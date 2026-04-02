import { useState, useEffect } from 'react';
import { getDailyStats } from '../../data/db';

interface Props {
  studentId: number;
}

export function DailySummary({ studentId }: Props) {
  const [stats, setStats] = useState<{ sessions: number; correct: number; total: number; accuracy: number; totalMinutes: number } | null>(null);

  useEffect(() => {
    getDailyStats(studentId).then(setStats);
  }, [studentId]);

  if (!stats) return null;

  if (stats.sessions === 0) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF8E1, #FFF0E8)',
          border: '2px solid #FFE58A',
          borderRadius: 18, padding: '16px 20px',
          boxShadow: '0 3px 0 0 #FFE58A',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '1.8rem' }}>🎮</span>
        <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#3D2C1E', marginTop: 4 }}>
          Nenhuma sessão hoje
        </p>
        <p style={{ fontSize: '0.8rem', color: '#8B6B55', fontWeight: 600 }}>
          Que tal jogar agora?
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #E8FFF5, #E8F8FF)',
        border: '2px solid #B3F0E0',
        borderRadius: 18, padding: '16px 20px',
        boxShadow: '0 3px 0 0 #B3F0E0',
        display: 'flex', alignItems: 'center', gap: 14,
      }}
    >
      <div style={{ fontSize: '2.2rem' }}>☀️</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#3D2C1E' }}>
          Hoje
        </p>
        <p style={{ fontSize: '0.85rem', color: '#8B6B55', fontWeight: 600, lineHeight: 1.4 }}>
          {stats.totalMinutes > 0 ? `${stats.totalMinutes} min` : '<1 min'} jogados
          {' · '}{stats.sessions} {stats.sessions === 1 ? 'jogo' : 'jogos'}
          {' · '}<span style={{ color: stats.accuracy >= 70 ? '#06D6A0' : stats.accuracy >= 40 ? '#FFB703' : '#FF6B35', fontWeight: 800 }}>
            {stats.accuracy}% acerto
          </span>
        </p>
      </div>
    </div>
  );
}
