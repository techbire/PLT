# Personal Library Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=material-ui&logoColor=white)](https://mui.com/)

A full-stack MERN (MongoDB, Express, React, Node.js) application for tracking your personal book collection and reading progress.

## 🚀 Live Demo

<!-- Add your live demo links here when deployed -->
- **Frontend**: [Demo Link](https://your-demo-link.com)
- **Backend API**: [API Documentation](https://your-api-docs.com)

## 📸 Screenshots

   ### Dashboard
   ![Dashboard](screenshots/dashboard.png)
   *Main dashboard showing reading statistics and recent activity*

   ### Book Collection
   ![Book Collection](screenshots/books.png)
   *Complete library view with filtering and sorting options*

   ### Add New Book
   ![Add Book Form](screenshots/add-book.png)
   *Form for adding books manually or via Google Books API*

   ### Book Details
   ![Book Details](screenshots/book-detail.png)
   *Detailed view of a book with reading progress and notes*

   ### User Profile
   ![User Profile](screenshots/profile.png)
   *User profile with reading preferences and statistics*

   ### All Users
   ![All Users](screenshots/all-users.png)
   *View of all registered users with management options*

   ### Login Page
   ![Login Screen](screenshots/login.png)
   *Authentication screen for user login*

   ### Responsive Design
   ![Mobile View](screenshots/responsive.png)
   *Mobile-responsive layout showing adaptability across devices*

## Features

### 📚 Book Management
- **Add Books**: Manually add books or search using Google Books API
- **Book Details**: Track title, author, genre, status, description, ISBN, page count
- **Cover Images**: Upload custom book covers
- **Status Tracking**: Want to Read, Currently Reading, Read
- **Reading Progress**: Track current page and reading percentage
- **Reviews & Ratings**: Add personal ratings and review comments
- **Notes**: Add personal notes and thoughts about books

### 👤 User Management
- **Authentication**: Secure user registration and login
- **Profile Management**: Customize profile with avatar, bio, and preferences
- **Reading Goals**: Set and track annual reading goals
- **Privacy Settings**: Control profile visibility and data sharing
- **Notifications**: Configure reading reminders and goal alerts

### 📊 Analytics & Insights
- **Reading Statistics**: Track total books, pages read, average ratings
- **Progress Dashboard**: Visualize reading goals and monthly progress
- **Genre Analytics**: See your reading preferences by genre
- **Reading History**: Track when books were started and finished

### 🔍 Advanced Features
- **Search & Filter**: Find books by title, author, genre, status
- **Pagination**: Efficient browsing of large book collections
- **Google Books Integration**: Search and import book data automatically
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: Choose your preferred viewing experience

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Helmet** for security
- **Express Rate Limit** for API protection
- **Axios** for Google Books API integration

### Frontend
- **React** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

## Project Structure

```
personal-library-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Book.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   └── user.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Books.tsx
│   │   │   ├── AddBook.tsx
│   │   │   ├── BookDetail.tsx
│   │   │   ├── EditBook.tsx
│   │   │   └── Profile.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   └── bookService.ts
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
└── package.json
```

## ⚡ Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/personal-library-tracker.git
   cd personal-library-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start the development servers**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Installation & Setup

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Issues**
```bash
# Make sure MongoDB is running
# For Windows:
net start MongoDB

# For macOS with Homebrew:
brew services start mongodb-community

# For Linux:
sudo systemctl start mongod
```

**Port Already in Use**
```bash
# Kill process using port 5000 (backend)
npx kill-port 5000

# Kill process using port 3000 (frontend)
npx kill-port 3000
```

**File Upload Issues**
- Ensure the `uploads` directory exists in the backend folder
- Check file permissions on the uploads directory
- Verify MAX_FILE_SIZE in your .env file

**Google Books API Issues**
- Ensure you have a valid Google Books API key
- Check your API key quota and usage limits
- Verify the API key is correctly set in your .env file

## 📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/personal-library-tracker
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here
   JWT_REFRESH_EXPIRE=30d
   GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=5000000
   NODE_ENV=development
   ```

4. **Start the backend server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

### Full Stack Development

To run both servers concurrently, from the root directory:

```bash
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Books
- `GET /api/books` - Get user's books (with pagination & filters)
- `POST /api/books` - Add new book
- `GET /api/books/:id` - Get specific book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `POST /api/books/:id/cover` - Upload book cover
- `PUT /api/books/:id/progress` - Update reading progress
- `POST /api/books/:id/review` - Add/update book review
- `GET /api/books/stats` - Get reading statistics
- `GET /api/books/search/google` - Search Google Books API

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/avatar` - Upload profile avatar
- `GET /api/user/dashboard` - Get dashboard data

## Features in Detail

### Book Status Management
- **Want to Read**: Books you plan to read
- **Currently Reading**: Books you're actively reading (with progress tracking)
- **Read**: Completed books (with optional reviews and ratings)

### Reading Progress Tracking
- Track current page for books you're reading
- Automatic percentage calculation
- Visual progress indicators
- Reading statistics and trends

### Review System
- 5-star rating system
- Written review comments
- Review date tracking
- Personal reading insights

### Google Books Integration
- Search millions of books
- Automatic metadata import
- Cover image retrieval
- ISBN and publication data

### User Preferences
- Customizable reading goals
- Favorite genre tracking
- Privacy settings
- Notification preferences

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against API abuse
- **CORS**: Configured for secure cross-origin requests
- **Helmet**: Security headers for Express
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricted file types and sizes

## 🚀 Deployment

### Environment Variables for Production

Create a `.env` file in the backend directory with the following variables:

```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Database (use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-library-tracker

# JWT Secrets (use strong, random strings)
JWT_SECRET=your_production_jwt_secret_minimum_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_production_refresh_secret_minimum_32_characters
JWT_REFRESH_EXPIRE=30d

# Google Books API
GOOGLE_BOOKS_API_KEY=your_google_books_api_key

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5000000

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Options

#### Option 1: Heroku
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect your GitHub repository
4. Deploy the backend to Heroku
5. Deploy the frontend to Netlify/Vercel

#### Option 2: Digital Ocean/AWS
1. Set up a Ubuntu server
2. Install Node.js and MongoDB
3. Clone your repository
4. Configure environment variables
5. Use PM2 for process management
6. Set up nginx as reverse proxy

#### Option 3: Docker
```dockerfile
# Use the provided Dockerfile
docker build -t personal-library-tracker .
docker run -p 5000:5000 personal-library-tracker
```

### Production Checklist
- [ ] Set strong JWT secrets
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Configure CORS for your domain
- [ ] Set up HTTPS
- [ ] Configure rate limiting
- [ ] Set up error logging
- [ ] Configure file upload limits
- [ ] Set up database backups

## 📊 Performance

### Optimization Features
- **Pagination**: Efficient loading of large book collections
- **Lazy Loading**: Images loaded on demand
- **Caching**: API responses cached for better performance
- **Database Indexing**: Optimized queries for fast searches
- **File Compression**: Uploaded images are compressed
- **Code Splitting**: React components loaded as needed

### Monitoring
- Use tools like New Relic or DataDog for performance monitoring
- Set up error tracking with Sentry
- Monitor database performance
- Track API response times

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Protected routes and middleware
- Role-based access control ready

### Data Protection
- Input validation and sanitization
- SQL injection prevention with Mongoose
- XSS protection with Helmet
- CORS configuration
- Rate limiting to prevent abuse
- File upload restrictions

### Best Practices
- Environment variables for sensitive data
- Secure headers with Helmet
- Regular security audits
- Dependency vulnerability scanning

## 📈 Analytics & Insights

### User Analytics
- Reading streak tracking
- Books read per month/year
- Favorite genres analysis
- Reading pace statistics
- Goal achievement tracking

### Data Visualization
- Progress charts and graphs
- Reading habit heatmaps
- Genre distribution pie charts
- Monthly reading trends

## 🛠️ Built With

### Core Technologies
- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **UI Framework**: Material-UI (MUI) v5
- **API Integration**: Google Books API

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Editor**: VS Code (recommended)
- **API Testing**: Postman/Thunder Client
- **Database GUI**: MongoDB Compass

### Deployment & DevOps
- **Frontend Hosting**: Netlify, Vercel, or AWS S3
- **Backend Hosting**: Heroku, DigitalOcean, or AWS EC2
- **Database**: MongoDB Atlas (cloud)
- **File Storage**: Local storage or AWS S3
- **CI/CD**: GitHub Actions (optional)

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or ensure MongoDB is available
2. Configure environment variables for production
3. Deploy to platforms like Heroku, AWS, or DigitalOcean
4. Ensure file upload directory is configured properly

### Frontend Deployment
1. Build the React application:
   ```bash
   npm run build
   ```
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Configure API base URL for production

### Docker Deployment (Optional)
Consider containerizing the application with Docker for consistent deployments across environments.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a pull request

### Code Style
- Follow the existing code style
- Use TypeScript for new frontend components
- Add proper error handling
- Include comments for complex logic
- Update documentation as needed

### Reporting Issues
- Use the GitHub issue tracker
- Include detailed reproduction steps
- Add screenshots if applicable
- Specify your environment (OS, Node.js version, etc.)

## 🧪 Testing

### Running Tests
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

### Test Coverage
```bash
# Generate test coverage report
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/refresh` | Refresh JWT token | Yes |

### Book Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books` | Get user's books | Yes |
| POST | `/api/books` | Add new book | Yes |
| GET | `/api/books/:id` | Get specific book | Yes |
| PUT | `/api/books/:id` | Update book | Yes |
| DELETE | `/api/books/:id` | Delete book | Yes |
| PUT | `/api/books/:id/status` | Update book status | Yes |
| POST | `/api/books/:id/cover` | Upload book cover | Yes |

### Statistics Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books/stats` | Get reading statistics | Yes |
| GET | `/api/books/search/google` | Search Google Books API | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

**Documentation**
- Check the [Setup Guide](SETUP_GUIDE.md) for detailed installation instructions
- Review the [MongoDB Setup Guide](MONGODB_SETUP.md) for database configuration
- Read the [API Documentation](#-api-documentation) for endpoint details

**Community Support**
- 🐛 [Report bugs](https://github.com/yourusername/personal-library-tracker/issues)
- 💡 [Request features](https://github.com/yourusername/personal-library-tracker/issues)
- 💬 [Join discussions](https://github.com/yourusername/personal-library-tracker/discussions)

**Contact**
- Email: your-email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourusername](https://twitter.com/yourusername)

### FAQ

**Q: How do I reset my password?**
A: Currently, password reset functionality is not implemented. You'll need to contact support or reset your data.

**Q: Can I export my book data?**
A: Data export functionality is planned for a future release. You can currently access your data through the API.

**Q: Is there a mobile app?**
A: Not yet, but the web application is fully responsive and works well on mobile devices.

**Q: How do I get a Google Books API key?**
A: Visit the [Google Cloud Console](https://console.cloud.google.com/), create a project, enable the Books API, and generate an API key.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses
- Material-UI: MIT License
- React: MIT License
- Express: MIT License
- MongoDB: Server Side Public License (SSPL)

## 🙏 Acknowledgments

### Contributors
- Thanks to all contributors who have helped improve this project
- Special thanks to the open-source community for the amazing tools and libraries

### Inspiration
- Inspired by Goodreads and other book tracking applications
- Built with modern web development best practices
- Designed with user experience in mind

### Resources
- [React Documentation](https://reactjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Google Books API Documentation](https://developers.google.com/books)

## Support

For support, email your-email@example.com or create an issue in the GitHub repository.

## Roadmap

### Upcoming Features
- [ ] Social features (friend connections, book recommendations)
- [ ] Book clubs and group reading challenges
- [ ] Advanced analytics and reading insights
- [ ] Export/import functionality
- [ ] Mobile app development
- [ ] Goodreads integration
- [ ] Public book lists and sharing
- [ ] Advanced search with filters
- [ ] Reading streak tracking
- [ ] Author following and new book notifications

---

**Happy Reading!** 📖✨
