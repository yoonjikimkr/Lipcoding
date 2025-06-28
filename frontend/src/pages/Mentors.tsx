import React, { useEffect, useState } from 'react';
import { getMentors, sendRequest } from '../api';

export default function Mentors() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [skill, setSkill] = useState('');
  const [sort, setSort] = useState('name');
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState<{ [id: number]: boolean }>({});
  const [requestMsg, setRequestMsg] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    const fetchMentors = async () => {
      const params: any = {};
      if (skill) params.skill = skill;
      if (sort) params.orderBy = sort;
      const data = await getMentors(params);
      setMentors(data || []);
    };
    fetchMentors();
    // eslint-disable-next-line
  }, [skill, sort]);

  const handleRequest = async (mentorId: number) => {
    setRequesting(r => ({ ...r, [mentorId]: true }));
    try {
      await sendRequest(mentorId, requestMsg[mentorId] || '');
      setMessage('요청이 전송되었습니다!');
    } catch {
      setMessage('요청에 실패했습니다.');
    }
    setRequesting(r => ({ ...r, [mentorId]: false }));
  };

  return (
    <div>
      <h2>멘토 목록</h2>
      <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          id="skill"
          value={skill}
          onChange={e => setSkill(e.target.value)}
          placeholder="기술스택으로 검색 (예: React)"
          data-testid="skill"
          style={{ flex: 2, minWidth: 120 }}
        />
        <select
          id="sort"
          data-testid="sort"
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ flex: 1, minWidth: 100 }}
        >
          <option value="name">이름순</option>
          <option value="skill">기술스택순</option>
        </select>
      </div>
      <div className="mentor-list">
        {mentors.map(m => (
          <div key={m.id} className="mentor-card">
            <img src={m.image_url || 'https://placehold.co/500x500.jpg?text=MENTOR'} alt={m.name} />
            <div className="mentor-name">{m.name}</div>
            <div className="mentor-skills">{Array.isArray(m.skillsets) ? m.skillsets.join(', ') : m.skillsets}</div>
            <div className="mentor-bio">{m.bio}</div>
            <div className="mentor-actions">
              <input
                type="text"
                placeholder="멘토에게 보낼 메시지"
                value={requestMsg[m.id] || ''}
                onChange={e => setRequestMsg(msg => ({ ...msg, [m.id]: e.target.value }))}
                disabled={requesting[m.id]}
              />
              <button onClick={() => handleRequest(m.id)} disabled={requesting[m.id]}>
                {requesting[m.id] ? '요청 중...' : '멘토에게 요청'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
}