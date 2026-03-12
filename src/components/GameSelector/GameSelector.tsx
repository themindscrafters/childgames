import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useAppContext';
import { GAME_LIST, type GameCategory } from '../../data/models';
import { audioManager } from '../../games/shared/AudioManager';

const CATEGORY_CONFIG_EARLY: Record<string, { label: string; emoji: string; color: string; bg: string; shadow: string }> = {
  literacy: { label: 'Alfabetização', emoji: '📖', color: '#FF6FA8', bg: '#FFF0F6', shadow: 'rgba(255,111,168,0.35)' },
  math:     { label: 'Matemática',    emoji: '🔢', color: '#00B4D8', bg: '#E8F8FF', shadow: 'rgba(0,180,216,0.35)' },
  memory:   { label: 'Memória',       emoji: '🧠', color: '#7B5EA7', bg: '#F3EEFF', shadow: 'rgba(123,94,167,0.35)' },
  motor:    { label: 'Coordenação',   emoji: '✍️', color: '#FF6B35', bg: '#FFF0E8', shadow: 'rgba(255,107,53,0.35)' },
  social:   { label: 'Emoções',       emoji: '😊', color: '#06D6A0', bg: '#E8FFF8', shadow: 'rgba(6,214,160,0.35)' },
};

const CATEGORY_CONFIG_5ANO: Record<string, { label: string; emoji: string; color: string; bg: string; shadow: string }> = {
  matematica:          { label: 'Matemática',          emoji: '🧮', color: '#059669', bg: '#ECFDF5', shadow: 'rgba(5,150,105,0.35)' },
  portugues:           { label: 'Português',           emoji: '📚', color: '#6366F1', bg: '#EEF2FF', shadow: 'rgba(99,102,241,0.35)' },
  ciencias:            { label: 'Ciências',            emoji: '🔬', color: '#F59E0B', bg: '#FFFBEB', shadow: 'rgba(245,158,11,0.35)' },
  'geografia-historia': { label: 'Geografia e História', emoji: '🌎', color: '#06B6D4', bg: '#ECFEFF', shadow: 'rgba(6,182,212,0.35)' },
};

const CATEGORY_ORDER_EARLY: GameCategory[] = ['literacy', 'math', 'memory', 'motor', 'social'];
const CATEGORY_ORDER_5ANO: GameCategory[] = ['matematica', 'portugues', 'ciencias', 'geografia-historia'];

function GradeSection({
  title,
  subtitle,
  gradient,
  borderColor,
  categoryOrder,
  categoryConfig,
  games,
}: {
  title: string;
  subtitle: string;
  gradient: string;
  borderColor: string;
  categoryOrder: GameCategory[];
  categoryConfig: Record<string, { label: string; emoji: string; color: string; bg: string; shadow: string }>;
  games: typeof GAME_LIST;
}) {
  const navigate = useNavigate();

  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    ...categoryConfig[cat],
    games: games.filter((g) => g.category === cat),
  })).filter((g) => g.games.length > 0);

  if (grouped.length === 0) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section Header */}
      <div
        style={{
          background: gradient,
          borderRadius: 20,
          padding: '16px 20px',
          marginBottom: 20,
          border: `2px solid ${borderColor}`,
          boxShadow: `0 4px 16px ${borderColor}33`,
        }}
      >
        <h3
          style={{
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            fontSize: '1.4rem',
            fontWeight: 900,
            color: '#1F2937',
            margin: 0,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            fontSize: '0.85rem',
            color: '#6B7280',
            margin: '4px 0 0',
            fontWeight: 600,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Category Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {grouped.map(({ category, label, emoji, color, bg, shadow, games: catGames }) => (
          <div key={category}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: bg,
                border: `2px solid ${color}`,
                borderRadius: 30,
                padding: '6px 16px 6px 10px',
                marginBottom: 12,
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
              <span
                style={{
                  fontFamily: "'Baloo 2', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: '1rem',
                  color,
                }}
              >
                {label}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {catGames.map((game, i) => (
                <button
                  key={game.id}
                  onClick={() => {
                    audioManager.playSelect();
                    navigate(`/game/${game.id}`);
                  }}
                  className="animate-bounce-in"
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    background: game.color,
                    borderRadius: 20,
                    padding: '18px 12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    border: 'none',
                    minHeight: 110,
                    boxShadow: `0 6px 0 0 rgba(0,0,0,0.18), 0 10px 24px ${shadow}`,
                    transition: 'transform 0.12s, box-shadow 0.12s',
                    color: '#fff',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-3px) scale(1.03)';
                    el.style.boxShadow = `0 9px 0 0 rgba(0,0,0,0.18), 0 14px 28px ${shadow}`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0) scale(1)';
                    el.style.boxShadow = `0 6px 0 0 rgba(0,0,0,0.18), 0 10px 24px ${shadow}`;
                  }}
                  onMouseDown={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(4px)';
                    el.style.boxShadow = `0 2px 0 0 rgba(0,0,0,0.18)`;
                  }}
                  onMouseUp={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = `0 6px 0 0 rgba(0,0,0,0.18), 0 10px 24px ${shadow}`;
                  }}
                >
                  <span style={{ fontSize: '2.4rem', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                    {game.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Baloo 2', system-ui, sans-serif",
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    {game.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GameSelector() {
  const { currentStudent } = useApp();

  const enabledGames = currentStudent?.settings.enabledGames ?? GAME_LIST.map((g) => g.id);
  const games = GAME_LIST.filter((g) => enabledGames.includes(g.id));

  const earlyGames = games.filter((g) => g.gradeLevel === 'early');
  const fiveGames = games.filter((g) => g.gradeLevel === '5ano');

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 16px 32px' }}>
      <h2
        style={{
          fontFamily: "'Baloo 2', system-ui, sans-serif",
          fontSize: '1.8rem',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: 20,
          background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Escolha um Jogo! 🎯
      </h2>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <GradeSection
          title="🧒 Educação Infantil"
          subtitle="Jogos para os primeiros anos de aprendizado"
          gradient="linear-gradient(135deg, #FFF7ED, #FEF3C7)"
          borderColor="#FBBF24"
          categoryOrder={CATEGORY_ORDER_EARLY}
          categoryConfig={CATEGORY_CONFIG_EARLY}
          games={earlyGames}
        />

        <GradeSection
          title="📚 5º Ano — Fundamental I"
          subtitle="Desafios para alunos do 5º ano"
          gradient="linear-gradient(135deg, #EEF2FF, #E0E7FF)"
          borderColor="#818CF8"
          categoryOrder={CATEGORY_ORDER_5ANO}
          categoryConfig={CATEGORY_CONFIG_5ANO}
          games={fiveGames}
        />
      </div>
    </div>
  );
}
