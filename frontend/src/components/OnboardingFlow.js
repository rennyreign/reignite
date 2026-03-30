import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import { Eye, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { studentService } from '../services/supabaseService';

const STEPS = [
  {
    Icon: Eye,
    title: 'Observe',
    subtitle: 'Guided, not guesswork',
    body: 'For each capability, you match what you see to a clear description. No guessing numbers — just slide to what fits.',
  },
  {
    Icon: BarChart3,
    title: 'Understand',
    subtitle: 'Context, not comparison',
    body: 'See where your child stands among others their age. Not a judgment — real context from the community.',
  },
  {
    Icon: TrendingUp,
    title: 'Track',
    subtitle: 'A story, not a snapshot',
    body: 'One check-in takes 5 minutes. Over time, you build the most complete picture of your child\'s development that exists anywhere.',
  },
];

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phase, setPhase] = useState('intro'); // 'intro' | 'create'
  const [introStep, setIntroStep] = useState(0);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleIntroNext = () => {
    if (introStep < STEPS.length - 1) {
      setIntroStep(introStep + 1);
    } else {
      setPhase('create');
    }
  };

  const handleCreateChild = async () => {
    if (!name.trim()) return;
    try {
      setSaving(true);
      setError(null);
      const child = await studentService.create({
        name: name.trim(),
        date_of_birth: dob || null,
        user_id: user.id,
      });
      // Go straight to first check-in with onboarding flag
      navigate(`/students/${child.id}/checkin?onboarding=true`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const card = {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E7E5E4',
    boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
  };

  // ─── Intro Phase: How It Works ─────────────────────────────────────────────
  if (phase === 'intro') {
    const step = STEPS[introStep];
    return (
      <Box sx={{ background: '#F5F3EF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 440, width: '100%', mx: 'auto', px: 3 }}>

          {/* Progress dots */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
            {STEPS.map((_, i) => (
              <Box key={i} sx={{
                width: i === introStep ? 24 : 8, height: 8,
                borderRadius: '99px',
                background: i === introStep ? '#3D7A5F' : '#E7E5E4',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </Box>

          <Box sx={{ ...card, p: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px',
              background: '#EBF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 3,
            }}>
              <step.Icon size={28} strokeWidth={1.5} color="#3D7A5F" />
            </Box>

            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              fontSize: '1.4rem', color: '#1C1917', letterSpacing: '-0.02em', mb: 0.5,
            }}>
              {step.title}
            </Typography>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 500,
              fontSize: '0.85rem', color: '#3D7A5F', mb: 2,
            }}>
              {step.subtitle}
            </Typography>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
              color: '#78716C', lineHeight: 1.7,
            }}>
              {step.body}
            </Typography>
          </Box>

          <Button
            fullWidth
            onClick={handleIntroNext}
            sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem',
              textTransform: 'none', background: '#3D7A5F', color: '#fff',
              borderRadius: '12px', py: 1.4, mt: 3,
              boxShadow: '0 2px 8px rgba(61,122,95,0.25)',
              '&:hover': { background: '#2d5f49' },
            }}
          >
            {introStep < STEPS.length - 1 ? 'Next' : 'Let\'s start — add your child'}
            <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </Button>

          {introStep > 0 && (
            <Button
              fullWidth
              onClick={() => setIntroStep(introStep - 1)}
              sx={{
                fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem',
                textTransform: 'none', color: '#78716C', mt: 1,
              }}
            >
              Back
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  // ─── Create Phase: Add Your Child ──────────────────────────────────────────
  return (
    <Box sx={{ background: '#F5F3EF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: 440, width: '100%', mx: 'auto', px: 3 }}>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 700,
            fontSize: '1.4rem', color: '#1C1917', letterSpacing: '-0.02em',
          }}>
            Add your child
          </Typography>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
            color: '#78716C', mt: 0.5,
          }}>
            This takes about 30 seconds.
          </Typography>
        </Box>

        <Box sx={{ ...card, p: 4 }}>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 600,
            fontSize: '0.82rem', color: '#1C1917', mb: 1,
          }}>
            Child's name
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. Maya"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Outfit, sans-serif', fontSize: '1rem',
                borderRadius: '12px', background: '#FAFAF8',
                '& fieldset': { borderColor: '#E7E5E4' },
                '&:hover fieldset': { borderColor: '#D6D3D1' },
                '&.Mui-focused fieldset': { borderColor: '#3D7A5F' },
              },
            }}
          />

          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 600,
            fontSize: '0.82rem', color: '#1C1917', mb: 1,
          }}>
            Date of birth
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Outfit, sans-serif', fontSize: '1rem',
                borderRadius: '12px', background: '#FAFAF8',
                '& fieldset': { borderColor: '#E7E5E4' },
                '&:hover fieldset': { borderColor: '#D6D3D1' },
                '&.Mui-focused fieldset': { borderColor: '#3D7A5F' },
              },
            }}
          />
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem',
            color: '#A8A29E', mb: 2,
          }}>
            Used for age-based comparisons. You can add this later.
          </Typography>

          {error && (
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem',
              color: '#DC2626', mb: 2,
            }}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            onClick={handleCreateChild}
            disabled={saving || !name.trim()}
            sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem',
              textTransform: 'none', background: '#3D7A5F', color: '#fff',
              borderRadius: '12px', py: 1.4,
              boxShadow: '0 2px 8px rgba(61,122,95,0.25)',
              '&:hover': { background: '#2d5f49' },
              '&:disabled': { background: '#A8A29E', color: '#fff' },
            }}
          >
            {saving ? 'Creating...' : 'Create & Start First Check-in'}
            <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </Button>
        </Box>

        <Button
          fullWidth
          onClick={() => setPhase('intro')}
          sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem',
            textTransform: 'none', color: '#78716C', mt: 2,
          }}
        >
          Back to how it works
        </Button>
      </Box>
    </Box>
  );
};

export default OnboardingFlow;
