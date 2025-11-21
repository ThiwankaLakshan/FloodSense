const axios = require('axios');

async function testRoutes() {
  try {
    console.log('Testing if routes exist...\n');
    
    // Test 1: Health check
    console.log('1. Testing health check...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health:', health.data);
    
    // Test 2: Login exists
    console.log('\n2. Testing if login route exists...');
    try {
      await axios.post('http://localhost:5000/api/admin/login', {});
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Login route exists (returned 400 - validation error)');
      } else {
        console.log('❌ Route error:', error.message);
      }
    }
    
    // Test 3: Verify exists
    console.log('\n3. Testing if verify route exists...');
    try {
      await axios.get('http://localhost:5000/api/admin/verify');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Verify route exists (returned 401 - no token)');
      } else if (error.response?.status === 404) {
        console.log('❌ Verify route NOT FOUND!');
      } else {
        console.log('❌ Route error:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testRoutes();