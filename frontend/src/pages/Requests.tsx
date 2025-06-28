import React, { useEffect, useState } from 'react';
import { authFetch, acceptRequest, rejectRequest } from '../api';

export default function Requests() {
  const [incoming, setIncoming] = useState<any[]>([]); // mentor용
  const [outgoing, setOutgoing] = useState<any[]>([]); // mentee용
  const [role, setRole] = useState<string>('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // 내 역할 확인
  useEffect(() => {
    setLoading(true);
    authFetch('http://localhost:8080/api/me')
      .then(res => res.json())
      .then(data => {
        setRole(data.role);
        setLoading(false);
      })
      .catch(() => {
        setError('로그인이 필요합니다.');
        setLoading(false);
      });
  }, []);

  // 요청 목록 불러오기
  const fetchRequests = async () => {
    setError('');
    setLoading(true);
    if (role === 'mentor') {
      const res = await authFetch('http://localhost:8080/api/match-requests/incoming');
      const data = await res.json();
      setIncoming(Array.isArray(data) ? data : []);
    } else if (role === 'mentee') {
      const res = await authFetch('http://localhost:8080/api/match-requests/outgoing');
      const data = await res.json();
      setOutgoing(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (role) fetchRequests();
    // eslint-disable-next-line
  }, [role]);

  // 멘토: 수락/거절
  const handleAccept = async (id: number) => {
    await acceptRequest(id);
    setMessage('요청을 수락했습니다!');
    fetchRequests();
  };
  const handleReject = async (id: number) => {
    await rejectRequest(id);
    setMessage('요청을 거절했습니다.');
    fetchRequests();
  };
  // 멘티: 취소/삭제
  const handleCancel = async (id: number) => {
    await authFetch(`http://localhost:8080/api/match-requests/${id}`, { method: 'DELETE' });
    setMessage('요청을 취소/삭제했습니다.');
    fetchRequests();
  };

  return (
    <div>
      <h2>요청</h2>
      {loading && <div>로딩 중...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {!loading && !error && !role && <div>권한 정보가 없습니다.</div>}
      {!loading && role === 'mentor' && (
        <>
          <div style={{marginBottom: '1rem', color:'#555'}}>멘토는 받은 요청을 수락 또는 거절할 수 있습니다.</div>
          <h3>받은 요청 목록</h3>
          <ul>
            {incoming.length === 0 && <li>받은 요청이 없습니다.</li>}
            {incoming.map(r => (
              <li key={r.id} style={{marginBottom: '1.2rem'}}>
                <div><b>멘티 ID:</b> {r.menteeId}</div>
                <div><b>메시지:</b> {r.message}</div>
                <div><b>상태:</b> {r.status}</div>
                {r.status === 'pending' && (
                  <>
                    <button onClick={() => handleAccept(r.id)}>수락</button>
                    <button onClick={() => handleReject(r.id)}>거절</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {!loading && role === 'mentee' && (
        <>
          <div style={{marginBottom: '1rem', color:'#555'}}>멘티는 보낸 요청의 상태를 확인하고, 대기중인 요청은 취소할 수 있습니다.</div>
          <h3>내가 보낸 요청 목록</h3>
          <ul>
            {outgoing.length === 0 && <li>보낸 요청이 없습니다.</li>}
            {outgoing.map(r => (
              <li key={r.id} style={{marginBottom: '1.2rem'}}>
                <div><b>멘토 ID:</b> {r.mentorId}</div>
                <div><b>상태:</b> {r.status}</div>
                {r.status === 'pending' ? (
                  <button onClick={() => handleCancel(r.id)}>취소</button>
                ) : (
                  <button onClick={() => handleCancel(r.id)}>삭제</button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {message && <div className="status-message">{message}</div>}
    </div>
  );
}
