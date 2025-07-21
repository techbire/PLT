const express = require('express');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/user/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Calculate reading statistics
    const userBooks = await Book.find({ userId: user._id });
    const booksRead = userBooks.filter(book => book.status === 'Read').length;
    const booksReading = userBooks.filter(book => book.status === 'Reading').length;
    const booksToRead = userBooks.filter(book => book.status === 'To Read').length;
    
    const userWithStats = {
      ...user.toObject(),
      stats: {
        totalBooks: userBooks.length,
        booksRead,
        booksReading,
        booksToRead
      }
    };
    
    res.json({ user: userWithStats });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().isString().isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName').optional().isString().isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('bio').optional().isString().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('readingGoal.yearly').optional().isInt({ min: 1 }).withMessage('Yearly reading goal must be at least 1'),
  body('preferences.readingGoal').optional().isInt({ min: 1 }).withMessage('Reading goal must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user.id);
    
    // Update allowed fields
    const allowedFields = ['firstName', 'lastName', 'bio', 'readingGoal', 'preferences'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'readingGoal' || field === 'preferences') {
          user[field] = { ...user[field].toObject(), ...req.body[field] };
        } else {
          user[field] = req.body[field];
        }
      }
    });

    // Handle preferences.readingGoal specifically
    if (req.body.preferences && req.body.preferences.readingGoal) {
      if (!user.readingGoal) {
        user.readingGoal = {};
      }
      user.readingGoal.yearly = req.body.preferences.readingGoal;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/user/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    
    // Delete old avatar if it exists
    if (user.avatar && (user.avatar.startsWith('/uploads/') || user.avatar.startsWith('/uploads/avatars/'))) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: user.avatar
    });

  } catch (error) {
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get reading statistics
    const stats = await Book.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      totalBooks: 0,
      booksRead: 0,
      booksReading: 0,
      booksToRead: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'Read') {
        formattedStats.booksRead = stat.count;
      } else if (stat._id === 'Reading') {
        formattedStats.booksReading = stat.count;
      } else if (stat._id === 'To Read') {
        formattedStats.booksToRead = stat.count;
      }
      formattedStats.totalBooks += stat.count;
    });

    // Get recent activity (last 5 books)
    const recentBooks = await Book.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title author status updatedAt');

    // Get current reading progress
    const currentlyReading = await Book.find({ 
      userId: req.user.id, 
      status: 'Reading' 
    }).select('title author readingProgress');

    // Calculate reading goal progress
    const currentYear = new Date().getFullYear();
    const booksReadThisYear = await Book.countDocuments({
      userId: req.user.id,
      status: 'Read',
      dateFinished: {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1)
      }
    });

    user.readingGoal.current = booksReadThisYear;
    await user.save();

    res.json({
      user,
      stats: formattedStats,
      recentBooks,
      currentlyReading,
      readingGoalProgress: {
        current: booksReadThisYear,
        target: user.readingGoal.yearly,
        percentage: Math.round((booksReadThisYear / user.readingGoal.yearly) * 100)
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/all
// @desc    Get all users with their reading statistics
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    // Get stats for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const books = await Book.find({ userId: user._id });
      const stats = {
        totalBooks: books.length,
        booksRead: books.filter(book => book.status === 'Read').length,
        booksReading: books.filter(book => book.status === 'Reading').length,
        booksToRead: books.filter(book => book.status === 'To Read').length
      };

      return {
        ...user.toObject(),
        stats
      };
    }));

    res.json({ users: usersWithStats });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/friends
// @desc    Get user's friends
// @access  Private
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', '-password');
    res.json({ friends: user.friends || [] });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/user/friends
// @desc    Add a friend
// @access  Private
router.post('/friends', auth, async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.friends && user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'User is already your friend' });
    }

    if (!user.friends) {
      user.friends = [];
    }

    user.friends.push(friendId);
    await user.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/user/search
// @desc    Search users
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({ users: [] });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } }, // Exclude current user
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { firstName: { $regex: q, $options: 'i' } },
            { lastName: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).select('-password').limit(10);

    // Get stats for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const books = await Book.find({ user: user._id });
      const stats = {
        totalBooks: books.length,
        booksRead: books.filter(book => book.status === 'Read').length,
        booksReading: books.filter(book => book.status === 'Reading').length,
        booksToRead: books.filter(book => book.status === 'To Read').length
      };

      return {
        ...user.toObject(),
        stats
      };
    }));

    res.json({ users: usersWithStats });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
