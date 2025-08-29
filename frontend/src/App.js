import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Material UI
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Components
import Header from './components/Header';
import HomePage from './components/HomePage';
import StudentList from './components/StudentList';
import StudentProfile from './components/StudentProfile';
import AddEditStudent from './components/AddEditStudent';
import AddAssessment from './components/AddAssessment';
import AssessmentHistory from './components/AssessmentHistory';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={
            <Container className="mt-4">
              <StudentList />
            </Container>
          } />
          <Route path="/students/new" element={
            <Container className="mt-4">
              <AddEditStudent />
            </Container>
          } />
          <Route path="/students/:id" element={
            <Container className="mt-4">
              <StudentProfile />
            </Container>
          } />
          <Route path="/students/:id/edit" element={
            <Container className="mt-4">
              <AddEditStudent />
            </Container>
          } />
          <Route path="/students/:id/assessments/new" element={
            <Container className="mt-4">
              <AddAssessment />
            </Container>
          } />
          <Route path="/students/:id/assessments" element={
            <Container className="mt-4">
              <AssessmentHistory />
            </Container>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
