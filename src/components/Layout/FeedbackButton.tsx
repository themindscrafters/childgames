import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sendFeedback } from '../../data/db';

const STARS = [1, 2, 3, 4, 5];
const STAR_LABELS = ['Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente'];

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const location = useLocation();

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSending(true);
    try {
      await sendFeedback(rating, message, location.pathname);
      setSent(true);
      setTimeout(() => { setOpen(false); setSent(false); setRating(0); setMessage(''); }, 1500);
    } catch {
      // silent fail
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 999,
        background: '#fff', borderRadius: 20, padding: '20px 24px',
        border: '2px solid #B3F0E0', boxShadow: '0 6px 0 0 #B3F0E0, 0 8px 24px rgba(6,214,160,0.2)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 4 }}>💚</div>
        <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, color: '#06D6A0' }}>
          Obrigado!
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 999,
          width: 48, height: 48, borderRadius: 16,
          background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 0 0 #E04E18, 0 6px 16px rgba(255,107,53,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem',
          transition: 'transform 0.15s',
        }}
        title="Enviar feedback"
      >
        💬
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 999,
      background: '#fff', borderRadius: 20, padding: '20px 18px',
      width: 280,
      border: '2px solid #FFD0BC',
      boxShadow: '0 6px 0 0 #FFD0BC, 0 8px 24px rgba(255,107,53,0.15)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#FF6B35' }}>
          Feedback
        </h3>
        <button
          onClick={() => { setOpen(false); setRating(0); setMessage(''); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#B09080' }}
        >
          ✕
        </button>
      </div>

      <p style={{ fontSize: '0.8rem', color: '#8B6B55', fontWeight: 600, marginBottom: 10 }}>
        Como esta sendo a experiencia?
      </p>

      {/* Stars */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
        {STARS.map((s) => (
          <button
            key={s}
            onClick={() => setRating(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1.8rem',
              transform: (hover || rating) >= s ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.1s',
              filter: (hover || rating) >= s ? 'none' : 'grayscale(1) opacity(0.3)',
            }}
          >
            ⭐
          </button>
        ))}
      </div>
      {(hover || rating) > 0 && (
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#FF6B35', fontWeight: 700, marginBottom: 8 }}>
          {STAR_LABELS[(hover || rating) - 1]}
        </p>
      )}

      {/* Message */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Conte mais (opcional)..."
        maxLength={500}
        rows={3}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 12,
          border: '2px solid #F0EAE4',
          fontSize: '0.85rem',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 600,
          color: '#3D2C1E',
          outline: 'none',
          background: '#FFF8F5',
          resize: 'none',
          boxSizing: 'border-box',
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || sending}
        style={{
          width: '100%',
          marginTop: 10,
          padding: '12px',
          borderRadius: 12,
          border: 'none',
          background: rating > 0 ? 'linear-gradient(135deg, #FF6B35, #FF9A6C)' : '#F0EAE4',
          color: rating > 0 ? '#fff' : '#B09080',
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 800,
          fontSize: '0.95rem',
          cursor: rating > 0 ? 'pointer' : 'not-allowed',
          boxShadow: rating > 0 ? '0 4px 0 0 #E04E18' : 'none',
        }}
      >
        {sending ? 'Enviando...' : 'Enviar'}
      </button>
    </div>
  );
}
