import pytest
from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def test_mentor_filter_and_sort():
    unique = str(uuid.uuid4())[:8]
    mentor_email = f"mentor_{unique}@example.com"
    mentee_email = f"mentee_{unique}@example.com"
    # Signup as mentor with skills
    mentor_data = {"email": mentor_email, "password": "testpass", "name": "멘토1", "role": "mentor"}
    client.post("/api/signup", json=mentor_data)
    # Update mentor profile with skills
    login_data = {"email": mentor_email, "password": "testpass"}
    r = client.post("/api/login", json=login_data)
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    update_data = {"id": 1, "name": "멘토1", "role": "mentor", "bio": "테스트", "image": None, "skills": ["React", "Vue"]}
    client.put("/api/profile", json=update_data, headers=headers)
    # Signup as mentee
    mentee_data = {"email": mentee_email, "password": "testpass", "name": "멘티3", "role": "mentee"}
    client.post("/api/signup", json=mentee_data)
    # Login as mentee
    login_data = {"email": mentee_email, "password": "testpass"}
    r = client.post("/api/login", json=login_data)
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    # Filter by skill
    r = client.get("/api/mentors?skill=React", headers=headers)
    assert r.status_code == 200
    mentors = r.json()
    assert any("React" in m["profile"]["skills"] for m in mentors)
    # Sort by name
    r = client.get("/api/mentors?order_by=name", headers=headers)
    assert r.status_code == 200
