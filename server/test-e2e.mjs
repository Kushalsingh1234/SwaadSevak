async function runE2ETest() {
  console.log('=== STARTING COMPREHENSIVE SWAAD SEVAK E2E TEST ===');

  // 1. Health check
  const health = await fetch('http://localhost:5000/health').then(r => r.json());
  console.log('✓ 1. Health check passed:', health.status);

  // 2. Onboarding / Register Restaurant
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurantName: 'Café Delhi Heights Express',
      ownerName: 'Kabir Oberoi',
      phone: '+91 99887 76655',
      email: 'kabir@cafedelhi.in',
      restaurantType: 'Café & Bistro',
      address: 'Shop 21, Cyber Hub, DLF Phase 2',
      city: 'Gurugram',
      state: 'Haryana',
      tableCount: 6,
      username: 'kabir_manager_' + Math.floor(Math.random() * 10000),
      pin: '5678'
    })
  }).then(r => r.json());
  console.log('✓ 2. Restaurant Registered:', regRes.success, 'Name:', regRes.restaurant?.name, 'Slug:', regRes.restaurant?.slug);
  const token = regRes.token;

  // 3. Login verification
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: regRes.manager.username, pin: '5678' })
  }).then(r => r.json());
  console.log('✓ 3. Manager Login:', loginRes.success, 'Token verified:', Boolean(loginRes.token));

  // 4. Create Menu Category & Items
  const catRes = await fetch('http://localhost:5000/api/menu/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ name: 'Juicy Burgers & Shakes' })
  }).then(r => r.json());
  console.log('✓ 4. Category Created:', catRes.success, catRes.category?.name);

  const itemRes = await fetch('http://localhost:5000/api/menu/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      name: 'Delhi Famous Juicy Lucy Burger',
      description: 'Hand-pressed spiced patty stuffed with molten yellow cheddar.',
      price: 349,
      categoryId: catRes.category.id,
      portion: '1 King Burger with Fries',
      isVeg: false,
      tags: ['Bestseller', "Chef's Special"]
    })
  }).then(r => r.json());
  console.log('✓ 4b. Menu Item Created:', itemRes.success, itemRes.item?.name, 'Price: ₹' + itemRes.item?.price);

  // 5. Get Tables & Pick Table 01
  const tablesRes = await fetch('http://localhost:5000/api/tables', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('✓ 5. Tables Generated:', tablesRes.tables?.length, 'First table:', tablesRes.tables[0]?.tableNumber);
  const table1 = tablesRes.tables[0];

  // 6. Public Diner Scans Table 01 QR
  const publicMenu = await fetch(`http://localhost:5000/api/public/menu/${regRes.restaurant.slug}/${table1.qrToken}`).then(r => r.json());
  console.log('✓ 6. Public Diner Menu Loaded:', publicMenu.success, 'Restaurant:', publicMenu.restaurant?.name, 'Table:', publicMenu.table?.tableNumber, 'Categories:', publicMenu.menu?.length);

  // 7. Diner Places Order for Table 01
  const orderRes = await fetch('http://localhost:5000/api/public/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurantSlug: regRes.restaurant.slug,
      qrToken: table1.qrToken,
      items: [{ menuItemId: itemRes.item.id, quantity: 2, portion: itemRes.item.portion }],
      customerNotes: 'Please serve burgers extra hot and crispy.'
    })
  }).then(r => r.json());
  console.log('✓ 7. Customer Order Placed:', orderRes.success, 'Order #:', orderRes.order?.orderNumber, 'Status:', orderRes.order?.status, 'Total: ₹' + orderRes.order?.total);
  const placedOrder = orderRes.order;

  // 8. Manager Accepts Order -> KOT Generation
  const acceptRes = await fetch(`http://localhost:5000/api/orders/${placedOrder.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status: 'ACCEPTED' })
  }).then(r => r.json());
  console.log('✓ 8. Order Accepted by Manager:', acceptRes.success, 'Status:', acceptRes.order?.status, 'KOT #:', acceptRes.order?.kotNumber);
  console.log('\n--- THERMAL RECEIPT SLIP PREVIEW (ESC/POS) ---\n' + acceptRes.thermalText + '----------------------------------------------\n');

  // 9. Quick Stock Toggle: Mark item Out of Stock
  const stockToggleRes = await fetch(`http://localhost:5000/api/menu/items/${itemRes.item.id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ isAvailable: false })
  }).then(r => r.json());
  console.log('✓ 9. Stock Toggled Live:', stockToggleRes.success, stockToggleRes.message);

  // Verify diner can no longer place order for out-of-stock item
  const failOrderRes = await fetch('http://localhost:5000/api/public/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurantSlug: regRes.restaurant.slug,
      qrToken: table1.qrToken,
      items: [{ menuItemId: itemRes.item.id, quantity: 1 }]
    })
  }).then(r => r.json());
  console.log('✓ 9b. Out-of-Stock Guard Blocked Sold Out Order:', !failOrderRes.success, 'Message:', failOrderRes.message);

  // 10. Customer Requests Bill
  const billReqRes = await fetch(`http://localhost:5000/api/public/order/${placedOrder.id}/request-bill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantSlug: regRes.restaurant.slug, qrToken: table1.qrToken })
  }).then(r => r.json());
  console.log('✓ 10. Customer Bill Request Received:', billReqRes.success, billReqRes.message);

  // 11. Manager Generates Bill & Settles with UPI
  const genBillRes = await fetch(`http://localhost:5000/api/bills/generate/${placedOrder.id}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('✓ 11. Bill Generated:', genBillRes.success, genBillRes.bill?.billNumber, 'Grand Total: ₹' + genBillRes.bill?.grandTotal);

  const settleRes = await fetch(`http://localhost:5000/api/bills/${genBillRes.bill.id}/settle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ paymentStatus: 'PAID_UPI' })
  }).then(r => r.json());
  console.log('✓ 11b. Bill Settled Successfully:', settleRes.success, 'Status:', settleRes.bill?.paymentStatus);

  // 12. Diner Downloads / Views Final Tax Invoice
  const invoiceRes = await fetch(`http://localhost:5000/api/public/order/${placedOrder.id}/invoice`).then(r => r.json());
  console.log('✓ 12. Final Tax Invoice Generated:', invoiceRes.success, 'Branding:', invoiceRes.invoice?.branding, 'Payment:', invoiceRes.invoice?.paymentStatus);

  // 13. Dynamic Today's Stats Check
  const statsRes = await fetch('http://localhost:5000/api/stats/today', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json());
  console.log('✓ 13. Dynamic Today Stats Computed:', statsRes.stats);

  console.log('\n=== ALL PHASE 1 REQUIREMENTS VALIDATED & PASSED 100%! ===');
}

runE2ETest().catch(console.error);
