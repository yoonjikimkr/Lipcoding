# Mentor-Mentee Matching App Backend

## How to run

1. Install dependencies (already done):
   
   ```sh
   pip install fastapi uvicorn[standard] python-multipart pydantic sqlalchemy alembic passlib[bcrypt] python-jose
   ```

2. Start the FastAPI server:

   ```sh
   uvicorn main:app --reload
   ```

The API will be available at http://127.0.0.1:8000
