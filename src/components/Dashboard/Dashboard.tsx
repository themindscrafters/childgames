import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';
import { StudentForm } from '../StudentManager/StudentForm';
import { deleteStudent, redeemInvite } from '../../data/db';
import { ROLE_LABELS } from '../../data/models';

export function Dashboard() {
  const { students, refreshStudents } = useApp();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const labels = ROLE_LABELS[profile?.role ?? 'teacher'];

  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState<typeof students[0] | undefined>();
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMsg, setRedeemMsg] = useState('');

  const handleDelete = async (id: number) => {
    await deleteStudent(id);
    await refreshStudents();
  };

  const handleRedeem = async () => {
    try {
      const { studentName } = await redeemInvite(redeemCode);
      setRedeemMsg(`✅ ${studentName} adicionado(a)!`);
      setRedeemCode('');
      await refreshStudents();
      setTimeout(() => setRedeemMsg(''), 3000);
    } catch (err: any) {
      setRedeemMsg(`❌ ${err.message}`);
    }
  };

  if (showForm) {
    return (
      <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 16px' }}>
        <StudentForm
          student={editStudent}
          onSaved={() => {
            setShowForm(false);
            setEditStudent(undefined);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditStudent(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '20px 16px 32px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Baloo 2', system-ui, sans-serif", fontSize: '1.3rem', fontWeight: 900, color: '#FF6B35' }}>
            {labels.icon} {labels.title}
          </h2>
          <button
            onClick={() => { setEditStudent(undefined); setShowForm(true); }}
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
              color: '#fff', padding: '8px 16px', borderRadius: 14,
              fontWeight: 800, fontSize: '0.85rem', border: 'none',
              cursor: 'pointer', boxShadow: '0 4px 0 0 #E04E18',
              fontFamily: "'Nunito', system-ui, sans-serif",
            }}
          >
            {labels.newChild}
          </button>
        </div>

        {/* Invite code */}
        <div
          style={{
            background: '#E8F8FF', border: '2px solid #B3E0F0', borderRadius: 16,
            padding: '14px 16px', boxShadow: '0 3px 0 0 #B3E0F0',
          }}
        >
          <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: '#0077B6', marginBottom: 8 }}>
            🔗 Tenho um código de convite
          </h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => { setRedeemCode(e.target.value.toUpperCase()); setRedeemMsg(''); }}
              placeholder="ABC123"
              maxLength={6}
              style={{
                flex: 1, padding: '10px 12px', borderRadius: 12,
                border: '2px solid #B3E0F0', fontSize: '1rem',
                fontWeight: 700, fontFamily: 'monospace', letterSpacing: 4,
                textAlign: 'center', outline: 'none', background: '#fff',
              }}
            />
            <button
              onClick={handleRedeem}
              disabled={redeemCode.length < 4}
              style={{
                padding: '10px 16px', borderRadius: 12, border: 'none',
                cursor: redeemCode.length >= 4 ? 'pointer' : 'not-allowed',
                background: redeemCode.length >= 4 ? '#0077B6' : '#B3E0F0',
                color: '#fff', fontWeight: 800, fontSize: '0.85rem',
                boxShadow: redeemCode.length >= 4 ? '0 3px 0 0 #005A8C' : 'none',
              }}
            >
              Usar
            </button>
          </div>
          {redeemMsg && (
            <p style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: 8, color: redeemMsg.startsWith('✅') ? '#06D6A0' : '#EF233C' }}>
              {redeemMsg}
            </p>
          )}
        </div>

        {/* Children list */}
        <div>
          <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#3D2C1E', marginBottom: 12 }}>
            👨‍🎓 {labels.childLabelPlural}
          </h3>

          {students.length === 0 ? (
            <div
              style={{
                background: '#fff', borderRadius: 18, padding: '32px 20px',
                border: '2px solid #F0EAE4', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📝</div>
              <p style={{ color: '#8B6B55', fontWeight: 700, marginBottom: 4 }}>{labels.noChildren}</p>
              <p style={{ color: '#B09080', fontSize: '0.85rem' }}>
                Toque em "{labels.newChild}" para começar.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {students.map((s) => (
                <div
                  key={s.id}
                  style={{
                    background: '#fff', borderRadius: 18, padding: '14px 16px',
                    border: '2px solid #FFD0BC',
                    boxShadow: '0 3px 0 0 #FFD0BC',
                    display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                  }}
                  onClick={() => navigate(`/dashboard/${s.id}`)}
                >
                  <span style={{ fontSize: '2.2rem' }}>{s.avatar}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#3D2C1E' }}>
                      {s.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#B09080', fontWeight: 600 }}>
                      Nivel: {s.current_difficulty === 'easy' ? 'Facil' : s.current_difficulty === 'medium' ? 'Medio' : 'Dificil'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditStudent(s); setShowForm(true); }}
                      style={{ fontSize: '0.75rem', color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm(`Remover ${s.name}?`)) handleDelete(s.id!); }}
                      style={{ fontSize: '0.75rem', color: '#EF233C', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      🗑️
                    </button>
                  </div>
                  <span style={{ color: '#B09080', fontSize: '1rem' }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
