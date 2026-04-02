import { useState, useEffect } from 'react';
import { calculateStreak, getDailyStats, generatePositiveMessage, getSkillStats, getWeeklyStats } from '../../data/db';

interface Props {
  studentId: number;
}

export function UsageStats({ studentId }: Props) {
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const [s, daily, weekly, skills] = await Promise.all([
        calculateStreak(studentId),
        getDailyStats(studentId),
        getWeeklyStats(studentId),
        getSkillStats(studentId),
      ]);
      setStreak(s);

      const bestSkill = skills.length > 0
        ? skills.reduce((best, s) => s.trend > best.trend ? s : best, skills[0])
        : undefined;

      setMessage(generatePositiveMessage(
        weekly.trend,
        s,
        daily.sessions,
        bestSkill ? { label: bestSkill.label, trend: bestSkill.trend } : undefined,
      ));
    }
    load();
  }, [studentId]);

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {/* Streak */}
      <div
        style={{
          flex: 1,
          background: streak > 0 ? 'linear-gradient(135deg, #FFF0E8, #FFF8E1)' : '#F9F5F2',
          border: `2px solid ${streak > 0 ? '#FFD0BC' : '#F0EAE4'}`,
          borderRadius: 16, padding: '14px 12px',
          boxShadow: streak > 0 ? '0 3px 0 0 #FFD0BC' : 'none',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.8rem', marginBottom: 2 }}>
          {streak > 0 ? '🔥' : '💤'}
        </div>
        <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 900, fontSize: '1.3rem', color: '#FF6B35', lineHeight: 1 }}>
          {streak}
        </p>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8B6B55', marginTop: 2 }}>
          {streak === 1 ? 'dia seguido' : 'dias seguidos'}
        </p>
      </div>

      {/* Positive message */}
      <div
        style={{
          flex: 2,
          background: 'linear-gradient(135deg, #F3EEFF, #E8F8FF)',
          border: '2px solid #D0C4F0',
          borderRadius: 16, padding: '14px 16px',
          boxShadow: '0 3px 0 0 #D0C4F0',
          display: 'flex', alignItems: 'center',
        }}
      >
        <p style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 700,
          fontSize: '0.85rem', color: '#3D2C1E', lineHeight: 1.4,
        }}>
          {message}
        </p>
      </div>
    </div>
  );
}
