const express = require('express');
const { body, validationResult, query } = require('express-validator');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Book = require('../models/Book');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

// @route   GET /api/books
// @desc    Get user's books with filtering and pagination
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['To Read', 'Reading', 'Read']).withMessage('Invalid status'),
  query('genre').optional().isString(),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = { userId: req.user.id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.genre) {
      filter.genre = new RegExp(req.query.genre, 'i');
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { author: new RegExp(req.query.search, 'i') }
      ];
    }

    // Get books with pagination
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/stats
// @desc    Get reading statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Book.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const genreStats = await Book.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const monthlyReading = await Book.aggregate([
      { 
        $match: { 
          userId: userId,
          status: 'Read',
          dateFinished: { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$dateFinished' },
            month: { $month: '$dateFinished' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const formattedStats = {
      'To Read': 0,
      'Reading': 0,
      'Read': 0
    };

    stats.forEach(stat => {
      if (stat._id && formattedStats.hasOwnProperty(stat._id)) {
        formattedStats[stat._id] = stat.count;
      }
    });

    // Sync reading goal with actual "Read" books count
    const actualReadCount = formattedStats['Read'];
    await User.findByIdAndUpdate(userId, {
      'readingGoal.current': actualReadCount
    });

    res.json({
      statusStats: formattedStats,
      genreStats,
      monthlyReading,
      totalBooks: Object.values(formattedStats).reduce((a, b) => a + b, 0)
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Private
router.get('/:id', auth, validateObjectId, async (req, res) => {
  try {
    const book = await Book.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book });

  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books
// @desc    Add new book
// @access  Private
router.post('/', auth, [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('author').notEmpty().trim().withMessage('Author is required'),
  body('genre').notEmpty().trim().withMessage('Genre is required'),
  body('status').optional().isIn(['To Read', 'Reading', 'Read']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const bookData = {
      ...req.body,
      userId: req.user.id
    };

    // Initialize reading progress if page count is provided
    if (req.body.pageCount) {
      bookData.readingProgress = {
        currentPage: req.body.currentPage || 0,
        totalPages: req.body.pageCount
      };
    }

    const book = new Book(bookData);
    await book.save();

    // Update user's reading goal if book is marked as "Read"
    if (req.body.status === 'Read') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'readingGoal.current': 1 }
      });
    }

    res.status(201).json({
      message: 'Book added successfully',
      book
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    console.error('Add book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private
router.put('/:id', auth, validateObjectId, [
  body('title').optional().notEmpty().trim().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().trim().withMessage('Author cannot be empty'),
  body('genre').optional().notEmpty().trim().withMessage('Genre cannot be empty'),
  body('status').optional().isIn(['To Read', 'Reading', 'Read']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const book = await Book.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Track if status is changing to "Read"
    const wasNotRead = book.status !== 'Read';
    const willBeRead = req.body.status === 'Read';
    const wasRead = book.status === 'Read';
    const willNotBeRead = req.body.status && req.body.status !== 'Read';

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        book[key] = req.body[key];
      }
    });

    // Set dateFinished if status changed to "Read"
    if (wasNotRead && willBeRead) {
      book.dateFinished = new Date();
    } else if (wasRead && willNotBeRead) {
      book.dateFinished = undefined;
    }

    await book.save();

    // Update user's reading goal
    if (wasNotRead && willBeRead) {
      // Book status changed to "Read", increment goal
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'readingGoal.current': 1 }
      });
    } else if (wasRead && willNotBeRead) {
      // Book status changed from "Read" to something else, decrement goal
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'readingGoal.current': -1 }
      });
    }

    res.json({
      message: 'Book updated successfully',
      book
    });

  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private
router.delete('/:id', auth, validateObjectId, async (req, res) => {
  try {
    const book = await Book.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update reading goal if deleting a "Read" book
    if (book.status === 'Read') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { 'readingGoal.current': -1 }
      });
    }

    // Delete cover image if it exists
    if (book.coverImage && book.coverImage.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', book.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });

  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books/:id/cover
// @desc    Upload book cover
// @access  Private
router.post('/:id/cover', auth, validateObjectId, upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const book = await Book.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!book) {
      // Delete uploaded file if book not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete old cover image if it exists
    if (book.coverImage && book.coverImage.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '..', book.coverImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update book with new cover image
    book.coverImage = `/uploads/books/${req.file.filename}`;
    await book.save();

    res.json({
      message: 'Cover image uploaded successfully',
      coverImage: book.coverImage
    });

  } catch (error) {
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload cover error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/books/:id/progress
// @desc    Update reading progress
// @access  Private
router.put('/:id/progress', auth, validateObjectId, [
  body('currentPage').isInt({ min: 0 }).withMessage('Current page must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const book = await Book.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.readingProgress) {
      return res.status(400).json({ message: 'Reading progress not initialized for this book' });
    }

    book.readingProgress.currentPage = req.body.currentPage;
    book.readingProgress.lastUpdated = new Date();

    // Auto-update status based on progress
    if (req.body.currentPage >= book.readingProgress.totalPages && book.status !== 'Read') {
      book.status = 'Read';
    } else if (req.body.currentPage > 0 && book.status === 'To Read') {
      book.status = 'Reading';
    }

    await book.save();

    res.json({
      message: 'Reading progress updated successfully',
      progress: book.readingProgress
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/books/:id/review
// @desc    Add or update book review
// @access  Private
router.post('/:id/review', auth, validateObjectId, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const book = await Book.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.review = {
      rating: req.body.rating,
      comment: req.body.comment || '',
      dateAdded: new Date()
    };

    await book.save();

    res.json({
      message: 'Review added successfully',
      review: book.review
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/books/search/google
// @desc    Search Google Books API
// @access  Private
router.get('/search/google', auth, [
  query('q').notEmpty().withMessage('Search query is required'),
  query('maxResults').optional().isInt({ min: 1, max: 40 }).withMessage('Max results must be between 1 and 40')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q, maxResults = 10 } = req.query;
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'Google Books API key not configured' });
    }

    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
      params: {
        q,
        maxResults,
        key: apiKey
      }
    });

    const books = response.data.items?.map(item => {
      const volumeInfo = item.volumeInfo;
      return {
        googleBooksId: item.id,
        title: volumeInfo.title || '',
        author: volumeInfo.authors?.join(', ') || '',
        description: volumeInfo.description || '',
        publishedDate: volumeInfo.publishedDate || '',
        publisher: volumeInfo.publisher || '',
        pageCount: volumeInfo.pageCount || 0,
        genre: volumeInfo.categories?.join(', ') || '',
        coverImage: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
        isbn: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || 
              volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || '',
        language: volumeInfo.language || 'en'
      };
    }) || [];

    res.json({ books });

  } catch (error) {
    console.error('Google Books search error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        params: error.config?.params
      }
    });
    
    if (error.response?.status === 403) {
      return res.status(500).json({ 
        message: 'Google Books API quota exceeded or invalid API key' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error searching Google Books',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
