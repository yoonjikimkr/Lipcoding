import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Mentors from './pages/Mentors';
import Requests from './pages/Requests';
import LoginSignup from './pages/LoginSignup';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-navbar">
        <span className="logo">멘토-멘티 매칭</span>
        <nav>
          <Link to="/signup">회원가입</Link>
          <Link to="/login">로그인</Link>
          <Link to="/profile">프로필</Link>
          <Link to="/mentors">멘토 목록</Link>
          <Link to="/requests">요청</Link>
        </nav>
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/signup" element={<LoginSignup />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="*" element={<Mentors />} />
        </Routes>
      </div>
    </Router>
  );
}
