import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Avatar
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { bookService } from '../services/bookService';

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'To Read',
    description: '',
    isbn: '',
    publishedDate: '',
    pageCount: '',
    language: ''
  });

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business',
    'Health', 'Travel', 'Cooking', 'Art', 'Poetry', 'Drama',
    'Horror', 'Thriller', 'Adventure', 'Children', 'Young Adult',
    'Philosophy', 'Religion', 'Science', 'Technology', 'Education',
    'Politics', 'Psychology', 'Other'
  ];

  const statusOptions = [
    { value: 'To Read', label: 'Want to Read' },
    { value: 'Reading', label: 'Currently Reading' },
    { value: 'Read', label: 'Read' }
  ];

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      if (id) {
        const response = await bookService.getBook(id);
        const book = response.book;
        
        setFormData({
          title: book.title || '',
          author: book.author || '',
          genre: book.genre || '',
          status: book.status || 'To Read',
          description: book.description || '',
          isbn: book.isbn || '',
          publishedDate: book.publishedDate || '',
          pageCount: book.pageCount?.toString() || '',
          language: book.language || ''
        });
        
        if (book.coverImage) {
          setCoverPreview(book.coverImage);
        }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!id) {
        setError('Book ID is required');
        return;
      }

      const updateData = {
        ...formData,
        pageCount: formData.pageCount ? Number(formData.pageCount) : undefined,
        status: formData.status as 'To Read' | 'Reading' | 'Read'
      };

      await bookService.updateBook(id, updateData);

      if (coverFile) {
        await bookService.uploadCover(id, coverFile);
      }

      setSuccess('Book updated successfully!');
      setTimeout(() => {
        navigate(`/books/${id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/books/${id}`);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Book
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Cover Image Section */}
              <Box sx={{ flex: '0 0 250px' }}>
                <Typography variant="h6" gutterBottom>
                  Book Cover
                </Typography>
                
                {coverPreview ? (
                  <img
                    src={coverPreview.startsWith('http') ? coverPreview : `http://localhost:5000${coverPreview}`}
                    alt="Cover Preview"
                    style={{
                      width: '100%',
                      maxWidth: 200,
                      height: 'auto',
                      borderRadius: 8,
                      marginBottom: 16
                    }}
                    onError={(e) => {
                      // Show placeholder instead of broken image
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTIwSDgwVjE0MEgxMDBWMTIwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNODAgMTQwSDEwMFYxNjBIODBWMTQwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4=';
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 150,
                      height: 200,
                      margin: '0 auto 16px',
                      backgroundColor: 'grey.300'
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                )}
                
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="cover-upload"
                  type="file"
                  onChange={handleCoverChange}
                />
                <label htmlFor="cover-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    fullWidth
                  >
                    Upload Cover
                  </Button>
                </label>
              </Box>

              {/* Form Fields */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    name="title"
                    label="Title"
                    fullWidth
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                  />

                  <TextField
                    name="author"
                    label="Author"
                    fullWidth
                    required
                    value={formData.author}
                    onChange={handleInputChange}
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      name="genre"
                      label="Genre"
                      select
                      fullWidth
                      value={formData.genre}
                      onChange={handleInputChange}
                    >
                      {genres.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      name="status"
                      label="Reading Status"
                      select
                      fullWidth
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <TextField
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    fullWidth
                    value={formData.description}
                    onChange={handleInputChange}
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      name="isbn"
                      label="ISBN"
                      fullWidth
                      value={formData.isbn}
                      onChange={handleInputChange}
                    />

                    <TextField
                      name="publishedDate"
                      label="Published Date"
                      fullWidth
                      value={formData.publishedDate}
                      onChange={handleInputChange}
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      name="pageCount"
                      label="Total Pages"
                      type="number"
                      fullWidth
                      value={formData.pageCount}
                      onChange={handleInputChange}
                      inputProps={{ min: 1 }}
                    />

                    <TextField
                      name="language"
                      label="Language"
                      fullWidth
                      value={formData.language}
                      onChange={handleInputChange}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditBook;
