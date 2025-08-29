import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService, assessmentService } from '../services/localStorageService';
import './CustomSlider.css';
import { formatDate } from '../utils/dateFormatter';

const AddAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    speaking_score: 0,
    listening_score: 0,
    reading_score: 0,
    writing_score: 0,
    typing_score: 0,
    maths_score: 0,
    digital_competence_score: 0,
    sports_score: 0,
    character_score: 0,
    hygiene_score: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [capabilityPercentage, setCapabilityPercentage] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [lastAssessmentDate, setLastAssessmentDate] = useState(null);

  // Criteria for each category
  const criteria = {
    speaking: [
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
    listening: [
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
    reading: [
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
    writing: [
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
    typing: [
      "No typing skill",
      "Types one finger, very slow",
      "Locates keys, very slow pace",
      "Types short words with pauses",
      "Can complete sentences with effort",
      "Uses both hands slowly, improving accuracy",
      "Steady pace, some backspace use",
      "Types without looking, moderate speed",
      "Fluent typing with few errors",
      "Types at ~50–60 WPM with accuracy",
      "Professional level typing (~70+ WPM, near flawless)"
    ],
    maths: [
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
    digital_competence: [
      "No familiarity with digital devices or interfaces",
      "Can turn on a device and recognize basic symbols (e.g., home, back)",
      "Navigates a single app or game independently",
      "Can open, close, and switch between apps; basic typing or search ability",
      "Understands internet use (e.g., search, streaming); shows curiosity to explore tools",
      "Uses productivity tools (camera, notes, calculator, simple apps) with intention",
      "Can troubleshoot basic problems (e.g., volume issues, connecting Wi-Fi)",
      "Applies multiple tools to achieve a goal (e.g., using Canva to design, YouTube to learn)",
      "Thinks critically about apps, privacy, and screen time; adapts quickly to new tech",
      "Leads digital tasks (e.g., creating slides, organizing files, managing folders)",
      "Resourceful, creative, and responsible; shows mastery across devices, platforms, and learning tools"
    ],
    sports: [
      "Shows no interest in physical activity",
      "Limited mobility or coordination",
      "Participates hesitantly in basic movements",
      "Runs, jumps, throws with some control",
      "Knows rules of one sport; plays casually",
      "Shows growing athleticism and interest",
      "Good hand-eye coordination; applies strategy",
      "Excels at one sport; understands fitness principles",
      "Plays competitively or practices regularly",
      "Athletic leadership, stamina, form",
      "Peak condition, technique, multi-sport capability"
    ],
    character: [
      "Reactive, disobedient, not self-aware",
      "Rarely shows kindness or control",
      "Basic awareness, often needs correction",
      "Shows empathy or responsibility when prompted",
      "Owns actions occasionally",
      "Regularly helpful, manages emotions",
      "Reflective, learns from mistakes",
      "Demonstrates self-discipline and values",
      "Acts with integrity even when unsupervised",
      "Inspires others; resolves conflicts maturely",
      "Remarkable moral compass and emotional maturity"
    ],
    hygiene: [
      "No awareness of hygiene or grooming; resists cleaning",
      "Rarely brushes teeth, bathes, or dresses independently",
      "Needs constant reminders for daily routines (e.g., brushing, washing face)",
      "Can bathe and brush with supervision; mismatched or unkempt clothing",
      "Completes basic routines (teeth, washing, dressing) but inconsistently",
      "Dresses appropriately for context; clean clothes; grooming is improving",
      "Maintains tidy appearance; can select outfits thoughtfully; understands cleanliness",
      "Cares about self-presentation; shows personal style; keeps personal space neat",
      "Actively maintains grooming routines; manages skincare, hair, etc.",
      "Demonstrates pride in presentation, including clothing care and hygiene tools",
      "High-level self-discipline and grooming; expresses identity through style with maturity and care"
    ]
  };

  useEffect(() => {
    try {
      console.log('Fetching student data from local storage for ID:', id);
      const studentData = studentService.getById(id);
      
      if (!studentData) {
        setError(`Student with ID ${id} not found`);
        setLoading(false);
        return;
      }
      
      setStudent(studentData);
      
      // Get student statistics
      const { statisticsService } = require('../services/localStorageService');
      const stats = statisticsService.getStudentStatistics(id);
      
      // Set assessment count
      setAssessmentCount(stats.assessment_count);
      
      // Set average capability
      setAverageScore(stats.average_capability);
      
      // Set last assessment date if available
      if (stats.latest_assessment) {
        setLastAssessmentDate(new Date(stats.latest_assessment.assessment_date));
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(`Failed to fetch student data: ${err.message}`);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Calculate total score and capability percentage
    const total = 
      Math.round(formData.speaking_score) +
      Math.round(formData.listening_score) +
      Math.round(formData.reading_score) +
      Math.round(formData.writing_score) +
      Math.round(formData.typing_score) +
      Math.round(formData.maths_score) +
      Math.round(formData.digital_competence_score) +
      Math.round(formData.sports_score) +
      Math.round(formData.character_score) +
      Math.round(formData.hygiene_score);
    
    setTotalScore(total);
    // Use parseInt to ensure we get a clean integer percentage
    setCapabilityPercentage(parseInt(total, 10));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For range inputs, we'll use the raw value (which can be decimal)
    // For the final display and calculations, we'll round to the nearest integer
    const processedValue = name === 'notes' ? value : 
      e.target.type === 'range' ? parseFloat(value) : parseInt(value, 10);
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Add student_id to the form data and round all scores for storage
      const assessmentData = {
        ...formData,
        speaking_score: Math.round(formData.speaking_score),
        listening_score: Math.round(formData.listening_score),
        reading_score: Math.round(formData.reading_score),
        writing_score: Math.round(formData.writing_score),
        typing_score: Math.round(formData.typing_score),
        maths_score: Math.round(formData.maths_score),
        digital_competence_score: Math.round(formData.digital_competence_score),
        sports_score: Math.round(formData.sports_score),
        character_score: Math.round(formData.character_score),
        hygiene_score: Math.round(formData.hygiene_score),
        student_id: parseInt(id, 10),
        assessment_date: new Date().toISOString().split('T')[0]
      };
      
      console.log('Creating new assessment:', assessmentData);
      assessmentService.create(assessmentData);
      
      // Navigate to student profile
      navigate(`/students/${id}`);
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError(`Failed to save assessment: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading student data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  if (!student) {
    return <div className="alert alert-warning mt-3">Student not found.</div>;
  }

  // Helper function to render score input with criteria
  const renderScoreInput = (category, label, description) => {
    const scoreKey = `${category}_score`;
    const criteriaList = criteria[category];
    
    return (
      <Form.Group className="mb-4">
        <Form.Label>
          <strong>{label}</strong>
          <div className="text-muted small">{description}</div>
        </Form.Label>
        
        <div className="d-flex align-items-center mb-2">
          <Form.Range
            name={scoreKey}
            value={formData[scoreKey]}
            onChange={handleInputChange}
            min="0"
            max="10"
            className="me-2 flex-grow-1"
          />
          <span className="badge bg-primary" style={{ width: '40px' }}>
            {formData[scoreKey]}/10
          </span>
        </div>
        
        <div className="small text-muted">
          Current level: {criteriaList[formData[scoreKey]]}
        </div>
      </Form.Group>
    );
  };

  return (
    <Container>
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Profile Name: {student ? student.name : 'Loading...'}</h4>
            <div>
              <Button 
                variant="success" 
                className="me-2" 
                size="sm"
                onClick={() => navigate('/students/new')}
              >
                Create New Profile
              </Button>
              <Button 
                variant="info" 
                size="sm"
                onClick={() => navigate(`/students/${id}/edit`)}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <div className="profile-image me-3" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {student && student.profile_image ? (
                <img src={student.profile_image} alt={student.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <i className="bi bi-person" style={{ fontSize: '1.5rem' }}></i>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Profile Info</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <div className="mb-3">
                <div className="text-muted small">Name</div>
                <div className="bg-light p-2">{student ? student.name : 'Loading...'}</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-3">
                <div className="text-muted small">Date of Birth</div>
                <div className="bg-light p-2">{student && student.date_of_birth ? formatDate(student.date_of_birth) : 'Not specified'}</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-3">
                <div className="text-muted small">Created Date</div>
                <div className="bg-light p-2">{student && student.created_at ? formatDate(student.created_at) : formatDate(new Date())}</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-3">
                <div className="text-muted small">Last Assessment</div>
                <div className="bg-light p-2">{lastAssessmentDate ? formatDate(lastAssessmentDate) : 'No assessments yet'}</div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={3}>
              <div className="text-center">
                <div className="text-muted small">Current Score</div>
                <div className="h3">{totalScore}/100</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="text-muted small">Capability Percentage</div>
                <div className="h3">{capabilityPercentage}%</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="text-muted small">Average Score</div>
                <div className="h3">{averageScore ? `${Math.round(averageScore)}%` : '0%'}</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <div className="text-muted small"># of Assessments</div>
                <div className="h3">{assessmentCount}</div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Communication & Expression</h5>
            <div className="text-muted small">How the child communicates, processes, and expresses ideas.</div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>🔊 Speaking</strong>
                      <div className="text-muted small">Measures articulation, vocabulary depth, coherence, and confidence.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.speaking_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.speaking_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="speaking_score"
                      value={formData.speaking_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.speaking[Math.round(formData.speaking_score)]}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>👂 Listening</strong>
                      <div className="text-muted small">Assesses focus, comprehension, memory retention, and ability to respond appropriately.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.listening_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.listening_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="listening_score"
                      value={formData.listening_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.listening[Math.round(formData.listening_score)]}
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>📖 Reading</strong>
                      <div className="text-muted small">Focuses on fluency, comprehension, vocabulary, and engagement.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.reading_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.reading_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="reading_score"
                      value={formData.reading_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.reading[Math.round(formData.reading_score)]}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>✍️ Writing</strong>
                      <div className="text-muted small">Evaluates penmanship (if applicable), idea formation, structure, grammar, and creativity.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.writing_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.writing_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="writing_score"
                      value={formData.writing_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.writing[Math.round(formData.writing_score)]}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Physical Conduct</h5>
                <div className="text-muted small">How the child performs physically and maintains personal care.</div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>🏃‍♂️ Sports</strong>
                      <div className="text-muted small">Measures physical coordination, fitness, teamwork, and motor skill confidence.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.sports_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.sports_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="sports_score"
                      value={formData.sports_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.sports ? criteria.sports[Math.round(formData.sports_score)] : 'Can persuade, narrate, or explain complex ideas'}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>🧠 Character</strong>
                      <div className="text-muted small">Evaluates self-awareness, responsibility, discipline, and interpersonal behavior.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.character_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.character_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="character_score"
                      value={formData.character_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.character ? criteria.character[Math.round(formData.character_score)] : 'Can persuade, narrate, or explain complex ideas'}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>🧼 Hygiene</strong>
                      <div className="text-muted small">Evaluates physical cleanliness, grooming, and care in appearance.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.hygiene_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.hygiene_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="hygiene_score"
                      value={formData.hygiene_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.hygiene ? criteria.hygiene[Math.round(formData.hygiene_score)] : 'Can persuade, narrate, or explain complex ideas'}
                  </div>
                </div>
              </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Thinking & Tech</h5>
                <div className="text-muted small">How the child thinks, solves problems, and uses technology.</div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>➕ Maths</strong>
                      <div className="text-muted small">Measures mental arithmetic, logical reasoning, and applied problem solving.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.maths_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.maths_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="maths_score"
                      value={formData.maths_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.maths ? criteria.maths[Math.round(formData.maths_score)] : 'Can persuade, narrate, or explain complex ideas'}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>🧠 Digital Competence</strong>
                      <div className="text-muted small">Covers awareness, navigation, and effectiveness in digital tools and technology.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.digital_competence_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.digital_competence_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="digital_competence_score"
                      value={formData.digital_competence_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.digital_competence ? criteria.digital_competence[Math.round(formData.digital_competence_score)] : 'Can persuade, narrate, or explain complex ideas'}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>⌨️ Typing</strong>
                      <div className="text-muted small">Measures typing speed, accuracy, and keyboard fluency.</div>
                    </div>
                    <div className="badge bg-primary">{Math.round(formData.typing_score)}/10</div>
                  </div>
                  <div className="custom-range-container" style={{ position: 'relative', padding: '10px 0' }}>
                    {/* Custom track background */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: '100%', 
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    />
                    {/* Green progress fill */}
                    <div 
                      style={{ 
                        position: 'absolute',
                        height: '8px', 
                        width: `${formData.typing_score * 10}%`, 
                        backgroundColor: '#28a745',
                        borderRadius: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        transition: 'width 0.1s ease-out'
                      }}
                    />
                    <Form.Range 
                      name="typing_score"
                      value={formData.typing_score}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      step="0.01"
                      style={{ 
                        position: 'relative',
                        zIndex: 3,
                        height: '20px',
                        margin: '0',
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundColor: 'transparent',
                        '--thumb-color': '#007bff',
                        '--thumb-border': '2px solid white',
                        '--thumb-shadow': '0 0 3px rgba(0,0,0,0.3)'
                      }}
                      className="custom-range"
                    />
                  </div>
                  <div className="text-muted small mt-1">
                    {criteria.typing ? criteria.typing[Math.round(formData.typing_score)] : 'Can persuade, narrate, or explain complex ideas'}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Notes</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Control 
                as="textarea" 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add any evaluator observations..."
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="success" type="submit">
                Submit Changes
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </Container>
  );
};

export default AddAssessment;
