import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    setAnchorEl(null);
    await signOut();
    navigate('/');
  };

  const drawer = (
    <Box onClick={() => setMobileOpen(false)} sx={{ width: 260 }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1C1917', fontFamily: 'Outfit, sans-serif' }}>
          Capability Tracker
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#E7E5E4' }} />
      <List sx={{ px: 1.5, pt: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: '10px',
                mb: 0.5,
                color: isActive(item.path) ? '#1C1917' : '#78716C',
                fontWeight: isActive(item.path) ? 600 : 400,
                fontFamily: 'Outfit, sans-serif',
                background: isActive(item.path) ? '#EBF3EE' : 'transparent',
                '&:hover': { background: '#F5F3EF' },
              }}
            >
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: isActive(item.path) ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {user ? (
          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemButton
              component={Link}
              to="/students/new"
              sx={{
                borderRadius: '10px',
                background: '#3D7A5F',
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                '&:hover': { background: '#2d5f49' },
              }}
            >
              <ListItemText
                primary="Add Child"
                primaryTypographyProps={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemButton
              component={Link}
              to="/login"
              sx={{
                borderRadius: '10px',
                background: '#3D7A5F',
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                '&:hover': { background: '#2d5f49' },
              }}
            >
              <ListItemText
                primary="Sign In"
                primaryTypographyProps={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E7E5E4',
          color: '#1C1917',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ minHeight: '64px !important', px: { xs: 0 } }}>
            {/* Mobile menu */}
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, color: '#1C1917', display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Brand */}
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              {/* Wordmark dot */}
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#3D7A5F',
                  mr: 1.2,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: '#1C1917',
                  letterSpacing: '-0.01em',
                }}
              >
                Capability Tracker
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop nav */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: isActive(item.path) ? 600 : 500,
                    fontSize: '0.875rem',
                    color: isActive(item.path) ? '#1C1917' : '#78716C',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 1.8,
                    py: 0.8,
                    background: isActive(item.path) ? '#EBF3EE' : 'transparent',
                    borderBottom: isActive(item.path) ? '2px solid #3D7A5F' : '2px solid transparent',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    '&:hover': { background: '#F5F3EF', color: '#1C1917' },
                  }}
                >
                  {item.name}
                </Button>
              ))}
              {user && (
                <>
                  <Button
                    component={Link}
                    to="/students/new"
                    sx={{
                      ml: 1,
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      background: '#3D7A5F',
                      color: '#fff',
                      borderRadius: '10px',
                      px: 2.5,
                      py: 0.9,
                      '&:hover': { background: '#2d5f49' },
                      '&:active': { transform: 'translateY(1px)' },
                    }}
                  >
                    Add Child
                  </Button>
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      src={user.user_metadata?.avatar_url}
                      sx={{ width: 32, height: 32, bgcolor: '#3D7A5F', fontSize: '0.8rem', fontFamily: 'Outfit' }}
                    >
                      {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{ sx: { borderRadius: '12px', border: '1px solid #E7E5E4', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 180, mt: 1 } }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #E7E5E4' }}>
                      <Typography sx={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.85rem', color: '#1C1917' }}>
                        {user.user_metadata?.full_name || 'User'}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Outfit', fontSize: '0.72rem', color: '#78716C' }}>
                        {user.email}
                      </Typography>
                    </Box>
                    <MenuItem onClick={handleSignOut} sx={{ fontFamily: 'Outfit', fontSize: '0.85rem', color: '#DC2626', gap: 1, py: 1.2 }}>
                      <LogOut size={16} /> Sign out
                    </MenuItem>
                  </Menu>
                </>
              )}
              {!user && (
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    ml: 1,
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    background: '#3D7A5F',
                    color: '#fff',
                    borderRadius: '10px',
                    px: 2.5,
                    py: 0.9,
                    '&:hover': { background: '#2d5f49' },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: 260, background: '#FFFFFF' } }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Header;