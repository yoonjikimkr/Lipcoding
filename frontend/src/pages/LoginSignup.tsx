import React, { useState } from 'react';
import { signup, login, saveToken } from '../api';

export default function LoginSignup() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  // 로그인 상태
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState('');
  // 회원가입 상태
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState('mentee');
  const [signupMsg, setSignupMsg] = useState('');

  // 로그인 핸들러
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMsg('');
    const res = await login({ email: loginEmail, password: loginPassword });
    if (res.access_token || res.token) {
      saveToken(res.access_token || res.token);
      setLoginMsg('로그인 성공!');
      window.location.href = '/profile';
    } else {
      setLoginMsg(res.detail || '로그인 실패');
    }
  };
  // 회원가입 핸들러
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMsg('');
    const res = await signup({ email: signupEmail, password: signupPassword, name: signupName, role: signupRole });
    if (res.success) {
      setSignupMsg('회원가입 성공! 이제 로그인하세요.');
      setTab('login');
      setLoginEmail(signupEmail);
      setLoginPassword(signupPassword);
    } else {
      setSignupMsg(res.detail || '회원가입 실패');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <button onClick={() => setTab('login')} style={{ fontWeight: tab==='login'?'bold':'normal', background: tab==='login'?'#2d3e50':'#e0e4ea', color: tab==='login'?'#fff':'#222', border: 'none', borderRadius: '6px 0 0 6px', padding: '0.7rem 1.5rem' }}>로그인</button>
        <button onClick={() => setTab('signup')} style={{ fontWeight: tab==='signup'?'bold':'normal', background: tab==='signup'?'#2d3e50':'#e0e4ea', color: tab==='signup'?'#fff':'#222', border: 'none', borderRadius: '0 6px 6px 0', padding: '0.7rem 1.5rem' }}>회원가입</button>
      </div>
      {tab === 'login' ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="email" placeholder="이메일" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
          <input type="password" placeholder="비밀번호" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
          <button type="submit">로그인</button>
          {loginMsg && <div className="status-message">{loginMsg}</div>}
        </form>
      ) : (
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="email" placeholder="이메일" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required />
          <input type="password" placeholder="비밀번호" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required />
          <input type="text" placeholder="이름" value={signupName} onChange={e => setSignupName(e.target.value)} required />
          <select value={signupRole} onChange={e => setSignupRole(e.target.value)} required>
            <option value="mentee">멘티</option>
            <option value="mentor">멘토</option>
          </select>
          <button type="submit">회원가입</button>
          {signupMsg && <div className="status-message">{signupMsg}</div>}
        </form>
      )}
    </div>
  );
}
