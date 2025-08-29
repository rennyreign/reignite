from app import app, db
from models import Student, Assessment
from datetime import datetime, timedelta
import random

# Sample student data
students = [
    {
        "name": "John Smith",
        "date_of_birth": datetime(2015, 5, 15),
        "profile_image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzM0OThkYiI+PC9yZWN0Pjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+SlM8L3RleHQ+PC9zdmc+"
    },
    {
        "name": "Emma Johnson",
        "date_of_birth": datetime(2016, 8, 22),
        "profile_image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzI3YWU2MCI+PC9yZWN0Pjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+RUo8L3RleHQ+PC9zdmc+"
    },
    {
        "name": "Michael Brown",
        "date_of_birth": datetime(2014, 3, 10),
        "profile_image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U3NGMzYyI+PC9yZWN0Pjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+TUI8L3RleHQ+PC9zdmc+"
    }
]

# Function to generate random assessment data
def generate_assessment(student_id, date):
    return {
        "student_id": student_id,
        "assessment_date": date,
        "notes": f"Assessment for {date.strftime('%B %Y')}",
        "speaking_score": random.randint(3, 10),
        "listening_score": random.randint(3, 10),
        "reading_score": random.randint(3, 10),
        "writing_score": random.randint(3, 10),
        "typing_score": random.randint(3, 10),
        "maths_score": random.randint(3, 10),
        "digital_competence_score": random.randint(3, 10),
        "sports_score": random.randint(3, 10),
        "character_score": random.randint(3, 10),
        "hygiene_score": random.randint(3, 10)
    }

# Main function to seed the database
def seed_database():
    with app.app_context():
        # Clear existing data
        Assessment.query.delete()
        Student.query.delete()
        db.session.commit()
        
        print("Cleared existing data")
        
        # Add students
        student_objects = []
        for student_data in students:
            student = Student(
                name=student_data["name"],
                date_of_birth=student_data["date_of_birth"],
                profile_image=student_data["profile_image"]
            )
            db.session.add(student)
            db.session.flush()  # Flush to get the ID
            student_objects.append(student)
            print(f"Added student: {student.name}")
        
        # Add assessments for each student (past 6 months)
        today = datetime.now().date()
        for student in student_objects:
            for i in range(6):
                assessment_date = today - timedelta(days=30 * i)
                assessment_data = generate_assessment(student.id, assessment_date)
                
                assessment = Assessment(
                    student_id=assessment_data["student_id"],
                    assessment_date=assessment_data["assessment_date"],
                    notes=assessment_data["notes"],
                    speaking_score=assessment_data["speaking_score"],
                    listening_score=assessment_data["listening_score"],
                    reading_score=assessment_data["reading_score"],
                    writing_score=assessment_data["writing_score"],
                    typing_score=assessment_data["typing_score"],
                    maths_score=assessment_data["maths_score"],
                    digital_competence_score=assessment_data["digital_competence_score"],
                    sports_score=assessment_data["sports_score"],
                    character_score=assessment_data["character_score"],
                    hygiene_score=assessment_data["hygiene_score"]
                )
                
                # Calculate capability percentage
                assessment.calculate_capability_percentage()
                
                db.session.add(assessment)
                print(f"Added assessment for {student.name} on {assessment_date}")
        
        # Commit all changes
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()