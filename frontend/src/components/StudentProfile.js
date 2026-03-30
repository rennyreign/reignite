import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { studentService } from '../services/supabaseService';
import { statisticsService as v2StatisticsService, calculateAge, getAgeBracket, getAgeBracketLabel, capabilityAreasService } from '../services/v2Service';
import { formatDate } from '../utils/dateFormatter';
import { getIconComponent } from '../utils/iconMapping';

const scoreColor = (score) => {
  if (score >= 8) return '#3D7A5F';
  if (score >= 5) return '#4A90A4';
  if (score >= 3) return '#D97706';
  return '#DC2626';
};

const scoreBg = (score) => scoreColor(score) + '18';
const scoreBorder = (score) => scoreColor(score) + '44';

function StatBox({ label, value }) {
  return (
    <Box sx={{ textAlign: 'center', flex: 1 }}>
      <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: '1.4rem', color: '#1C1917', lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.06em', mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([
      studentService.getById(id),
      v2StatisticsService.getChildStatistics(id),
      capabilityAreasService.getAll(),
    ])
      .then(([studentData, stats, areasData]) => {
        if (!studentData) { setError('Child not found'); return; }
        setStudent(studentData);
        setStatistics(stats);
        setAreas(areasData);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleDelete = () => {
    setDeleting(true);
    studentService.delete(id)
      .then(() => navigate('/dashboard'))
      .catch((err) => { setError(err.message); setDeleting(false); setShowDeleteDialog(false); });
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 860, mx: 'auto', px: 3, pt: 4 }}>
        <Box sx={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', p: 3 }}>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: '#DC2626' }}>{error}</Typography>
        </Box>
      </Box>
    );
  }

  if (!student) return null;

  const age = calculateAge(student.date_of_birth);
  const bracket = getAgeBracket(age);
  const bracketLabel = getAgeBracketLabel(bracket);
  const areaAverages = statistics?.area_averages || {};
  const percentiles = statistics?.percentiles || {};
  const hasData = statistics?.checkin_count > 0;

  // Map areas to display data
  const areaDisplayData = areas.map(area => {
    const areaAvg = areaAverages[area.id];
    const percentile = percentiles[area.id];
    return {
      id: area.id,
      name: area.name,
      icon: area.icon,
      score: areaAvg !== undefined ? areaAvg : null,
      percentile: percentile !== undefined ? percentile : null,
    };
  });

  const card = {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E7E5E4',
    boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
    p: 3,
    mb: 2.5,
  };

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto', px: 3, pt: 4, pb: 8 }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Avatar */}
          <Box sx={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
            background: student.profile_image_url ? 'transparent' : '#EBF3EE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #E7E5E4',
          }}>
            {student.profile_image_url ? (
              <Box component="img" src={student.profile_image_url} alt={student.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#3D7A5F' }}>
                {student.name.charAt(0).toUpperCase()}
              </Typography>
            )}
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1C1917', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                {student.name}
              </Typography>
              {age !== null && (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5, py: 0.3, borderRadius: '99px', background: '#EBF3EE', border: '1px solid #3D7A5F44' }}>
                  <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 700, color: '#3D7A5F' }}>
                    {age} yrs
                  </Typography>
                </Box>
              )}
            </Box>
            {student.date_of_birth && (
              <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: '#78716C', mt: 0.4 }}>
                Born {formatDate(student.date_of_birth)}{bracketLabel ? ` · ${bracketLabel}` : ''}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to={`/students/${id}/edit`}
            startIcon={<EditOutlinedIcon />}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', border: '1.5px solid #E7E5E4', color: '#78716C', borderRadius: '10px', px: 2, py: 0.9, '&:hover': { background: '#F5F3EF', borderColor: '#1C1917', color: '#1C1917' } }}
          >
            Edit
          </Button>
          <Button
            component={Link}
            to={`/students/${id}/assessments`}
            startIcon={<HistoryIcon />}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', border: '1.5px solid #E7E5E4', color: '#78716C', borderRadius: '10px', px: 2, py: 0.9, '&:hover': { background: '#F5F3EF', borderColor: '#1C1917', color: '#1C1917' } }}
          >
            History
          </Button>
          <Button
            component={Link}
            to={`/students/${id}/checkin`}
            startIcon={<AddIcon />}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', background: '#3D7A5F', color: '#fff', borderRadius: '10px', px: 2.5, py: 0.9, '&:hover': { background: '#2d5f49' }, '&:active': { transform: 'translateY(1px)' } }}
          >
            New Check-in
          </Button>
        </Box>
      </Box>

      {/* Stats row */}
      <Box sx={{ ...card, display: 'flex', gap: 1 }}>
        <StatBox label="Current Score" value={hasData ? `${statistics.overall_score_percentage}%` : '—'} />
        <Box sx={{ width: '1px', background: '#E7E5E4', mx: 1 }} />
        <StatBox label="Your Average" value={hasData ? `${statistics.overall_average_percentage}%` : '—'} />
        <Box sx={{ width: '1px', background: '#E7E5E4', mx: 1 }} />
        <StatBox
          label="Ranking"
          value={hasData && statistics.overall_percentile != null ? `Top ${statistics.overall_percentile}%` : '—'}
        />
        <Box sx={{ width: '1px', background: '#E7E5E4', mx: 1 }} />
        <StatBox label="Check-ins" value={statistics?.checkin_count ?? 0} />
      </Box>

      {hasData ? (
        <>
          {/* Latest check-in date */}
          {statistics?.latest_checkin && (
            <Box sx={{ mb: 1.5 }}>
              <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: '#78716C' }}>
                Latest check-in — {formatDate(statistics.latest_checkin.checkin_date)}
              </Typography>
            </Box>
          )}

          {/* 8 Capability Areas */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 2.5 }}>
            {areaDisplayData.map(area => (
              <Box key={area.id} sx={card}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {React.createElement(getIconComponent(area.icon), { size: 20, strokeWidth: 1.5, color: '#3D7A5F' })}
                    </Box>
                    <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#1C1917' }}>
                      {area.name}
                    </Typography>
                  </Box>
                  {area.percentile !== null && !percentiles.insufficient_data && (
                    <Box sx={{ px: 1.5, py: 0.3, borderRadius: '99px', background: '#EBF3EE', border: '1px solid #3D7A5F44' }}>
                      <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 600, color: '#3D7A5F' }}>
                        Top {Math.max(1, Math.round(100 - area.percentile))}%
                      </Typography>
                    </Box>
                  )}
                </Box>
                {area.score !== null ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#78716C' }}>
                        Your Score
                      </Typography>
                      <Box sx={{
                        display: 'inline-flex', alignItems: 'center',
                        px: 1.2, py: 0.2, borderRadius: '99px',
                        background: scoreBg(area.score), border: `1px solid ${scoreBorder(area.score)}`,
                      }}>
                        <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', fontWeight: 600, color: scoreColor(area.score) }}>
                          {Math.round(area.score)}/10
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ height: 8, borderRadius: '99px', background: '#E7E5E4', overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${area.score * 10}%`, borderRadius: '99px', background: scoreColor(area.score), transition: 'width 0.3s ease' }} />
                    </Box>
                  </>
                ) : (
                  <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: '#A8A29E', fontStyle: 'italic' }}>
                    No data yet
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </>
      ) : (
        <Box sx={{ ...card, textAlign: 'center', py: 6 }}>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#1C1917', mb: 0.5 }}>
            No check-ins yet
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: '#78716C', mb: 3 }}>
            Complete the first check-in to start tracking {student.name}'s capabilities.
          </Typography>
          <Button
            component={Link}
            to={`/students/${id}/checkin`}
            startIcon={<AddIcon />}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', background: '#3D7A5F', color: '#fff', borderRadius: '10px', px: 2.5, py: 1, '&:hover': { background: '#2d5f49' } }}
          >
            Start First Check-in
          </Button>
        </Box>
      )}

      {/* Danger zone */}
      <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #E7E5E4' }}>
        <Button
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setShowDeleteDialog(true)}
          sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.82rem', textTransform: 'none', color: '#DC2626', borderRadius: '10px', px: 2, py: 0.8, '&:hover': { background: '#FEF2F2' } }}
        >
          Delete student
        </Button>
      </Box>

      {/* Delete dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#1C1917' }}>
          Delete {student.name}?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: '#78716C' }}>
            This will permanently delete their profile and all assessment data. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, textTransform: 'none', color: '#78716C', borderRadius: '10px', border: '1.5px solid #E7E5E4', px: 2.5, '&:hover': { background: '#F5F3EF' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, textTransform: 'none', background: '#DC2626', color: '#fff', borderRadius: '10px', px: 2.5, '&:hover': { background: '#B91C1C' }, '&.Mui-disabled': { background: '#FECACA', color: '#fff' } }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentProfile;
