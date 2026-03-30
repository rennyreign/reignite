import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, CategoryScale, LinearScale,
} from 'chart.js';
import {
  MessageCircle, Brain, Activity, Heart, Users, Star, Palette, Wrench,
} from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, CategoryScale, LinearScale);

// ─── Demo data for visual proof ──────────────────────────────────────────────

const radarData = {
  labels: ['Communication', 'Cognitive', 'Physical', 'Emotional', 'Social', 'Character', 'Creative', 'Practical'],
  datasets: [{
    data: [7.2, 6.5, 8.1, 7.8, 6.9, 7.5, 8.4, 6.2],
    backgroundColor: 'rgba(61,122,95,0.12)',
    borderColor: '#3D7A5F',
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: '#3D7A5F',
    pointBorderColor: '#fff',
    pointBorderWidth: 1.5,
  }],
};

const radarOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: { legend: { display: false }, datalabels: { display: false } },
  scales: {
    r: {
      min: 0, max: 10,
      ticks: { display: false, stepSize: 2 },
      grid: { color: '#E7E5E4' },
      angleLines: { color: '#E7E5E4' },
      pointLabels: {
        font: { family: 'Outfit', size: 10, weight: '500' },
        color: '#78716C',
      },
    },
  },
};

const trendData = {
  labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
  datasets: [{
    data: [52, 58, 61, 64, 69, 73],
    fill: true,
    backgroundColor: 'rgba(61,122,95,0.08)',
    borderColor: '#3D7A5F',
    borderWidth: 2.5,
    pointRadius: 4,
    pointBackgroundColor: '#3D7A5F',
    pointBorderColor: '#fff',
    pointBorderWidth: 1.5,
    tension: 0.35,
  }],
};

const trendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, datalabels: { display: false } },
  scales: {
    y: {
      min: 0, max: 100,
      grid: { color: '#F5F3EF' },
      ticks: { callback: v => v + '%', font: { family: 'JetBrains Mono', size: 10 }, color: '#A8A29E' },
      border: { display: false },
    },
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Outfit', size: 10 }, color: '#A8A29E' },
      border: { display: false },
    },
  },
};

// ─── Mechanisms ──────────────────────────────────────────────────────────────

const MECHANISMS = [
  {
    number: '01',
    title: 'Guided Observation',
    body: 'You don\'t guess a score. You match what you see to clear descriptions. Every position on the 0–10 scale has a criteria sentence — you simply slide to the one that fits.',
  },
  {
    number: '02',
    title: 'Age-Based Context',
    body: 'See how your child compares to others their age — not in theory, but in real data from the community. Percentiles sharpen as more families join.',
  },
  {
    number: '03',
    title: 'A Record Over Time',
    body: 'One check-in is a snapshot. Repeated check-ins become a clear story. Over months and years, you build the most complete picture of your child\'s development that exists anywhere.',
  },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const card = {
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #E7E5E4',
  boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
};

const HomePage = () => {
  return (
    <Box sx={{ background: '#F5F3EF', minHeight: '100vh' }}>

      {/* ──────────────── HERO ──────────────── */}
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, pt: { xs: 7, md: 12 }, pb: 2, textAlign: 'center' }}>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 800,
          fontSize: { xs: '2.1rem', md: '3rem' },
          color: '#1C1917', letterSpacing: '-0.035em', lineHeight: 1.1, mb: 2.5,
        }}>
          See what your child<br />can actually do.
        </Typography>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '1.08rem',
          color: '#78716C', maxWidth: 540, mx: 'auto', mb: 1.5, lineHeight: 1.7,
        }}>
          Move beyond gut feel and school reports. Build a clear, objective
          picture of your child's development over time.
        </Typography>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
          color: '#A8A29E', maxWidth: 460, mx: 'auto', mb: 4.5, lineHeight: 1.5, fontStyle: 'italic',
        }}>
          Not a diagnosis. Not a grade. A living record.
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem',
            textTransform: 'none', background: '#3D7A5F', color: '#fff',
            borderRadius: '12px', px: 4, py: 1.4,
            boxShadow: '0 2px 10px rgba(61,122,95,0.28)',
            '&:hover': { background: '#2d5f49', boxShadow: '0 4px 20px rgba(61,122,95,0.35)' },
            '&:active': { transform: 'translateY(1px)' },
          }}
        >
          Start Your First Check-in
        </Button>
      </Box>

      {/* ──────────────── THE PROBLEM ──────────────── */}
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, pt: { xs: 7, md: 9 }, pb: 2 }}>
        <Box sx={{ maxWidth: 580, mx: 'auto', textAlign: 'center' }}>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 700,
            fontSize: { xs: '1.3rem', md: '1.6rem' },
            color: '#1C1917', letterSpacing: '-0.02em', lineHeight: 1.25, mb: 2.5,
          }}>
            You've been guessing.
          </Typography>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem',
            color: '#78716C', lineHeight: 1.8, mb: 1.5,
          }}>
            Right now, you're relying on instinct, comparison with other families,
            and occasional feedback from school. But none of that shows you how your
            child is <em>actually</em> developing over time.
          </Typography>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem',
            fontWeight: 600, color: '#1C1917', lineHeight: 1.6,
          }}>
            This does.
          </Typography>
        </Box>
      </Box>

      {/* ──────────────── THE WEDGE ──────────────── */}
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, pt: 6, pb: 2 }}>
        <Box sx={{
          ...card,
          borderLeft: '3px solid #3D7A5F',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
        }}>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: { xs: '1rem', md: '1.15rem' },
            color: '#1C1917', fontStyle: 'italic', lineHeight: 1.7, maxWidth: 520, mx: 'auto',
          }}>
            "Most systems ask what a child <strong>completed</strong>.<br />
            This asks what a child can <strong>actually do</strong>."
          </Typography>
        </Box>
      </Box>

      {/* ──────────────── HOW IT WORKS (Mechanisms) ──────────────── */}
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, pt: { xs: 7, md: 9 }, pb: 2 }}>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700,
          fontSize: { xs: '1.3rem', md: '1.5rem' },
          color: '#1C1917', letterSpacing: '-0.02em', textAlign: 'center', mb: 4,
        }}>
          How it works
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {MECHANISMS.map((m) => (
            <Box key={m.number} sx={{ ...card, p: { xs: 3, md: 3.5 }, display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
              <Typography sx={{
                fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                fontSize: '1.8rem', color: '#3D7A5F22', lineHeight: 1, flexShrink: 0, mt: 0.3,
              }}>
                {m.number}
              </Typography>
              <Box>
                <Typography sx={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                  fontSize: '1rem', color: '#1C1917', mb: 0.6,
                }}>
                  {m.title}
                </Typography>
                <Typography sx={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem',
                  color: '#78716C', lineHeight: 1.7,
                }}>
                  {m.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ──────────────── VISUAL PROOF ──────────────── */}
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, pt: { xs: 7, md: 9 }, pb: 2 }}>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700,
          fontSize: { xs: '1.3rem', md: '1.5rem' },
          color: '#1C1917', letterSpacing: '-0.02em', textAlign: 'center', mb: 1,
        }}>
          What you'll see
        </Typography>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem',
          color: '#78716C', textAlign: 'center', mb: 4, maxWidth: 460, mx: 'auto', lineHeight: 1.6,
        }}>
          Eight capability areas. One clear picture. Updated every check-in.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          {/* Radar */}
          <Box sx={{ ...card, p: 3 }}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 600,
              fontSize: '0.82rem', color: '#78716C', textTransform: 'uppercase',
              letterSpacing: '0.07em', mb: 2,
            }}>
              Capability Snapshot
            </Typography>
            <Box sx={{ maxWidth: 280, mx: 'auto' }}>
              <Radar data={radarData} options={radarOptions} />
            </Box>
          </Box>

          {/* Trend */}
          <Box sx={{ ...card, p: 3 }}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 600,
              fontSize: '0.82rem', color: '#78716C', textTransform: 'uppercase',
              letterSpacing: '0.07em', mb: 2,
            }}>
              Growth Over Time
            </Typography>
            <Box sx={{ height: 220 }}>
              <Line data={trendData} options={trendOptions} />
            </Box>
          </Box>
        </Box>

        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem',
          color: '#A8A29E', textAlign: 'center', mt: 1.5, fontStyle: 'italic',
        }}>
          Illustrative data — your child's real profile builds with each check-in.
        </Typography>
      </Box>

      {/* ──────────────── THE LIVING RECORD ──────────────── */}
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, pt: { xs: 7, md: 9 }, pb: 2 }}>
        <Box sx={{
          ...card,
          borderLeft: '3px solid #3D7A5F',
          p: { xs: 3, md: 4 },
        }}>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 700,
            fontSize: '1.1rem', color: '#1C1917', mb: 1.5,
          }}>
            This becomes your child's development record
          </Typography>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem',
            color: '#78716C', lineHeight: 1.8, mb: 2,
          }}>
            Over time, you build a consistent, structured view of how your child is
            growing — more detailed than any school report, more longitudinal than
            any clinical assessment, and entirely in your hands.
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
            {[
              { num: '8', label: 'Capability areas' },
              { num: '25', label: 'Sub-capabilities' },
              { num: '5 min', label: 'Per check-in' },
            ].map((s) => (
              <Box key={s.label}>
                <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1.3rem', color: '#3D7A5F', lineHeight: 1 }}>
                  {s.num}
                </Typography>
                <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', fontWeight: 500, color: '#78716C', mt: 0.3 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ──────────────── THE 8 AREAS (compact) ──────────────── */}
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, pt: { xs: 6, md: 8 }, pb: 2 }}>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700,
          fontSize: { xs: '1.1rem', md: '1.25rem' },
          color: '#1C1917', letterSpacing: '-0.02em', textAlign: 'center', mb: 3,
        }}>
          Eight areas. One complete picture.
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 1.5 }}>
          {[
            { Icon: MessageCircle, name: 'Communication' },
            { Icon: Brain, name: 'Cognitive' },
            { Icon: Activity, name: 'Physical' },
            { Icon: Heart, name: 'Emotional' },
            { Icon: Users, name: 'Social' },
            { Icon: Star, name: 'Character' },
            { Icon: Palette, name: 'Creative' },
            { Icon: Wrench, name: 'Practical Life' },
          ].map((a) => (
            <Box key={a.name} sx={{
              ...card, p: 2, textAlign: 'center',
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.8 }}>
                <a.Icon size={24} strokeWidth={1.5} color="#3D7A5F" />
              </Box>
              <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#1C1917' }}>
                {a.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ──────────────── FINAL CTA ──────────────── */}
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, pt: { xs: 7, md: 10 }, pb: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700,
          fontSize: { xs: '1.4rem', md: '1.75rem' },
          color: '#1C1917', letterSpacing: '-0.02em', lineHeight: 1.2, mb: 1.5,
        }}>
          Stop guessing.<br />Start seeing clearly.
        </Typography>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
          color: '#78716C', maxWidth: 440, mx: 'auto', mb: 4, lineHeight: 1.7,
        }}>
          Five minutes. Eight areas. A picture you've never had before.
        </Typography>
        <Button
          component={Link}
          to="/dashboard"
          sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '1rem',
            textTransform: 'none', background: '#3D7A5F', color: '#fff',
            borderRadius: '12px', px: 5, py: 1.5,
            boxShadow: '0 2px 10px rgba(61,122,95,0.28)',
            '&:hover': { background: '#2d5f49', boxShadow: '0 4px 20px rgba(61,122,95,0.35)' },
            '&:active': { transform: 'translateY(1px)' },
          }}
        >
          Start Your First Check-in
        </Button>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem',
          color: '#A8A29E', mt: 2,
        }}>
          Free. No account required.
        </Typography>
      </Box>

    </Box>
  );
};

export default HomePage;