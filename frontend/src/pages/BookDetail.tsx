import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MenuBook as BookIcon
} from '@mui/icons-material';
import { bookService } from '../services/bookService';
import { getAssetUrl } from '../utils/urls';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressDialog, setProgressDialog] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [newProgress, setNewProgress] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      if (id) {
        const response = await bookService.getBook(id);
        setBook(response.book);
        setNewProgress(response.book.readingProgress?.currentPage || 0);
        setReviewRating(response.book.review?.rating || 0);
        setReviewComment(response.book.review?.comment || '');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch book');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleUpdateProgress = async () => {
    try {
      if (id) {
        await bookService.updateProgress(id, newProgress);
        await fetchBook();
        setProgressDialog(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update progress');
    }
  };

  const handleAddReview = async () => {
    try {
      if (id) {
        await bookService.addReview(id, reviewRating, reviewComment);
        await fetchBook();
        setReviewDialog(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        if (id) {
          await bookService.deleteBook(id);
          navigate('/books');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Read': return 'success';
      case 'Reading': return 'primary';
      case 'To Read': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (!book) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Book not found</Typography>
        <Button onClick={() => navigate('/books')} sx={{ mt: 2 }}>
          Back to Books
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Book Cover and Basic Info */}
        <Box sx={{ flex: '0 0 300px' }}>
          <Card>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              {book.coverImage ? (
                <img
                  src={getAssetUrl(book.coverImage)}
                  alt={book.title}
                  style={{
                    width: '100%',
                    maxWidth: 250,
                    height: 'auto',
                    borderRadius: 8
                  }}
                  onError={(e) => {
                    // Show placeholder instead of broken image
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjMzMyIgdmlld0JveD0iMCAwIDI1MCAzMzMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMzMzIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMjUgMTUwSDEwMFYxNzVIMTI1VjE1MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTEwMCAxNzVIMTI1VjIwMEgxMDBWMTc1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4=';
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 200,
                    height: 300,
                    margin: '0 auto',
                    backgroundColor: 'grey.300'
                  }}
                >
                  <BookIcon sx={{ fontSize: 80 }} />
                </Avatar>
              )}
              
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                {book.title}
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                by {book.author}
              </Typography>

              <Chip
                label={book.status}
                color={getStatusColor(book.status) as any}
                sx={{ mb: 2 }}
              />

              {book.status === 'Reading' && book.pageCount && book.readingProgress && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Reading Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={book.readingProgress.progressPercentage || 0}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {book.readingProgress.currentPage || 0} / {book.pageCount} pages 
                    ({book.readingProgress.progressPercentage || 0}%)
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Box>

        {/* Book Details */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Book Details
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Genre
                  </Typography>
                  <Typography variant="body1">{book.genre}</Typography>
                </Box>
                
                {book.publishedDate && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Published
                    </Typography>
                    <Typography variant="body1">{book.publishedDate}</Typography>
                  </Box>
                )}
                
                {book.isbn && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      ISBN
                    </Typography>
                    <Typography variant="body1">{book.isbn}</Typography>
                  </Box>
                )}
                
                {book.pageCount && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pages
                    </Typography>
                    <Typography variant="body1">{book.pageCount}</Typography>
                  </Box>
                )}
              </Box>

              {book.description && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2">{book.description}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Review Section */}
          {book.review && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  My Review
                </Typography>
                <Rating value={book.review.rating} readOnly sx={{ mb: 2 }} />
                <Typography variant="body2">{book.review.comment}</Typography>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/books/${id}/edit`)}
            >
              Edit Book
            </Button>
            
            {book.status === 'Reading' && (
              <Button
                variant="outlined"
                onClick={() => setProgressDialog(true)}
              >
                Update Progress
              </Button>
            )}
            
            <Button
              variant="outlined"
              onClick={() => setReviewDialog(true)}
            >
              {book.review ? 'Update Review' : 'Add Review'}
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Progress Dialog */}
      <Dialog open={progressDialog} onClose={() => setProgressDialog(false)}>
        <DialogTitle>Update Reading Progress</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Current Page"
            type="number"
            fullWidth
            variant="outlined"
            value={newProgress}
            onChange={(e) => setNewProgress(Number(e.target.value))}
            inputProps={{ min: 0, max: book.pageCount || 1000 }}
            sx={{ mt: 2 }}
          />
          {book.pageCount && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total pages: {book.pageCount}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProgressDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateProgress} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{book.review ? 'Update Review' : 'Add Review'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={reviewRating}
              onChange={(event, newValue) => setReviewRating(newValue || 0)}
              size="large"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Review Comment"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleAddReview} variant="contained">
            {book.review ? 'Update' : 'Add'} Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookDetail;
