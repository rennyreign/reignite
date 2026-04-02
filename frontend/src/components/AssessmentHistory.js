import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { studentService } from '../services/supabaseService';
import { checkinsService } from '../services/v2Service';
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

function getAreaAverages(checkin) {
  if (!checkin.scores || !checkin.scores.length) return [];
  const areaMap = {};
  checkin.scores.forEach(s => {
    const area = s.sub_capability?.area;
    const score = typeof s.score === 'number' && !isNaN(s.score) ? s.score : null;
    if (!area || score === null) return;
    if (!areaMap[area.id]) areaMap[area.id] = { name: area.name, total: 0, count: 0 };
    areaMap[area.id].total += score;
    areaMap[area.id].count += 1;
  });
  return Object.values(areaMap)
    .filter(a => a.count > 0)
    .map(a => ({
      name: a.name,
      avg: Math.round(a.total / a.count),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getOverallPct(checkin) {
  const areas = getAreaAverages(checkin);
  if (!areas.length) return 0;
  const avg = areas.reduce((s, a) => s + a.avg, 0) / areas.length;
  return Math.round((avg / 10) * 100);
}

function MiniScoreChip({ label, score }) {
  const clamped = Math.min(10, Math.max(0, score ?? 0));
  const color = scoreColor(clamped);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem', color: '#78716C', minWidth: 110 }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: 6, borderRadius: '99px', background: '#E7E5E4', overflow: 'hidden', minWidth: 60 }}>
        <Box sx={{ height: '100%', width: `${clamped * 10}%`, background: color, borderRadius: '99px', transition: 'width 0.3s ease' }} />
      </Box>
      <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', fontWeight: 600, color, minWidth: 32, textAlign: 'right' }}>
        {clamped}/10
      </Typography>
    </Box>
  );
}

const AssessmentHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [notesDialog, setNotesDialog] = useState({ open: false, notes: '', date: '' });

  useEffect(() => {
    studentService.getById(id)
      .then((studentData) => {
        if (!studentData) { setError('Child not found'); return; }
        setStudent(studentData);
        return checkinsService.getByChildId(id);
      })
      .then((data) => {
        if (data) {
          const sorted = [...data].sort((a, b) => new Date(b.checkin_date) - new Date(a.checkin_date));
          setCheckins(sorted);
        }
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

  const chronological = [...checkins].reverse();

  const chartData = checkins.length > 0 ? {
    labels: chronological.map(c => formatDate(c.checkin_date)),
    datasets: [{
      label: 'Capability %',
      data: chronological.map(c => getOverallPct(c)),
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
            {checkins.length} {checkins.length === 1 ? 'check-in' : 'check-ins'} on record
          </Typography>
        </Box>
        <Button
          component={Link}
          to={`/students/${id}/checkin`}
          startIcon={<AddIcon />}
          sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', background: '#3D7A5F', color: '#fff', borderRadius: '10px', px: 2.5, py: 1, flexShrink: 0, '&:hover': { background: '#2d5f49' }, '&:active': { transform: 'translateY(1px)' } }}
        >
          New Check-in
        </Button>
      </Box>

      {checkins.length === 0 ? (
        <Box sx={{ ...card, textAlign: 'center', py: 6 }}>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#1C1917', mb: 0.5 }}>
            No check-ins yet
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: '#78716C', mb: 3 }}>
            Complete the first check-in to start the history.
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
          <Typography sx={{ ...sectionLabel, mb: 2 }}>Check-in History</Typography>
          {checkins.map((checkin) => {
            const isExpanded = expandedId === checkin.id;
            const pct = getOverallPct(checkin);
            const color = pctColor(pct);
            const areaAverages = getAreaAverages(checkin);
            const areaNames = areaAverages.map(a => a.name).join(' · ');

            return (
              <Box
                key={checkin.id}
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
                {/* Card header row */}
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, cursor: 'pointer' }}
                  onClick={() => setExpandedId(isExpanded ? null : checkin.id)}
                >
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
                      {formatDate(checkin.checkin_date)}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: '#78716C', mt: 0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {areaNames || 'No area data'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {checkin.general_note && (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotesDialog({ open: true, notes: checkin.general_note, date: checkin.checkin_date });
                        }}
                        sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', color: '#3D7A5F', borderRadius: '8px', px: 1.5, py: 0.4, minWidth: 0, border: '1px solid #EBF3EE', background: '#EBF3EE', '&:hover': { background: '#d4ebe0' } }}
                      >
                        Note
                      </Button>
                    )}
                    {checkin.is_flagged && (
                      <Box sx={{ px: 1.2, py: 0.3, borderRadius: '8px', background: '#FEF3E2', border: '1px solid #D9770644' }}>
                        <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.68rem', fontWeight: 600, color: '#D97706' }}>
                          Flagged
                        </Typography>
                      </Box>
                    )}
                    <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: '#78716C', transition: 'transform 0.15s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ›
                    </Typography>
                  </Box>
                </Box>

                {/* Expanded: area averages */}
                {isExpanded && (
                  <Box sx={{ px: 3, pb: 3, borderTop: '1px solid #F5F3EF' }}>
                    {areaAverages.length > 0 ? (
                      <Box sx={{ pt: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.2 }}>
                        {areaAverages.map(a => (
                          <MiniScoreChip key={a.name} label={a.name} score={a.avg} />
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: '#A8A29E', fontStyle: 'italic', pt: 2.5 }}>
                        No scored areas recorded for this check-in.
                      </Typography>
                    )}
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
