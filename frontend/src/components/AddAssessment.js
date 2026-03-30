import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { studentService, assessmentService, statisticsService } from '../services/supabaseService';

const scoreColor = (score) => {
  if (score >= 8) return '#3D7A5F';
  if (score >= 5) return '#4A90A4';
  if (score >= 3) return '#D97706';
  return score > 0 ? '#DC2626' : '#E7E5E4';
};

const CATEGORIES = [
  {
    group: 'Communication & Expression',
    desc: 'How the student communicates, processes, and expresses ideas.',
    items: [
      { key: 'speaking_score', label: '🔊 Speaking', desc: 'Articulation, vocabulary depth, coherence, and confidence.' },
      { key: 'listening_score', label: '👂 Listening', desc: 'Focus, comprehension, memory retention, and responding appropriately.' },
      { key: 'reading_score', label: '📖 Reading', desc: 'Fluency, comprehension, vocabulary, and engagement.' },
      { key: 'writing_score', label: '✍️ Writing', desc: 'Idea formation, structure, grammar, and creativity.' },
    ],
  },
  {
    group: 'Thinking & Tech',
    desc: 'How the student thinks, solves problems, and uses technology.',
    items: [
      { key: 'maths_score', label: '➕ Maths', desc: 'Mental arithmetic, logical reasoning, and applied problem solving.' },
      { key: 'digital_competence_score', label: '💻 Digital Competence', desc: 'Awareness, navigation, and effectiveness with digital tools.' },
      { key: 'typing_score', label: '⌨️ Typing', desc: 'Typing speed, accuracy, and keyboard fluency.' },
    ],
  },
  {
    group: 'Physical & Character',
    desc: 'How the student performs physically and maintains personal care.',
    items: [
      { key: 'sports_score', label: '🏃 Sports', desc: 'Physical coordination, fitness, teamwork, and motor skill confidence.' },
      { key: 'character_score', label: '🧠 Character', desc: 'Self-awareness, responsibility, discipline, and interpersonal behaviour.' },
      { key: 'hygiene_score', label: '🧼 Hygiene', desc: 'Physical cleanliness, grooming, and care in appearance.' },
    ],
  },
];

const CRITERIA = {
  speaking_score: ["No verbal communication","Says single words; not clearly enunciated","Phrases of 2–3 words; often unclear","Short, clear sentences on familiar topics","Can explain basic thoughts; occasional hesitations","Communicates needs + feelings; vocabulary is growing","Engages in conversations with some detail","Uses descriptive language and adjusts tone","Explains ideas clearly across topics","Can persuade, narrate, or explain complex ideas","Near-adult fluency: nuanced, expressive, confident"],
  listening_score: ["Doesn't respond to verbal prompts","Needs repeated instructions","Occasionally responds appropriately","Can follow 1-step instructions","Understands 2-step instructions","Responds well to stories or commands with questions","Can summarize what was said","Listens attentively and responds with relevant thoughts","Can follow complex, multi-part conversations","Anticipates meaning, asks clarifying questions","Active listener: paraphrases, questions, synthesizes info"],
  reading_score: ["Cannot identify letters or sounds","Recognizes letters; beginning phonics","Reads simple words (CVC) slowly","Reads basic sentences with effort","Reads short stories with support","Reads fluently at primary level; understands context","Reads independently; discusses plot and characters","Analyzes themes; uses tone while reading aloud","Reads complex texts (articles, fiction, nonfiction)","Synthesizes information; compares across sources","Reads at adult level fluently with critical insight"],
  writing_score: ["Cannot write words","Writes letters or name only","Short words; unsure spelling","Writes basic sentences with effort","Forms clear short paragraphs; minor errors","Expresses ideas with structure and punctuation","Writes for different purposes (story, note, description)","Coherent paragraphs with varied vocabulary","Uses tone, style, and grammar to strengthen message","Writes persuasively or creatively with voice","Advanced writing: essays, fiction, articles with polish"],
  typing_score: ["No typing skill","Types one finger, very slow","Locates keys, very slow pace","Types short words with pauses","Can complete sentences with effort","Uses both hands slowly, improving accuracy","Steady pace, some backspace use","Types without looking, moderate speed","Fluent typing with few errors","Types at ~50–60 WPM with accuracy","Professional level typing (~70+ WPM, near flawless)"],
  maths_score: ["No number recognition","Counts to 10; simple addition","Understands number relationships to 20","Adds/subtracts within 50","Multiplies/divides basic facts","Understands fractions, time, measurement","Applies math to real-world problems","Solves multi-step equations","Uses math in strategic thinking (e.g. probability)","Algebra, geometry, patterns, logic","Advanced math reasoning & abstract concepts"],
  digital_competence_score: ["No familiarity with digital devices","Can turn on a device and recognise basic symbols","Navigates a single app or game independently","Can open, close, switch apps; basic typing or search","Understands internet use; shows curiosity to explore","Uses productivity tools with intention","Can troubleshoot basic problems","Applies multiple tools to achieve a goal","Thinks critically about apps, privacy, and screen time","Leads digital tasks; managing files and folders","Resourceful, creative, and responsible across platforms"],
  sports_score: ["Shows no interest in physical activity","Limited mobility or coordination","Participates hesitantly in basic movements","Runs, jumps, throws with some control","Knows rules of one sport; plays casually","Shows growing athleticism and interest","Good hand-eye coordination; applies strategy","Excels at one sport; understands fitness principles","Plays competitively or practices regularly","Athletic leadership, stamina, form","Peak condition, technique, multi-sport capability"],
  character_score: ["Reactive, disobedient, not self-aware","Rarely shows kindness or control","Basic awareness, often needs correction","Shows empathy or responsibility when prompted","Owns actions occasionally","Regularly helpful, manages emotions","Reflective, learns from mistakes","Demonstrates self-discipline and values","Acts with integrity even when unsupervised","Inspires others; resolves conflicts maturely","Remarkable moral compass and emotional maturity"],
  hygiene_score: ["No awareness of hygiene; resists cleaning","Rarely brushes teeth, bathes, or dresses independently","Needs constant reminders for daily routines","Can bathe and brush with supervision; unkempt clothing","Completes basic routines but inconsistently","Dresses appropriately; clean clothes; grooming improving","Maintains tidy appearance; selects outfits thoughtfully","Cares about self-presentation; keeps personal space neat","Actively maintains grooming routines","Demonstrates pride in presentation and clothing care","High-level self-discipline, grooming, and personal style"],
};

function ScoreSlider({ field, label, desc, value, onChange }) {
  const score = Math.round(value);
  const color = scoreColor(score);
  const pct = score * 10;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.8 }}>
        <Box>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#1C1917' }}>
            {label}
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#78716C', mt: 0.1 }}>
            {desc}
          </Typography>
        </Box>
        <Box sx={{
          ml: 2, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center',
          px: 1.2, py: 0.2, borderRadius: '99px',
          background: color + '18', border: `1px solid ${color}44`,
        }}>
          <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', fontWeight: 700, color }}>
            {score}/10
          </Typography>
        </Box>
      </Box>

      {/* Custom slider track */}
      <Box sx={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ position: 'absolute', width: '100%', height: 8, borderRadius: '99px', background: '#E7E5E4', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', width: `${pct}%`, height: 8, borderRadius: '99px', background: color, zIndex: 2, transition: 'width 0.1s ease, background 0.2s ease' }} />
        <Box
          component="input"
          type="range"
          name={field}
          value={value}
          min="0"
          max="10"
          step="0.01"
          onChange={onChange}
          sx={{
            position: 'relative', zIndex: 3, width: '100%', height: 28,
            appearance: 'none', background: 'transparent', cursor: 'pointer', margin: 0,
            '&::-webkit-slider-thumb': {
              appearance: 'none', width: 20, height: 20,
              borderRadius: '50%', background: '#fff',
              border: `2px solid ${color}`, boxShadow: '0 1px 4px rgba(28,25,23,0.18)',
              transition: 'border-color 0.2s',
            },
            '&::-moz-range-thumb': {
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              border: `2px solid ${color}`, boxShadow: '0 1px 4px rgba(28,25,23,0.18)',
              cursor: 'pointer',
            },
          }}
        />
      </Box>

      {/* Criterion text */}
      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#78716C', mt: 0.5, fontStyle: 'italic' }}>
        {CRITERIA[field][score]}
      </Typography>
    </Box>
  );
}

const AddAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    speaking_score: 0, listening_score: 0, reading_score: 0, writing_score: 0,
    typing_score: 0, maths_score: 0, digital_competence_score: 0,
    sports_score: 0, character_score: 0, hygiene_score: 0, notes: '',
  });
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    studentService.getById(id)
      .then((studentData) => {
        if (!studentData) { setError('Student not found'); return; }
        setStudent(studentData);
        return statisticsService.getStudentStatistics(id);
      })
      .then((s) => { if (s) setStats(s); })
      .catch((err) => setError(err.message));
  }, [id]);

  const totalScore = ['speaking_score','listening_score','reading_score','writing_score',
    'typing_score','maths_score','digital_competence_score','sports_score','character_score','hygiene_score']
    .reduce((sum, k) => sum + Math.round(formData[k]), 0);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(f => ({ ...f, [name]: type === 'range' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scoreKeys = ['speaking_score','listening_score','reading_score','writing_score',
        'typing_score','maths_score','digital_competence_score','sports_score','character_score','hygiene_score'];
      const rounded = {};
      scoreKeys.forEach(k => { rounded[k] = Math.round(formData[k]); });
      await assessmentService.create({
        ...formData, ...rounded,
        student_id: parseInt(id, 10),
        assessment_date: new Date().toISOString().split('T')[0],
      });
      navigate(`/students/${id}`);
    } catch (err) {
      setError(err.message);
    }
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

  const card = {
    background: '#FFFFFF', borderRadius: '16px',
    border: '1px solid #E7E5E4', boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
    p: 3, mb: 2.5,
  };
  const sectionLabel = {
    fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', fontWeight: 600,
    letterSpacing: '0.07em', textTransform: 'uppercase', color: '#78716C', mb: 2,
  };

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto', px: 3, pt: 4, pb: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/students/${id}`)}
          sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.82rem', textTransform: 'none', color: '#78716C', borderRadius: '8px', px: 1.5, py: 0.5, mb: 1, '&:hover': { background: '#F5F3EF', color: '#1C1917' } }}
        >
          Back to profile
        </Button>
        <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1C1917', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
          New Assessment
        </Typography>
        <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: '#78716C', mt: 0.4 }}>
          {student.name} · {stats?.assessment_count ?? 0} previous {(stats?.assessment_count ?? 0) === 1 ? 'assessment' : 'assessments'}
        </Typography>
      </Box>

      {/* Live score summary */}
      <Box sx={{ ...card, display: 'flex', alignItems: 'center', gap: 3, mb: 3, mt: 3 }}>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1.6rem', color: scoreColor(totalScore / 10), lineHeight: 1 }}>
            {totalScore}
            <Box component="span" sx={{ fontSize: '0.9rem', color: '#78716C', fontWeight: 400 }}>/100</Box>
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.06em', mt: 0.5 }}>
            Current Score
          </Typography>
        </Box>
        <Box sx={{ width: '1px', background: '#E7E5E4', height: 40 }} />
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography sx={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1.6rem', color: '#78716C', lineHeight: 1 }}>
            {stats?.average_capability ? `${Math.round(stats.average_capability)}%` : '—'}
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.06em', mt: 0.5 }}>
            Avg. Score
          </Typography>
        </Box>
      </Box>

      {/* Score groups */}
      <Box component="form" onSubmit={handleSubmit}>
        {CATEGORIES.map((group) => (
          <Box key={group.group} sx={card}>
            <Typography sx={sectionLabel}>{group.group}</Typography>
            <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', color: '#78716C', mb: 2.5, mt: -1.5 }}>
              {group.desc}
            </Typography>
            {group.items.map((item) => (
              <ScoreSlider
                key={item.key}
                field={item.key}
                label={item.label}
                desc={item.desc}
                value={formData[item.key]}
                onChange={handleChange}
              />
            ))}
          </Box>
        ))}

        {/* Notes */}
        <Box sx={card}>
          <Typography sx={sectionLabel}>Notes</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any observations or context…"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.9rem',
                borderRadius: '10px',
                background: '#FAFAF8',
                '& fieldset': { borderColor: '#E7E5E4', borderWidth: '1.5px' },
                '&:hover fieldset': { borderColor: '#78716C' },
                '&.Mui-focused fieldset': { borderColor: '#3D7A5F', boxShadow: '0 0 0 3px rgba(61,122,95,0.12)' },
              },
            }}
          />
        </Box>

        {/* Submit */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            type="button"
            onClick={() => navigate(`/students/${id}`)}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', border: '1.5px solid #E7E5E4', color: '#78716C', borderRadius: '10px', px: 2.5, py: 1, '&:hover': { background: '#F5F3EF', borderColor: '#1C1917', color: '#1C1917' } }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', background: '#3D7A5F', color: '#fff', borderRadius: '10px', px: 3, py: 1, '&:hover': { background: '#2d5f49' }, '&:active': { transform: 'translateY(1px)' } }}
          >
            Save Assessment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddAssessment;
