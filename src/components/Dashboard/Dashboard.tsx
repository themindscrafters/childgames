import { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useAppContext';
import { useAuth } from '../../hooks/useAuth';
import { StudentForm } from '../StudentManager/StudentForm';
import { deleteStudent, getStudentSessions, createInvite, redeemInvite } from '../../data/db';
import { GAME_LIST, ROLE_LABELS, type GameSession } from '../../data/models';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { students, refreshStudents } = useApp();
  const { profile } = useAuth();
  const labels = ROLE_LABELS[profile?.role ?? 'teacher'];

  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState<typeof students[0] | undefined>();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);

  // Invite state
  const [inviteCode, setInviteCode] = useState('');
  const [inviteStudentId, setInviteStudentId] = useState<number | null>(null);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMsg, setRedeemMsg] = useState('');

  useEffect(() => {
    if (selectedStudentId) {
      getStudentSessions(selectedStudentId).then(setSessions);
    }
  }, [selectedStudentId]);

  const handleDelete = async (id: number) => {
    await deleteStudent(id);
    await refreshStudents();
    if (selectedStudentId === id) {
      setSelectedStudentId(null);
      setSessions([]);
    }
  };

  const handleInvite = async (studentId: number) => {
    const code = await createInvite(studentId);
    setInviteCode(code);
    setInviteStudentId(studentId);
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

  const getGameStats = () => {
    return GAME_LIST.map((game) => {
      const gameSessions = sessions.filter((s) => s.game_id === game.id);
      const totalCorrect = gameSessions.reduce((sum, s) => sum + s.correct_answers, 0);
      const totalQuestions = gameSessions.reduce((sum, s) => sum + s.total_questions, 0);
      return {
        name: game.name.substring(0, 10),
        acertos: totalCorrect,
        total: totalQuestions,
        sessoes: gameSessions.length,
      };
    }).filter((s) => s.sessoes > 0);
  };

  if (showForm) {
    return (
      <div className="h-full overflow-y-auto px-4 py-6">
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
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px 20px 32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Baloo 2', system-ui, sans-serif", fontSize: '1.8rem', fontWeight: 900, color: '#FF6B35' }}>
            {labels.icon} {labels.title}
          </h2>
          <button
            onClick={() => {
              setEditStudent(undefined);
              setShowForm(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 0 0 #E04E18',
              fontFamily: "'Nunito', system-ui, sans-serif",
            }}
          >
            {labels.newChild}
          </button>
        </div>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: `Total de ${labels.childLabelPlural}`, value: students.length, color: '#FF6B35', border: '#FFD0BC', bg: '#FFF0E8' },
            { label: 'Sessões Registradas', value: sessions.length, color: '#06D6A0', border: '#B3F0E0', bg: '#E8FFF5' },
            { label: 'Jogos Disponíveis', value: GAME_LIST.length, color: '#FFB703', border: '#FFE58A', bg: '#FFF8E1' },
          ].map(({ label, value, color, border, bg }) => (
            <div
              key={label}
              style={{
                background: bg,
                border: `2px solid ${border}`,
                borderRadius: 18,
                padding: '16px 20px',
                boxShadow: `0 4px 0 0 ${border}, 0 6px 20px rgba(0,0,0,0.06)`,
              }}
            >
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B6B55', marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '2.4rem', fontWeight: 900, color, lineHeight: 1 }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Redeem invite code */}
        <div
          style={{
            background: '#E8F8FF',
            border: '2px solid #B3E0F0',
            borderRadius: 18,
            padding: '16px 20px',
            boxShadow: '0 4px 0 0 #B3E0F0',
          }}
        >
          <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#0077B6', marginBottom: 10 }}>
            🔗 Tenho um código de convite
          </h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => { setRedeemCode(e.target.value.toUpperCase()); setRedeemMsg(''); }}
              placeholder="Ex: ABC123"
              maxLength={6}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 12,
                border: '2px solid #B3E0F0',
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                letterSpacing: 4,
                textAlign: 'center',
                outline: 'none',
                background: '#fff',
                textTransform: 'uppercase',
              }}
            />
            <button
              onClick={handleRedeem}
              disabled={redeemCode.length < 4}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: 'none',
                cursor: redeemCode.length >= 4 ? 'pointer' : 'not-allowed',
                background: redeemCode.length >= 4 ? '#0077B6' : '#B3E0F0',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                boxShadow: redeemCode.length >= 4 ? '0 3px 0 0 #005A8C' : 'none',
              }}
            >
              Usar
            </button>
          </div>
          {redeemMsg && (
            <p style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: 8, color: redeemMsg.startsWith('✅') ? '#06D6A0' : '#EF233C' }}>
              {redeemMsg}
            </p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {/* Student list */}
          <div
            style={{
              background: '#fff',
              border: '2px solid #FFD0BC',
              borderRadius: 18,
              padding: '20px',
              boxShadow: '0 4px 0 0 #FFD0BC, 0 6px 20px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#3D2C1E', marginBottom: 12 }}>
              👨‍🎓 {labels.childLabelPlural}
            </h3>
            {students.length === 0 ? (
              <p style={{ color: '#B09080', fontSize: '0.9rem' }}>{labels.noChildren}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {students.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id!)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 12,
                      cursor: 'pointer',
                      background: selectedStudentId === s.id ? '#FFF0E8' : '#F9F5F2',
                      border: selectedStudentId === s.id ? '2px solid #FF6B35' : '2px solid transparent',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{s.avatar}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#3D2C1E' }}>{s.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#B09080' }}>
                        {s.difficulties.filter((d) => d !== 'none').join(', ') || 'Sem dificuldades'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleInvite(s.id!); }}
                      title="Gerar código de convite"
                      style={{ fontSize: '0.75rem', color: '#0077B6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      🔗
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditStudent(s); setShowForm(true); }}
                      style={{ fontSize: '0.75rem', color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm(`Remover ${s.name}?`)) handleDelete(s.id!); }}
                      style={{ fontSize: '0.75rem', color: '#EF233C', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Show invite code if generated */}
            {inviteCode && (
              <div
                style={{
                  marginTop: 12,
                  background: '#E8FFF5',
                  border: '2px solid #06D6A0',
                  borderRadius: 12,
                  padding: '12px 16px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#06D6A0', marginBottom: 4 }}>
                  Código de convite para {students.find(s => s.id === inviteStudentId)?.name}:
                </p>
                <p style={{
                  fontFamily: 'monospace',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#3D2C1E',
                  letterSpacing: 6,
                }}>
                  {inviteCode}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#8B6B55', marginTop: 4 }}>
                  Válido por 7 dias. Compartilhe com outro responsável.
                </p>
              </div>
            )}
          </div>

          {/* Progress chart */}
          <div
            style={{
              background: '#fff',
              border: '2px solid #B3F0E0',
              borderRadius: 18,
              padding: '20px',
              boxShadow: '0 4px 0 0 #B3F0E0, 0 6px 20px rgba(0,0,0,0.06)',
            }}
          >
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#3D2C1E', marginBottom: 12 }}>
              📊 {selectedStudentId ? `Progresso — ${students.find((s) => s.id === selectedStudentId)?.name}` : `Selecione um ${labels.childLabel.toLowerCase()}`}
            </h3>
            {selectedStudentId && sessions.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getGameStats()}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="acertos" fill="#06D6A0" name="Acertos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#FFE58A" name="Total" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: '#B09080', fontSize: '0.9rem' }}>
                {selectedStudentId ? 'Nenhuma sessão registrada.' : `Clique em um ${labels.childLabel.toLowerCase()} para ver o progresso.`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
