import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import bookService, { BookFormData, GoogleBook } from '../services/bookService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Manual form data
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    status: 'To Read',
    description: '',
    publishedDate: '',
    publisher: '',
    pageCount: undefined,
    language: 'en',
    tags: [],
    favorite: false,
    priority: 'Medium',
  });

  // Google Books search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [searching, setSearching] = useState(false);

  // Cover image upload
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setCoverFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setFormData(prev => ({
      ...prev,
      coverImage: undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.author) {
      setError('Title and author are required');
      return;
    }

    try {
      setLoading(true);
      
      // First create the book
      const bookResponse = await bookService.createBook(formData);
      
      // Then upload cover image if provided
      if (coverFile && bookResponse.book) {
        try {
          await bookService.uploadCover(bookResponse.book._id, coverFile);
        } catch (coverError) {
          console.error('Cover upload failed:', coverError);
          // Don't fail the entire operation if cover upload fails
        }
      }
      
      setSuccess('Book added successfully!');
      setTimeout(() => {
        navigate('/books');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const response = await bookService.searchGoogleBooks(searchQuery, 10);
      setSearchResults(response.books);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search Google Books');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectGoogleBook = (book: GoogleBook) => {
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre || '',
      status: 'To Read',
      description: book.description,
      publishedDate: book.publishedDate,
      publisher: book.publisher,
      pageCount: book.pageCount || undefined,
      language: book.language || 'en',
      googleBooksId: book.googleBooksId,
      coverImage: book.coverImage || undefined, // Include cover image from Google Books
      tags: [],
      favorite: false,
      priority: 'Medium',
    });
    
    // Clear any manually uploaded cover since we're using Google Books cover
    setCoverFile(null);
    setCoverPreview(null);
    
    setTabValue(0); // Switch to manual form
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business', 'Technology',
    'Health', 'Travel', 'Cooking', 'Art', 'Education', 'Religion', 'Other'
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Book
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Manual Entry" />
            <Tab label="Search Google Books" />
          </Tabs>
        </Box>

        {/* Manual Entry Tab */}
        <TabPanel value={tabValue} index={0}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                required
                fullWidth
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                disabled={loading}
              />
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={formData.genre}
                  label="Genre"
                  onChange={(e) => handleSelectChange('genre', e.target.value)}
                  disabled={loading}
                >
                  {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleSelectChange('status', e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="To Read">To Read</MenuItem>
                  <MenuItem value="Reading">Reading</MenuItem>
                  <MenuItem value="Read">Read</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => handleSelectChange('priority', e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              sx={{ mb: 2 }}
            />

            {/* Cover Image Upload */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Cover Image
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Upload a cover image for your book (Max 5MB, JPG/PNG/GIF)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="cover-upload"
                  type="file"
                  onChange={handleCoverUpload}
                  disabled={loading}
                />
                <label htmlFor="cover-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    disabled={loading}
                  >
                    Upload Cover
                  </Button>
                </label>
                
                {(coverPreview || formData.coverImage) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={coverPreview || (formData.coverImage?.startsWith('http') ? formData.coverImage : `http://localhost:5000${formData.coverImage}`)}
                      variant="rounded"
                      sx={{ width: 60, height: 90 }}
                    />
                    <IconButton
                      onClick={handleRemoveCover}
                      disabled={loading}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Page Count"
                name="pageCount"
                type="number"
                value={formData.pageCount || ''}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                type="button"
                onClick={() => navigate('/books')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Book'}
              </Button>
            </Box>
          </Box>
        </TabPanel>

        {/* Google Books Search Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGoogleSearch()}
                disabled={searching}
              />
              <Button
                variant="contained"
                onClick={handleGoogleSearch}
                disabled={searching || !searchQuery.trim()}
              >
                {searching ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Box>
          </Box>

          {searchResults.length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
              {searchResults.map((book, index) => (
                <Card key={index}>
                  {book.coverImage && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={book.coverImage}
                      alt={book.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      by {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.publishedDate && `Published: ${book.publishedDate}`}
                    </Typography>
                    {book.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {book.description.substring(0, 100)}...
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleSelectGoogleBook(book)}
                    >
                      Select This Book
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AddBook;
