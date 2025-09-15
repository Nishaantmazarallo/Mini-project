const http = require('http');

// Test if backend server is running
const testBackend = () => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Backend Status: ${res.statusCode}`);
    res.on('data', (d) => {
      console.log('Response:', d.toString());
    });
  });

  req.on('error', (error) => {
    console.log('Backend is not running or not accessible');
    console.log('Error:', error.message);
  });

  req.end();
};

testBackend();
