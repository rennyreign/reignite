import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { studentService } from '../services/supabaseService';
import { capabilityAreasService, checkinsService } from '../services/v2Service';

const scoreColor = (score) => {
  if (score >= 8) return '#3D7A5F';
  if (score >= 5) return '#4A90A4';
  if (score >= 3) return '#D97706';
  return score > 0 ? '#DC2626' : '#E7E5E4';
};

// Criteria text for each sub-capability (0-10)
const CRITERIA = {
  // Communication
  Speaking: [
    "No verbal communication",
    "Says single words; not clearly enunciated",
    "Phrases of 2–3 words; often unclear",
    "Short, clear sentences on familiar topics",
    "Can explain basic thoughts; occasional hesitations",
    "Communicates needs + feelings; vocabulary is growing",
    "Engages in conversations with some detail",
    "Uses descriptive language and adjusts tone",
    "Explains ideas clearly across topics",
    "Can persuade, narrate, or explain complex ideas",
    "Near-adult fluency: nuanced, expressive, confident"
  ],
  Listening: [
    "Doesn't respond to verbal prompts",
    "Needs repeated instructions",
    "Occasionally responds appropriately",
    "Can follow 1-step instructions",
    "Understands 2-step instructions",
    "Responds well to stories or commands with questions",
    "Can summarize what was said",
    "Listens attentively and responds with relevant thoughts",
    "Can follow complex, multi-part conversations",
    "Anticipates meaning, asks clarifying questions",
    "Active listener: paraphrases, questions, synthesizes info"
  ],
  Reading: [
    "Cannot identify letters or sounds",
    "Recognizes letters; beginning phonics",
    "Reads simple words (CVC) slowly",
    "Reads basic sentences with effort",
    "Reads short stories with support",
    "Reads fluently at primary level; understands context",
    "Reads independently; discusses plot and characters",
    "Analyzes themes; uses tone while reading aloud",
    "Reads complex texts (articles, fiction, nonfiction)",
    "Synthesizes information; compares across sources",
    "Reads at adult level fluently with critical insight"
  ],
  Writing: [
    "Cannot write words",
    "Writes letters or name only",
    "Short words; unsure spelling",
    "Writes basic sentences with effort",
    "Forms clear short paragraphs; minor errors",
    "Expresses ideas with structure and punctuation",
    "Writes for different purposes (story, note, description)",
    "Coherent paragraphs with varied vocabulary",
    "Uses tone, style, and grammar to strengthen message",
    "Writes persuasively or creatively with voice",
    "Advanced writing: essays, fiction, articles with polish"
  ],
  
  // Cognitive
  'Problem Solving': [
    "No problem-solving attempts",
    "Tries random actions without logic",
    "Can solve very simple problems with help",
    "Solves basic problems independently",
    "Uses trial and error effectively",
    "Applies logic to familiar problems",
    "Thinks through multi-step problems",
    "Uses strategies and adapts approach",
    "Solves complex problems creatively",
    "Analyzes problems systematically",
    "Expert problem-solver: strategic, efficient, innovative"
  ],
  'Understanding Numbers': [
    "No number recognition",
    "Counts to 10; simple addition",
    "Understands number relationships to 20",
    "Adds/subtracts within 50",
    "Multiplies/divides basic facts",
    "Understands fractions, time, measurement",
    "Applies math to real-world problems",
    "Solves multi-step equations",
    "Uses math in strategic thinking (e.g. probability)",
    "Algebra, geometry, patterns, logic",
    "Advanced math reasoning & abstract concepts"
  ],
  'Thinking Things Through': [
    "Accepts information without question",
    "Rarely questions or analyzes",
    "Asks basic questions occasionally",
    "Shows curiosity about how things work",
    "Questions assumptions sometimes",
    "Evaluates simple arguments",
    "Compares different viewpoints",
    "Analyzes evidence before concluding",
    "Identifies logical fallacies",
    "Forms well-reasoned arguments",
    "Sophisticated analytical thinking across domains"
  ],

  // Physical
  'Movement & Coordination': [
    "Very limited body control",
    "Struggles with basic movements",
    "Can walk and run with some stability",
    "Basic hand-eye coordination emerging",
    "Catches and throws with effort",
    "Good balance and body awareness",
    "Coordinates complex movements",
    "Fluid, controlled movements",
    "Excellent coordination in sports/activities",
    "Advanced motor control and precision",
    "Elite-level coordination and agility"
  ],
  'Strength & Energy': [
    "Very sedentary; avoids activity",
    "Limited stamina; tires quickly",
    "Can sustain light activity briefly",
    "Participates in moderate activity",
    "Shows growing endurance",
    "Maintains activity for extended periods",
    "Good cardiovascular fitness",
    "Strong and energetic",
    "High stamina and strength",
    "Athlete-level fitness",
    "Peak physical condition"
  ],
  'Hand & Body Skills': [
    "Minimal fine/gross motor control",
    "Struggles with basic tasks (holding objects)",
    "Can perform simple motor tasks with help",
    "Basic self-care tasks (eating, dressing)",
    "Improving dexterity and control",
    "Good fine motor skills (writing, cutting)",
    "Precise hand movements",
    "Skilled at detailed tasks",
    "Excellent dexterity",
    "Professional-level motor control",
    "Master-level precision and skill"
  ],

  // Emotional Intelligence
  'Understanding Feelings': [
    "No awareness of own emotions",
    "Rarely recognizes feelings",
    "Can name basic emotions when prompted",
    "Identifies own feelings sometimes",
    "Recognizes emotional patterns",
    "Understands triggers and responses",
    "Reflects on emotions regularly",
    "Deep self-understanding",
    "Articulates complex emotional states",
    "Highly self-aware and introspective",
    "Exceptional emotional self-knowledge"
  ],
  'Caring About Others': [
    "No awareness of others' feelings",
    "Rarely considers others' perspectives",
    "Shows concern when prompted",
    "Notices when others are upset",
    "Tries to comfort others",
    "Understands different perspectives",
    "Actively empathizes with others",
    "Deeply attuned to others' emotions",
    "Responds sensitively to emotional cues",
    "Exceptional empathy and compassion",
    "Profound understanding of human emotion"
  ],
  'Managing Emotions': [
    "Frequent meltdowns; no control",
    "Struggles to manage emotions",
    "Can calm down with significant help",
    "Uses simple strategies when reminded",
    "Manages emotions with some success",
    "Usually stays calm under stress",
    "Good emotional control",
    "Handles frustration well",
    "Excellent self-regulation",
    "Calm and composed in all situations",
    "Exceptional emotional mastery"
  ],

  // Social
  'Making Friends': [
    "No interest in peers",
    "Rarely interacts with others",
    "Plays alongside others (parallel play)",
    "Engages in simple interactions",
    "Has one or two friends",
    "Maintains several friendships",
    "Forms meaningful connections",
    "Strong, supportive friendships",
    "Deep, lasting relationships",
    "Exceptional social bonds",
    "Profound, mature friendships"
  ],
  'Working with Others': [
    "Refuses to cooperate",
    "Rarely works with others",
    "Cooperates when required",
    "Participates in group activities",
    "Shares and takes turns",
    "Works well in teams",
    "Contributes actively to groups",
    "Collaborative and supportive",
    "Natural team player",
    "Exceptional collaborator",
    "Inspires cooperation in others"
  ],
  'Solving Disagreements': [
    "Escalates conflicts",
    "Avoids or ignores conflicts",
    "Needs adult intervention always",
    "Can resolve simple disputes with help",
    "Attempts to find solutions",
    "Resolves minor conflicts independently",
    "Handles disagreements maturely",
    "Mediates conflicts effectively",
    "Excellent conflict resolution skills",
    "Natural peacemaker",
    "Exceptional diplomacy and fairness"
  ],

  // Character
  'Being Responsible': [
    "No sense of responsibility",
    "Rarely follows through",
    "Needs constant reminders",
    "Completes tasks when supervised",
    "Takes ownership sometimes",
    "Usually reliable",
    "Consistently responsible",
    "Highly dependable",
    "Exceptional accountability",
    "Leads by example",
    "Unwavering integrity and responsibility"
  ],
  'Sticking with Things': [
    "No self-control",
    "Gives up easily",
    "Needs constant motivation",
    "Shows effort when interested",
    "Persists with encouragement",
    "Good self-discipline",
    "Focused and determined",
    "Strong work ethic",
    "Exceptional self-discipline",
    "Relentless pursuit of goals",
    "Master-level discipline and focus"
  ],
  'Being Honest & Fair': [
    "Dishonest; blames others",
    "Rarely tells the truth",
    "Honest when caught",
    "Usually truthful",
    "Owns mistakes sometimes",
    "Consistently honest",
    "Strong moral compass",
    "Does right thing even when hard",
    "Exceptional integrity",
    "Inspires trust in others",
    "Unwavering ethical standards"
  ],

  // Creative
  'Creative Thinking': [
    "No imaginative play",
    "Limited creative thinking",
    "Engages in simple pretend play",
    "Creates basic stories or scenarios",
    "Shows growing imagination",
    "Rich imaginative play",
    "Invents elaborate scenarios",
    "Highly creative thinking",
    "Exceptional imagination",
    "Visionary creative ideas",
    "Boundless, sophisticated imagination"
  ],
  'Art & Expression': [
    "No interest in art/music",
    "Minimal creative output",
    "Enjoys simple creative activities",
    "Creates basic art/music",
    "Shows artistic interest",
    "Produces creative work regularly",
    "Skilled in one or more art forms",
    "Expressive and original",
    "Exceptional artistic ability",
    "Produces sophisticated work",
    "Master-level artistic expression"
  ],
  Curiosity: [
    "No interest in learning",
    "Rarely asks questions",
    "Shows mild curiosity",
    "Asks basic questions",
    "Explores new ideas sometimes",
    "Actively curious",
    "Seeks out new knowledge",
    "Deeply inquisitive",
    "Exceptional curiosity",
    "Relentless learner",
    "Insatiable intellectual curiosity"
  ],

  // Practical Life
  'Taking Care of Themselves': [
    "No self-care; resists help",
    "Minimal hygiene awareness",
    "Needs constant reminders",
    "Can complete routines with supervision",
    "Manages basic hygiene inconsistently",
    "Usually maintains good hygiene",
    "Consistently clean and groomed",
    "Takes pride in appearance",
    "Excellent self-care habits",
    "Highly organized personal care",
    "Exemplary hygiene and presentation"
  ],
  'Doing Things Independently': [
    "Completely dependent",
    "Needs help with everything",
    "Can do simple tasks with help",
    "Completes basic tasks independently",
    "Growing independence",
    "Manages daily routines alone",
    "Highly self-sufficient",
    "Makes good decisions independently",
    "Exceptional independence",
    "Fully autonomous",
    "Mature, responsible independence"
  ],
  'Staying Organized': [
    "No organization; chaotic",
    "Rarely keeps track of belongings",
    "Can organize with significant help",
    "Keeps some things tidy",
    "Improving organizational skills",
    "Usually organized",
    "Good planning and organization",
    "Highly organized",
    "Exceptional organizational skills",
    "Systematically organized",
    "Master-level planning and organization"
  ],
};

function ScoreSlider({ subCapability, value, onChange, note, onNoteChange }) {
  const [showNote, setShowNote] = React.useState(false);
  const score = Math.round(value);
  const color = scoreColor(score);
  const pct = score * 10;
  const criteria = CRITERIA[subCapability.name] || [];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.8 }}>
        <Box>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#1C1917' }}>
            {subCapability.name}
          </Typography>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#78716C', mt: 0.1 }}>
            {subCapability.helper_text}
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

      {/* Slider */}
      <Box sx={{ position: 'relative', height: 28, display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ position: 'absolute', width: '100%', height: 8, borderRadius: '99px', background: '#E7E5E4', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', width: `${pct}%`, height: 8, borderRadius: '99px', background: color, zIndex: 2, transition: 'width 0.1s ease, background 0.2s ease' }} />
        <Box
          component="input"
          type="range"
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

      {/* Criteria text */}
      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#78716C', fontStyle: 'italic', mb: 1.5 }}>
        {criteria[score] || 'No criteria available'}
      </Typography>

      {/* Collapsible note */}
      {(showNote || note) ? (
        <TextField
          fullWidth
          multiline
          rows={1}
          autoFocus={showNote && !note}
          placeholder="Your note..."
          value={note}
          onChange={onNoteChange}
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-root': {
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.75rem',
              borderRadius: '8px',
              background: '#FAFAF8',
              '& fieldset': { borderColor: '#E7E5E422', borderWidth: '1px' },
              '&:hover fieldset': { borderColor: '#E7E5E4' },
              '&.Mui-focused fieldset': { borderColor: '#D6D3D1', boxShadow: 'none' },
            },
          }}
        />
      ) : (
        <Typography
          onClick={() => setShowNote(true)}
          sx={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.7rem',
            color: '#A8A29E',
            cursor: 'pointer',
            mt: 0.5,
            '&:hover': { color: '#78716C' },
          }}
        >
          + Add a note
        </Typography>
      )}
    </Box>
  );
}

const NewCheckin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [child, setChild] = useState(null);
  const [areas, setAreas] = useState([]);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState({});
  const [generalNote, setGeneralNote] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    Promise.all([
      studentService.getById(id),
      capabilityAreasService.getAllWithSubCapabilities(),
    ])
      .then(([childData, areasData]) => {
        if (!childData) { setError('Child not found'); return; }
        setChild(childData);
        setAreas(areasData);
        
        // Initialize scores to 0
        const initialScores = {};
        areasData.forEach(area => {
          area.sub_capabilities.forEach(sub => {
            initialScores[sub.id] = 0;
          });
        });
        setScores(initialScores);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const currentArea = areas[currentAreaIndex];
  const isLastArea = currentAreaIndex === areas.length - 1;

  const handleNext = () => {
    if (isLastArea) {
      handleSubmit();
    } else {
      setCurrentAreaIndex(i => i + 1);
    }
  };

  const handleBack = () => {
    if (currentAreaIndex > 0) {
      setCurrentAreaIndex(i => i - 1);
    } else {
      navigate(`/students/${id}`);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
      
      const scoresArray = Object.entries(scores).map(([subCapId, score]) => ({
        sub_capability_id: subCapId,
        score: Math.round(score),
        note: notes[subCapId] || null,
      }));

      await checkinsService.create({
        childId: id,
        scores: scoresArray,
        generalNote: generalNote || null,
        durationSeconds,
      });

      navigate(`/students/${id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 680, mx: 'auto', px: 3, pt: 4 }}>
        <Box sx={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', p: 3 }}>
          <Typography sx={{ fontWeight: 600, color: '#DC2626', fontFamily: 'Outfit, sans-serif', mb: 0.5 }}>
            Error
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#78716C', fontFamily: 'Outfit, sans-serif' }}>
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!child || !currentArea) {
    return (
      <Box sx={{ maxWidth: 680, mx: 'auto', px: 3, pt: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'Outfit, sans-serif', color: '#78716C' }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', px: 3, pt: 4, pb: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1C1917', letterSpacing: '-0.025em', mb: 3 }}>
          New Check-in: {child.name}
        </Typography>
        
        {/* Prominent Area Title */}
        <Box sx={{ 
          background: '#EBF3EE', 
          borderRadius: '12px', 
          border: '2px solid #3D7A5F', 
          p: 3,
          mb: 2
        }}>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3D7A5F', mb: 1 }}>
            Area {currentAreaIndex + 1} of {areas.length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: '2.5rem', lineHeight: 1 }}>{currentArea.icon}</Typography>
            <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1C1917', letterSpacing: '-0.02em' }}>
              {currentArea.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {areas.map((_, idx) => (
            <Box
              key={idx}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: '99px',
                background: idx <= currentAreaIndex ? '#3D7A5F' : '#E7E5E4',
                transition: 'background 0.2s ease',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Sub-capabilities */}
      <Box sx={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E7E5E4', boxShadow: '0 1px 4px rgba(28,25,23,0.06)', p: 3, mb: 3 }}>
        {currentArea.sub_capabilities.map((sub) => (
          <ScoreSlider
            key={sub.id}
            subCapability={sub}
            value={scores[sub.id] || 0}
            onChange={(e) => setScores(s => ({ ...s, [sub.id]: parseFloat(e.target.value) }))}
            note={notes[sub.id] || ''}
            onNoteChange={(e) => setNotes(n => ({ ...n, [sub.id]: e.target.value }))}
          />
        ))}
      </Box>

      {/* General note (last area only) - subtle */}
      {isLastArea && (
        <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid #E7E5E422' }}>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '0.75rem', color: '#A8A29E', mb: 1 }}>
            Overall note (optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Any general observations about this check-in..."
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.75rem',
                borderRadius: '8px',
                background: '#FAFAF8',
                '& fieldset': { borderColor: '#E7E5E422', borderWidth: '1px' },
                '&:hover fieldset': { borderColor: '#E7E5E4' },
                '&.Mui-focused fieldset': { borderColor: '#D6D3D1', boxShadow: 'none' },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#A8A29E',
                opacity: 0.6,
              },
            }}
          />
        </Box>
      )}

      {/* Navigation */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'space-between' }}>
        <Button
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem',
            textTransform: 'none', border: '1.5px solid #E7E5E4', color: '#78716C',
            borderRadius: '10px', px: 2.5, py: 1,
            '&:hover': { background: '#F5F3EF', borderColor: '#1C1917', color: '#1C1917' },
          }}
        >
          {currentAreaIndex === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          onClick={handleNext}
          endIcon={isLastArea ? null : <ArrowForwardIcon />}
          disabled={saving}
          sx={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem',
            textTransform: 'none', background: '#3D7A5F', color: '#fff',
            borderRadius: '10px', px: 3, py: 1,
            '&:hover': { background: '#2d5f49' },
            '&:active': { transform: 'translateY(1px)' },
            '&.Mui-disabled': { background: '#A8A29E', color: '#fff' },
          }}
        >
          {saving ? 'Saving...' : isLastArea ? 'Complete Check-in' : 'Next Area'}
        </Button>
      </Box>
    </Box>
  );
};

export default NewCheckin;
