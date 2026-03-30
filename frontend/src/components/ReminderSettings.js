import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { reminderService } from '../services/supabaseService';

const INTERVALS = [
  { days: 7, label: 'Weekly', desc: 'Best for active tracking' },
  { days: 14, label: 'Every 2 weeks', desc: 'Great balance' },
  { days: 30, label: 'Monthly', desc: 'Light touch' },
  { days: 0, label: 'No reminders', desc: 'I\'ll remember on my own' },
];

const ReminderSettings = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState(14); // Default: biweekly
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      if (selected > 0) {
        const nextReminder = new Date();
        nextReminder.setDate(nextReminder.getDate() + selected);
        await reminderService.upsert({
          user_id: user.id,
          child_id: childId,
          interval_days: selected,
          is_active: true,
          next_reminder_at: nextReminder.toISOString(),
        });
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.warn('Reminder save failed (non-critical):', err.message);
      navigate('/dashboard', { replace: true });
    }
  };

  const card = {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E7E5E4',
    boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
  };

  return (
    <Box sx={{ background: '#F5F3EF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ maxWidth: 440, width: '100%', mx: 'auto', px: 3 }}>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px',
            background: '#EBF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
          }}>
            <Bell size={28} strokeWidth={1.5} color="#3D7A5F" />
          </Box>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 700,
            fontSize: '1.4rem', color: '#1C1917', letterSpacing: '-0.02em',
          }}>
            Stay consistent
          </Typography>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
            color: '#78716C', mt: 0.5, lineHeight: 1.6, maxWidth: 340, mx: 'auto',
          }}>
            Regular check-ins build the clearest picture. How often would you like a reminder?
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {INTERVALS.map((interval) => {
            const isSelected = selected === interval.days;
            return (
              <Box
                key={interval.days}
                onClick={() => setSelected(interval.days)}
                sx={{
                  ...card,
                  p: 2.5,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #3D7A5F' : '1px solid #E7E5E4',
                  background: isSelected ? '#EBF3EE' : '#FFFFFF',
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  '&:hover': { borderColor: '#3D7A5F' },
                }}
              >
                <Box>
                  <Typography sx={{
                    fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                    fontSize: '0.95rem', color: '#1C1917',
                  }}>
                    {interval.label}
                  </Typography>
                  <Typography sx={{
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem',
                    color: '#78716C',
                  }}>
                    {interval.desc}
                  </Typography>
                </Box>
                {isSelected && (
                  <Box sx={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#3D7A5F', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Check size={14} color="#fff" strokeWidth={2.5} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Button
          fullWidth
          onClick={handleSave}
          disabled={saving}
          sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem',
            textTransform: 'none', background: '#3D7A5F', color: '#fff',
            borderRadius: '12px', py: 1.4, mt: 3,
            boxShadow: '0 2px 8px rgba(61,122,95,0.25)',
            '&:hover': { background: '#2d5f49' },
            '&:disabled': { background: '#A8A29E', color: '#fff' },
          }}
        >
          {saving ? 'Saving...' : 'Continue to Dashboard'}
        </Button>

        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem',
          color: '#A8A29E', textAlign: 'center', mt: 2,
        }}>
          You can change this anytime in settings.
        </Typography>
      </Box>
    </Box>
  );
};

export default ReminderSettings;
