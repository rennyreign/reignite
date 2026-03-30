import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { studentService } from '../services/supabaseService';
import { calculateAge, getAgeBracket, getAgeBracketLabel } from '../services/v2Service';
import { formatDate } from '../utils/dateFormatter';

const SS = {
  page: {
    maxWidth: 860,
    mx: 'auto',
    px: 3,
    pt: 4,
    pb: 8,
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E7E5E4',
    boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
    p: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 2,
    cursor: 'pointer',
    transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    textDecoration: 'none',
    '&:hover': {
      boxShadow: '0 4px 16px rgba(28,25,23,0.10)',
      transform: 'translateY(-1px)',
    },
  },
  avatar: (hasImage) => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: hasImage ? 'transparent' : '#EBF3EE',
    color: '#3D7A5F',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 700,
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  }),
};

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    studentService.getAll()
      .then((data) => {
        if (data.length === 0) {
          navigate('/onboarding', { replace: true });
          return;
        }
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  if (loading && !error) return null;

  if (error) {
    return (
      <Box sx={SS.page}>
        <Box sx={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', p: 3 }}>
          <Typography sx={{ fontWeight: 600, color: '#DC2626', fontFamily: 'Outfit, sans-serif', mb: 0.5 }}>
            Could not load students
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#78716C', fontFamily: 'Outfit, sans-serif' }}>
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={SS.page}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '1.75rem',
              color: '#1C1917',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            Your Children
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: '#78716C', mt: 0.5 }}>
            {students.length} {students.length === 1 ? 'child' : 'children'} tracked
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/students/new"
          startIcon={<AddIcon />}
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
            background: '#3D7A5F',
            color: '#fff',
            borderRadius: '10px',
            px: 2.5,
            py: 1.1,
            flexShrink: 0,
            '&:hover': { background: '#2d5f49' },
            '&:active': { transform: 'translateY(1px)' },
          }}
        >
          Add Child
        </Button>
      </Box>

      {/* Empty state */}
      {students.length === 0 && (
        <Box
          sx={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px dashed #E7E5E4',
            p: 6,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#EBF3EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              fontSize: '1.5rem',
            }}
          >
            🎓
          </Box>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#1C1917', mb: 0.5 }}>
            No students yet
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: '#78716C', mb: 3 }}>
            Add a student to start tracking their capabilities.
          </Typography>
          <Button
            component={Link}
            to="/students/new"
            startIcon={<AddIcon />}
            sx={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
              border: '1.5px solid #1C1917',
              color: '#1C1917',
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              '&:hover': { background: '#F5F3EF' },
            }}
          >
            Add First Student
          </Button>
        </Box>
      )}

      {/* Student cards */}
      {students.map((student) => (
        <Box key={student.id} component={Link} to={`/students/${student.id}`} sx={SS.card}>
          {/* Avatar */}
          <Box sx={SS.avatar(!!student.profile_image_url)}>
            {student.profile_image_url ? (
              <Box
                component="img"
                src={student.profile_image_url}
                alt={student.name}
                sx={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              student.name.charAt(0).toUpperCase()
            )}
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1C1917',
                lineHeight: 1.3,
              }}
            >
              {student.name}
            </Typography>
            <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: '#78716C', mt: 0.2 }}>
              {student.date_of_birth ? (() => {
                const age = calculateAge(student.date_of_birth);
                const bracket = getAgeBracket(age);
                const bracketLabel = getAgeBracketLabel(bracket);
                return age !== null && bracket ? `${age} years old · ${bracketLabel}` : `Born ${formatDate(student.date_of_birth)}`;
              })() : 'No date of birth'}
            </Typography>
          </Box>

          {/* Arrow */}
          <ArrowForwardIcon sx={{ color: '#E7E5E4', fontSize: 20, flexShrink: 0 }} />
        </Box>
      ))}
    </Box>
  );
};

export default StudentList;
