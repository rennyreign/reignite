from datetime import datetime
from app import db

class Student(db.Model):
    """Student model representing a child being assessed"""
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True)
    profile_image = db.Column(db.String(255), nullable=True)  # Path to profile image
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with assessments
    assessments = db.relationship("Assessment", back_populates="student", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Student(id={self.id}, name='{self.name}')>"
    
    def to_dict(self):
        """Convert student object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'profile_image': self.profile_image,
            'created_at': self.created_at.isoformat()
        }


class Assessment(db.Model):
    """Assessment model representing a capability assessment for a student"""
    __tablename__ = 'assessments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    assessment_date = db.Column(db.Date, default=datetime.utcnow().date)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Scores for each category (0-10)
    speaking_score = db.Column(db.Integer, default=0)
    listening_score = db.Column(db.Integer, default=0)
    reading_score = db.Column(db.Integer, default=0)
    writing_score = db.Column(db.Integer, default=0)
    typing_score = db.Column(db.Integer, default=0)
    maths_score = db.Column(db.Integer, default=0)
    digital_competence_score = db.Column(db.Integer, default=0)
    sports_score = db.Column(db.Integer, default=0)
    character_score = db.Column(db.Integer, default=0)
    hygiene_score = db.Column(db.Integer, default=0)
    
    # Overall capability percentage (calculated)
    capability_percentage = db.Column(db.Float, default=0.0)
    
    # Relationship with student
    student = db.relationship("Student", back_populates="assessments")
    
    def __repr__(self):
        return f"<Assessment(id={self.id}, student_id={self.student_id}, date='{self.assessment_date}')>"
    
    def calculate_capability_percentage(self):
        """Calculate the overall capability percentage based on all scores"""
        total_score = (
            self.speaking_score +
            self.listening_score +
            self.reading_score +
            self.writing_score +
            self.typing_score +
            self.maths_score +
            self.digital_competence_score +
            self.sports_score +
            self.character_score +
            self.hygiene_score
        )
        # Maximum possible score is 100 (10 categories * 10 points)
        self.capability_percentage = (total_score / 100) * 100
        return self.capability_percentage
    
    def to_dict(self):
        """Convert assessment object to dictionary"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'assessment_date': self.assessment_date.isoformat(),
            'notes': self.notes,
            'speaking_score': self.speaking_score,
            'listening_score': self.listening_score,
            'reading_score': self.reading_score,
            'writing_score': self.writing_score,
            'typing_score': self.typing_score,
            'maths_score': self.maths_score,
            'digital_competence_score': self.digital_competence_score,
            'sports_score': self.sports_score,
            'character_score': self.character_score,
            'hygiene_score': self.hygiene_score,
            'capability_percentage': self.capability_percentage,
            'created_at': self.created_at.isoformat()
        }