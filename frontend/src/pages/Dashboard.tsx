import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Book as BookIcon,
  MenuBook as ReadingIcon,
  CheckCircle as CompletedIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import bookService from '../services/bookService';

interface DashboardStats {
  'To Read': number;
  'Reading': number;
  'Read': number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ 'To Read': 0, 'Reading': 0, 'Read': 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await bookService.getStats();
      setStats(response.statusStats);
      
      // Also refresh user data to get updated reading goal
      const userResponse = await fetch('http://localhost:5000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        // Update the user context if needed
        window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: userData.user }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh stats when dashboard is focused
  useEffect(() => {
    const handleFocus = () => {
      fetchStats();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const readingGoalProgress = user?.readingGoal 
    ? Math.round((user.readingGoal.current / user.readingGoal.yearly) * 100) 
    : 0;

  if (loading) {
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
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName || user?.username}!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Reading Goal Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {new Date().getFullYear()} Reading Goal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user?.readingGoal?.current || 0} of {user?.readingGoal?.yearly || 12} books
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({readingGoalProgress}%)
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(readingGoalProgress, 100)} 
            sx={{ height: 10, borderRadius: 5 }}
          />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <BookmarkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {stats['To Read']}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                To Read
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReadingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {stats['Reading']}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Currently Reading
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CompletedIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {stats['Read']}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <BookIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {stats['To Read'] + stats['Reading'] + stats['Read']}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Books
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use the navigation bar above to:
        </Typography>
        <Box component="ul" sx={{ mt: 1 }}>
          <li>View and manage your book collection</li>
          <li>Add new books to your library</li>
          <li>Update your reading progress</li>
          <li>Write reviews for completed books</li>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
