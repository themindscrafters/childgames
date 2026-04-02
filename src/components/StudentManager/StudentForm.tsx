import { useState } from 'react';
import { AVATARS, DEFAULT_STUDENT_SETTINGS, ROLE_LABELS, type Student } from '../../data/models';
import { addStudent, updateStudent } from '../../data/db';
import { useApp } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';

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

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 30) return;
    if (student?.id) {
      await updateStudent(student.id, { name: trimmed, avatar });
    } else {
      await addStudent({
        name: trimmed,
        avatar,
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
          <p style={{
            fontSize: '0.75rem',
            color: '#B09080',
            fontWeight: 600,
            fontFamily: "'Nunito', sans-serif",
            lineHeight: 1.4,
            marginBottom: 6,
            background: '#FFF8F2',
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid #F0EAE4',
          }}>
            🔒 Use apenas o primeiro nome ou apelido. Nao coloque nome completo, sobrenome ou dados que identifiquem a crianca.
          </p>
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
            maxLength={30}
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
