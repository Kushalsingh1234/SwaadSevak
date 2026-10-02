"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const index_js_1 = require("../db/index.js");
const jwt_js_1 = require("../auth/jwt.js");
const socket_js_1 = require("../realtime/socket.js");
const aiMenuParser_js_1 = require("../services/aiMenuParser.js");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
// All routes here require manager authentication
router.use(jwt_js_1.requireAuth);
// --- CATEGORIES ---
router.get('/categories', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const categories = index_js_1.db.getCategories(restaurantId);
    return res.json({ success: true, categories });
});
router.post('/categories', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const category = index_js_1.db.createCategory(restaurantId, name.trim());
    return res.status(201).json({ success: true, category });
});
router.put('/categories/:id', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const updated = index_js_1.db.updateCategory(restaurantId, req.params.id, name.trim());
    if (!updated) {
        return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, category: updated });
});
router.delete('/categories/:id', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const success = index_js_1.db.deleteCategory(restaurantId, req.params.id);
    if (!success) {
        return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, message: 'Category deleted successfully' });
});
// --- MENU ITEMS ---
router.get('/items', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const items = index_js_1.db.getItems(restaurantId);
    const categories = index_js_1.db.getCategories(restaurantId);
    return res.json({ success: true, items, categories });
});
router.post('/items', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { name, description, price, categoryId, portion, isVeg, tags } = req.body;
    if (!name || price === undefined || !categoryId) {
        return res.status(400).json({ success: false, message: 'Dish name, price, and category are required' });
    }
    const item = index_js_1.db.createItem(restaurantId, {
        name: name.trim(),
        description: description || '',
        price: parseFloat(price) || 0,
        categoryId,
        portion: portion || 'Standard',
        isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
        isAvailable: true,
        tags: Array.isArray(tags) ? tags : []
    });
    return res.status(201).json({ success: true, item });
});
router.put('/items/:id', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { name, description, price, categoryId, portion, isVeg, tags, isAvailable } = req.body;
    const updated = index_js_1.db.updateItem(restaurantId, req.params.id, {
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
    // If availability changed, broadcast to tables
    if (isAvailable !== undefined) {
        (0, socket_js_1.emitMenuStockChange)(restaurantId, updated.id, updated.isAvailable);
    }
    return res.json({ success: true, item: updated });
});
// Quick Toggle In Stock <-> Out of Stock
router.patch('/items/:id/stock', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { isAvailable } = req.body;
    if (isAvailable === undefined) {
        return res.status(400).json({ success: false, message: 'isAvailable boolean is required' });
    }
    const updated = index_js_1.db.setItemStock(restaurantId, req.params.id, Boolean(isAvailable));
    if (!updated) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    // Instantly broadcast to all customer tables
    (0, socket_js_1.emitMenuStockChange)(restaurantId, updated.id, updated.isAvailable);
    return res.json({
        success: true,
        message: `Dish is now marked ${updated.isAvailable ? 'In Stock' : 'Out of Stock'}`,
        item: updated
    });
});
router.delete('/items/:id', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const success = index_js_1.db.deleteItem(restaurantId, req.params.id);
    if (!success) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    return res.json({ success: true, message: 'Dish deleted successfully' });
});
// --- AI MENU IMPORT ---
// Upload and Parse PDF
router.post('/ai/parse-pdf', upload.single('menuPdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a PDF menu file.' });
        }
        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ success: false, message: 'Invalid file format. Only PDF menus are supported.' });
        }
        const parseResult = await (0, aiMenuParser_js_1.parseMenuPdfBuffer)(req.file.buffer);
        return res.json({
            success: true,
            message: 'Menu parsed successfully! Please review the extracted dishes before confirming.',
            data: parseResult
        });
    }
    catch (error) {
        console.error('Menu PDF AI parsing error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "We couldn't process this menu. Please try again or add dishes manually."
        });
    }
});
// Confirm AI Extracted Menu & Publish to Restaurant
router.post('/ai/confirm-menu', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'No items provided to save.' });
    }
    // Cache or create categories
    const existingCategories = index_js_1.db.getCategories(restaurantId);
    const categoryMap = new Map();
    for (const c of existingCategories) {
        categoryMap.set(c.name.toLowerCase(), c.id);
    }
    let createdCategoriesCount = 0;
    let createdDishesCount = 0;
    for (const rawItem of items) {
        const catName = rawItem.category?.trim() || 'General';
        let catId = categoryMap.get(catName.toLowerCase());
        if (!catId) {
            const newCat = index_js_1.db.createCategory(restaurantId, catName);
            catId = newCat.id;
            categoryMap.set(catName.toLowerCase(), catId);
            createdCategoriesCount++;
        }
        index_js_1.db.createItem(restaurantId, {
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
exports.default = router;
