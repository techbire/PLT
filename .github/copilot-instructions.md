# Copilot Instructions for Personal Library Tracker

## Project Overview
This is a Personal Library Tracker application built with the MERN stack (MongoDB, Express.js, React with TypeScript, Node.js). The application helps users track their personal book collections, reading progress, and goals.

## Architecture
- **Backend**: Node.js/Express.js API server with MongoDB database
- **Frontend**: React with TypeScript, Material-UI components
- **Authentication**: JWT-based authentication with refresh tokens
- **File Storage**: Local file storage with Multer for book covers and avatars

## Key Technologies
- **Backend**: Express.js, Mongoose, JWT, Multer, Helmet, Express Rate Limit
- **Frontend**: React, TypeScript, Material-UI, React Router, Axios
- **Database**: MongoDB with Mongoose ODM
- **API Integration**: Google Books API for book data

## Code Style and Conventions

### TypeScript
- Use strict TypeScript with proper type definitions
- Define interfaces for all data structures
- Use proper typing for API responses and function parameters
- Prefer explicit types over `any`

### React Components
- Use functional components with hooks
- Implement proper error handling and loading states
- Use Material-UI components consistently
- Follow React best practices for state management

### API Design
- RESTful API endpoints with proper HTTP methods
- Consistent error handling and response formats
- Proper middleware for authentication and validation
- Rate limiting and security measures

### Database
- Use Mongoose schemas with proper validation
- Implement proper indexing for performance
- Use middleware for data transformation and validation

## File Structure Patterns

### Backend
```
backend/
├── models/          # Mongoose schemas
├── routes/          # Express route handlers
├── middleware/      # Custom middleware (auth, upload, etc.)
├── uploads/         # File storage directory
├── .env            # Environment variables
└── server.js       # Main server file
```

### Frontend
```
frontend/src/
├── components/      # Reusable React components
├── pages/          # Page-level components
├── services/       # API service layers
├── contexts/       # React context providers
├── types/          # TypeScript type definitions
└── App.tsx         # Main application component
```

## Development Guidelines

### When Adding New Features
1. **Backend First**: Create/update models, routes, and middleware
2. **API Integration**: Update service layers in frontend
3. **UI Implementation**: Create/update React components
4. **Type Safety**: Ensure proper TypeScript typing throughout
5. **Error Handling**: Implement comprehensive error handling
6. **Testing**: Consider adding tests for critical functionality

### Security Considerations
- Always validate input on both client and server
- Use proper authentication middleware for protected routes
- Implement rate limiting for public endpoints
- Sanitize file uploads and validate file types
- Use HTTPS in production environments

### Performance Best Practices
- Implement pagination for large data sets
- Use proper MongoDB indexing
- Optimize image uploads and storage
- Implement caching where appropriate
- Use React.memo and useMemo for expensive operations

## Common Patterns

### API Service Pattern
```typescript
class BookService {
  async getBooks(params?: FilterParams): Promise<BooksResponse> {
    const response = await api.get('/books', { params });
    return response.data;
  }
}
```

### React Component Pattern
```typescript
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Component logic
  
  return (
    <Box>
      {error && <Alert severity="error">{error}</Alert>}
      {/* Component JSX */}
    </Box>
  );
};
```

### MongoDB Schema Pattern
```javascript
const Schema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});
```

## Debugging Tips
- Use proper error boundaries in React
- Implement comprehensive logging in backend
- Use TypeScript strict mode for better error detection
- Test API endpoints with proper error scenarios

## Testing Strategy
- Unit tests for utility functions
- Integration tests for API endpoints
- Component testing for React components
- End-to-end testing for critical user flows

## Deployment Considerations
- Environment variable configuration
- Database connection strings
- File upload directory setup
- CORS configuration for production
- Security headers and rate limiting

## Future Enhancements
When suggesting improvements, consider:
- Social features (friend connections, book sharing)
- Advanced analytics and insights
- Mobile app development
- Third-party integrations (Goodreads, Amazon)
- Enhanced search and filtering capabilities
- Reading challenges and gamification
