from flask import request, jsonify
from app import app, db
from models import Student, Assessment
from datetime import datetime

# Routes for Students
@app.route('/api/students', methods=['GET'])
def get_students():
    """Get all students"""
    students = Student.query.all()
    return jsonify([student.to_dict() for student in students])

@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Get a specific student by ID"""
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(student.to_dict())

@app.route('/api/students', methods=['POST'])
def create_student():
    """Create a new student"""
    data = request.json
    
    # Validate required fields
    if 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400
    
    # Parse date of birth if provided
    dob = None
    if 'date_of_birth' in data and data['date_of_birth']:
        try:
            dob = datetime.fromisoformat(data['date_of_birth'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format for date_of_birth'}), 400
    
    # Create new student
    student = Student(
        name=data['name'],
        date_of_birth=dob,
        profile_image=data.get('profile_image')
    )
    
    db.session.add(student)
    db.session.commit()
    
    return jsonify(student.to_dict()), 201

@app.route('/api/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    """Update an existing student"""
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.json
    
    # Update fields if provided
    if 'name' in data:
        student.name = data['name']
    
    if 'date_of_birth' in data and data['date_of_birth']:
        try:
            student.date_of_birth = datetime.fromisoformat(data['date_of_birth'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format for date_of_birth'}), 400
    
    if 'profile_image' in data:
        student.profile_image = data['profile_image']
    
    db.session.commit()
    
    return jsonify(student.to_dict())

@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete a student"""
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    db.session.delete(student)
    db.session.commit()
    
    return jsonify({'message': 'Student deleted successfully'})

# Routes for Assessments
@app.route('/api/students/<int:student_id>/assessments', methods=['GET'])
def get_student_assessments(student_id):
    """Get all assessments for a student"""
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    assessments = Assessment.query.filter_by(student_id=student_id).all()
    return jsonify([assessment.to_dict() for assessment in assessments])

@app.route('/api/assessments/<int:assessment_id>', methods=['GET'])
def get_assessment(assessment_id):
    """Get a specific assessment by ID"""
    assessment = Assessment.query.filter_by(id=assessment_id).first()
    if not assessment:
        return jsonify({'error': 'Assessment not found'}), 404
    return jsonify(assessment.to_dict())

@app.route('/api/students/<int:student_id>/assessments', methods=['POST'])
def create_assessment(student_id):
    """Create a new assessment for a student"""
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    data = request.json
    
    # Create new assessment
    assessment = Assessment(
        student_id=student_id,
        notes=data.get('notes'),
        speaking_score=data.get('speaking_score', 0),
        listening_score=data.get('listening_score', 0),
        reading_score=data.get('reading_score', 0),
        writing_score=data.get('writing_score', 0),
        typing_score=data.get('typing_score', 0),
        maths_score=data.get('maths_score', 0),
        digital_competence_score=data.get('digital_competence_score', 0),
        sports_score=data.get('sports_score', 0),
        character_score=data.get('character_score', 0),
        hygiene_score=data.get('hygiene_score', 0)
    )
    
    # Calculate capability percentage
    assessment.calculate_capability_percentage()
    
    db.session.add(assessment)
    db.session.commit()
    
    return jsonify(assessment.to_dict()), 201

@app.route('/api/assessments/<int:assessment_id>', methods=['PUT'])
def update_assessment(assessment_id):
    """Update an existing assessment"""
    assessment = Assessment.query.filter_by(id=assessment_id).first()
    if not assessment:
        return jsonify({'error': 'Assessment not found'}), 404
    
    data = request.json
    
    # Update scores if provided
    if 'speaking_score' in data:
        assessment.speaking_score = data['speaking_score']
    if 'listening_score' in data:
        assessment.listening_score = data['listening_score']
    if 'reading_score' in data:
        assessment.reading_score = data['reading_score']
    if 'writing_score' in data:
        assessment.writing_score = data['writing_score']
    if 'typing_score' in data:
        assessment.typing_score = data['typing_score']
    if 'maths_score' in data:
        assessment.maths_score = data['maths_score']
    if 'digital_competence_score' in data:
        assessment.digital_competence_score = data['digital_competence_score']
    if 'sports_score' in data:
        assessment.sports_score = data['sports_score']
    if 'character_score' in data:
        assessment.character_score = data['character_score']
    if 'hygiene_score' in data:
        assessment.hygiene_score = data['hygiene_score']
    if 'notes' in data:
        assessment.notes = data['notes']
    
    # Recalculate capability percentage
    assessment.calculate_capability_percentage()
    
    db.session.commit()
    
    return jsonify(assessment.to_dict())

@app.route('/api/assessments/<int:assessment_id>', methods=['DELETE'])
def delete_assessment(assessment_id):
    """Delete an assessment"""
    assessment = Assessment.query.filter_by(id=assessment_id).first()
    if not assessment:
        return jsonify({'error': 'Assessment not found'}), 404
    
    db.session.delete(assessment)
    db.session.commit()
    
    return jsonify({'message': 'Assessment deleted successfully'})

# Route to get student statistics
@app.route('/api/students/<int:student_id>/statistics', methods=['GET'])
def get_student_statistics(student_id):
    """Get statistics for a student"""
    student = Student.query.filter_by(id=student_id).first()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    
    assessments = Assessment.query.filter_by(student_id=student_id).all()
    
    if not assessments:
        return jsonify({
            'latest_assessment': None,
            'average_capability': 0,
            'assessment_count': 0,
            'trend_data': []
        })
    
    # Get latest assessment
    latest_assessment = max(assessments, key=lambda a: a.assessment_date)
    
    # Calculate average capability
    avg_capability = sum(a.capability_percentage for a in assessments) / len(assessments)
    
    # Create trend data (date and capability percentage)
    trend_data = [
        {
            'date': a.assessment_date.isoformat(),
            'capability_percentage': a.capability_percentage
        }
        for a in sorted(assessments, key=lambda a: a.assessment_date)
    ]
    
    return jsonify({
        'latest_assessment': latest_assessment.to_dict(),
        'average_capability': avg_capability,
        'assessment_count': len(assessments),
        'trend_data': trend_data
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)