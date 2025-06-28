import pytest
from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def test_mentor_list():
    unique = str(uuid.uuid4())[:8]
    mentor_email = f"mentor_{unique}@example.com"
    mentee_email = f"mentee_{unique}@example.com"
    # Signup as mentor
    mentor_data = {"email": mentor_email, "password": "testpass", "name": "멘토1", "role": "mentor"}
    client.post("/api/signup", json=mentor_data)
    # Signup as mentee
    mentee_data = {"email": mentee_email, "password": "testpass", "name": "멘티3", "role": "mentee"}
    client.post("/api/signup", json=mentee_data)
    # Login as mentee
    login_data = {"email": mentee_email, "password": "testpass"}
    r = client.post("/api/login", json=login_data)
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    # Get mentor list
    r = client.get("/api/mentors", headers=headers)
    assert r.status_code == 200
    mentors = r.json()
    assert any(m["email"] == mentor_email for m in mentors)
