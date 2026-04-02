import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getAdminStats, getAdminFeedback } from '../../data/db';
import { GAME_LIST } from '../../data/models';
import type { AdminStats, AdminFeedback } from '../../data/models';
import { Navigate } from 'react-router-dom';

export function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.is_admin) {
      Promise.all([getAdminStats(), getAdminFeedback()])
        .then(([s, f]) => { setStats(s); setFeedback(f); })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [profile]);

  if (!profile?.is_admin) return <Navigate to="/" replace />;

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <div className="animate-float" style={{ fontSize: '2.5rem' }}>📊</div>
        <p style={{ color: '#8B6B55', fontWeight: 700, marginTop: 12 }}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p style={{ color: '#EF233C', fontWeight: 700 }}>Erro: {error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const gameNameMap = Object.fromEntries(GAME_LIST.map((g) => [g.id, g.name]));

  return (
    <div style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            fontSize: '1.5rem',
            fontWeight: 900,
            color: '#FF6B35',
          }}
        >
          Painel Admin
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#8B6B55', fontWeight: 600 }}>
          Dados agregados — nenhuma informacao pessoal
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <KpiCard emoji="👥" label="Usuarios" value={stats.total_users} />
        <KpiCard emoji="🧒" label="Criancas" value={stats.total_students} />
        <KpiCard emoji="🎮" label="Sessoes (total)" value={stats.total_sessions} />
        <KpiCard emoji="📅" label="Hoje" value={stats.sessions_today} />
        <KpiCard emoji="📆" label="Ultimos 7d" value={stats.sessions_last_7d} />
        <KpiCard emoji="📊" label="Ultimos 30d" value={stats.sessions_last_30d} />
        <KpiCard emoji="🔥" label="Ativos 7d" value={stats.active_users_7d} />
        <KpiCard emoji="🆕" label="Signups 7d" value={stats.signups_last_7d} />
        <KpiCard emoji="🎯" label="Acuracia media" value={`${stats.avg_accuracy}%`} />
        <KpiCard emoji="⏱️" label="Min/sessao" value={`${stats.avg_session_minutes}`} />
      </div>

      {/* Users by Role */}
      {stats.users_by_role && (
        <Section title="Usuarios por tipo">
          <div style={{ display: 'flex', gap: 16 }}>
            {Object.entries(stats.users_by_role).map(([role, count]) => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧‍👦'}</span>
                <span style={{ fontWeight: 700, color: '#3D2C1E' }}>
                  {role === 'teacher' ? 'Professores' : 'Pais'}: {count}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Top Games */}
      {stats.top_games.length > 0 && (
        <Section title="Jogos mais jogados (30d)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.top_games.map((g, i) => {
              const maxPlays = stats.top_games[0].plays;
              return (
                <div key={g.game_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 24, fontWeight: 800, color: '#B09080', fontSize: '0.85rem' }}>
                    {i + 1}.
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: '#3D2C1E', fontSize: '0.9rem' }}>
                        {gameNameMap[g.game_id] ?? g.game_id}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#8B6B55', fontWeight: 600 }}>
                        {g.plays}x | {g.avg_accuracy}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: '#F0EAE4',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(g.plays / maxPlays) * 100}%`,
                          background: 'linear-gradient(90deg, #FF6B35, #FFB703)',
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Daily Sessions Chart (simple bar) */}
      {stats.daily_sessions.length > 0 && (
        <Section title="Sessoes diarias (14d)">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
            {stats.daily_sessions.map((d) => {
              const maxSessions = Math.max(...stats.daily_sessions.map((x) => x.sessions), 1);
              const height = Math.max((d.sessions / maxSessions) * 100, 4);
              const dayLabel = new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
              return (
                <div
                  key={d.date}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                >
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8B6B55' }}>
                    {d.sessions}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 32,
                      height: `${height}%`,
                      background: d.sessions > 0
                        ? 'linear-gradient(180deg, #FF6B35, #FFB703)'
                        : '#F0EAE4',
                      borderRadius: 4,
                      minHeight: 4,
                    }}
                    title={`${d.date}: ${d.sessions} sessoes, ${d.unique_students} criancas`}
                  />
                  <span style={{ fontSize: '0.55rem', color: '#B09080', fontWeight: 600 }}>
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Feedback */}
      {feedback && (
        <Section title="Feedback dos usuarios">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontFamily: "'Baloo 2', sans-serif", fontWeight: 900, color: '#FFB703' }}>
                {'⭐'.repeat(Math.round(feedback.avg_rating))}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#8B6B55', fontWeight: 700 }}>
                {feedback.avg_rating}/5 ({feedback.total} avaliacoes)
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
              {[1,2,3,4,5].map((r) => {
                const count = feedback.rating_distribution[String(r)] ?? 0;
                const max = Math.max(...Object.values(feedback.rating_distribution).map(Number), 1);
                return (
                  <div key={r} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8B6B55' }}>{count}</span>
                    <div style={{
                      width: 24, minHeight: 4, borderRadius: 3,
                      height: Math.max((count / max) * 50, 4),
                      background: count > 0 ? '#FFB703' : '#F0EAE4',
                    }} />
                    <span style={{ fontSize: '0.6rem', color: '#B09080' }}>{r}⭐</span>
                  </div>
                );
              })}
            </div>
          </div>

          {feedback.recent.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {feedback.recent.map((f) => (
                <div
                  key={f.id}
                  style={{
                    padding: '10px 12px',
                    background: '#FFF8F5',
                    borderRadius: 12,
                    border: '1px solid #F0EAE4',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.85rem' }}>
                      {'⭐'.repeat(f.rating)}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#B09080', fontWeight: 600 }}>
                      {f.user_role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧‍👦'}{' '}
                      {new Date(f.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {f.message && (
                    <p style={{ fontSize: '0.85rem', color: '#3D2C1E', fontWeight: 600, lineHeight: 1.4 }}>
                      {f.message}
                    </p>
                  )}
                  {f.page && (
                    <span style={{ fontSize: '0.65rem', color: '#B09080', fontWeight: 600 }}>
                      Pagina: {f.page}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {feedback.recent.length === 0 && (
            <p style={{ fontSize: '0.85rem', color: '#B09080', fontWeight: 600, textAlign: 'center', padding: 16 }}>
              Nenhum feedback recebido ainda
            </p>
          )}
        </Section>
      )}
    </div>
  );
}

function KpiCard({ emoji, label, value }: { emoji: string; label: string; value: string | number }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '16px 14px',
        border: '2px solid #F0EAE4',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{emoji}</div>
      <div
        style={{
          fontFamily: "'Baloo 2', system-ui, sans-serif",
          fontSize: '1.4rem',
          fontWeight: 900,
          color: '#3D2C1E',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#8B6B55', fontWeight: 700, marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: '20px 16px',
        border: '2px solid #F0EAE4',
        marginBottom: 16,
      }}
    >
      <h2
        style={{
          fontFamily: "'Baloo 2', system-ui, sans-serif",
          fontSize: '1rem',
          fontWeight: 800,
          color: '#8B6B55',
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
