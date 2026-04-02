import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';
import { getStudentSessions, createInvite } from '../../data/db';
import { GAME_LIST, ROLE_LABELS, type GameSession } from '../../data/models';
import { DailySummary } from './DailySummary';
import { WeeklyChart } from './WeeklyChart';
import { UsageStats } from './UsageStats';
import { SkillDomains } from './SkillDomains';

export function StudentProgress() {
  const { id } = useParams<{ id: string }>();
  const { students } = useApp();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const labels = ROLE_LABELS[profile?.role ?? 'teacher'];

  const studentId = Number(id);
  const student = students.find((s) => s.id === studentId);

  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    if (studentId) {
      getStudentSessions(studentId).then(setSessions);
    }
  }, [studentId]);

  if (!student) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>😢</div>
          <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, color: '#8B6B55' }}>
            {labels.childLabel} não encontrado
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              marginTop: 16, padding: '10px 24px', borderRadius: 14,
              background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)', color: '#fff',
              fontWeight: 800, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 0 0 #E04E18',
            }}
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 32px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Student header */}
        <div
          style={{
            background: '#fff', borderRadius: 18, padding: '16px',
            border: '2px solid #FFD0BC', boxShadow: '0 3px 0 0 #FFD0BC',
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>{student.avatar}</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '1.2rem', fontWeight: 900, color: '#3D2C1E' }}>
              {student.name}
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#8B6B55', fontWeight: 600 }}>
              Nivel: {student.current_difficulty === 'easy' ? 'Facil' : student.current_difficulty === 'medium' ? 'Medio' : 'Dificil'}
            </p>
          </div>
          <button
            onClick={async () => { const code = await createInvite(studentId); setInviteCode(code); }}
            style={{
              padding: '6px 12px', borderRadius: 10,
              background: '#E8F8FF', border: '2px solid #B3E0F0',
              color: '#0077B6', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer',
            }}
          >
            🔗
          </button>
        </div>

        {/* Invite code */}
        {inviteCode && (
          <div style={{ background: '#E8FFF5', border: '2px solid #06D6A0', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06D6A0' }}>Código de convite:</p>
            <p style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 900, color: '#3D2C1E', letterSpacing: 6 }}>{inviteCode}</p>
            <p style={{ fontSize: '0.65rem', color: '#8B6B55', marginTop: 2 }}>Válido por 7 dias</p>
          </div>
        )}

        {/* E1: Daily summary */}
        <DailySummary studentId={studentId} />

        {/* E4+E5+E3: Usage stats + streak + positive message */}
        <UsageStats studentId={studentId} />

        {/* E2: Weekly chart */}
        <WeeklyChart studentId={studentId} />

        {/* I1: Skill domains */}
        <SkillDomains studentId={studentId} />

        {/* Recent sessions */}
        {sessions.length > 0 && (
          <div
            style={{
              background: '#fff', border: '2px solid #FFD0BC', borderRadius: 18,
              padding: '16px', boxShadow: '0 3px 0 0 #FFD0BC',
            }}
          >
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#3D2C1E', marginBottom: 10 }}>
              🕐 Últimas sessões
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sessions.slice(0, 8).map((s) => {
                const game = GAME_LIST.find((g) => g.id === s.game_id);
                const pct = s.total_questions > 0 ? Math.round((s.correct_answers / s.total_questions) * 100) : 0;
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 10px', borderRadius: 10, background: '#F9F5F2',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{game?.icon ?? '🎮'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.8rem', color: '#3D2C1E' }}>
                        {game?.name ?? s.game_id}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: '#B09080' }}>
                        {s.correct_answers}/{s.total_questions} acertos
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '0.85rem',
                        color: pct >= 70 ? '#06D6A0' : pct >= 40 ? '#FFB703' : '#EF233C',
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
