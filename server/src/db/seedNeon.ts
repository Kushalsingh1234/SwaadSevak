import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon PostgreSQL Database...');

  const restaurantSlug = 'chai-and-chaat';

  // Check if restaurant already exists
  let restaurant = await prisma.restaurant.findUnique({
    where: { slug: restaurantSlug }
  });

  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        slug: restaurantSlug,
        name: 'The Chai & Chaat Co.',
        ownerName: 'Vikram Sharma',
        phone: '+91 98765 43210',
        email: 'vikram@chaichaat.in',
        address: 'Shop 14, Indiranagar 100ft Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        restaurantType: 'Café & Bistro',
        gstNumber: '29ABCDE1234F1Z5'
      }
    });
    console.log('✓ Created Restaurant:', restaurant.name, 'Slug:', restaurant.slug);
  } else {
    console.log('Restaurant already exists:', restaurant.name);
  }

  // Manager: demo_manager / 1234
  const pinHash = await bcrypt.hash('1234', 10);
  const existingManager = await prisma.manager.findUnique({
    where: { username: 'demo_manager' }
  });

  if (!existingManager) {
    await prisma.manager.create({
      data: {
        restaurantId: restaurant.id,
        username: 'demo_manager',
        pinHash,
        role: 'OWNER'
      }
    });
    console.log('✓ Created Manager: demo_manager (PIN: 1234)');
  }

  // Printer Config
  await prisma.printerConfig.upsert({
    where: { restaurantId: restaurant.id },
    update: {},
    create: {
      restaurantId: restaurant.id,
      printerName: 'POS-80 Thermal Kitchen Printer',
      paperWidth: '80mm',
      autoPrintKot: true,
      printerType: 'BROWSER'
    }
  });

  // Seed Categories
  const categoriesData = [
    { name: 'Starters & Chaat', displayOrder: 1 },
    { name: 'Main Course', displayOrder: 2 },
    { name: 'Tandoori Breads', displayOrder: 3 },
    { name: 'Chai & Coolers', displayOrder: 4 },
    { name: 'Mithai & Desserts', displayOrder: 5 }
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const existing = await prisma.menuCategory.findFirst({
      where: { restaurantId: restaurant.id, name: cat.name }
    });

    if (!existing) {
      const created = await prisma.menuCategory.create({
        data: {
          restaurantId: restaurant.id,
          name: cat.name,
          displayOrder: cat.displayOrder
        }
      });
      categoryMap.set(cat.name, created.id);
    } else {
      categoryMap.set(cat.name, existing.id);
    }
  }
  console.log('✓ Seeded Categories');

  // Seed Dishes
  const dishes = [
    {
      categoryName: 'Starters & Chaat',
      name: 'Dahi Ke Kebab',
      description: 'Crispy hung curd patties spiced with green chillies, cardamom, and fresh coriander.',
      price: 249,
      portion: 'Standard (6 pcs)',
      isVeg: true,
      tags: JSON.stringify(['Bestseller', "Chef's Special"])
    },
    {
      categoryName: 'Starters & Chaat',
      name: 'Amritsari Paneer Tikka',
      description: 'Tender cottage cheese marinated in ajwain, curd, and hand-ground spices, clay-oven roasted.',
      price: 279,
      portion: 'Standard (6 pcs)',
      isVeg: true,
      tags: JSON.stringify(['Bestseller', 'Popular'])
    },
    {
      categoryName: 'Starters & Chaat',
      name: 'Chicken Malai Tikka',
      description: 'Succulent boneless chicken morsels coated in creamy cashew-cheese marinade with crushed white peppercorns.',
      price: 329,
      portion: 'Standard (6 pcs)',
      isVeg: false,
      tags: JSON.stringify(['Popular'])
    },
    {
      categoryName: 'Main Course',
      name: 'Dal Makhani Slow Cooked',
      description: 'Black lentils slow cooked overnight on charcoal with churned butter and rich cream.',
      price: 299,
      portion: 'Standard Bowl',
      isVeg: true,
      tags: JSON.stringify(['Bestseller'])
    },
    {
      categoryName: 'Main Course',
      name: 'Paneer Butter Masala',
      description: 'Cottage cheese simmered in a luscious tomato, butter, and cashew gravy finished with kasuri methi.',
      price: 319,
      portion: 'Standard Bowl',
      isVeg: true,
      tags: JSON.stringify(['Recommended'])
    },
    {
      categoryName: 'Main Course',
      name: 'Old Delhi Butter Chicken',
      description: 'Smoked tandoori chicken cooked in velvety, mildly spiced makhani gravy with authentic Delhi flavors.',
      price: 389,
      portion: 'Standard Bowl',
      isVeg: false,
      tags: JSON.stringify(['Bestseller', "Chef's Special"])
    },
    {
      categoryName: 'Tandoori Breads',
      name: 'Butter Garlic Naan',
      description: 'Clay-oven leavened bread brushed with garlic butter and fresh cilantro.',
      price: 75,
      portion: '1 Pc',
      isVeg: true,
      tags: JSON.stringify(['Popular'])
    },
    {
      categoryName: 'Chai & Coolers',
      name: 'Kulhad Masala Chai',
      description: 'Hand-brewed strong Assam tea infused with fresh ginger, green cardamom, and lemongrass.',
      price: 69,
      portion: 'Standard Kulhad',
      isVeg: true,
      tags: JSON.stringify(['Bestseller'])
    },
    {
      categoryName: 'Mithai & Desserts',
      name: 'Warm Gulab Jamun with Rabri',
      description: 'Soft melt-in-mouth khoya dumplings soaked in saffron syrup, paired with slow-reduced rabri.',
      price: 159,
      portion: '2 Pcs with Rabri',
      isVeg: true,
      tags: JSON.stringify(["Chef's Special"])
    }
  ];

  for (const d of dishes) {
    const categoryId = categoryMap.get(d.categoryName);
    if (!categoryId) continue;

    const existingDish = await prisma.menuItem.findFirst({
      where: { restaurantId: restaurant.id, name: d.name }
    });

    if (!existingDish) {
      await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          categoryId,
          name: d.name,
          description: d.description,
          price: d.price,
          portion: d.portion,
          isVeg: d.isVeg,
          isAvailable: true,
          tags: d.tags
        }
      });
    }
  }
  console.log('✓ Seeded Menu Items');

  // Seed 8 Tables with QR tokens
  const existingTables = await prisma.table.count({
    where: { restaurantId: restaurant.id }
  });

  if (existingTables === 0) {
    for (let i = 1; i <= 8; i++) {
      const padNum = i < 10 ? `0${i}` : `${i}`;
      const qrToken = `qr_token_demo_tbl_${padNum}_${crypto.randomBytes(4).toString('hex')}`;
      await prisma.table.create({
        data: {
          restaurantId: restaurant.id,
          tableNumber: `Table ${padNum}`,
          qrToken,
          status: 'AVAILABLE'
        }
      });
    }
    console.log('✓ Seeded 8 Dining Tables');
  }

  console.log('\n=== NEON POSTGRESQL SEED COMPLETE! ===');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
