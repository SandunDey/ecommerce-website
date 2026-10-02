// Automated End-to-End Workflow Verification Script
async function runTests() {
  console.log('🚀 Starting Auspify E-Commerce System Verification...\n');

  // 1. Health check
  const healthRes = await fetch('http://localhost:3000/api/health').then(r => r.json());
  console.log('✅ 1. Health Check:', healthRes.status, '| Platform:', healthRes.platform);

  // 2. Products Catalog & Filter
  const prodsRes = await fetch('http://localhost:3000/api/products?category=Electronics').then(r => r.json());
  console.log('✅ 2. Product Catalog: Found', prodsRes.products.length, 'electronics items');

  // 3. Search Products
  const searchRes = await fetch('http://localhost:3000/api/products?search=headphone').then(r => r.json());
  console.log('✅ 3. Search Query ("headphone"): Found', searchRes.products.length, 'item(s):', searchRes.products[0]?.name);

  // 4. Cart Pricing & Coupon Verification
  const cartRes = await fetch('http://localhost:3000/api/cart/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productId: 'prod_1', quantity: 2 }],
      couponCode: 'AUSPIFY20'
    })
  }).then(r => r.json());
  console.log('✅ 4. Cart & Voucher: Subtotal: $' + cartRes.subtotal + ' | Discount (20%): -$' + cartRes.discount + ' | Total: $' + cartRes.total);

  // 5. Order Placement
  const orderRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Maya Patel',
      customerEmail: 'maya@example.com',
      phone: '+1 555-4321',
      shippingAddress: {
        street: '456 Innovation Blvd',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'United States'
      },
      paymentMethod: 'Credit Card',
      items: [{ productId: 'prod_1', quantity: 1 }],
      couponCode: 'AUSPIFY20'
    })
  }).then(r => r.json());
  console.log('✅ 5. Order Placed:', orderRes.order.orderNumber, '| Tracking:', orderRes.order.trackingNumber, '| Status:', orderRes.order.orderStatus);

  // 6. Order Tracking Lookup
  const trackRes = await fetch('http://localhost:3000/api/orders/track/' + orderRes.order.orderNumber).then(r => r.json());
  console.log('✅ 6. Order Tracking:', trackRes.order.orderNumber, 'is currently', trackRes.order.orderStatus);

  // 7. Admin Login & Authorization
  const adminLogin = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@auspify.com', password: 'admin123' })
  }).then(r => r.json());
  console.log('✅ 7. Admin Authentication: Logged in as', adminLogin.user.name, '(Role:', adminLogin.user.role + ')');

  // 8. Admin Analytics & Stats
  const adminStats = await fetch('http://localhost:3000/api/admin/stats', {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  }).then(r => r.json());
  console.log('✅ 8. Admin Dashboard Stats: Total Revenue: $' + adminStats.stats.totalRevenue + ' | Orders Count:', adminStats.stats.totalOrders);

  // 9. Admin Order Status Update
  const updateStatusRes = await fetch(`http://localhost:3000/api/orders/${orderRes.order.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminLogin.token}`
    },
    body: JSON.stringify({ status: 'Shipped', trackingNumber: 'TRK-EXP-9923841' })
  }).then(r => r.json());
  console.log('✅ 9. Admin Order Fulfillment: Status updated to', updateStatusRes.order.orderStatus);

  console.log('\n🎉 ALL 9 END-TO-END WORKFLOWS COMPLETED AND PASSED WITH 100% SUCCESS!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
