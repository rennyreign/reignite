import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Eye, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';

const brandPoints = [
  { Icon: Eye,        text: 'Guided scoring — match what you see to clear descriptions' },
  { Icon: BarChart3,  text: 'Age-based context from real community data' },
  { Icon: TrendingUp, text: 'Track growth over time, not just a snapshot' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 28 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const friendlyError = (msg = '') => {
  const m = msg.toLowerCase();
  if (m.includes('rate limit') || m.includes('too many') || m.includes('over_email_send_rate_limit'))
    return 'Too many attempts — please wait a few minutes before trying again.';
  if (m.includes('invalid email') || m.includes('unable to validate'))
    return 'Please enter a valid email address.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error — check your connection and try again.';
  if (m.includes('user not found') || m.includes('no user'))
    return 'No account found with that email.';
  if (m.includes('email not confirmed'))
    return 'Please confirm your email before signing in.';
  return 'Something went wrong — please try again.';
};

const LoginPage = () => {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail]       = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleGoogle = async () => {
    try { setError(null); await signInWithGoogle(); }
    catch (err) { setError(friendlyError(err.message)); }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setError(null); setLoading(true);
      await signInWithEmail(email.trim());
      setEmailSent(true);
    } catch (err) { setError(friendlyError(err.message)); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      minHeight: '100dvh',
    }}>
      {/* ── Left: Brand Panel ── */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        sx={{
          background: 'linear-gradient(160deg, #1A3329 0%, #2C5140 60%, #3D7A5F 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle texture circle */}
        <Box sx={{
          position: 'absolute', bottom: -120, right: -120,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', top: -80, left: -80,
          width: 260, height: 260, borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)', pointerEvents: 'none',
        }} />

        <Box>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 800,
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)',
            letterSpacing: '-0.02em',
          }}>
            Capability Tracker
          </Typography>
        </Box>

        <Box
          component={motion.div}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              fontSize: { md: '2rem', lg: '2.4rem' },
              color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, mb: 2,
            }}>
              See what your child can actually do.
            </Typography>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
              color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, mb: 4, maxWidth: 360,
            }}>
              Replace guesswork with structured observation. Build the most complete picture of your child's development that exists anywhere.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {brandPoints.map(({ Icon, text }, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{
                    mt: 0.3, flexShrink: 0,
                    width: 30, height: 30, borderRadius: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={15} strokeWidth={2} color="rgba(255,255,255,0.8)" />
                  </Box>
                  <Typography sx={{
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.7)', lineHeight: 1.5,
                  }}>
                    {text}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.3)',
        }}>
          Free during beta · No card required
        </Typography>
      </Box>

      {/* ── Right: Form Panel ── */}
      <Box sx={{
        background: '#F5F3EF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        px: { xs: 3, md: 6 }, py: 6,
      }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.15 }}
          sx={{ width: '100%', maxWidth: 380 }}
        >
          {/* Mobile brand */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 5 }}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 800,
              fontSize: '1.5rem', color: '#1C1917', letterSpacing: '-0.03em',
            }}>
              Capability Tracker
            </Typography>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
              color: '#78716C', mt: 0.5,
            }}>
              See what your child can actually do.
            </Typography>
          </Box>

          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 700,
            fontSize: '1.35rem', color: '#1C1917', letterSpacing: '-0.025em', mb: 0.5,
          }}>
            Sign in to continue
          </Typography>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem',
            color: '#78716C', mb: 4,
          }}>
            No password needed.
          </Typography>

          <AnimatePresence mode="wait">
            {emailSent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <Box sx={{
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid #E7E5E4',
                  boxShadow: '0 2px 12px rgba(61,122,95,0.08)',
                  p: 4, textAlign: 'center',
                }}>
                  <Box sx={{
                    width: 52, height: 52, borderRadius: '14px',
                    background: '#EBF3EE',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 2,
                  }}>
                    <Mail size={24} strokeWidth={1.5} color="#3D7A5F" />
                  </Box>
                  <Typography sx={{
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                    fontSize: '1.05rem', color: '#1C1917', mb: 1,
                  }}>
                    Check your inbox
                  </Typography>
                  <Typography sx={{
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
                    color: '#78716C', lineHeight: 1.6, mb: 3,
                  }}>
                    Sign-in link sent to <strong style={{ color: '#1C1917' }}>{email}</strong>
                  </Typography>
                  <Button
                    onClick={() => { setEmailSent(false); setEmail(''); }}
                    sx={{
                      fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem',
                      textTransform: 'none', color: '#3D7A5F',
                      '&:hover': { background: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    Use a different email
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid #E7E5E4',
                  boxShadow: '0 2px 16px rgba(28,25,23,0.06)',
                  p: 3.5,
                }}>
                  {/* Google */}
                  <Button
                    fullWidth
                    onClick={handleGoogle}
                    className="ct-pressable"
                    sx={{
                      fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                      textTransform: 'none', color: '#1C1917',
                      background: '#FAFAF8', border: '1px solid #E7E5E4',
                      borderRadius: '12px', py: 1.4,
                      boxShadow: '0 1px 3px rgba(28,25,23,0.07)',
                      '&:hover': { background: '#F5F3EF', borderColor: '#C7C3BF' },
                    }}
                  >
                    <Box component="img"
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="" sx={{ width: 18, height: 18, mr: 1.5 }}
                    />
                    Continue with Google
                    <ArrowRight size={15} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                  </Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', my: 2.5, gap: 2 }}>
                    <Box sx={{ flex: 1, height: '1px', background: '#ECEAE6' }} />
                    <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', color: '#C7C3BF' }}>or</Typography>
                    <Box sx={{ flex: 1, height: '1px', background: '#ECEAE6' }} />
                  </Box>

                  <Box component="form" onSubmit={handleEmail} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography sx={{
                      fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                      fontSize: '0.78rem', color: '#57534E', letterSpacing: '0.02em',
                    }}>
                      Email address
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      inputProps={{ maxLength: 254 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
                          borderRadius: '12px', background: '#FAFAF8',
                          '& fieldset': { borderColor: '#E7E5E4' },
                          '&:hover fieldset': { borderColor: '#C7C3BF' },
                          '&.Mui-focused fieldset': { borderColor: '#3D7A5F', borderWidth: '1.5px' },
                        },
                      }}
                    />
                    {error && (
                      <Typography sx={{
                        fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem',
                        color: '#DC2626', lineHeight: 1.4,
                      }}>
                        {error}
                      </Typography>
                    )}
                    <Button
                      fullWidth
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="ct-pressable"
                      sx={{
                        fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.92rem',
                        textTransform: 'none', background: '#3D7A5F', color: '#fff',
                        borderRadius: '12px', py: 1.35, mt: 0.5,
                        boxShadow: '0 2px 10px rgba(61,122,95,0.28)',
                        '&:hover': { background: '#2d5f49', boxShadow: '0 4px 18px rgba(61,122,95,0.32)' },
                        '&:disabled': { background: '#C7C3BF', color: '#fff', boxShadow: 'none' },
                      }}
                    >
                      {loading ? 'Sending link…' : 'Continue with Email'}
                    </Button>
                  </Box>
                </Box>

                <Typography sx={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem',
                  color: '#A8A29E', textAlign: 'center', mt: 2.5, lineHeight: 1.5,
                }}>
                  We'll send a secure sign-in link — no password needed.
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
