# Capability Tracker

A web application for tracking and assessing student capabilities across multiple categories. This application allows assessors to score students based on 10 different capability categories, each with detailed scoring criteria from 0-10.

## Features

- Add/edit student profiles with name, date of birth, and profile image
- Create new assessments with scores across 10 capability categories
- View detailed scoring criteria for each category while assessing
- Automatically calculate overall capability percentage
- View student profiles with latest assessment scores
- Track progress over time with interactive charts
- View assessment history and trends

## Categories Assessed

1. **Speaking** – Fluency, vocabulary, clarity, and verbal confidence
2. **Listening** – Attention, comprehension, and responsive understanding
3. **Reading** – Fluency, comprehension, and critical thinking
4. **Writing** – Expression, grammar, structure, and creativity
5. **Typing** – Speed, accuracy, and digital fluency
6. **Maths** – Arithmetic, logic, and applied problem-solving
7. **Digital Competence** – Use of digital tools, navigation, and problem-solving
8. **Sports** – Physical ability, teamwork, coordination, and interest
9. **Character** – Integrity, reflection, self-awareness, and responsibility
10. **Hygiene** – Cleanliness, grooming, style, and care of personal space

## Tech Stack

- **Frontend**: React, React Router, Bootstrap, Chart.js
- **Backend**: Flask, SQLAlchemy
- **Database**: SQLite (for simplicity, can be upgraded to PostgreSQL/MySQL)

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.6+

### Installation

1. Clone the repository
2. Set up the backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

3. Set up the frontend:

```bash
cd frontend
npm install
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Create student profiles with basic information
2. Add assessments for each student using the detailed scoring criteria
3. View student progress over time through the profile page
4. Track historical assessments and trends

## Data Storage

Student profiles and assessments are stored in a SQLite database. In a production environment, you may want to upgrade to a more robust database solution.

## Future Enhancements

- User authentication and role-based access
- PDF report generation
- Email notifications for assessment updates
- Multiple assessor support with comparison views
- Custom category creation
