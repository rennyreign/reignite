import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Container, Alert, Modal } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { studentService, statisticsService } from '../services/localStorageService';
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

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      
      // Get student statistics from local storage
      const statisticsData = statisticsService.getStudentStatistics(id);
      setStatistics(statisticsData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError(`Failed to fetch student data: ${err.message}`);
      setLoading(false);
    }
  }, [id]);
  
  const handleDeleteStudent = () => {
    try {
      studentService.delete(id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting student:', err);
      setError(`Failed to delete student: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading student profile...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  if (!student) {
    return <div className="alert alert-warning mt-3">Student not found.</div>;
  }

  // Prepare chart data if statistics are available
  const chartData = statistics && statistics.trend_data && statistics.trend_data.length > 0 ? {
    labels: statistics.trend_data.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Capability %',
        data: statistics.trend_data.map(item => item.capability_percentage),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  } : null;

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

  // Group assessment categories
  const latestAssessment = statistics?.latest_assessment;
  
  const communicationCategories = latestAssessment ? [
    { name: 'Speaking', score: latestAssessment.speaking_score },
    { name: 'Listening', score: latestAssessment.listening_score },
    { name: 'Reading', score: latestAssessment.reading_score },
    { name: 'Writing', score: latestAssessment.writing_score },
  ] : [];
  
  const thinkingCategories = latestAssessment ? [
    { name: 'Maths', score: latestAssessment.maths_score },
    { name: 'Digital Competence', score: latestAssessment.digital_competence_score },
    { name: 'Typing', score: latestAssessment.typing_score },
  ] : [];
  
  const physicalCategories = latestAssessment ? [
    { name: 'Sports', score: latestAssessment.sports_score },
    { name: 'Character', score: latestAssessment.character_score },
    { name: 'Hygiene', score: latestAssessment.hygiene_score },
  ] : [];

  // Helper function to render category scores
  const renderCategoryScores = (categories) => {
    return categories.map((category, index) => (
      <div key={index} className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>{category.name}</span>
          <Badge bg={getScoreBadgeColor(category.score)}>{category.score}/10</Badge>
        </div>
        <div className="progress">
          <div 
            className={`progress-bar bg-${getScoreBadgeColor(category.score)}`} 
            role="progressbar" 
            style={{ width: `${category.score * 10}%` }}
            aria-valuenow={category.score} 
            aria-valuemin="0" 
            aria-valuemax="10"
          />
        </div>
      </div>
    ));
  };

  // Helper function to get badge color based on score
  const getScoreBadgeColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'info';
    if (score >= 3) return 'warning';
    return 'danger';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Profile</h2>
        <div>
          <Link to={`/students/${id}/edit`} className="me-2">
            <Button variant="outline-primary">Edit Profile</Button>
          </Link>
          <Link to={`/students/${id}/assessments/new`} className="me-2">
            <Button variant="primary">New Assessment</Button>
          </Link>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete Student
          </Button>
        </div>
      </div>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <div 
                  className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center mx-auto mb-3" 
                  style={{ width: '100px', height: '100px', overflow: 'hidden' }}
                >
                  {student.profile_image ? (
                    <img 
                      src={student.profile_image} 
                      alt={student.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span className="fs-1">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h4>{student.name}</h4>
                <p className="text-muted">
                  Date of Birth: {student.date_of_birth ? formatDate(student.date_of_birth) : 'Not specified'}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-3">
                  <h5>Current Score</h5>
                  <div className="display-4 fw-bold">
                    {latestAssessment ? `${Math.round(latestAssessment.capability_percentage)}%` : 'N/A'}
                  </div>
                </div>

                <div className="mb-3">
                  <h5>Average Score</h5>
                  <div className="h4">
                    {statistics?.average_capability ? `${Math.round(statistics.average_capability)}%` : 'N/A'}
                  </div>
                </div>

                <div>
                  <h5>Assessments</h5>
                  <div className="h4">
                    {statistics?.assessment_count || 0}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Link to={`/students/${id}/assessments`} className="w-100">
            <Button variant="outline-secondary" className="w-100 mb-4">
              View Assessment History
            </Button>
          </Link>
        </Col>

        <Col md={8}>
          {latestAssessment ? (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <h4 className="mb-3">Latest Assessment</h4>
                  <p className="text-muted">
                    Date: {formatDate(latestAssessment.assessment_date)}
                  </p>
                  
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-3">Communication & Expression</h5>
                      {renderCategoryScores(communicationCategories)}
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-3">Thinking & Tech</h5>
                      {renderCategoryScores(thinkingCategories)}
                    </Col>
                  </Row>
                  
                  <Row className="mt-3">
                    <Col md={6}>
                      <h5 className="mb-3">Physical & Character</h5>
                      {renderCategoryScores(physicalCategories)}
                    </Col>
                    <Col md={6}>
                      {latestAssessment.notes && (
                        <>
                          <h5 className="mb-3">Notes</h5>
                          <p>{latestAssessment.notes}</p>
                        </>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {chartData && (
                <Card>
                  <Card.Body>
                    <h4 className="mb-3">Progress Chart</h4>
                    <Line data={chartData} options={chartOptions} />
                  </Card.Body>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <Card.Body className="text-center p-5">
                <h4 className="mb-3">No Assessments Yet</h4>
                <p>This student doesn't have any assessments yet.</p>
                <Link to={`/students/${id}/assessments/new`}>
                  <Button variant="primary">Create First Assessment</Button>
                </Link>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete {student?.name}'s profile?</p>
          <p className="text-danger"><strong>Warning:</strong> This will permanently delete the student profile and all associated assessment data. This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteStudent}>
            Delete Student
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentProfile;
