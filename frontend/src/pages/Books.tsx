import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Pagination,
  Menu,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  SwapHoriz as StatusIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import bookService, { Book } from '../services/bookService';

const Books: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const fetchBooks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params: any = { page, limit: 12 };
      
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;

      const response = await bookService.getBooks(params);
      setBooks(response.books);
      setTotalPages(response.pagination.totalPages);
      setCurrentPage(response.pagination.currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchBooks(1);
  }, [fetchBooks]);

  const handleSearch = () => {
    fetchBooks(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchBooks(page);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(bookId);
        fetchBooks(currentPage);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleStatusMenuOpen = (event: React.MouseEvent<HTMLElement>, bookId: string) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedBookId(bookId);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedBookId(null);
  };

  const handleStatusChange = async (newStatus: 'To Read' | 'Reading' | 'Read') => {
    if (!selectedBookId) return;
    
    try {
      await bookService.updateBookStatus(selectedBookId, newStatus);
      fetchBooks(currentPage);
      handleStatusMenuClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Read':
        return 'success';
      case 'Reading':
        return 'warning';
      case 'To Read':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading && books.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Books
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/books/add')}
        >
          Add New Book
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search books..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ minWidth: 300 }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="To Read">To Read</MenuItem>
            <MenuItem value="Reading">Reading</MenuItem>
            <MenuItem value="Read">Read</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Books Grid */}
      {books.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No books found. Start building your library!
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/books/add')}
          >
            Add Your First Book
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
            {books.map((book) => (
              <Card key={book._id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {book.coverImage ? (
                  <Box sx={{ height: '280px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                    <CardMedia
                      component="img"
                      height="280"
                      image={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:5000${book.coverImage}`}
                      alt={book.title}
                      sx={{ 
                        objectFit: 'cover',
                        aspectRatio: '9/16',
                        width: '100%',
                        maxHeight: '280px'
                      }}
                      onError={(e) => {
                        // Show placeholder instead of hiding
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNDAgMTIwSDEyMFYxNDBIMTQwVjEyMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTEyMCAxNDBIMTQwVjE2MEgxMjBWMTQwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4=';
                      }}
                    />
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      height: '280px', 
                      backgroundColor: '#f5f5f5', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      aspectRatio: '9/16'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No Cover
                    </Typography>
                  </Box>
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Genre: {book.genre}
                  </Typography>
                  
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip
                      label={book.status}
                      color={getStatusColor(book.status) as any}
                      size="small"
                    />
                  </Box>

                  {book.readingProgress && (
                    <Typography variant="body2" color="text.secondary">
                      Progress: {book.readingProgress.progressPercentage}%
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/books/${book._id}`)}
                    title="View Details"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/books/${book._id}?edit=true`)}
                    title="Edit Book"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleStatusMenuOpen(e, book._id)}
                    title="Change Status"
                  >
                    <StatusIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteBook(book._id)}
                    color="error"
                    title="Delete Book"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Status Change Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleStatusMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('To Read')}>
          <Chip label="To Read" color="info" size="small" sx={{ mr: 1 }} />
          To Read
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Reading')}>
          <Chip label="Reading" color="warning" size="small" sx={{ mr: 1 }} />
          Reading
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Read')}>
          <Chip label="Read" color="success" size="small" sx={{ mr: 1 }} />
          Read
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Books;
