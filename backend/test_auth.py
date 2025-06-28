import pytest
from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def test_signup_and_login():
    unique = str(uuid.uuid4())[:8]
    email = f"testuser_{unique}@example.com"
    password = "testpass123"
    name = "테스트유저"
    role = "mentee"

    # Signup
    resp = client.post("/api/signup", json={"email": email, "password": password, "name": name, "role": role})
    assert resp.status_code == 201 or resp.status_code == 200

    # Login
    resp = client.post("/api/login", json={"email": email, "password": password})
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
