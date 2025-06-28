import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api';
import '../App.css';

const defaultMentorImg = 'https://placehold.co/500x500.jpg?text=MENTOR';
const defaultMenteeImg = 'https://placehold.co/500x500.jpg?text=MENTEE';

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [message, setMessage] = useState('');
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then(data => {
      setProfile(data || {});
      setForm(data || {});
      setImgPreview(data?.image_url || null);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f: any) => ({ ...f, image: file }));
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'image' && v instanceof File) formData.append('image', v);
      else if (typeof v === 'string') formData.append(k, v);
    });
    const res = await updateProfile(formData);
    if (res.success) {
      setMessage('프로필이 저장되었습니다!');
      setEditing(false);
      setProfile(res.profile);
      setImgPreview(res.profile?.image_url || null);
    } else {
      setMessage(res.detail || '프로필 저장 실패');
    }
  };

  const isMentor = profile.role === 'mentor';
  const imgUrl = imgPreview || (isMentor ? defaultMentorImg : defaultMenteeImg);

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>내 프로필</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
        <img src={imgUrl} alt="프로필" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e4ea' }} />
        {!editing ? (
          <div className="profile-info">
            <div><b>이름:</b> {profile.name || '-'}</div>
            <div><b>소개:</b> {profile.bio || '-'}</div>
            {isMentor && <div><b>기술 스택:</b> {profile.skillsets || '-'}</div>}
            <button className="edit-button" onClick={() => setEditing(true)}>프로필 수정</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <input name="name" placeholder="이름" value={form.name || ''} onChange={handleChange} required />
            <textarea name="bio" placeholder="소개" value={form.bio || ''} onChange={handleChange} rows={3} required />
            {isMentor && (
              <input name="skillsets" placeholder="기술 스택 (예: Python, React)" value={form.skillsets || ''} onChange={handleChange} />
            )}
            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleImage} />
            <button type="submit" className="save-button">저장</button>
            <button type="button" onClick={() => setEditing(false)} className="cancel-button">취소</button>
          </form>
        )}
        {message && <div className="status-message">{message}</div>}
      </div>
    </div>
  );
}
