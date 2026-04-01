import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos'
        : result.error);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(255,107,53,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(255,183,3,0.06) 0%, transparent 50%),
          linear-gradient(180deg, #FFF8F2 0%, #FFF0E8 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating decorative elements */}
      <div style={{ position: 'absolute', top: '8%', left: '5%', fontSize: '2.5rem', opacity: 0.15, transform: 'rotate(-15deg)' }}>🎮</div>
      <div style={{ position: 'absolute', top: '15%', right: '8%', fontSize: '2rem', opacity: 0.12, transform: 'rotate(20deg)' }}>⭐</div>
      <div style={{ position: 'absolute', bottom: '12%', left: '10%', fontSize: '2.2rem', opacity: 0.1, transform: 'rotate(10deg)' }}>🧩</div>
      <div style={{ position: 'absolute', bottom: '20%', right: '5%', fontSize: '1.8rem', opacity: 0.13, transform: 'rotate(-25deg)' }}>📚</div>

      <div
        className="animate-bounce-in"
        style={{
          background: '#fff',
          borderRadius: 28,
          padding: '40px 28px 36px',
          width: '100%',
          maxWidth: 400,
          border: '2px solid #FFD0BC',
          boxShadow: '0 8px 0 0 #FFD0BC, 0 12px 40px rgba(255,107,53,0.12)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            className="animate-float"
            style={{ fontSize: '3.5rem', marginBottom: 8, display: 'inline-block' }}
          >
            🎮
          </div>
          <h1
            style={{
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontSize: '2rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            Jogos Educativos
          </h1>
          <p style={{
            fontFamily: "'Nunito', system-ui, sans-serif",
            fontSize: '0.95rem',
            color: '#8B6B55',
            fontWeight: 600,
          }}>
            Entre na sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#8B6B55',
                display: 'block',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: "'Nunito', system-ui, sans-serif",
              }}
            >
              📧 E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 14,
                border: '2px solid #FFD0BC',
                fontSize: '1rem',
                fontFamily: "'Nunito', system-ui, sans-serif",
                fontWeight: 700,
                color: '#3D2C1E',
                outline: 'none',
                background: '#FFF8F5',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FF6B35';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#FFD0BC';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#8B6B55',
                display: 'block',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: "'Nunito', system-ui, sans-serif",
              }}
            >
              🔒 Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 14,
                border: '2px solid #FFD0BC',
                fontSize: '1rem',
                fontFamily: "'Nunito', system-ui, sans-serif",
                fontWeight: 700,
                color: '#3D2C1E',
                outline: 'none',
                background: '#FFF8F5',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                letterSpacing: 3,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FF6B35';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#FFD0BC';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: '#FFF0F0',
                border: '2px solid #FFBCBC',
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>😢</span>
              <p style={{ fontSize: '0.85rem', color: '#D32F2F', fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="game-btn"
            style={{
              width: '100%',
              background: loading
                ? '#FFD0BC'
                : 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
              color: '#fff',
              padding: '16px 20px',
              borderRadius: 16,
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: '1.15rem',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: loading ? 'none' : '0 6px 0 0 #E04E18',
              transition: 'all 0.15s',
              marginTop: 4,
            }}
          >
            {loading ? '⏳ Entrando...' : '🚀 Entrar'}
          </button>
        </form>

        {/* Signup link */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: '0.9rem', color: '#8B6B55', fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>
            Ainda não tem conta?{' '}
            <Link
              to="/signup"
              style={{
                color: '#FF6B35',
                fontWeight: 800,
                textDecoration: 'none',
                borderBottom: '2px solid rgba(255,107,53,0.3)',
                transition: 'border-color 0.15s',
              }}
            >
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
