import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, CategoryScale, LinearScale,
} from 'chart.js';
import {
  MessageCircle, Brain, Activity, Heart, Users, Star, Palette, Wrench, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
    image: '/images/HomeHowLili01.png',
  },
  {
    number: '02',
    title: 'Age-Based Context',
    body: 'See how your child compares to others their age — not in theory, but in real data from the community. Percentiles sharpen as more families join.',
    image: '/images/HomeHowR02.png',
  },
  {
    number: '03',
    title: 'A Record Over Time',
    body: 'One check-in is a snapshot. Repeated check-ins become a clear story. Over months and years, you build the most complete picture of your child\'s development that exists anywhere.',
    image: '/images/homeHow03.png',
  },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const card = {
  background: '#FFFFFF',
  borderRadius: '16px',
  border: '1px solid #E7E5E4',
  boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 26 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const AREAS = [
  { Icon: MessageCircle, name: 'Communication' },
  { Icon: Brain,         name: 'Cognitive' },
  { Icon: Activity,      name: 'Physical' },
  { Icon: Heart,         name: 'Emotional' },
  { Icon: Users,         name: 'Social' },
  { Icon: Star,          name: 'Character' },
  { Icon: Palette,       name: 'Creative' },
  { Icon: Wrench,        name: 'Practical Life' },
];

const HomePage = () => {
  const { user } = useAuth();
  const ctaPath = user ? '/dashboard' : '/login';

  return (
    <Box sx={{ background: '#F5F3EF', minHeight: '100dvh' }}>

      {/* ── HERO: asymmetric split ── */}
      <Box sx={{
        maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 6 },
        pt: { xs: 7, md: 14 }, pb: { xs: 6, md: 10 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 6, md: 8 },
        alignItems: 'center',
      }}>
        {/* Left: copy */}
        <Box
          component={motion.div}
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 500,
              fontSize: '0.78rem', color: '#3D7A5F',
              letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2,
            }}>
              Development tracking · Beta
            </Typography>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 800,
              fontSize: { xs: '2.4rem', md: '3.2rem', lg: '3.6rem' },
              color: '#1C1917', letterSpacing: '-0.04em', lineHeight: 1.05, mb: 2.5,
            }}>
              See what your child can actually do.
            </Typography>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '1rem',
              color: '#78716C', lineHeight: 1.75, mb: 1.5, maxWidth: 440,
            }}>
              Move beyond gut feel and school reports. Build a clear, objective picture of your child's development over time.
            </Typography>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem',
              color: '#A8A29E', fontStyle: 'italic', mb: 4,
            }}>
              Not a diagnosis. Not a grade. A living record.
            </Typography>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to={ctaPath}
                className="ct-pressable"
                sx={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                  textTransform: 'none', background: '#1C1917', color: '#fff',
                  borderRadius: '12px', px: 3.5, py: 1.4,
                  boxShadow: '0 2px 12px rgba(28,25,23,0.18)',
                  '&:hover': { background: '#3D3530' },
                }}
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight size={16} style={{ marginLeft: 8 }} />
              </Button>
              {!user && (
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.88rem',
                    textTransform: 'none', color: '#78716C',
                    borderRadius: '12px', px: 2, py: 1.4,
                    '&:hover': { background: 'rgba(28,25,23,0.05)', color: '#1C1917' },
                  }}
                >
                  Sign in
                </Button>
              )}
              {user && (
                <Typography sx={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#A8A29E',
                }}>
                  Free · 30 sec setup
                </Typography>
              )}
            </Box>
          </motion.div>
        </Box>

        {/* Right: radar chart */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.3 }}
          sx={{ ...card, p: 3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem',
              color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              Capability Snapshot
            </Typography>
            <Typography sx={{
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
              fontSize: '0.78rem', color: '#3D7A5F',
            }}>
              Top 23%
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 300, mx: 'auto' }}>
            <Radar data={radarData} options={radarOptions} />
          </Box>
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem',
            color: '#A8A29E', textAlign: 'center', mt: 1, fontStyle: 'italic',
          }}>
            Illustrative — your child's real profile builds with each check-in
          </Typography>
        </Box>
      </Box>

      {/* ── PULL QUOTE ── */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 6 }, pb: { xs: 6, md: 8 } }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          sx={{
            borderLeft: '3px solid #3D7A5F',
            pl: 3, py: 1,
          }}
        >
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 600,
            fontSize: { xs: '1.05rem', md: '1.25rem' },
            color: '#1C1917', fontStyle: 'italic', lineHeight: 1.6,
          }}>
            "Most systems ask what a child <strong>completed</strong>.
            This asks what a child can <strong>actually do</strong>."
          </Typography>
        </Box>
      </Box>

      {/* ── HOW IT WORKS: numbered zig-zag ── */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 6 }, pb: { xs: 8, md: 12 } }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          sx={{ mb: 6 }}
        >
          <Typography sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 700,
            fontSize: { xs: '1.3rem', md: '1.6rem' },
            color: '#1C1917', letterSpacing: '-0.025em',
          }}>
            How it works
          </Typography>
        </Box>

        <Box
          component={motion.div}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          {MECHANISMS.map((m, i) => (
            <motion.div key={m.number} variants={fadeUp}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: i % 2 === 0 ? '1fr 1.4fr' : '1.4fr 1fr' },
                gap: { xs: 2, md: 8 },
                alignItems: 'center',
                py: { xs: 4, md: 6 },
                borderTop: '1px solid #ECEAE6',
                order: i % 2 !== 0 ? { md: 0 } : undefined,
              }}>
                <Box sx={{ order: i % 2 !== 0 ? { md: 1 } : 0 }}>
                  <Typography sx={{
                    fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                    fontSize: '3rem', color: 'rgba(61,122,95,0.12)', lineHeight: 1, mb: 1,
                  }}>
                    {m.number}
                  </Typography>
                  <Typography sx={{
                    fontFamily: 'Outfit, sans-serif', fontWeight: 700,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    color: '#1C1917', letterSpacing: '-0.02em', mb: 1,
                  }}>
                    {m.title}
                  </Typography>
                  <Typography sx={{
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
                    color: '#78716C', lineHeight: 1.75, maxWidth: 400,
                  }}>
                    {m.body}
                  </Typography>
                </Box>
                <Box sx={{
                  order: i % 2 !== 0 ? { md: 0 } : 0,
                  display: { xs: 'none', md: 'block' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #E7E5E4',
                  boxShadow: '0 2px 12px rgba(28,25,23,0.07)',
                  height: 280,
                }}>
                  <Box
                    component="img"
                    src={m.image}
                    alt={m.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* ── STATS + TREND ── */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 6 }, pb: { xs: 8, md: 12 } }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          gap: { xs: 4, md: 6 },
          alignItems: 'stretch',
        }}>
          {/* Stats */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}
          >
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              fontSize: '1.15rem', color: '#1C1917',
              letterSpacing: '-0.02em', mb: 3,
            }}>
              This becomes your child's development record
            </Typography>
            {[
              { num: '8',     label: 'Capability areas' },
              { num: '25',    label: 'Sub-capabilities tracked' },
              { num: '5 min', label: 'Per check-in' },
            ].map((s, i) => (
              <Box key={s.label} sx={{
                py: 2.5,
                borderTop: '1px solid #ECEAE6',
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', color: '#78716C' }}>
                  {s.label}
                </Typography>
                <Typography sx={{
                  fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                  fontSize: '1.3rem', color: '#3D7A5F',
                }}>
                  {s.num}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Trend chart */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 28, delay: 0.1 }}
            sx={{ ...card, p: 3 }}
          >
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 600,
              fontSize: '0.8rem', color: '#78716C',
              textTransform: 'uppercase', letterSpacing: '0.07em', mb: 2,
            }}>
              Growth Over Time
            </Typography>
            <Box sx={{ height: 220 }}>
              <Line data={trendData} options={trendOptions} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── 8 AREAS: 2-col inline list ── */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 6 }, pb: { xs: 8, md: 12 } }}>
        <Typography sx={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 700,
          fontSize: { xs: '1.1rem', md: '1.25rem' },
          color: '#1C1917', letterSpacing: '-0.02em', mb: 4,
        }}>
          Eight areas. One complete picture.
        </Typography>
        <Box
          component={motion.div}
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          }}
        >
          {AREAS.map((a) => (
            <motion.div key={a.name} variants={fadeUp}>
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                py: 2, borderTop: '1px solid #ECEAE6',
              }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: '#EBF3EE', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <a.Icon size={18} strokeWidth={1.5} color="#3D7A5F" />
                </Box>
                <Typography sx={{
                  fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                  fontSize: '0.9rem', color: '#1C1917',
                }}>
                  {a.name}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* ── FINAL CTA ── */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        sx={{
          maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 6 },
          pb: { xs: 10, md: 16 },
        }}
      >
        <Box sx={{
          background: '#1C1917', borderRadius: '20px',
          px: { xs: 4, md: 8 }, py: { xs: 6, md: 8 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
          gap: { xs: 4, md: 8 },
          alignItems: 'center',
        }}>
          <Box>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, mb: 1.5,
            }}>
              Stop guessing.<br />Start seeing clearly.
            </Typography>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem',
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
            }}>
              Five minutes. Eight areas. A picture you've never had before.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              component={Link}
              to={ctaPath}
              className="ct-pressable"
              sx={{
                fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                textTransform: 'none', background: '#3D7A5F', color: '#fff',
                borderRadius: '12px', px: 4, py: 1.4, whiteSpace: 'nowrap',
                boxShadow: '0 2px 12px rgba(61,122,95,0.35)',
                '&:hover': { background: '#2d5f49' },
              }}
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight size={16} style={{ marginLeft: 8 }} />
            </Button>
            <Typography sx={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.3)',
            }}>
              Free during beta · No card required
            </Typography>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default HomePage;