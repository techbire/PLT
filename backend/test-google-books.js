require('dotenv').config();
const axios = require('axios');

async function testGoogleBooksAPI() {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    console.log('API Key:', apiKey ? 'Set' : 'Not set');
    
    if (!apiKey) {
      console.error('Google Books API key not found in environment variables');
      return;
    }

    console.log('Testing Google Books API...');
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      params: {
        q: 'javascript',
        maxResults: 5,
        key: apiKey
      }
    });

    console.log('API Response Status:', response.status);
    console.log('Number of books found:', response.data.items?.length || 0);
    
    if (response.data.items && response.data.items.length > 0) {
      console.log('First book title:', response.data.items[0].volumeInfo.title);
      console.log('Google Books API is working correctly!');
    } else {
      console.log('No books found in response');
    }

  } catch (error) {
    console.error('Google Books API Error:', error.response?.data || error.message);
  }
}

testGoogleBooksAPI();
