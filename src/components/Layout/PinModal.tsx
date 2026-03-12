import { useState, useEffect } from 'react';

const PIN_KEY = 'teacherPin';
export const DEFAULT_PIN = '1234';

export function getStoredPin(): string {
  return localStorage.getItem(PIN_KEY) ?? DEFAULT_PIN;
}

export function setStoredPin(pin: string): void {
  localStorage.setItem(PIN_KEY, pin);
}

interface PinModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PinModal({ onSuccess, onCancel }: PinModalProps) {
  const [digits, setDigits] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (digits.length === 4) {
      const entered = digits.join('');
      if (entered === getStoredPin()) {
        onSuccess();
      } else {
        setShake(true);
        setHint('PIN incorreto. Tente novamente.');
        setTimeout(() => {
          setShake(false);
          setDigits([]);
          setHint('');
        }, 700);
      }
    }
  }, [digits, onSuccess]);

  const press = (d: string) => {
    if (digits.length < 4) setDigits((prev) => [...prev, d]);
  };

  const del = () => setDigits((prev) => prev.slice(0, -1));

  const PAD = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(61,44,30,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className={shake ? 'animate-wiggle' : ''}
        style={{
          background: '#fff',
          borderRadius: 28,
          padding: '32px 28px 28px',
          width: '100%',
          maxWidth: 320,
          border: shake ? '2px solid #EF233C' : '2px solid #FFD0BC',
          boxShadow: shake
            ? '0 6px 0 0 #EF233C, 0 12px 40px rgba(239,35,60,0.2)'
            : '0 6px 0 0 #FFD0BC, 0 12px 40px rgba(255,107,53,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Ícone + título */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>🔒</div>
          <h2
            style={{
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontSize: '1.3rem', fontWeight: 900, color: '#FF6B35', marginBottom: 4,
            }}
          >
            Modo Professor
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#8B6B55', fontWeight: 600 }}>
            {hint || 'Digite o PIN para continuar'}
          </p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 14 }}>
          {[0,1,2,3].map((i) => (
            <div
              key={i}
              style={{
                width: 18, height: 18,
                borderRadius: '50%',
                background: i < digits.length
                  ? (shake ? '#EF233C' : '#FF6B35')
                  : '#F0EAE4',
                border: `2px solid ${i < digits.length ? (shake ? '#EF233C' : '#FF6B35') : '#D6C8BE'}`,
                transition: 'all 0.15s',
                transform: i < digits.length ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Teclado numérico */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
          {PAD.map((key, idx) => {
            if (key === '') return <div key={idx} />;
            const isDel = key === '⌫';
            return (
              <button
                key={idx}
                onClick={() => isDel ? del() : press(key)}
                disabled={!isDel && digits.length === 4}
                style={{
                  height: 64,
                  borderRadius: 16,
                  fontFamily: "'Baloo 2', system-ui, sans-serif",
                  fontSize: isDel ? '1.4rem' : '1.6rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  border: 'none',
                  background: isDel ? '#FFF0E8' : '#FFF8F5',
                  color: isDel ? '#FF6B35' : '#3D2C1E',
                  boxShadow: '0 4px 0 0 #F0EAE4',
                  transition: 'all 0.1s',
                  transform: 'translateY(0)',
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 0 0 #F0EAE4';
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 0 0 #F0EAE4';
                }}
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Cancelar */}
        <button
          onClick={onCancel}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.85rem', color: '#B09080', fontWeight: 700,
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
