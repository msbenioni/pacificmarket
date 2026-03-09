const https = require('https');

// Test one of the logo URLs from the database
const testUrl = 'https://mnmisjprswpuvcojnbip.supabase.co/storage/v1/object/public/admin-listings/logos/amuriboyz.jpg';

function testUrlAccessibility(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      console.log(`Status Code: ${response.statusCode}`);
      console.log(`Content-Type: ${response.headers['content-type']}`);
      console.log(`Content-Length: ${response.headers['content-length']}`);
      
      if (response.statusCode === 200) {
        console.log('✅ URL is accessible');
      } else {
        console.log('❌ URL returned error status');
      }
      
      resolve(response.statusCode);
    });
    
    request.on('error', (error) => {
      console.error('❌ Network error:', error.message);
      resolve(0);
    });
    
    request.setTimeout(10000, () => {
      console.log('❌ Request timeout');
      request.destroy();
      resolve(0);
    });
  });
}

async function main() {
  console.log('Testing logo URL accessibility...');
  console.log(`URL: ${testUrl}`);
  console.log('---');
  
  const statusCode = await testUrlAccessibility(testUrl);
  
  if (statusCode === 200) {
    console.log('\n✅ Logo URLs should be working in the browser');
    console.log('If logos are still not showing, the issue might be:');
    console.log('1. CORS policies blocking browser requests');
    console.log('2. Image loading errors in the browser');
    console.log('3. CSS styling issues hiding the images');
  } else {
    console.log('\n❌ Logo URLs are not accessible');
    console.log('This could be due to:');
    console.log('1. Storage bucket permissions');
    console.log('2. File not found in storage');
    console.log('3. Network connectivity issues');
  }
}

main();
