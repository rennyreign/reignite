import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import HomePage from './components/HomePage';
import StudentList from './components/StudentList';
import StudentProfile from './components/StudentProfile';
import AddEditStudent from './components/AddEditStudent';
import AddAssessment from './components/AddAssessment';
import AssessmentHistory from './components/AssessmentHistory';
import NewCheckin from './components/NewCheckin';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<StudentList />} />
          <Route path="/students/new" element={<AddEditStudent />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/students/:id/edit" element={<AddEditStudent />} />
          <Route path="/students/:id/checkin" element={<NewCheckin />} />
          <Route path="/students/:id/assessments/new" element={<AddAssessment />} />
          <Route path="/students/:id/assessments" element={<AssessmentHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
