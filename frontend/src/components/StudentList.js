import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { studentService } from '../services/localStorageService';
import { formatDate } from '../utils/dateFormatter';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      console.log('Fetching students from local storage...');
      const data = studentService.getAll();
      console.log('Local storage data:', data);
      setStudents(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(`Failed to fetch students: ${err.message}`);
      setLoading(false);
    }
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Re-fetch students from local storage
    try {
      const data = studentService.getAll();
      setStudents(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(`Failed to fetch students: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h5" sx={{ mt: 3 }}>Loading students...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <Typography>{error}</Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleRetry} variant="outlined" color="error">
              Retry
            </Button>
          </Box>
        </Alert>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Troubleshooting:</Typography>
          <ol>
            <li>Make sure the backend server is running on port 5000</li>
            <li>Check if the database has been initialized properly</li>
            <li>Verify that CORS is enabled on the backend</li>
          </ol>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Student Profiles</Typography>
        <Button 
          component={Link} 
          to="/students/new" 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
        >
          Add New Student
        </Button>
      </Box>

      {students.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>No students found</AlertTitle>
          <Typography>Add a new student to get started with capability tracking.</Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              component={Link} 
              to="/students/new" 
              variant="outlined" 
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Student
            </Button>
          </Box>
        </Alert>
      ) : (
        <Row>
          {students.map((student) => (
            <Col key={student.id} md={4} className="mb-4">
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar 
                      src={student.profile_image || undefined} 
                      alt={student.name}
                      sx={{ width: 56, height: 56, bgcolor: 'secondary.main' }}
                    >
                      {!student.profile_image && student.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6">{student.name}</Typography>
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Date of Birth: {student.date_of_birth ? formatDate(student.date_of_birth) : 'Not specified'}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ mt: 'auto', p: 2, pt: 0 }}>
                  <Button 
                    component={Link} 
                    to={`/students/${student.id}`} 
                    variant="outlined" 
                    fullWidth
                    startIcon={<PersonIcon />}
                  >
                    View Profile
                  </Button>
                </CardActions>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default StudentList;
