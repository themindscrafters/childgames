import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useAppContext';
import { audioManager } from '../../games/shared/AudioManager';

const STUDENT_COLORS = [
  { bg: '#FFF0E8', border: '#FF6B35', shadow: 'rgba(255,107,53,0.3)' },
  { bg: '#E8F8FF', border: '#00B4D8', shadow: 'rgba(0,180,216,0.3)' },
  { bg: '#FFF8E1', border: '#FFB703', shadow: 'rgba(255,183,3,0.3)' },
  { bg: '#E8FFF5', border: '#06D6A0', shadow: 'rgba(6,214,160,0.3)' },
  { bg: '#F3E8FF', border: '#7B5EA7', shadow: 'rgba(123,94,167,0.3)' },
  { bg: '#FFE8F0', border: '#FF6FA8', shadow: 'rgba(255,111,168,0.3)' },
];

export function Home() {
  const { students, setCurrentStudent } = useApp();
  const navigate = useNavigate();

  const handleSelectStudent = (student: typeof students[0]) => {
    audioManager.playSelect();
    setCurrentStudent(student);
    navigate('/games');
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        gap: 28,
        overflowY: 'auto',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div className="animate-float" style={{ fontSize: '3rem', marginBottom: 4, display: 'inline-block' }}>
          🌟
        </div>
        <h1
          style={{
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            fontSize: '2.4rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          Hora de Aprender!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#8B6B55', fontWeight: 700 }}>
          Quem vai jogar hoje?
        </p>
      </div>

      {students.length === 0 ? (
        <div style={{ textAlign: 'center', maxWidth: 340 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{'👩\u200d🏫'}</div>
          <p style={{ color: '#8B6B55', fontWeight: 700, marginBottom: 6 }}>
            Nenhum aluno cadastrado ainda.
          </p>
          <p style={{ color: '#B09080', fontSize: '0.9rem', marginBottom: 20 }}>
            Toque em <strong style={{ color: '#FF6B35' }}>Prof</strong> para adicionar alunos.
          </p>
          <button
            onClick={() => navigate('/games')}
            className="game-btn"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
              color: '#fff',
              padding: '0 32px',
              fontSize: '1.1rem',
              minHeight: 60,
              boxShadow: '0 6px 0 0 #E04E18',
            }}
          >
            {'\uD83C\uDFAE'} Jogar como visitante
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%', maxWidth: 600 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 16,
              width: '100%',
            }}
          >
            {students.map((student, i) => {
              const colors = STUDENT_COLORS[i % STUDENT_COLORS.length];
              return (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="animate-bounce-in"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    background: colors.bg,
                    border: `3px solid ${colors.border}`,
                    borderRadius: 24,
                    padding: '20px 12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    boxShadow: `0 6px 0 0 ${colors.border}, 0 8px 20px ${colors.shadow}`,
                    minHeight: 130,
                  }}
                >
                  <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>{student.avatar}</span>
                  <span
                    style={{
                      fontFamily: "'Baloo 2', system-ui, sans-serif",
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: '#3D2C1E',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {student.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => { audioManager.playClick(); navigate('/games'); }}
              className="game-btn"
              style={{
                background: '#fff',
                color: '#FF6B35',
                border: '3px solid #FF6B35',
                padding: '0 28px',
                fontSize: '1rem',
                minHeight: 52,
                boxShadow: '0 5px 0 0 rgba(224,78,24,0.3)',
              }}
            >
              🎮 Jogar como visitante
            </button>
            <p style={{ fontSize: '0.8rem', color: '#B09080', fontWeight: 600 }}>
              Toque em <strong style={{ color: '#FF6B35' }}>Prof</strong> para gerenciar alunos
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
