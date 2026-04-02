import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { setPin, verifyPin } from '../../data/db';

interface PinModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

export function PinModal({ onSuccess, onCancel }: PinModalProps) {
  const { profile } = useAuth();
  const [digits, setDigits] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState('');
  const [step, setStep] = useState<'enter' | 'create' | 'confirm'>('enter');
  const [newPin, setNewPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  useEffect(() => {
    if (profile && !profile.pin) {
      setStep('create');
    }
  }, [profile]);

  const isLocked = Date.now() < lockedUntil;

  useEffect(() => {
    if (digits.length === 4 && !isLocked) {
      handlePinComplete(digits.join(''));
    }
  }, [digits]);

  const handlePinComplete = async (pin: string) => {
    if (step === 'create') {
      setNewPin(pin);
      setDigits([]);
      setStep('confirm');
      setHint('');
      return;
    }

    if (step === 'confirm') {
      if (pin === newPin) {
        try {
          await setPin(newPin);
          onSuccess();
        } catch {
          setShake(true);
          setHint('Erro ao salvar PIN. Tente novamente.');
          setTimeout(() => { setShake(false); setDigits([]); setStep('create'); setNewPin(''); setHint(''); }, 1000);
        }
      } else {
        setShake(true);
        setHint('PINs nao coincidem. Tente novamente.');
        setTimeout(() => { setShake(false); setDigits([]); setStep('create'); setNewPin(''); setHint(''); }, 1000);
      }
      return;
    }

    // Verify step
    try {
      const valid = await verifyPin(pin);
      if (valid) {
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setHint('Muitas tentativas. Aguarde 5 minutos.');
        } else {
          setHint(`PIN incorreto (${newAttempts}/${MAX_ATTEMPTS})`);
        }
        setShake(true);
        setTimeout(() => { setShake(false); setDigits([]); }, 700);
      }
    } catch {
      setShake(true);
      setHint('Erro de conexao');
      setTimeout(() => { setShake(false); setDigits([]); }, 700);
    }
  };

  const press = (d: string) => {
    if (digits.length < 4 && !isLocked) setDigits((prev) => [...prev, d]);
  };
  const del = () => setDigits((prev) => prev.slice(0, -1));

  const PAD = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  const title = isLocked ? 'Bloqueado' : step === 'create' ? 'Crie seu PIN' : step === 'confirm' ? 'Confirme o PIN' : 'Digite o PIN';
  const subtitle = isLocked
    ? 'Muitas tentativas. Aguarde 5 minutos.'
    : step === 'create'
    ? 'Escolha 4 digitos para proteger o painel'
    : step === 'confirm'
    ? 'Digite novamente para confirmar'
    : hint || 'Area protegida';

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
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>
            {isLocked ? '⏳' : step === 'create' ? '🔐' : step === 'confirm' ? '✅' : '🔒'}
          </div>
          <h2
            style={{
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontSize: '1.3rem', fontWeight: 900, color: isLocked ? '#EF233C' : '#FF6B35', marginBottom: 4,
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: shake || isLocked ? '#EF233C' : '#8B6B55', fontWeight: 600 }}>
            {subtitle}
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

        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
          {PAD.map((key, idx) => {
            if (key === '') return <div key={idx} />;
            const isDel = key === '⌫';
            return (
              <button
                key={idx}
                onClick={() => isDel ? del() : press(key)}
                disabled={isLocked || (!isDel && digits.length === 4)}
                style={{
                  height: 56,
                  borderRadius: 16,
                  fontFamily: "'Baloo 2', system-ui, sans-serif",
                  fontSize: isDel ? '1.4rem' : '1.6rem',
                  fontWeight: 800,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  border: 'none',
                  background: isLocked ? '#F0EAE4' : isDel ? '#FFF0E8' : '#FFF8F5',
                  color: isLocked ? '#D6C8BE' : isDel ? '#FF6B35' : '#3D2C1E',
                  boxShadow: isLocked ? 'none' : '0 4px 0 0 #F0EAE4',
                  transition: 'all 0.1s',
                  opacity: isLocked ? 0.5 : 1,
                }}
              >
                {key}
              </button>
            );
          })}
        </div>

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
