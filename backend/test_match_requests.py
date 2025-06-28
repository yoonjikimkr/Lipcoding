import pytest
from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def test_match_request_flow():
    unique = str(uuid.uuid4())[:8]
    mentor_email = f"mentor_{unique}@example.com"
    mentee_email = f"mentee_{unique}@example.com"
    # Signup mentor
    mentor_data = {"email": mentor_email, "password": "testpass", "name": "멘토1", "role": "mentor"}
    client.post("/api/signup", json=mentor_data)
    # Signup mentee
    mentee_data = {"email": mentee_email, "password": "testpass", "name": "멘티1", "role": "mentee"}
    client.post("/api/signup", json=mentee_data)
    # Login as mentee
    r = client.post("/api/login", json={"email": mentee_email, "password": "testpass"})
    mentee_token = r.json()["token"]
    mentee_headers = {"Authorization": f"Bearer {mentee_token}"}
    # Get mentor id
    r = client.get("/api/mentors", headers=mentee_headers)
    mentor_id = r.json()[0]["id"]
    # Send match request
    req_data = {"mentorId": mentor_id, "menteeId": None, "message": "멘토링 받고 싶어요!"}
    r = client.post("/api/match-requests", json=req_data, headers=mentee_headers)
    assert r.status_code == 200
    match_id = r.json()["id"]
    # Login as mentor
    r = client.post("/api/login", json={"email": mentor_email, "password": "testpass"})
    mentor_token = r.json()["token"]
    mentor_headers = {"Authorization": f"Bearer {mentor_token}"}
    # Mentor accepts request
    r = client.put(f"/api/match-requests/{match_id}/accept", headers=mentor_headers)
    assert r.status_code == 200
    # Mentor rejects request (should fail, already accepted)
    r = client.put(f"/api/match-requests/{match_id}/reject", headers=mentor_headers)
    assert r.status_code in (400, 404)
    # Mentee cancels request (should fail, already accepted)
    r = client.delete(f"/api/match-requests/{match_id}", headers=mentee_headers)
    assert r.status_code in (400, 404)
