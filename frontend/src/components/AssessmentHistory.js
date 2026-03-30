import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { studentService, assessmentService } from '../services/supabaseService';
import { formatDate } from '../utils/dateFormatter';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

const scoreColor = (score) => {
  if (score >= 8) return '#3D7A5F';
  if (score >= 5) return '#4A90A4';
  if (score >= 3) return '#D97706';
  return '#DC2626';
};

const pctColor = (pct) => {
  if (pct >= 80) return '#3D7A5F';
  if (pct >= 50) return '#4A90A4';
  if (pct >= 30) return '#D97706';
  return '#DC2626';
};

function MiniScoreChip({ label, score }) {
  const color = scoreColor(score);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem', color: '#78716C', minWidth: 90 }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: 6, borderRadius: '99px', background: '#E7E5E4', overflow: 'hidden', minWidth: 60 }}>
        <Box sx={{ height: '100%', width: `${score * 10}%`, background: color, borderRadius: '99px', transition: 'width 0.3s ease' }} />
      </Box>
      <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', fontWeight: 600, color, minWidth: 28, textAlign: 'right' }}>
        {score}
      </Typography>
    </Box>
  );
}

const AssessmentHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [notesDialog, setNotesDialog] = useState({ open: false, notes: '', date: '' });

  useEffect(() => {
    studentService.getById(id)
      .then((studentData) => {
        if (!studentData) { setError('Student not found'); return; }
        setStudent(studentData);
        return assessmentService.getByStudentId(id);
      })
      .then((data) => {
        if (data) setAssessments([...data].sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date)));
      })
      .catch((err) => setError(err.message));
  }, [id]);

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

  const reversed = [...assessments].reverse();

  const chartData = assessments.length > 0 ? {
    labels: reversed.map(a => formatDate(a.assessment_date)),
    datasets: [{
      label: 'Capability %',
      data: reversed.map(a => a.capability_percentage),
      fill: false,
      borderColor: '#3D7A5F',
      backgroundColor: '#3D7A5F',
      borderWidth: 2.5,
      pointRadius: 4,
      pointBackgroundColor: '#3D7A5F',
      tension: 0.3,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: true,
        align: 'top',
        offset: 6,
        font: { family: 'JetBrains Mono', size: 11, weight: 600 },
        color: '#3D7A5F',
        formatter: (value) => `${Math.round(value)}%`,
      },
    },
    scales: {
      y: {
        min: 0, max: 100,
        grid: { color: '#F5F3EF' },
        ticks: { callback: v => v + '%', font: { family: 'JetBrains Mono', size: 11 }, color: '#78716C' },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Outfit', size: 11 }, color: '#78716C', maxRotation: 30 },
        border: { display: false },
      },
    },
  };

  const card = {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E7E5E4',
    boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
    p: 3,
    mb: 2.5,
  };

  const sectionLabel = {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: '#78716C',
    mb: 2,
  };

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto', px: 3, pt: 4, pb: 8 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/students/${id}`)}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.82rem', textTransform: 'none', color: '#78716C', borderRadius: '8px', px: 1.5, py: 0.5, mb: 1, '&:hover': { background: '#F5F3EF', color: '#1C1917' } }}
          >
            Back to profile
          </Button>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1C1917', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            {student.name}
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: '#78716C', mt: 0.4 }}>
            {assessments.length} {assessments.length === 1 ? 'assessment' : 'assessments'} on record
          </Typography>
        </Box>
        <Button
          component={Link}
          to={`/students/${id}/assessments/new`}
          startIcon={<AddIcon />}
          sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', background: '#3D7A5F', color: '#fff', borderRadius: '10px', px: 2.5, py: 1, flexShrink: 0, '&:hover': { background: '#2d5f49' }, '&:active': { transform: 'translateY(1px)' } }}
        >
          New Assessment
        </Button>
      </Box>

      {assessments.length === 0 ? (
        <Box sx={{ ...card, textAlign: 'center', py: 6 }}>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#1C1917', mb: 0.5 }}>
            No assessments yet
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: '#78716C', mb: 3 }}>
            Create the first assessment to start the history.
          </Typography>
          <Button
            component={Link}
            to={`/students/${id}/assessments/new`}
            startIcon={<AddIcon />}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', background: '#3D7A5F', color: '#fff', borderRadius: '10px', px: 2.5, py: 1, '&:hover': { background: '#2d5f49' } }}
          >
            Create Assessment
          </Button>
        </Box>
      ) : (
        <>
          {/* Chart */}
          {chartData && (
            <Box sx={card}>
              <Typography sx={sectionLabel}>Progress Over Time</Typography>
              <Box sx={{ height: 220 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </Box>
          )}

          {/* Timeline */}
          <Typography sx={{ ...sectionLabel, mb: 2 }}>Assessment Timeline</Typography>
          {assessments.map((assessment) => {
            const isExpanded = expandedId === assessment.id;
            const pct = Math.round(assessment.capability_percentage);
            const color = pctColor(pct);
            const scores = [
              { label: 'Speaking', score: assessment.speaking_score },
              { label: 'Listening', score: assessment.listening_score },
              { label: 'Reading', score: assessment.reading_score },
              { label: 'Writing', score: assessment.writing_score },
              { label: 'Maths', score: assessment.maths_score },
              { label: 'Digital', score: assessment.digital_competence_score },
              { label: 'Typing', score: assessment.typing_score },
              { label: 'Sports', score: assessment.sports_score },
              { label: 'Character', score: assessment.character_score },
              { label: 'Hygiene', score: assessment.hygiene_score },
            ];

            return (
              <Box
                key={assessment.id}
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E7E5E4',
                  boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
                  mb: 2,
                  overflow: 'hidden',
                  transition: 'box-shadow 0.15s ease',
                  '&:hover': { boxShadow: '0 4px 16px rgba(28,25,23,0.10)' },
                }}
              >
                {/* Card header row — always visible */}
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, cursor: 'pointer' }}
                  onClick={() => setExpandedId(isExpanded ? null : assessment.id)}
                >
                  {/* Overall score badge */}
                  <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 52, height: 52, borderRadius: '12px', flexShrink: 0,
                    background: color + '14', border: `1.5px solid ${color}40`,
                  }}>
                    <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1rem', color }}>
                      {pct}%
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#1C1917' }}>
                      {formatDate(assessment.assessment_date)}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: '#78716C', mt: 0.2 }}>
                      {scores.filter(s => s.score > 0).map(s => s.label).join(' · ')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {assessment.notes && (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotesDialog({ open: true, notes: assessment.notes, date: assessment.assessment_date });
                        }}
                        sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', color: '#3D7A5F', borderRadius: '8px', px: 1.5, py: 0.4, minWidth: 0, border: '1px solid #EBF3EE', background: '#EBF3EE', '&:hover': { background: '#d4ebe0' } }}
                      >
                        Note
                      </Button>
                    )}
                    <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: '#78716C', transition: 'transform 0.15s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ›
                    </Typography>
                  </Box>
                </Box>

                {/* Expanded scores */}
                {isExpanded && (
                  <Box sx={{ px: 3, pb: 3, borderTop: '1px solid #F5F3EF' }}>
                    <Box sx={{ pt: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.2 }}>
                      {scores.map(s => <MiniScoreChip key={s.label} label={s.label} score={s.score} />)}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        </>
      )}

      {/* Notes dialog */}
      <Dialog open={notesDialog.open} onClose={() => setNotesDialog(d => ({ ...d, open: false }))} PaperProps={{ sx: { borderRadius: '16px', p: 1, maxWidth: 460 } }}>
        <DialogTitle sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#1C1917' }}>
          Notes — {formatDate(notesDialog.date)}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: '#1C1917', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
            "{notesDialog.notes}"
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => setNotesDialog(d => ({ ...d, open: false }))}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, textTransform: 'none', color: '#78716C', borderRadius: '10px', border: '1.5px solid #E7E5E4', px: 2.5, '&:hover': { background: '#F5F3EF' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentHistory;
