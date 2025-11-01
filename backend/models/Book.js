const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

const readingProgressSchema = new mongoose.Schema({
  currentPage: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    required: true
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  isbn: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Allow multiple null values
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['To Read', 'Reading', 'Read'],
    default: 'To Read'
  },
  coverImage: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  publishedDate: {
    type: Date
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  pageCount: {
    type: Number,
    min: [1, 'Page count must be at least 1']
  },
  language: {
    type: String,
    default: 'en'
  },
  googleBooksId: {
    type: String,
    unique: true,
    sparse: true
  },
  readingProgress: readingProgressSchema,
  review: reviewSchema,
  tags: [{
    type: String,
    trim: true
  }],
  notes: [{
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Note cannot exceed 500 characters']
    },
    page: {
      type: Number
    },
    dateAdded: {
      type: Date,
      default: Date.now
    }
  }],
  dateAdded: {
    type: Date,
    default: Date.now
  },
  dateStarted: {
    type: Date
  },
  dateFinished: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  favorite: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

// Index for better query performance
bookSchema.index({ userId: 1, status: 1 });
bookSchema.index({ userId: 1, title: 'text', author: 'text' });

// Update reading progress percentage
bookSchema.pre('save', function(next) {
  if (this.readingProgress && this.readingProgress.totalPages > 0) {
    this.readingProgress.progressPercentage = Math.round(
      (this.readingProgress.currentPage / this.readingProgress.totalPages) * 100
    );
  }
  
  // Update dates based on status
  if (this.isModified('status')) {
    const now = new Date();
    
    if (this.status === 'Reading' && !this.dateStarted) {
      this.dateStarted = now;
    } else if (this.status === 'Read' && !this.dateFinished) {
      this.dateFinished = now;
      if (!this.dateStarted) {
        this.dateStarted = now;
      }
    }
  }
  
  next();
});

module.exports = mongoose.model('Book', bookSchema);
