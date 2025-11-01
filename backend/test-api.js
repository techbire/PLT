const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test Google Books API
async function testGoogleBooks() {
  try {
    console.log('🔍 Testing Google Books API...');
    const response = await axios.get('http://localhost:5000/api/books/search/google', {
      params: {
        q: 'javascript',
        maxResults: 5
      },
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN' // You'll need to get this from login
      }
    });
    
    console.log('✅ Google Books API working:', response.data.books.length, 'books found');
  } catch (error) {
    console.error('❌ Google Books API error:', error.response?.data || error.message);
  }
}

// Test file upload
async function testUpload() {
  try {
    console.log('📤 Testing file upload...');
    
    // Create a test image file (1x1 PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x01, 0x9A, 0x2C, 0x08, 0xE5,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
      0xAE, 0x42, 0x60, 0x82
    ]);
    
    const testImagePath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(testImagePath, testImageBuffer);
    
    const form = new FormData();
    form.append('cover', fs.createReadStream(testImagePath));
    
    const response = await axios.post('http://localhost:5000/api/books/BOOK_ID/cover', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': 'Bearer YOUR_JWT_TOKEN' // You'll need to get this from login
      }
    });
    
    console.log('✅ Upload working:', response.data);
    
    // Cleanup
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('❌ Upload error:', error.response?.data || error.message);
  }
}

// Test server health
async function testHealth() {
  try {
    console.log('🏥 Testing server health...');
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server is healthy:', response.data);
  } catch (error) {
    console.error('❌ Server health error:', error.message);
    console.log('Make sure the backend server is running on port 5000');
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting API tests...\n');
  await testHealth();
  console.log('');
  // Note: Google Books and Upload tests require authentication
  console.log('📝 To test Google Books and Upload, you need to:');
  console.log('1. Login to get a JWT token');
  console.log('2. Replace YOUR_JWT_TOKEN in this script');
  console.log('3. For upload test, replace BOOK_ID with a real book ID');
}

runTests();
