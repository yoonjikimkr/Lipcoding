# Mentor-Mentee Matching App

## How to Run

### Backend (FastAPI)

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Start the backend server:
   ```bash
   uvicorn backend.main:app --reload --port 8080
   ```
   - The API will be available at http://localhost:8080/api
   - Swagger UI: http://localhost:8080/docs

### Frontend (React)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend server:
   ```bash
   npm start
   ```
   - The app will be available at http://localhost:3000

### Automated Tests (Backend)

1. From the project root, run:
   ```bash
   pytest backend
   ```

---

- Make sure both servers are running for full functionality.
- For any issues, check the terminal output for error messages.
