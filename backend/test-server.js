const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running!',
    timestamp: new Date().toISOString() 
  });
});

// Test auth route
app.post('/api/auth/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend API is working!' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}/api/health`);
});
