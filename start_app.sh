#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd backend
python run.py &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Start the frontend server
echo "Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Register the cleanup function for when the script is terminated
trap cleanup INT TERM

# Keep the script running
echo "Both servers are running. Press Ctrl+C to stop."
wait
