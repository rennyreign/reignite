import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Mail } from 'lucide-react';

const LoginPage = () => {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setError(null);
      setLoading(true);
      await signInWithEmail(email.trim());
      setEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ background: '#F5F3EF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: 400, width: '100%', mx: 'auto', px: 3 }}>

        {/* Logo / Brand */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
            fontSize: '1.6rem', color: '#1C1917', letterSpacing: '-0.03em', lineHeight: 1.2,
          }}>
            Capability Tracker
          </Typography>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
            color: '#78716C', mt: 1, lineHeight: 1.5,
          }}>
            See what your child can actually do.
          </Typography>
        </Box>

        {emailSent ? (
          /* Magic link sent confirmation */
          <Box sx={{
            background: '#FFFFFF', borderRadius: '16px',
            border: '1px solid #E7E5E4', p: 4, textAlign: 'center',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Mail size={32} strokeWidth={1.5} color="#3D7A5F" />
            </Box>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 600,
              fontSize: '1.05rem', color: '#1C1917', mb: 1,
            }}>
              Check your email
            </Typography>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
              color: '#78716C', lineHeight: 1.6, mb: 2,
            }}>
              We sent a sign-in link to <strong>{email}</strong>. Click the link to continue.
            </Typography>
            <Button
              onClick={() => { setEmailSent(false); setEmail(''); }}
              sx={{
                fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem',
                textTransform: 'none', color: '#3D7A5F',
              }}
            >
              Use a different email
            </Button>
          </Box>
        ) : (
          /* Login form */
          <Box sx={{
            background: '#FFFFFF', borderRadius: '16px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
            p: 4,
          }}>

            {/* Google Sign-in */}
            <Button
              fullWidth
              onClick={handleGoogle}
              sx={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.92rem',
                textTransform: 'none', color: '#1C1917',
                background: '#FFFFFF', border: '1px solid #E7E5E4',
                borderRadius: '12px', py: 1.4,
                boxShadow: '0 1px 3px rgba(28,25,23,0.08)',
                '&:hover': { background: '#FAFAF8', borderColor: '#D6D3D1' },
              }}
            >
              <Box component="img" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" sx={{ width: 20, height: 20, mr: 1.5 }} />
              Continue with Google
            </Button>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3, gap: 2 }}>
              <Box sx={{ flex: 1, height: '1px', background: '#E7E5E4' }} />
              <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#A8A29E' }}>
                or
              </Typography>
              <Box sx={{ flex: 1, height: '1px', background: '#E7E5E4' }} />
            </Box>

            {/* Email Magic Link */}
            <Box component="form" onSubmit={handleEmail}>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
                    borderRadius: '12px', background: '#FAFAF8',
                    '& fieldset': { borderColor: '#E7E5E4' },
                    '&:hover fieldset': { borderColor: '#D6D3D1' },
                    '&.Mui-focused fieldset': { borderColor: '#3D7A5F' },
                  },
                }}
              />
              <Button
                fullWidth
                type="submit"
                disabled={loading || !email.trim()}
                sx={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.92rem',
                  textTransform: 'none', background: '#3D7A5F', color: '#fff',
                  borderRadius: '12px', py: 1.3,
                  boxShadow: '0 2px 8px rgba(61,122,95,0.25)',
                  '&:hover': { background: '#2d5f49' },
                  '&:disabled': { background: '#A8A29E', color: '#fff' },
                }}
              >
                {loading ? 'Sending...' : 'Continue with Email'}
              </Button>
            </Box>

            {error && (
              <Typography sx={{
                fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem',
                color: '#DC2626', mt: 2, textAlign: 'center',
              }}>
                {error}
              </Typography>
            )}
          </Box>
        )}

        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem',
          color: '#A8A29E', textAlign: 'center', mt: 3, lineHeight: 1.5,
        }}>
          No password needed. We'll sign you in securely.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
