import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Switch,
  FormControlLabel,
  Slider,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  console.log('Profile component rendered, user:', user);
  console.log('Profile state:', profile);
  console.log('Loading state:', loading);

  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    readingGoal: 12,
    showProfile: true
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching profile...');
      
      // Fetch both profile and dashboard data
      const [profileResponse, dashboardResponse] = await Promise.all([
        authService.getProfile(),
        authService.getDashboard()
      ]);
      
      console.log('Profile response:', profileResponse);
      console.log('Dashboard response:', dashboardResponse);
      
      // Handle the response based on the backend format
      let profileData;
      if (profileResponse.user) {
        profileData = profileResponse.user;
      } else if (profileResponse.data && profileResponse.data.user) {
        profileData = profileResponse.data.user;
      } else {
        profileData = profileResponse;
      }
      
      console.log('Profile data:', profileData);
      setProfile(profileData);
      setDashboardData(dashboardResponse.data || dashboardResponse);
      
      setEditData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        bio: profileData.bio || '',
        readingGoal: profileData.preferences?.readingGoal || profileData.readingGoal?.yearly || 12,
        showProfile: profileData.preferences?.privacy?.showProfile ?? true
      });

      // Fix avatar display - handle both relative and absolute URLs
      if (profileData.avatar) {
        const avatarUrl = profileData.avatar.startsWith('http') 
          ? profileData.avatar 
          : `http://localhost:5000${profileData.avatar}`;
        setAvatarPreview(avatarUrl);
      }
      
      // Update the AuthContext user data with the latest profile info
      if (profileData.avatar && user) {
        const updatedUser = { ...user, avatar: profileData.avatar };
        window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: updatedUser }));
      }
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const updateData = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        bio: editData.bio,
        preferences: {
          readingGoal: editData.readingGoal,
          privacy: {
            showProfile: editData.showProfile
          }
        }
      };

      await authService.updateProfile(updateData);

      if (avatarFile) {
        await authService.uploadAvatar(avatarFile);
      }

      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      // Re-fetch profile to get the latest data
      await fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Profile not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
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

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Profile Info */}
        <Box sx={{ flex: '0 0 300px' }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                {avatarPreview ? (
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 120, height: 120, margin: '0 auto' }}
                  />
                ) : (
                  <Avatar sx={{ width: 120, height: 120, margin: '0 auto' }}>
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                )}
                
                {editing && (
                  <>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="avatar-upload"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        component="span"
                        startIcon={<UploadIcon />}
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Upload Avatar
                      </Button>
                    </label>
                  </>
                )}
              </Box>

              <Typography variant="h5" gutterBottom>
                {profile.firstName && profile.lastName 
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.username
                }
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{profile.username}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>

              {profile.bio && (
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                  "{profile.bio}"
                </Typography>
              )}

              <Box sx={{ mt: 2 }}>
                {!editing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditing(false);
                        setAvatarPreview(profile.avatar || '');
                        setAvatarFile(null);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      Save
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Reading Stats */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reading Statistics
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="h4" color="primary">
                    {dashboardData?.stats?.totalBooks || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Books
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h4" color="success.main">
                    {dashboardData?.stats?.booksRead || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Books Read
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h4" color="info.main">
                    {dashboardData?.stats?.booksReading || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Currently Reading
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {dashboardData?.stats?.booksToRead || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Want to Read
                  </Typography>
                </Box>
              </Box>
              
              {/* Reading Goal Progress */}
              {dashboardData?.readingGoal && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Reading Goal Progress: {dashboardData.readingGoal.current} / {dashboardData.readingGoal.yearly} books
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '100%' }}>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(100, (dashboardData.readingGoal.current / dashboardData.readingGoal.yearly) * 100)}%`,
                          height: '100%',
                          backgroundColor: '#4caf50',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((dashboardData.readingGoal.current / dashboardData.readingGoal.yearly) * 100)}%
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Profile Details & Settings */}
        <Box sx={{ flex: 1 }}>
          {editing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Personal Information */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <TextField
                        name="firstName"
                        label="First Name"
                        fullWidth
                        value={editData.firstName}
                        onChange={handleInputChange}
                      />
                      
                      <TextField
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        value={editData.lastName}
                        onChange={handleInputChange}
                      />
                    </Box>
                    
                    <TextField
                      name="bio"
                      label="Bio"
                      multiline
                      rows={3}
                      fullWidth
                      value={editData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Reading Preferences */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Reading Preferences
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Annual Reading Goal: {editData.readingGoal} books
                    </Typography>
                    <Slider
                      value={editData.readingGoal}
                      onChange={(e, value) => setEditData(prev => ({ ...prev, readingGoal: value as number }))}
                      valueLabelDisplay="auto"
                      min={1}
                      max={100}
                      marks={[
                        { value: 12, label: '12' },
                        { value: 24, label: '24' },
                        { value: 50, label: '50' },
                        { value: 100, label: '100' }
                      ]}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Settings
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        name="showProfile"
                        checked={editData.showProfile}
                        onChange={handleInputChange}
                      />
                    }
                    label="Show my profile to other users"
                  />
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reading Goal
                </Typography>
                <Typography variant="h4" gutterBottom>
                  {profile.preferences?.readingGoal || 12} books per year
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
