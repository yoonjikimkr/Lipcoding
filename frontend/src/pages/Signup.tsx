import React, { useState } from 'react';
import { signup } from '../api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mentee');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signup({ email, password, role });
    if (res.success) {
      setMessage('회원가입 성공! 이제 로그인하세요.');
    } else {
      setMessage(res.detail || '회원가입 실패');
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="signup-input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="signup-input"
        />
        <select value={role} onChange={e => setRole(e.target.value)} required className="signup-select">
          <option value="mentee">멘티</option>
          <option value="mentor">멘토</option>
        </select>
        <button type="submit" className="signup-button">회원가입</button>
      </form>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
}
