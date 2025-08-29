import { createTheme } from '@mui/material/styles';

// Brand colors from the style guide
const theme = createTheme({
  palette: {
    primary: {
      main: '#11999E', // Teal
      light: '#40B5BC',
      dark: '#0D6E71',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F9A826', // Yellow/Gold
      light: '#FFBC55',
      dark: '#E59008',
      contrastText: '#FFFFFF',
    },
    accent: {
      green: '#30E3CA', // Light teal
      blue: '#40514E', // Dark blue-gray
      gray: '#BCBCBC', // Light gray
    },
    background: {
      default: '#FFFFFF',
      paper: '#F9F9F9',
    },
    text: {
      primary: '#2D3E4E',
      secondary: '#637381',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#0D6E71',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#E59008',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;