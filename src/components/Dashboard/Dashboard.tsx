import { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useAppContext';
import { StudentForm } from '../StudentManager/StudentForm';
import { deleteStudent, getStudentSessions } from '../../data/db';
import { GAME_LIST, type GameSession } from '../../data/models';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getStoredPin, setStoredPin } from '../Layout/PinModal';

export function Dashboard() {
  const { students, refreshStudents } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const [editStudent, setEditStudent] = useState<typeof students[0] | undefined>();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);

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

  const getGameStats = () => {
    const stats = GAME_LIST.map((game) => {
      const gameSessions = sessions.filter((s) => s.gameId === game.id);
      const totalCorrect = gameSessions.reduce((sum, s) => sum + s.correctAnswers, 0);
      const totalQuestions = gameSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
      return {
        name: game.name.substring(0, 10),
        acertos: totalCorrect,
        total: totalQuestions,
        sessoes: gameSessions.length,
      };
    }).filter((s) => s.sessoes > 0);
    return stats;
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
            👩‍🏫 Painel do Professor
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
            + Novo Aluno
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total de Alunos', value: students.length, color: '#FF6B35', border: '#FFD0BC', bg: '#FFF0E8' },
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
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
              👨‍🎓 Alunos
            </h3>
            {students.length === 0 ? (
              <p style={{ color: '#B09080', fontSize: '0.9rem' }}>Nenhum aluno cadastrado.</p>
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
          </div>

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
              📊 {selectedStudentId ? `Progresso — ${students.find((s) => s.id === selectedStudentId)?.name}` : 'Selecione um aluno'}
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
                {selectedStudentId ? 'Nenhuma sessão registrada.' : 'Clique em um aluno para ver o progresso.'}
              </p>
            )}
          </div>
        </div>

        {/* Segurança — alterar PIN */}
        <div
          style={{
            background: '#fff',
            border: '2px solid #F0EAE4',
            borderRadius: 18,
            padding: '20px',
            boxShadow: '0 4px 0 0 #F0EAE4, 0 6px 20px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showPinChange ? 14 : 0 }}>
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#3D2C1E' }}>
              🔒 PIN do Modo Professor
            </h3>
            <button
              onClick={() => { setShowPinChange(!showPinChange); setNewPin(''); setPinMsg(''); }}
              style={{
                fontSize: '0.8rem', fontWeight: 800, color: '#FF6B35',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              {showPinChange ? 'Cancelar' : 'Alterar PIN'}
            </button>
          </div>

          {showPinChange && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: '0.8rem', color: '#8B6B55', fontWeight: 600 }}>
                PIN atual: <strong style={{ fontFamily: 'monospace', letterSpacing: 4 }}>{'•'.repeat(getStoredPin().length)}</strong>
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Novo PIN (4 dígitos)"
                  value={newPin}
                  onChange={(e) => { setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinMsg(''); }}
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 12,
                    border: '2px solid #FFD0BC', fontSize: '1rem',
                    fontFamily: "'Nunito', system-ui, sans-serif", fontWeight: 700,
                    outline: 'none', background: '#FFF8F5', letterSpacing: 6,
                  }}
                />
                <button
                  onClick={() => {
                    if (newPin.length !== 4) { setPinMsg('O PIN deve ter 4 dígitos.'); return; }
                    setStoredPin(newPin);
                    setPinMsg('✅ PIN alterado com sucesso!');
                    setNewPin('');
                    setTimeout(() => { setShowPinChange(false); setPinMsg(''); }, 1500);
                  }}
                  style={{
                    padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
                    color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                    boxShadow: '0 4px 0 0 #E04E18',
                    fontFamily: "'Baloo 2', sans-serif",
                  }}
                >
                  Salvar
                </button>
              </div>
              {pinMsg && (
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: pinMsg.startsWith('✅') ? '#06D6A0' : '#EF233C' }}>
                  {pinMsg}
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
