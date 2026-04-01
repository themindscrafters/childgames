import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../data/models';

const ROLES: { value: UserRole; label: string; icon: string; description: string; bg: string; border: string; color: string }[] = [
  {
    value: 'teacher',
    label: 'Professor(a)',
    icon: '👩‍🏫',
    description: 'Uso na escola com meus alunos',
    bg: '#E8F8FF',
    border: '#00B4D8',
    color: '#0077B6',
  },
  {
    value: 'parent',
    label: 'Mãe / Pai',
    icon: '👨‍👩‍👧‍👦',
    description: 'Uso em casa com meus filhos',
    bg: '#FFF0E8',
    border: '#FF6B35',
    color: '#D4430A',
  },
];

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres');
      setLoading(false);
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('A senha precisa ter pelo menos uma letra e um número');
      setLoading(false);
      return;
    }

    const result = await signUp(email, password, name, role);
    if (result.error) {
      setError(sanitizeError(result.error));
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    }
  };

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          background: 'linear-gradient(180deg, #FFF8F2 0%, #FFF0E8 100%)',
        }}
      >
        <div
          className="animate-bounce-in"
          style={{
            background: '#fff',
            borderRadius: 28,
            padding: '48px 28px',
            textAlign: 'center',
            border: '2px solid #B3F0E0',
            boxShadow: '0 8px 0 0 #B3F0E0, 0 12px 40px rgba(6,214,160,0.15)',
            maxWidth: 400,
            width: '100%',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: 12 }}>🎉</div>
          <h2
            style={{
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#06D6A0',
              marginBottom: 8,
            }}
          >
            Conta criada!
          </h2>
          <p style={{ color: '#8B6B55', fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>
            Redirecionando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '32px 20px 48px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
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
      <div style={{ position: 'absolute', top: '6%', right: '8%', fontSize: '2.5rem', opacity: 0.12, transform: 'rotate(15deg)' }}>🌟</div>
      <div style={{ position: 'absolute', bottom: '10%', left: '6%', fontSize: '2rem', opacity: 0.1, transform: 'rotate(-20deg)' }}>🎨</div>
      <div style={{ position: 'absolute', top: '50%', right: '3%', fontSize: '1.8rem', opacity: 0.08 }}>🧸</div>

      <div
        className="animate-bounce-in"
        style={{
          background: '#fff',
          borderRadius: 28,
          padding: '36px 28px 32px',
          width: '100%',
          maxWidth: 440,
          border: '2px solid #FFD0BC',
          boxShadow: '0 8px 0 0 #FFD0BC, 0 12px 40px rgba(255,107,53,0.12)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="animate-float" style={{ fontSize: '3rem', marginBottom: 6, display: 'inline-block' }}>🌈</div>
          <h1
            style={{
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontSize: '1.7rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            Criar Conta
          </h1>
          <p style={{
            fontFamily: "'Nunito', system-ui, sans-serif",
            fontSize: '0.9rem',
            color: '#8B6B55',
            fontWeight: 600,
          }}>
            Comece a jornada de aprendizado!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Role Selector */}
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#8B6B55',
                display: 'block',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: "'Nunito', system-ui, sans-serif",
              }}
            >
              Eu sou...
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {ROLES.map((r) => {
                const active = role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      padding: '16px 12px',
                      borderRadius: 18,
                      cursor: 'pointer',
                      background: active ? r.bg : '#F9F5F2',
                      border: active ? `3px solid ${r.border}` : '2px solid #F0EAE4',
                      boxShadow: active ? `0 4px 0 0 ${r.border}44` : 'none',
                      transition: 'all 0.2s',
                      transform: active ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    <span style={{ fontSize: '2rem', lineHeight: 1 }}>{r.icon}</span>
                    <span
                      style={{
                        fontFamily: "'Baloo 2', system-ui, sans-serif",
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        color: active ? r.color : '#8B6B55',
                      }}
                    >
                      {r.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: active ? r.color : '#B09080',
                        fontFamily: "'Nunito', sans-serif",
                        textAlign: 'center',
                        lineHeight: 1.2,
                      }}
                    >
                      {r.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label style={labelStyle}>👤 Seu nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser chamado(a)?"
              required
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>📧 E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>🔒 Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres (letra + número)"
              required
              minLength={8}
              style={{ ...inputStyle, letterSpacing: 3 }}
              onFocus={handleFocus}
              onBlur={handleBlur}
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
            {loading ? '⏳ Criando...' : '🎉 Criar minha conta'}
          </button>
        </form>

        {/* Login link */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontSize: '0.9rem', color: '#8B6B55', fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>
            Já tem conta?{' '}
            <Link
              to="/login"
              style={{
                color: '#FF6B35',
                fontWeight: 800,
                textDecoration: 'none',
                borderBottom: '2px solid rgba(255,107,53,0.3)',
              }}
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function sanitizeError(msg: string): string {
  const map: Record<string, string> = {
    'User already registered': 'Já existe uma conta com este e-mail',
    'Invalid email': 'E-mail inválido',
    'Password should be at least': 'A senha precisa ter pelo menos 8 caracteres',
    'Signup requires a valid password': 'Senha inválida',
  };
  for (const [key, value] of Object.entries(map)) {
    if (msg.includes(key)) return value;
  }
  return 'Erro ao criar conta. Tente novamente.';
}

// Shared styles
const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 800,
  color: '#8B6B55',
  display: 'block',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontFamily: "'Nunito', system-ui, sans-serif",
};

const inputStyle: React.CSSProperties = {
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
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = '#FF6B35';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,53,0.1)';
};

const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = '#FFD0BC';
  e.currentTarget.style.boxShadow = 'none';
};
