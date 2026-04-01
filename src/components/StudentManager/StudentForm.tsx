import { useState } from 'react';
import { AVATARS, DEFAULT_STUDENT_SETTINGS, ROLE_LABELS, type LearningDifficulty, type Student } from '../../data/models';
import { addStudent, updateStudent } from '../../data/db';
import { useApp } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';

const DIFFICULTIES: { value: LearningDifficulty; label: string; emoji: string; color: string; bg: string; border: string }[] = [
  { value: 'dyslexia',    label: 'Dislexia',          emoji: '📖', color: '#FF6FA8', bg: '#FFF0F6', border: '#FF6FA8' },
  { value: 'dyscalculia', label: 'Discalculia',        emoji: '🔢', color: '#00B4D8', bg: '#E8F8FF', border: '#00B4D8' },
  { value: 'adhd',        label: 'TDAH',               emoji: '⚡', color: '#FFB703', bg: '#FFF8E1', border: '#FFB703' },
  { value: 'autism',      label: 'Autismo (TEA)',       emoji: '🧩', color: '#7B5EA7', bg: '#F3EEFF', border: '#7B5EA7' },
  { value: 'dyspraxia',   label: 'Dispraxia',          emoji: '✍️', color: '#FF6B35', bg: '#FFF0E8', border: '#FF6B35' },
  { value: 'none',        label: 'Nenhuma específica', emoji: '😊', color: '#06D6A0', bg: '#E8FFF5', border: '#06D6A0' },
];

interface Props {
  student?: Student;
  onSaved: () => void;
  onCancel: () => void;
}

export function StudentForm({ student, onSaved, onCancel }: Props) {
  const { refreshStudents } = useApp();
  const { profile } = useAuth();
  const labels = ROLE_LABELS[profile?.role ?? 'teacher'];
  const [name, setName] = useState(student?.name ?? '');
  const [avatar, setAvatar] = useState(student?.avatar ?? AVATARS[0].emoji);
  const [difficulties, setDifficulties] = useState<LearningDifficulty[]>(
    student?.difficulties ?? []
  );

  const toggleDifficulty = (d: LearningDifficulty) => {
    if (d === 'none') {
      setDifficulties(['none']);
      return;
    }
    setDifficulties((prev) => {
      const filtered = prev.filter((x) => x !== 'none');
      return filtered.includes(d) ? filtered.filter((x) => x !== d) : [...filtered, d];
    });
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    if (student?.id) {
      await updateStudent(student.id, { name: name.trim(), avatar, difficulties });
    } else {
      await addStudent({
        name: name.trim(),
        avatar,
        difficulties,
        current_difficulty: 'easy',
        created_at: new Date().toISOString(),
        settings: { ...DEFAULT_STUDENT_SETTINGS },
      });
    }
    await refreshStudents();
    onSaved();
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 24,
        padding: '28px 24px',
        maxWidth: 480,
        margin: '0 auto',
        border: '2px solid #FFD0BC',
        boxShadow: '0 6px 0 0 #FFD0BC, 0 10px 32px rgba(255,107,53,0.1)',
      }}
    >
      <h3
        style={{
          fontFamily: "'Baloo 2', system-ui, sans-serif",
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#FF6B35',
          marginBottom: 20,
        }}
      >
        {student ? `✏️ ${labels.formEditTitle}` : `🌟 ${labels.formTitle}`}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Nome */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8B6B55', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {labels.nameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={labels.namePlaceholder}
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 14,
              border: '2px solid #FFD0BC',
              fontSize: '1.05rem',
              fontFamily: "'Nunito', system-ui, sans-serif",
              fontWeight: 700,
              color: '#3D2C1E',
              outline: 'none',
              background: '#FFF8F5',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#FF6B35'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#FFD0BC'; }}
          />
        </div>

        {/* Avatar */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8B6B55', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Avatar
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAvatar(a.emoji)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  cursor: 'pointer',
                  border: avatar === a.emoji ? '3px solid #FF6B35' : '2px solid #FFD0BC',
                  background: avatar === a.emoji ? '#FFF0E8' : '#FFF8F5',
                  transform: avatar === a.emoji ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: avatar === a.emoji ? '0 4px 0 0 #FFD0BC' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Dificuldades */}
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8B6B55', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dificuldades de Aprendizagem
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {DIFFICULTIES.map((d) => {
              const active = difficulties.includes(d.value);
              return (
                <button
                  key={d.value}
                  onClick={() => toggleDifficulty(d.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 12,
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: active ? d.bg : '#F9F5F2',
                    border: active ? `2px solid ${d.border}` : '2px solid #F0EAE4',
                    borderLeftWidth: active ? 5 : 2,
                    transition: 'all 0.15s',
                    boxShadow: active ? `0 3px 0 0 ${d.border}33` : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{d.emoji}</span>
                  <span
                    style={{
                      fontFamily: "'Nunito', system-ui, sans-serif",
                      fontSize: '0.9rem',
                      fontWeight: active ? 800 : 600,
                      color: active ? d.color : '#8B6B55',
                    }}
                  >
                    {d.label}
                  </span>
                  {active && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: d.color, fontWeight: 800 }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            style={{
              flex: 1,
              background: name.trim()
                ? 'linear-gradient(135deg, #FF6B35, #FF9A6C)'
                : '#FFD0BC',
              color: '#fff',
              padding: '14px 20px',
              borderRadius: 14,
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: '1rem',
              border: 'none',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              boxShadow: name.trim() ? '0 5px 0 0 #E04E18' : 'none',
              transition: 'all 0.15s',
            }}
          >
            💾 Salvar
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: '#fff',
              color: '#8B6B55',
              padding: '14px 20px',
              borderRadius: 14,
              fontFamily: "'Baloo 2', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: '1rem',
              border: '2px solid #F0EAE4',
              cursor: 'pointer',
              boxShadow: '0 5px 0 0 #F0EAE4',
              transition: 'all 0.15s',
            }}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
