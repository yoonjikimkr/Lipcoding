// Simple API utility for connecting to FastAPI backend
const API_URL = 'http://localhost:8080/api';

export async function signup(data: { email: string; password: string; name: string; role: string }) {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Placeholder for freeze feature
export function freezeActions() {
  // This can be expanded to disable UI/actions
  alert('Actions are currently frozen.');
}

export function saveToken(token: string) {
  localStorage.setItem('access_token', token);
}

export function getToken() {
  return localStorage.getItem('access_token');
}

export async function authFetch(url: string, options: any = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
}

export async function getProfile() {
  const res = await authFetch('http://localhost:8080/api/profile');
  return res.json();
}

export async function updateProfile(data: { name: string; bio: string; skillsets?: string; file?: File | null } | FormData) {
  let formData: FormData;
  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio);
    if (data.skillsets !== undefined) formData.append('skillsets', data.skillsets);
    if (data.file) formData.append('file', data.file);
  }
  const res = await authFetch('http://localhost:8080/api/profile', {
    method: 'PUT',
    body: formData,
  });
  return res.json();
}

export async function getMentors(params: { skill?: string; orderBy?: string } = {}) {
  const url = new URL('http://localhost:8080/api/mentors');
  if (params.skill) url.searchParams.append('skill', params.skill);
  if (params.orderBy) url.searchParams.append('orderBy', params.orderBy);
  const res = await authFetch(url.toString());
  return res.json();
}

export async function sendRequest(mentor_id: number, message: string) {
  const res = await authFetch('http://localhost:8080/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mentor_id, message }),
  });
  return res.json();
}

export async function getRequests() {
  const res = await authFetch('http://localhost:8080/api/requests');
  return res.json();
}

export async function acceptRequest(request_id: number) {
  const res = await authFetch(`http://localhost:8080/api/requests/${request_id}/accept`, { method: 'PUT' });
  return res.json();
}

export async function rejectRequest(request_id: number) {
  const res = await authFetch(`http://localhost:8080/api/requests/${request_id}/reject`, { method: 'PUT' });
  return res.json();
}

export async function cancelRequest(request_id: number) {
  const res = await authFetch(`http://localhost:8080/api/requests/${request_id}`, { method: 'DELETE' });
  return res.json();
}
