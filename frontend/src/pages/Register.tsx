import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (formData.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!formData.email.includes('@')) {
      errors.push('Please enter a valid email address');
    }

    if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormErrors([]);

    if (!validateForm()) {
      return;
    }
    
    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Personal Library
            </Typography>
            <Typography component="h2" variant="h5" gutterBottom>
              Sign Up
            </Typography>
            
            {(error || formErrors.length > 0) && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error && <div>{error}</div>}
                {formErrors.map((err, index) => (
                  <div key={index}>{err}</div>
                ))}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Box>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              <Box textAlign="center">
                <Link component={RouterLink} to="/login" variant="body2">
                  {"Already have an account? Sign In"}
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
