import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LibraryBooks as BooksIcon,
  Add as AddIcon,
  AccountCircle as AccountIcon,
  People as FriendsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const getAvatarUrl = (avatarPath: string) => {
    if (!avatarPath) return undefined;
    if (avatarPath.startsWith('http')) {
      return avatarPath;
    }
    return `http://localhost:5000${avatarPath}`;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Personal Library
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Dashboard
          </Button>
          
          <Button
            color="inherit"
            startIcon={<BooksIcon />}
            onClick={() => navigate('/books')}
            sx={{
              backgroundColor: isActive('/books') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            My Books
          </Button>
          
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => navigate('/books/add')}
            sx={{
              backgroundColor: isActive('/books/add') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Add Book
          </Button>
          
          <Button
            color="inherit"
            startIcon={<FriendsIcon />}
            onClick={() => navigate('/friends')}
            sx={{
              backgroundColor: isActive('/friends') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            All Users
          </Button>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user?.avatar ? (
              <Avatar src={getAvatarUrl(user.avatar)} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountIcon />
            )}
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
