import pytest
from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def test_profile_flow():
    unique = str(uuid.uuid4())[:8]
    email = f"mentee_{unique}@example.com"
    # 1. Signup as mentee
    signup_data = {"email": email, "password": "testpass", "name": "멘티투", "role": "mentee"}
    r = client.post("/api/signup", json=signup_data)
    assert r.status_code == 201 or r.status_code == 200
    # 2. Login as mentee
    login_data = {"email": email, "password": "testpass"}
    r = client.post("/api/login", json=login_data)
    assert r.status_code == 200
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    # 3. Get profile (should be empty/default)
    r = client.get("/api/me", headers=headers)
    assert r.status_code == 200
    # 4. Update profile (not implemented in API spec, so skip)
    # 5. Get profile again (should be updated)
    # r = client.get("/api/me", headers=headers)
    # assert r.status_code == 200
    # assert r.json()["profile"]["name"] == "멘티투"
