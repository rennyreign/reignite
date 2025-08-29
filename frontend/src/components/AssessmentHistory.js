import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Container, Alert, Modal } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { studentService, assessmentService } from '../services/localStorageService';
import { formatDate } from '../utils/dateFormatter';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AssessmentHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNotes, setCurrentNotes] = useState('');
  const [currentAssessmentDate, setCurrentAssessmentDate] = useState('');

  useEffect(() => {
    try {
      // Get student details from local storage
      console.log('Fetching student data from local storage for ID:', id);
      const studentData = studentService.getById(id);
      
      if (!studentData) {
        setError(`Student with ID ${id} not found`);
        setLoading(false);
        return;
      }
      
      setStudent(studentData);
      
      // Get all assessments for this student from local storage
      const assessmentsData = assessmentService.getByStudentId(parseInt(id, 10));
      
      // Sort assessments by date (newest first)
      const sortedAssessments = [...assessmentsData].sort((a, b) => 
        new Date(b.assessment_date) - new Date(a.assessment_date)
      );
      
      setAssessments(sortedAssessments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Failed to fetch data: ${err.message}`);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Loading assessment history...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  if (!student) {
    return <div className="alert alert-warning mt-3">Student not found.</div>;
  }

  // Prepare chart data
  const chartData = {
    labels: [...assessments].reverse().map(assessment => 
      formatDate(assessment.assessment_date)
    ),
    datasets: [
      {
        label: 'Overall Capability %',
        data: [...assessments].reverse().map(assessment => assessment.capability_percentage),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Speaking',
        data: [...assessments].reverse().map(assessment => assessment.speaking_score * 10),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        hidden: true
      },
      {
        label: 'Listening',
        data: [...assessments].reverse().map(assessment => assessment.listening_score * 10),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        hidden: true
      },
      {
        label: 'Reading',
        data: [...assessments].reverse().map(assessment => assessment.reading_score * 10),
        fill: false,
        backgroundColor: 'rgb(255, 206, 86)',
        borderColor: 'rgba(255, 206, 86, 0.2)',
        hidden: true
      },
      {
        label: 'Writing',
        data: [...assessments].reverse().map(assessment => assessment.writing_score * 10),
        fill: false,
        backgroundColor: 'rgb(153, 102, 255)',
        borderColor: 'rgba(153, 102, 255, 0.2)',
        hidden: true
      },
      {
        label: 'Typing',
        data: [...assessments].reverse().map(assessment => assessment.typing_score * 10),
        fill: false,
        backgroundColor: 'rgb(255, 159, 64)',
        borderColor: 'rgba(255, 159, 64, 0.2)',
        hidden: true
      },
      {
        label: 'Maths',
        data: [...assessments].reverse().map(assessment => assessment.maths_score * 10),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        hidden: true
      },
      {
        label: 'Digital Competence',
        data: [...assessments].reverse().map(assessment => assessment.digital_competence_score * 10),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        hidden: true
      },
      {
        label: 'Sports',
        data: [...assessments].reverse().map(assessment => assessment.sports_score * 10),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        hidden: true
      },
      {
        label: 'Character',
        data: [...assessments].reverse().map(assessment => assessment.character_score * 10),
        fill: false,
        backgroundColor: 'rgb(255, 206, 86)',
        borderColor: 'rgba(255, 206, 86, 0.2)',
        hidden: true
      },
      {
        label: 'Hygiene',
        data: [...assessments].reverse().map(assessment => assessment.hygiene_score * 10),
        fill: false,
        backgroundColor: 'rgb(153, 102, 255)',
        borderColor: 'rgba(153, 102, 255, 0.2)',
        hidden: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Capability Progress Over Time',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  // Helper function to get badge color based on score
  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'info';
    if (score >= 30) return 'warning';
    return 'danger';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Assessment History: {student.name}</h2>
        <div>
          <Button variant="secondary" className="me-2" onClick={() => navigate(`/students/${id}`)}>
            Back to Profile
          </Button>
          <Link to={`/students/${id}/assessments/new`}>
            <Button variant="primary">New Assessment</Button>
          </Link>
        </div>
      </div>

      {assessments.length === 0 ? (
        <div className="alert alert-info">
          No assessments found for this student. Create a new assessment to get started.
        </div>
      ) : (
        <>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-3">Progress Chart</h4>
              <Line data={chartData} options={chartOptions} />
              <div className="text-muted text-center mt-2">
                <small>Click on legend items to show/hide specific categories</small>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h4 className="mb-3">All Assessments</h4>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Overall Score</th>
                      <th>Speaking</th>
                      <th>Listening</th>
                      <th>Reading</th>
                      <th>Writing</th>
                      <th>Typing</th>
                      <th>Maths</th>
                      <th>Digital</th>
                      <th>Sports</th>
                      <th>Character</th>
                      <th>Hygiene</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td>{formatDate(assessment.assessment_date)}</td>
                        <td>
                          <Badge bg={getScoreBadgeColor(assessment.capability_percentage)}>
                            {Math.round(assessment.capability_percentage)}%
                          </Badge>
                        </td>
                        <td>{assessment.speaking_score}</td>
                        <td>{assessment.listening_score}</td>
                        <td>{assessment.reading_score}</td>
                        <td>{assessment.writing_score}</td>
                        <td>{assessment.typing_score}</td>
                        <td>{assessment.maths_score}</td>
                        <td>{assessment.digital_competence_score}</td>
                        <td>{assessment.sports_score}</td>
                        <td>{assessment.character_score}</td>
                        <td>{assessment.hygiene_score}</td>
                        <td>
                          {assessment.notes ? (
                            <Button 
                              variant="link" 
                              size="sm" 
                              onClick={() => {
                                setCurrentNotes(assessment.notes);
                                setCurrentAssessmentDate(assessment.assessment_date);
                                setShowNotesModal(true);
                              }}
                            >
                              View
                            </Button>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
      
      {/* Notes Modal */}
      <Modal 
        show={showNotesModal} 
        onHide={() => setShowNotesModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Assessment Notes - {formatDate(currentAssessmentDate)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ whiteSpace: 'pre-wrap' }}>{currentNotes}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssessmentHistory;
