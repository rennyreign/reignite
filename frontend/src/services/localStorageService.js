/**
 * Local Storage Service for Capability Tracker
 * 
 * This service provides methods to interact with browser's localStorage
 * for storing and retrieving student and assessment data.
 */

// Storage keys
const KEYS = {
  STUDENTS: 'capability_tracker_students',
  ASSESSMENTS: 'capability_tracker_assessments',
  NEXT_STUDENT_ID: 'capability_tracker_next_student_id',
  NEXT_ASSESSMENT_ID: 'capability_tracker_next_assessment_id'
};

// Initialize local storage with default values if not present
const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.STUDENTS)) {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(KEYS.ASSESSMENTS)) {
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(KEYS.NEXT_STUDENT_ID)) {
    localStorage.setItem(KEYS.NEXT_STUDENT_ID, '1');
  }
  
  if (!localStorage.getItem(KEYS.NEXT_ASSESSMENT_ID)) {
    localStorage.setItem(KEYS.NEXT_ASSESSMENT_ID, '1');
  }
};

// Initialize storage on import
initializeStorage();

// Get the next ID and increment
const getNextId = (key) => {
  const nextId = parseInt(localStorage.getItem(key), 10);
  localStorage.setItem(key, (nextId + 1).toString());
  return nextId;
};

// Safe localStorage setter with error handling
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Check if it's a quota exceeded error
    if (error.name === 'QuotaExceededError' || 
        error.message.includes('quota') || 
        error.message.includes('storage') || 
        error.message.includes('exceeded')) {
      throw new Error('Storage quota exceeded. The data (likely an image) is too large.');
    }
    throw error; // Re-throw any other errors
  }
};

// Student methods
const studentService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
  },
  
  getById: (id) => {
    const students = JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
    return students.find(student => student.id === parseInt(id, 10)) || null;
  },
  
  create: (studentData) => {
    const students = JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
    const newStudent = {
      ...studentData,
      id: getNextId(KEYS.NEXT_STUDENT_ID),
      created_at: new Date().toISOString()
    };
    
    students.push(newStudent);
    safeSetItem(KEYS.STUDENTS, JSON.stringify(students));
    return newStudent;
  },
  
  update: (id, studentData) => {
    const students = JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
    const index = students.findIndex(student => student.id === parseInt(id, 10));
    
    if (index !== -1) {
      students[index] = {
        ...students[index],
        ...studentData
      };
      safeSetItem(KEYS.STUDENTS, JSON.stringify(students));
      return students[index];
    }
    
    return null;
  },
  
  delete: (id) => {
    const students = JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
    const filteredStudents = students.filter(student => student.id !== parseInt(id, 10));
    safeSetItem(KEYS.STUDENTS, JSON.stringify(filteredStudents));
    
    // Also delete related assessments
    const assessments = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS) || '[]');
    const filteredAssessments = assessments.filter(assessment => assessment.student_id !== parseInt(id, 10));
    safeSetItem(KEYS.ASSESSMENTS, JSON.stringify(filteredAssessments));
  }
};

// Assessment methods
const assessmentService = {
  getAll: () => {
    return JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS) || '[]');
  },
  
  getById: (id) => {
    const assessments = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS) || '[]');
    return assessments.find(assessment => assessment.id === parseInt(id, 10)) || null;
  },
  
  getByStudentId: (studentId) => {
    const assessments = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS) || '[]');
    return assessments.filter(assessment => assessment.student_id === parseInt(studentId, 10));
  },
  
  create: (assessmentData) => {
    const assessments = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS) || '[]');
    
    // Calculate capability percentage
    const totalScore = 
      (assessmentData.speaking_score || 0) +
      (assessmentData.listening_score || 0) +
      (assessmentData.reading_score || 0) +
      (assessmentData.writing_score || 0) +
      (assessmentData.typing_score || 0) +
      (assessmentData.maths_score || 0) +
      (assessmentData.digital_competence_score || 0) +
      (assessmentData.sports_score || 0) +
      (assessmentData.character_score || 0) +
      (assessmentData.hygiene_score || 0);
    
    // Use parseInt to ensure we get a clean integer percentage without floating-point precision issues
    const capability_percentage = parseInt(totalScore, 10);
    
    const newAssessment = {
      ...assessmentData,
      id: getNextId(KEYS.NEXT_ASSESSMENT_ID),
      assessment_date: assessmentData.assessment_date || new Date().toISOString().split('T')[0],
      capability_percentage,
      created_at: new Date().toISOString()
    };
    
    assessments.push(newAssessment);
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(assessments));
    return newAssessment;
  },
  
  update: (id, assessmentData) => {
    const assessments = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS) || '[]');
    const index = assessments.findIndex(assessment => assessment.id === parseInt(id, 10));
    
    if (index !== -1) {
      // Recalculate capability percentage if scores are updated
      let capability_percentage = assessments[index].capability_percentage;
      
      if (
        'speaking_score' in assessmentData ||
        'listening_score' in assessmentData ||
        'reading_score' in assessmentData ||
        'writing_score' in assessmentData ||
        'typing_score' in assessmentData ||
        'maths_score' in assessmentData ||
        'digital_competence_score' in assessmentData ||
        'sports_score' in assessmentData ||
        'character_score' in assessmentData ||
        'hygiene_score' in assessmentData
      ) {
        const updatedAssessment = {
          ...assessments[index],
          ...assessmentData
        };
        
        const totalScore = 
          (updatedAssessment.speaking_score || 0) +
          (updatedAssessment.listening_score || 0) +
          (updatedAssessment.reading_score || 0) +
          (updatedAssessment.writing_score || 0) +
          (updatedAssessment.typing_score || 0) +
          (updatedAssessment.maths_score || 0) +
          (updatedAssessment.digital_competence_score || 0) +
          (updatedAssessment.sports_score || 0) +
          (updatedAssessment.character_score || 0) +
          (updatedAssessment.hygiene_score || 0);
        
        // Use parseInt to ensure we get a clean integer percentage without floating-point precision issues
        capability_percentage = parseInt(totalScore, 10);
      }
      
      assessments[index] = {
        ...assessments[index],
        ...assessmentData,
        capability_percentage
      };
      
      localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(assessments));
      return assessments[index];
    }
    
    return null;
  },
  
  delete: (id) => {
    const assessments = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS) || '[]');
    const filteredAssessments = assessments.filter(assessment => assessment.id !== parseInt(id, 10));
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(filteredAssessments));
  }
};

// Statistics methods
const statisticsService = {
  getStudentStatistics: (studentId) => {
    const assessments = assessmentService.getByStudentId(parseInt(studentId, 10));
    
    if (assessments.length === 0) {
      return {
        latest_assessment: null,
        average_capability: 0,
        assessment_count: 0,
        trend_data: []
      };
    }
    
    // Sort assessments by date (newest first)
    const sortedAssessments = [...assessments].sort((a, b) => 
      new Date(b.assessment_date) - new Date(a.assessment_date)
    );
    
    // Get latest assessment
    const latest_assessment = sortedAssessments[0];
    
    // Calculate average capability
    const average_capability = assessments.reduce(
      (sum, assessment) => sum + assessment.capability_percentage, 0
    ) / assessments.length;
    
    // Create trend data (date and capability percentage)
    const trend_data = sortedAssessments
      .reverse() // Oldest first for trend data
      .map(assessment => ({
        date: assessment.assessment_date,
        capability_percentage: assessment.capability_percentage
      }));
    
    return {
      latest_assessment,
      average_capability,
      assessment_count: assessments.length,
      trend_data
    };
  }
};

// Sample data for initial setup
const loadSampleData = () => {
  // Only load sample data if no students exist
  if (studentService.getAll().length === 0) {
    // Add sample students
    const john = studentService.create({
      name: 'John Smith',
      date_of_birth: '2015-05-15',
      profile_image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM0OThkYiI+PC9yZWN0Pjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+SlM8L3RleHQ+PC9zdmc+'
    });
    
    const emma = studentService.create({
      name: 'Emma Johnson',
      date_of_birth: '2016-08-22',
      profile_image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzI3YWU2MCI+PC9yZWN0Pjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+RUo8L3RleHQ+PC9zdmc+'
    });
    
    const michael = studentService.create({
      name: 'Michael Brown',
      date_of_birth: '2014-03-10',
      profile_image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U3NGMzYyI+PC9yZWN0Pjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+TUI8L3RleHQ+PC9zdmc+'
    });
    
    // Generate random scores between 3 and 10
    const randomScore = () => Math.floor(Math.random() * 8) + 3;
    
    // Add assessments for each student (past 6 months)
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const assessmentDate = new Date(today);
      assessmentDate.setMonth(today.getMonth() - i);
      const dateString = assessmentDate.toISOString().split('T')[0];
      
      // John's assessments
      assessmentService.create({
        student_id: john.id,
        assessment_date: dateString,
        notes: `Assessment for ${assessmentDate.toLocaleString('default', { month: 'long' })} ${assessmentDate.getFullYear()}`,
        speaking_score: randomScore(),
        listening_score: randomScore(),
        reading_score: randomScore(),
        writing_score: randomScore(),
        typing_score: randomScore(),
        maths_score: randomScore(),
        digital_competence_score: randomScore(),
        sports_score: randomScore(),
        character_score: randomScore(),
        hygiene_score: randomScore()
      });
      
      // Emma's assessments
      assessmentService.create({
        student_id: emma.id,
        assessment_date: dateString,
        notes: `Assessment for ${assessmentDate.toLocaleString('default', { month: 'long' })} ${assessmentDate.getFullYear()}`,
        speaking_score: randomScore(),
        listening_score: randomScore(),
        reading_score: randomScore(),
        writing_score: randomScore(),
        typing_score: randomScore(),
        maths_score: randomScore(),
        digital_competence_score: randomScore(),
        sports_score: randomScore(),
        character_score: randomScore(),
        hygiene_score: randomScore()
      });
      
      // Michael's assessments
      assessmentService.create({
        student_id: michael.id,
        assessment_date: dateString,
        notes: `Assessment for ${assessmentDate.toLocaleString('default', { month: 'long' })} ${assessmentDate.getFullYear()}`,
        speaking_score: randomScore(),
        listening_score: randomScore(),
        reading_score: randomScore(),
        writing_score: randomScore(),
        typing_score: randomScore(),
        maths_score: randomScore(),
        digital_competence_score: randomScore(),
        sports_score: randomScore(),
        character_score: randomScore(),
        hygiene_score: randomScore()
      });
    }
  }
};

// Load sample data
loadSampleData();

// Migrated to supabaseService.js — exports removed to avoid name collision
