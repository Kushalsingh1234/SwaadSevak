import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { getPrismaClient } from '../db/prismaClient.js';
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

    const cleanUsername = String(username || '').trim();
    const cleanPin = String(pin || '').trim();

    if (!restaurantName || !ownerName || !phone || !cleanUsername || !cleanPin) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    if (cleanPin.length < 4) {
      return res.status(400).json({ success: false, message: 'PIN must be at least 4 digits.' });
    }

    await db.ensureInitialized();

    // Check if username already exists in memory or in PostgreSQL
    let existing = db.getManagerByUsername(cleanUsername);
    if (!existing) {
      const prisma = getPrismaClient();
      if (prisma) {
        try {
          const dbMgr = await prisma.manager.findFirst({
            where: { username: { equals: cleanUsername, mode: 'insensitive' } }
          });
          if (dbMgr) existing = dbMgr as any;
        } catch (e) {
          console.warn('Prisma check existing manager error:', e);
        }
      }
    }
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username is already taken. Please choose another.' });
    }

    // Generate slug from restaurant name
    const baseSlug = restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Restaurant (persisted to PostgreSQL)
    const restaurant = await db.createRestaurant({
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

    // Create Manager Account (persisted to PostgreSQL)
    const pinHash = await bcrypt.hash(cleanPin, 10);
    const manager = await db.createManager({
      restaurantId: restaurant.id,
      username: cleanUsername,
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
    const cleanUsername = String(req.body.username || '').trim();
    const cleanPin = String(req.body.pin || '').trim();

    if (!cleanUsername || !cleanPin) {
      return res.status(400).json({ success: false, message: 'Please enter your username and PIN.' });
    }

    await db.ensureInitialized();
    let manager = db.getManagerByUsername(cleanUsername);

    // Direct Database Fallback if not loaded into memory
    if (!manager) {
      const prisma = getPrismaClient();
      if (prisma) {
        try {
          const dbMgr = await prisma.manager.findFirst({
            where: {
              username: {
                equals: cleanUsername,
                mode: 'insensitive'
              }
            },
            include: {
              restaurant: true
            }
          });

          if (dbMgr) {
            manager = {
              id: dbMgr.id,
              restaurantId: dbMgr.restaurantId,
              username: dbMgr.username,
              pinHash: dbMgr.pinHash,
              role: dbMgr.role as any,
              createdAt: dbMgr.createdAt
            };
            db.managers.set(manager.id, manager);

            if (dbMgr.restaurant) {
              db.restaurants.set(dbMgr.restaurant.id, {
                id: dbMgr.restaurant.id,
                slug: dbMgr.restaurant.slug,
                name: dbMgr.restaurant.name,
                ownerName: dbMgr.restaurant.ownerName,
                phone: dbMgr.restaurant.phone,
                email: dbMgr.restaurant.email,
                address: dbMgr.restaurant.address,
                city: dbMgr.restaurant.city,
                state: dbMgr.restaurant.state,
                restaurantType: dbMgr.restaurant.restaurantType,
                gstNumber: dbMgr.restaurant.gstNumber || undefined,
                createdAt: dbMgr.restaurant.createdAt,
                updatedAt: dbMgr.restaurant.updatedAt
              });
            }
          }
        } catch (dbErr) {
          console.error('Direct PostgreSQL manager query error:', dbErr);
        }
      }
    }

    if (!manager) {
      return res.status(401).json({ success: false, message: 'Invalid username or PIN.' });
    }

    const isValid = await bcrypt.compare(cleanPin, manager.pinHash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or PIN.' });
    }

    let restaurant = db.getRestaurant(manager.restaurantId);
    if (!restaurant) {
      const prisma = getPrismaClient();
      if (prisma) {
        try {
          const r = await prisma.restaurant.findUnique({ where: { id: manager.restaurantId } });
          if (r) {
            restaurant = {
              id: r.id,
              slug: r.slug,
              name: r.name,
              ownerName: r.ownerName,
              phone: r.phone,
              email: r.email,
              address: r.address,
              city: r.city,
              state: r.state,
              restaurantType: r.restaurantType,
              gstNumber: r.gstNumber || undefined,
              createdAt: r.createdAt,
              updatedAt: r.updatedAt
            };
            db.restaurants.set(restaurant.id, restaurant);
          }
        } catch (rErr) {
          console.error('Direct PostgreSQL restaurant query error:', rErr);
        }
      }
    }

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
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  let restaurant = db.getRestaurant(req.manager!.restaurantId);
  if (!restaurant) {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const r = await prisma.restaurant.findUnique({ where: { id: req.manager!.restaurantId } });
        if (r) {
          restaurant = {
            id: r.id,
            slug: r.slug,
            name: r.name,
            ownerName: r.ownerName,
            phone: r.phone,
            email: r.email,
            address: r.address,
            city: r.city,
            state: r.state,
            restaurantType: r.restaurantType,
            gstNumber: r.gstNumber || undefined,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
          };
          db.restaurants.set(restaurant.id, restaurant);
        }
      } catch (err) {
        console.error('Prisma fetch restaurant error in /me:', err);
      }
    }
  }

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
