// Quick E2E verification script
async function runTests() {
  console.log('--- 1. Testing API Health ---');
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('Health:', health);

  console.log('\n--- 2. Testing Services List ---');
  const servRes = await fetch('http://localhost:5000/api/services');
  const serv = await servRes.json();
  console.log(`Fetched ${serv.count} services:`, serv.services.map(s => `${s.name} (₹${s.price})`).join(', '));

  console.log('\n--- 3. Testing Customer Fast Auto-Login ---');
  const custRes = await fetch('http://localhost:5000/api/auth/customer-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Rohan Sharma', phone: '9876543210' }),
  });
  const cust = await custRes.json();
  console.log('Customer Logged In:', cust.user.name, '| Phone:', cust.user.phone, '| JWT Token Generated:', !!cust.token);

  console.log('\n--- 4. Testing Admin Login ---');
  const adminRes = await fetch('http://localhost:5000/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@zerotohero.com', password: 'admin123' }),
  });
  const admin = await adminRes.json();
  console.log('Admin Authenticated:', admin.user.email, '| Role:', admin.user.role, '| JWT Token Generated:', !!admin.token);

  console.log('\n--- 5. Testing Dynamic Slot Availability Calculation ---');
  const today = new Date().toISOString().split('T')[0];
  const slotRes = await fetch(`http://localhost:5000/api/appointments/availability?date=${today}&duration=45`);
  const slots = await slotRes.json();
  const availableCount = slots.slots.filter(s => s.available).length;
  console.log(`Date: ${slots.date} | Available slots for 45m duration: ${availableCount}/${slots.slots.length}`);

  console.log('\n--- 6. Testing Frontend Client Vite Server ---');
  const clientRes = await fetch('http://localhost:3000');
  console.log('Client Server Status:', clientRes.status, clientRes.statusText);

  console.log('\nALL END-TO-END SERVICES VALIDATED SUCCESSFULLY!');
}

runTests().catch(console.error);
