# User Story Coverage Checklist

| User Story (Summary)                                   | Implemented | Backend Tested | Frontend Tested | Code/Test Mapping |
|--------------------------------------------------------|:-----------:|:--------------:|:---------------:|-------------------|
| Sign up as mentor/mentee                               | ✅          | ✅             | ✅              | [`test_auth.py`](backend/test_auth.py), [`/api/signup`](backend/routers/auth.py), [`Signup.test.tsx`](frontend/src/pages/__tests__/Signup.test.tsx) |
| Login and JWT token                                    | ✅          | ✅             | ✅              | [`test_auth.py`](backend/test_auth.py), [`/api/login`](backend/routers/auth.py), [`Login.test.tsx`](frontend/src/pages/__tests__/Login.test.tsx) |
| View/update profile (mentor/mentee)                    | ✅          | ✅             | ⬜️              | [`test_profile.py`](backend/test_profile.py), [`/api/profile`](backend/routers/profile.py) |
| Mentor: register skills, bio, image                    | ✅          | ✅             | ⬜️              | [`test_profile.py`](backend/test_profile.py), [`/api/profile`](backend/routers/profile.py) |
| Mentee: view mentor list, filter/sort by skill         | ✅          | ✅             | ⬜️              | [`test_mentors.py`](backend/test_mentors.py), [`test_mentors_filter.py`](backend/test_mentors_filter.py), [`/api/mentors`](backend/routers/mentors.py) |
| Mentee: send match request with message                | ✅          | ✅             | ⬜️              | [`test_match_requests.py`](backend/test_match_requests.py), [`/api/match-requests`](backend/routers/requests.py) |
| Mentor: accept/reject requests, only one at a time     | ✅          | ✅             | ⬜️              | [`test_match_requests.py`](backend/test_match_requests.py), [`/api/match-requests/{id}/accept`](backend/routers/requests.py) |
| Mentee: cancel request, see request status             | ✅          | ✅             | ⬜️              | [`test_match_requests.py`](backend/test_match_requests.py), [`/api/match-requests/{id}`](backend/routers/requests.py) |
| Profile image upload/validation                        | ✅          | ✅             | ⬜️              | [`test_profile.py`](backend/test_profile.py), [`/api/profile`](backend/routers/profile.py) |
| UI elements have required IDs for testing              | ✅          |                | ⬜️              | See frontend code |

Legend: ✅ = Complete, ⬜️ = Not yet, 🚧 = In progress

---

## Mapping of User Stories to Code, Tests, and UI Sequences

### 1. 회원가입 (Sign up)
- **Backend:** [`backend/routers/auth.py`](backend/routers/auth.py) (`/api/signup`)
- **Test:** [`backend/test_auth.py`](backend/test_auth.py)
- **Frontend:** [`frontend/src/pages/Signup.tsx`](frontend/src/pages/Signup.tsx)
- **Sequence:**
    1. User navigates to `/signup` page.
    2. Fills in email, password, role (mentor/mentee).
    3. Clicks [Sign Up] (`id=signup`).
    4. On success, redirected to `/` (login page).

### 2. 로그인 (Login)
- **Backend:** [`backend/routers/auth.py`](backend/routers/auth.py) (`/api/login`)
- **Test:** [`backend/test_auth.py`](backend/test_auth.py)
- **Frontend:** [`frontend/src/pages/Login.tsx`](frontend/src/pages/Login.tsx)
- **Sequence:**
    1. User navigates to `/login`.
    2. Fills in email, password.
    3. Clicks [Login] (`id=login`).
    4. On success, redirected to `/profile`.
    5. JWT token stored in frontend (localStorage/cookie).

### 3. 사용자 프로필 (Profile)
- **Backend:** [`backend/routers/profile.py`](backend/routers/profile.py) (`/api/profile`)
- **Test:** [`backend/test_profile.py`](backend/test_profile.py)
- **Frontend:** [`frontend/src/pages/Profile.tsx`](frontend/src/pages/Profile.tsx)
- **Sequence:**
    1. User navigates to `/profile`.
    2. Sees current profile info (name, bio, image, skills).
    3. Edits info and uploads image (`id=profile-photo`).
    4. Clicks [Save] (`id=save`).
    5. Changes are saved via `/api/profile`.

### 4. 멘토 목록 조회 (Mentor List)
- **Backend:** [`backend/routers/mentors.py`](backend/routers/mentors.py) (`/api/mentors`)
- **Test:** [`backend/test_mentors.py`](backend/test_mentors.py), [`backend/test_mentors_filter.py`](backend/test_mentors_filter.py)
- **Frontend:** [`frontend/src/pages/Mentors.tsx`](frontend/src/pages/Mentors.tsx)
- **Sequence:**
    1. Mentee navigates to `/mentors`.
    2. Sees mentor list (`class=mentor`).
    3. Searches by skill (`id=search`).
    4. Sorts by name/skill (`id=name`, `id=skill`).

### 5. 매칭 요청 (Match Request)
- **Backend:** [`backend/routers/requests.py`](backend/routers/requests.py) (`/api/match-requests`)
- **Test:** [`backend/test_match_requests.py`](backend/test_match_requests.py)
- **Frontend:** [`frontend/src/pages/Requests.tsx`](frontend/src/pages/Requests.tsx)
- **Sequence:**
    1. Mentee clicks [Request] (`id=request`) on mentor card.
    2. Fills message (`id=message`).
    3. Sends request to mentor.
    4. Request status shown on `/requests` page.

### 6. 매칭 요청 수락/거절 (Accept/Reject Request)
- **Backend:** [`backend/routers/requests.py`](backend/routers/requests.py) (`/api/match-requests/{id}/accept`, `/api/match-requests/{id}/reject`)
- **Test:** [`backend/test_match_requests.py`](backend/test_match_requests.py)
- **Frontend:** [`frontend/src/pages/Requests.tsx`](frontend/src/pages/Requests.tsx)
- **Sequence:**
    1. Mentor navigates to `/requests`.
    2. Sees incoming requests (`class=request-message`).
    3. Clicks [Accept] (`id=accept`) or [Reject] (`id=reject`).
    4. Status updates for mentee and mentor.

### 7. 매칭 요청 목록/취소 (Request List/Cancel)
- **Backend:** [`backend/routers/requests.py`](backend/routers/requests.py) (`/api/match-requests/incoming`, `/api/match-requests/outgoing`, `/api/match-requests/{id}`)
- **Test:** [`backend/test_match_requests.py`](backend/test_match_requests.py)
- **Frontend:** [`frontend/src/pages/Requests.tsx`](frontend/src/pages/Requests.tsx)
- **Sequence:**
    1. Mentee navigates to `/requests`.
    2. Sees outgoing requests and their status (`id=request-status`).
    3. Can cancel request before acceptance (`id=request-cancel`).

### 8. 프로필 이미지 업로드/검증 (Profile Image Upload/Validation)
- **Backend:** [`backend/routers/profile.py`](backend/routers/profile.py) (`/api/profile`)
- **Test:** [`backend/test_profile.py`](backend/test_profile.py)
- **Frontend:** [`frontend/src/pages/Profile.tsx`](frontend/src/pages/Profile.tsx)
- **Sequence:**
    1. User uploads image (`id=profile`).
    2. Backend validates type/size.
    3. Image displayed in profile (`id=profile-photo`).

### 9. UI 테스트용 ID/클래스 (UI Element IDs for Testing)
- **Frontend:** All relevant pages/components (see user stories for required IDs)
- **Details:**
    - Signup: `id=email`, `id=password`, `id=role`, `id=signup`
    - Login: `id=email`, `id=password`, `id=login`
    - Profile: `id=name`, `id=bio`, `id=skillsets`, `id=profile-photo`, `id=profile`, `id=save`
    - Mentor List: `class=mentor`, `id=search`, `id=name`, `id=skill`
    - Match Request: `id=message`, `id=request`, `id=request-status`
    - Accept/Reject: `class=request-message`, `id=accept`, `id=reject`
    - Request List: `id=request-status`, `id=request-cancel`

---

For each user story, see the linked code and test files for implementation details. Update the checklist as you complete frontend tests or add screenshots.
