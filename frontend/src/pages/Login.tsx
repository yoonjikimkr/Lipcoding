import React, { useState } from 'react';
import { login, saveToken } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      if (res.access_token) {
        saveToken(res.access_token);
        setMessage('로그인 성공!');
      } else {
        setMessage('로그인 실패.');
      }
    } catch (err) {
      setMessage('로그인 실패.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button id="login" data-testid="login" type="submit">로그인</button>
      </form>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
}
