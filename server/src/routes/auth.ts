import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { signManagerToken, requireAuth, AuthenticatedRequest } from '../auth/jwt.js';

const router = Router();

// Register a new restaurant + manager + initial tables (Onboarding flow)
router.post('/register', async (req, res) => {
  try {
    const {
      restaurantName,
      ownerName,
      phone,
      email,
      restaurantType,
      address,
      city,
      state,
      tableCount,
      username,
      pin
    } = req.body;

    if (!restaurantName || !ownerName || !phone || !username || !pin) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    if (String(pin).length < 4) {
      return res.status(400).json({ success: false, message: 'PIN must be at least 4 digits.' });
    }

    // Check if username already exists
    const existing = db.getManagerByUsername(username);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username is already taken. Please choose another.' });
    }

    // Generate slug from restaurant name
    const baseSlug = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Restaurant
    const restaurant = db.createRestaurant({
      slug,
      name: restaurantName,
      ownerName,
      phone,
      email: email || '',
      address: address || '',
      city: city || 'New Delhi',
      state: state || 'Delhi',
      restaurantType: restaurantType || 'Restaurant'
    });

    // Create Manager Account
    const pinHash = await bcrypt.hash(String(pin), 10);
    const manager = db.createManager({
      restaurantId: restaurant.id,
      username: username.trim(),
      pinHash,
      role: 'OWNER'
    });

    // Create initial tables
    const count = parseInt(tableCount, 10) || 6;
    for (let i = 1; i <= count; i++) {
      const padNum = i < 10 ? `0${i}` : `${i}`;
      db.createTable(restaurant.id, `Table ${padNum}`);
    }

    // Initialize Default Printer Config
    db.getPrinterConfig(restaurant.id);

    // Issue JWT token
    const token = signManagerToken({
      managerId: manager.id,
      restaurantId: restaurant.id,
      username: manager.username,
      restaurantName: restaurant.name,
      restaurantSlug: restaurant.slug
    });

    return res.status(201).json({
      success: true,
      message: 'Restaurant registered successfully!',
      token,
      restaurant: {
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        ownerName: restaurant.ownerName,
        tablesCount: count
      },
      manager: {
        id: manager.id,
        username: manager.username,
        role: manager.role
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration. Please try again.' });
  }
});

// Manager Login using Username + PIN
router.post('/login', async (req, res) => {
  try {
    const { username, pin } = req.body;
    if (!username || !pin) {
      return res.status(400).json({ success: false, message: 'Please enter your username and PIN.' });
    }

    const manager = db.getManagerByUsername(username);
    if (!manager) {
      return res.status(401).json({ success: false, message: 'Invalid username or PIN.' });
    }

    const isValid = await bcrypt.compare(String(pin), manager.pinHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or PIN.' });
    }

    const restaurant = db.getRestaurant(manager.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Associated restaurant record not found.' });
    }

    const token = signManagerToken({
      managerId: manager.id,
      restaurantId: restaurant.id,
      username: manager.username,
      restaurantName: restaurant.name,
      restaurantSlug: restaurant.slug
    });

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      restaurant: {
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        ownerName: restaurant.ownerName
      },
      manager: {
        id: manager.id,
        username: manager.username,
        role: manager.role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during login.' });
  }
});

// Verify current session
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const restaurant = db.getRestaurant(req.manager!.restaurantId);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  return res.json({
    success: true,
    manager: {
      id: req.manager!.managerId,
      username: req.manager!.username
    },
    restaurant: {
      id: restaurant.id,
      slug: restaurant.slug,
      name: restaurant.name,
      ownerName: restaurant.ownerName,
      phone: restaurant.phone,
      email: restaurant.email,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      restaurantType: restaurant.restaurantType,
      gstNumber: restaurant.gstNumber
    }
  });
});

export default router;
