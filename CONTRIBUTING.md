# Contributing to Reignite

Thank you for your interest in contributing to Reignite! This project helps families track and celebrate their children's growth across multiple capability domains.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.6+
- Git

### Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/reignite.git`
3. Install dependencies:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   ```

## Development Workflow

### Backend Development
- The Flask backend is in the `backend/` directory
- Run with: `python app.py`
- Database models are in `models.py`
- API routes are in `server.py`

### Frontend Development
- The React frontend is in the `frontend/` directory
- Run with: `npm start`
- Components are organized in `src/components/`

### Running the Full Application
Use the provided script: `./start_app.sh`

## Code Style

### Python
- Follow PEP 8 guidelines
- Use meaningful variable names
- Add docstrings to functions and classes

### JavaScript/React
- Use functional components with hooks
- Follow consistent naming conventions
- Use meaningful component and variable names

## Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Commit with clear messages: `git commit -m "Add: brief description of changes"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Pull Request Guidelines

- Provide a clear description of the changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Reference any related issues

## Reporting Issues

When reporting bugs or requesting features:
- Use clear, descriptive titles
- Provide steps to reproduce (for bugs)
- Include system information
- Add screenshots if applicable

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing to Reignite!
