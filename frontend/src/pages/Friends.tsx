import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  MenuBook as BookIcon,
  Timeline as ProgressIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

interface User {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  readingGoal?: {
    yearly: number;
    current: number;
  };
  stats?: {
    totalBooks: number;
    booksRead: number;
    booksReading: number;
    booksToRead: number;
  };
  preferences?: {
    privacy?: {
      showProfile: boolean;
    };
  };
}

const Friends: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching all users...');
      const response = await authService.getAllUsers();
      console.log('Response:', response);
      setUsers(response.users || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (userObj: User) => {
    if (userObj.firstName && userObj.lastName) {
      return `${userObj.firstName} ${userObj.lastName}`;
    }
    return userObj.username;
  };

  const getAvatarUrl = (avatarPath: string) => {
    if (!avatarPath) return undefined;
    if (avatarPath.startsWith('http')) {
      return avatarPath;
    }
    return `http://localhost:5000${avatarPath}`;
  };

  const isCurrentUser = (userObj: User) => {
    if (!user) return false;
    console.log('Checking if current user:', {
      userObj_id: userObj._id,
      user_id: user.id,
      user_full: user,
      isMatch: userObj._id === user.id
    });
    // Check both id and _id to handle different formats
    return userObj._id === user.id || userObj._id === (user as any)._id;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Users ({users.length})
      </Typography>

      {users.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
          {users.map((userObj) => (
            <Card key={userObj._id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={getAvatarUrl(userObj.avatar || '')}
                    sx={{ width: 64, height: 64, mr: 2 }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {getDisplayName(userObj)}
                      {isCurrentUser(userObj) && (
                        <Typography 
                          component="span" 
                          variant="body2" 
                          sx={{ 
                            ml: 1, 
                            color: 'white', 
                            fontWeight: 'bold',
                            backgroundColor: 'primary.light',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem'
                          }}
                        >
                          [You]
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{userObj.username}
                    </Typography>
                  </Box>
                </Box>

                {userObj.bio && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {userObj.bio}
                  </Typography>
                )}

                {userObj.stats && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Reading Statistics
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        icon={<BookIcon />}
                        label={`${userObj.stats.totalBooks} Total Books`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${userObj.stats.booksRead} Read`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        label={`${userObj.stats.booksReading} Reading`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={`${userObj.stats.booksToRead} To Read`}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                )}

                {userObj.readingGoal && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ProgressIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        Reading Goal: {userObj.readingGoal.current || 0} / {userObj.readingGoal.yearly} books
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(((userObj.readingGoal.current || 0) / userObj.readingGoal.yearly) * 100, 100)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Friends;
