import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

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
              primary="New Assessment"
              primaryTypographyProps={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>
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
                New Assessment
              </Button>
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