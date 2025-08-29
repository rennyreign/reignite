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
  ListItemText,
  ListItemButton,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

// Logo component
const Logo = () => (
  <Box 
    component="img" 
    src="/images/reign.png" 
    alt="Reignite Logo" 
    sx={{ 
      height: 40,
      mr: 1
    }} 
  />
);

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#11999E',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? '#F9A826' : '#11999E',
  fontWeight: 500,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(17, 153, 158, 0.04)',
  },
  position: 'relative',
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: 3,
    backgroundColor: '#F9A826',
    borderRadius: 1.5,
  } : {},
}));

const CTAButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F9A826',
  color: 'white',
  fontWeight: 600,
  borderRadius: 20,
  padding: theme.spacing(0.5, 3),
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#e59008',
  },
}));

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2, display: 'flex', justifyContent: 'center' }}>
        <Logo />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Reignite
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              sx={{ 
                textAlign: 'center',
                color: isActive(item.path) ? '#F9A826' : 'inherit'
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/register"
            sx={{ 
              textAlign: 'center',
              bgcolor: '#F9A826',
              color: 'white',
              my: 1,
              mx: 2,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#e59008',
              }
            }}
          >
            <ListItemText primary="Get Started" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo and brand name */}
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Logo />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                }}
              >
                Reignite
              </Typography>
            </Box>
            
            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Desktop navigation */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {navItems.map((item) => (
                <NavButton 
                  key={item.name}
                  component={Link}
                  to={item.path}
                  active={isActive(item.path) ? 1 : 0}
                >
                  {item.name}
                </NavButton>
              ))}
              <CTAButton component={Link} to="/register">
                Get Started
              </CTAButton>
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Header;