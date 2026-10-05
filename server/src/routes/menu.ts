import { Router, Response } from 'express';
import multer from 'multer';
import { db } from '../db/index.js';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { emitMenuStockChange } from '../realtime/socket.js';
import { parseMenuPdfBuffer } from '../services/aiMenuParser.js';
import { ExtractedMenuItem } from '../types/index.js';
import { aggregatorManager } from '../aggregators/aggregatorManager.js';

const router = Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// All routes here require manager authentication
router.use(requireAuth);

// --- CATEGORIES ---

router.get('/categories', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const categories = db.getCategories(restaurantId);
  return res.json({ success: true, categories });
});

router.post('/categories', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const category = db.createCategory(restaurantId, name.trim());
  return res.status(201).json({ success: true, category });
});

router.put('/categories/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const updated = db.updateCategory(restaurantId, req.params.id as string, name.trim());
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  return res.json({ success: true, category: updated });
});

router.delete('/categories/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const success = db.deleteCategory(restaurantId, req.params.id as string);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  return res.json({ success: true, message: 'Category deleted successfully' });
});

// --- MENU ITEMS ---

router.get('/items', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const items = db.getItems(restaurantId);
  const categories = db.getCategories(restaurantId);
  return res.json({ success: true, items, categories });
});

router.post('/items', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  let { name, description, price, categoryId, newCategoryName, portion, isVeg, tags, channels, publishSwiggy, publishZomato } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: 'Dish name and price are required' });
  }

  // If a new category name is provided, create it or reuse existing
  let createdCategory = null;
  if (newCategoryName && typeof newCategoryName === 'string' && newCategoryName.trim()) {
    const trimmedCat = newCategoryName.trim();
    const existingCats = db.getCategories(restaurantId);
    let match = existingCats.find(c => c.name.toLowerCase() === trimmedCat.toLowerCase());
    if (!match) {
      match = db.createCategory(restaurantId, trimmedCat);
      createdCategory = match;
    }
    categoryId = match.id;
  }

  if (!categoryId) {
    return res.status(400).json({ success: false, message: 'Please select an existing category or enter a new category name' });
  }

  const numericPrice = parseFloat(price) || 0;
  const item = db.createItem(restaurantId, {
    name: name.trim(),
    description: description || '',
    price: numericPrice,
    categoryId,
    portion: portion || 'Standard',
    isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
    isAvailable: true,
    tags: Array.isArray(tags) ? tags : []
  });

  // Sync to aggregator channels if selected
  const syncSwiggy = Boolean(
    publishSwiggy !== false &&
    (!Array.isArray(channels) || channels.includes('SWIGGY'))
  );
  const syncZomato = Boolean(
    publishZomato !== false &&
    (!Array.isArray(channels) || channels.includes('ZOMATO'))
  );

  aggregatorManager.setItemOverrides(item.id, {
    menuItemId: item.id,
    priceMode: 'SEPARATE_CHANNELS',
    swiggy: {
      enabled: syncSwiggy,
      price: numericPrice,
      isAvailable: true,
      syncStatus: 'SYNCED'
    },
    zomato: {
      enabled: syncZomato,
      price: numericPrice,
      isAvailable: true,
      syncStatus: 'SYNCED'
    }
  });

  return res.status(201).json({ success: true, item, createdCategory });
});

router.put('/items/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const {
    name,
    description,
    price,
    categoryId,
    portion,
    isVeg,
    tags,
    isAvailable,
    channels,
    publishSwiggy,
    publishZomato,
    syncPriceToAggregators
  } = req.body;

  const updated = db.updateItem(restaurantId, req.params.id as string, {
    ...(name !== undefined && { name: name.trim() }),
    ...(description !== undefined && { description }),
    ...(price !== undefined && { price: parseFloat(price) }),
    ...(categoryId !== undefined && { categoryId }),
    ...(portion !== undefined && { portion }),
    ...(isVeg !== undefined && { isVeg: Boolean(isVeg) }),
    ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
    ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) })
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  // If price is updated, sync new price to Swiggy & Zomato when selected
  if (price !== undefined) {
    const numericPrice = parseFloat(price);
    const syncSwiggy = Boolean(
      publishSwiggy ||
      (Array.isArray(channels) && channels.includes('SWIGGY')) ||
      syncPriceToAggregators
    );
    const syncZomato = Boolean(
      publishZomato ||
      (Array.isArray(channels) && channels.includes('ZOMATO')) ||
      syncPriceToAggregators
    );

    if (syncSwiggy) {
      aggregatorManager.setItemOverrides(updated.id, {
        swiggy: {
          enabled: true,
          price: numericPrice,
          isAvailable: updated.isAvailable,
          syncStatus: 'SYNCED'
        }
      });
      aggregatorManager.logSyncEvent(
        restaurantId,
        'SWIGGY',
        'PRICE_UPDATE',
        'PRICE',
        'SUCCESS',
        `Master menu updated "${updated.name}" price to ₹${numericPrice} on Swiggy`
      );
    }

    if (syncZomato) {
      aggregatorManager.setItemOverrides(updated.id, {
        zomato: {
          enabled: true,
          price: numericPrice,
          isAvailable: updated.isAvailable,
          syncStatus: 'SYNCED'
        }
      });
      aggregatorManager.logSyncEvent(
        restaurantId,
        'ZOMATO',
        'PRICE_UPDATE',
        'PRICE',
        'SUCCESS',
        `Master menu updated "${updated.name}" price to ₹${numericPrice} on Zomato`
      );
    }
  }

  // If availability changed, broadcast to tables & aggregators
  if (isAvailable !== undefined) {
    emitMenuStockChange(restaurantId, updated.id, updated.isAvailable);
    aggregatorManager.setItemOverrides(updated.id, {
      swiggy: { isAvailable: Boolean(isAvailable) },
      zomato: { isAvailable: Boolean(isAvailable) }
    });
  }

  return res.json({ success: true, item: updated });
});

// Quick Toggle In Stock <-> Out of Stock
router.patch('/items/:id/stock', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { isAvailable } = req.body;

  if (isAvailable === undefined) {
    return res.status(400).json({ success: false, message: 'isAvailable boolean is required' });
  }

  const updated = db.setItemStock(restaurantId, req.params.id as string, Boolean(isAvailable));
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  // Instantly broadcast to all customer tables
  emitMenuStockChange(restaurantId, updated.id, updated.isAvailable);

  return res.json({
    success: true,
    message: `Dish is now marked ${updated.isAvailable ? 'In Stock' : 'Out of Stock'}`,
    item: updated
  });
});

router.delete('/items/:id', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const success = db.deleteItem(restaurantId, req.params.id as string);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  return res.json({ success: true, message: 'Dish deleted successfully' });
});

// --- AI MENU IMPORT ---

// Upload and Parse PDF
router.post('/ai/parse-pdf', upload.single('menuPdf'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF menu file.' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ success: false, message: 'Invalid file format. Only PDF menus are supported.' });
    }

    const parseResult = await parseMenuPdfBuffer(req.file.buffer);

    return res.json({
      success: true,
      message: 'Menu parsed successfully! Please review the extracted dishes before confirming.',
      data: parseResult
    });
  } catch (error: any) {
    console.error('Menu PDF AI parsing error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "We couldn't process this menu. Please try again or add dishes manually."
    });
  }
});

// Confirm AI Extracted Menu & Publish to Restaurant
router.post('/ai/confirm-menu', (req: AuthenticatedRequest, res: Response) => {
  const restaurantId = req.manager!.restaurantId;
  const { items } = req.body as { items: ExtractedMenuItem[] };

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items provided to save.' });
  }

  // Cache or create categories
  const existingCategories = db.getCategories(restaurantId);
  const categoryMap = new Map<string, string>();
  for (const c of existingCategories) {
    categoryMap.set(c.name.toLowerCase(), c.id);
  }

  let createdCategoriesCount = 0;
  let createdDishesCount = 0;

  for (const rawItem of items) {
    const catName = rawItem.category?.trim() || 'General';
    let catId = categoryMap.get(catName.toLowerCase());

    if (!catId) {
      const newCat = db.createCategory(restaurantId, catName);
      catId = newCat.id;
      categoryMap.set(catName.toLowerCase(), catId);
      createdCategoriesCount++;
    }

    db.createItem(restaurantId, {
      name: rawItem.name?.trim() || 'Untitled Dish',
      description: rawItem.description || '',
      price: Number(rawItem.price) || 0,
      categoryId: catId,
      portion: rawItem.portion || 'Standard',
      isVeg: rawItem.isVeg !== undefined ? Boolean(rawItem.isVeg) : true,
      isAvailable: true,
      tags: Array.isArray(rawItem.tags) ? rawItem.tags : []
    });
    createdDishesCount++;
  }

  return res.json({
    success: true,
    message: `Successfully imported ${createdDishesCount} dishes across ${categoryMap.size} categories!`,
    stats: {
      categoriesCount: categoryMap.size,
      newCategories: createdCategoriesCount,
      dishesCount: createdDishesCount
    }
  });
});

export default router;
