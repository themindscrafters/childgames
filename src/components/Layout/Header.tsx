import { useState } from 'react';
import { useApp } from '../../hooks/useAppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PinModal } from './PinModal';

export function Header() {
  const { currentStudent, setCurrentStudent, isTeacherMode, setTeacherMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPin, setShowPin] = useState(false);

  const isHome = location.pathname === '/';

  const handleTeacherClick = () => {
    if (isTeacherMode) {
      // Sair do modo professor não precisa de PIN
      setTeacherMode(false);
      navigate('/');
    } else {
      setShowPin(true);
    }
  };

  return (
    <>
      <header
        style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 60%, #FFB703 100%)',
          minHeight: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          boxShadow: '0 4px 0 0 #E04E18, 0 6px 16px rgba(224,78,24,0.25)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Left: back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {!isHome && (
            <button
              onClick={() => {
                if (location.pathname.startsWith('/game/')) {
                  navigate('/games');
                } else {
                  navigate('/');
                }
              }}
              aria-label="Voltar"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.25)',
                border: '2px solid rgba(255,255,255,0.45)',
                color: '#fff',
                fontSize: '1.3rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              ←
            </button>
          )}
          <h1
            onClick={() => navigate('/')}
            style={{
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#fff',
              cursor: 'pointer',
              textShadow: '0 2px 4px rgba(0,0,0,0.15)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            🎮 Jogos Educativos
          </h1>
        </div>

        {/* Right: student pill + teacher button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {currentStudent && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255,255,255,0.25)',
                border: '2px solid rgba(255,255,255,0.45)',
                borderRadius: 24,
                padding: '4px 12px 4px 8px',
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{currentStudent.avatar}</span>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                {currentStudent.name}
              </span>
              <button
                onClick={() => {
                  setCurrentStudent(null);
                  navigate('/');
                }}
                style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.8)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: 2,
                  fontWeight: 700,
                }}
                aria-label="Trocar aluno"
              >
                ✕
              </button>
            </div>
          )}

          <button
            onClick={handleTeacherClick}
            aria-label={isTeacherMode ? 'Modo aluno' : 'Modo professor'}
            style={{
              height: 44,
              minWidth: 56,
              borderRadius: 14,
              background: isTeacherMode ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
              border: '2px solid rgba(255,255,255,0.6)',
              color: isTeacherMode ? '#FF6B35' : '#fff',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: '0 14px',
              fontFamily: "'Nunito', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
          >
            {isTeacherMode ? '🎒 Aluno' : '👩‍🏫 Prof'}
          </button>
        </div>
      </header>

      {showPin && (
        <PinModal
          onSuccess={() => {
            setShowPin(false);
            setTeacherMode(true);
            navigate('/dashboard');
          }}
          onCancel={() => setShowPin(false)}
        />
      )}
    </>
  );
}
