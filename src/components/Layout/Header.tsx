import { useState } from 'react';
import { useApp } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROLE_LABELS } from '../../data/models';
import { PinModal } from './PinModal';

export function Header() {
  const { currentStudent, setCurrentStudent } = useApp();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPin, setShowPin] = useState(false);

  const isHome = location.pathname === '/';
  const labels = ROLE_LABELS[profile?.role ?? 'teacher'];

  const handleDashboardClick = () => {
    if (location.pathname === '/dashboard') {
      navigate('/');
    } else {
      setShowPin(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <header
        style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 60%, #FFB703 100%)',
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          boxShadow: '0 4px 0 0 #E04E18, 0 6px 16px rgba(224,78,24,0.25)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Left: back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.25)',
                border: '2px solid rgba(255,255,255,0.45)',
                color: '#fff',
                fontSize: '1.2rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#fff',
              cursor: 'pointer',
              textShadow: '0 2px 4px rgba(0,0,0,0.15)',
              lineHeight: 1,
            }}
          >
            🎮 Jogos
          </h1>
        </div>

        {/* Right: student pill + dashboard + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {currentStudent && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(255,255,255,0.25)',
                border: '2px solid rgba(255,255,255,0.45)',
                borderRadius: 20,
                padding: '3px 10px 3px 6px',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{currentStudent.avatar}</span>
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#fff' }}>
                {currentStudent.name.split(' ')[0]}
              </span>
              <button
                onClick={() => {
                  setCurrentStudent(null);
                  navigate('/');
                }}
                style={{
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.8)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                aria-label="Trocar aluno"
              >
                ✕
              </button>
            </div>
          )}

          {profile?.is_admin && (
            <button
              onClick={() => navigate('/admin')}
              aria-label="Admin"
              style={{
                height: 40,
                borderRadius: 12,
                background: location.pathname === '/admin'
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.4)',
                color: location.pathname === '/admin' ? '#FF6B35' : '#fff',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0 10px',
                fontFamily: "'Nunito', system-ui, sans-serif",
              }}
            >
              📊
            </button>
          )}

          {profile && (
            <button
              onClick={handleDashboardClick}
              aria-label="Dashboard"
              style={{
                height: 40,
                borderRadius: 12,
                background: location.pathname === '/dashboard'
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(255,255,255,0.25)',
                border: '2px solid rgba(255,255,255,0.6)',
                color: location.pathname === '/dashboard' ? '#FF6B35' : '#fff',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0 10px',
                fontFamily: "'Nunito', system-ui, sans-serif",
              }}
            >
              {labels.icon}
            </button>
          )}

          <button
            onClick={handleLogout}
            aria-label="Sair"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.3)',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            🚪
          </button>
        </div>
      </header>

      {showPin && (
        <PinModal
          onSuccess={() => {
            setShowPin(false);
            navigate('/dashboard');
          }}
          onCancel={() => setShowPin(false)}
        />
      )}
    </>
  );
}
