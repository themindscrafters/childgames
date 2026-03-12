import type { RewardState } from '../../games/shared/RewardSystem';
import { audioManager } from '../../games/shared/AudioManager';

interface GameCompleteProps {
  reward: RewardState;
  gameName: string;
  onPlayAgain: () => void;
}

export function GameComplete({ reward, gameName, onPlayAgain }: GameCompleteProps) {
  audioManager.playSuccess();

  const starsArr = Array.from({ length: 5 }, (_, i) => i < reward.stars);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '24px 20px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 60% 0%, #FFF3E0 0%, #FFF8EF 60%)',
        overflowY: 'auto',
      }}
    >
      {/* Trophy */}
      <div
        className="animate-star-spin"
        style={{ fontSize: '4.5rem', lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(255,183,3,0.5))' }}
      >
        🏆
      </div>

      {/* Title */}
      <div>
        <h2
          style={{
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            fontSize: '2.2rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          Parabéns! 🎉
        </h2>
        <p style={{ color: '#8B6B55', fontWeight: 700, fontSize: '1rem' }}>
          Você completou o <strong style={{ color: '#FF6B35' }}>{gameName}</strong>!
        </p>
      </div>

      {/* Stars row */}
      <div style={{ display: 'flex', gap: 6 }}>
        {starsArr.map((filled, i) => (
          <span
            key={i}
            className="animate-bounce-in"
            style={{
              fontSize: '2rem',
              animationDelay: `${i * 0.1}s`,
              filter: filled
                ? 'drop-shadow(0 2px 6px rgba(255,183,3,0.7))'
                : 'grayscale(1) opacity(0.3)',
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          style={{
            background: '#FFF8E1',
            border: '2px solid #FFB703',
            borderRadius: 16,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 0 0 #E09E00',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>⭐</span>
          <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '1.4rem', fontWeight: 900, color: '#E09E00' }}>
            {reward.stars}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#8B6B55', fontWeight: 700 }}>estrelas</span>
        </div>

        <div
          style={{
            background: '#E8FFF5',
            border: '2px solid #06D6A0',
            borderRadius: 16,
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 0 0 #04A87E',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>✅</span>
          <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '1.4rem', fontWeight: 900, color: '#04A87E' }}>
            {reward.totalCorrect}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#8B6B55', fontWeight: 700 }}>acertos</span>
        </div>

        {reward.bestStreak > 1 && (
          <div
            style={{
              background: '#FFF0E8',
              border: '2px solid #FF6B35',
              borderRadius: 16,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 0 0 #E04E18',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔥</span>
            <span style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '1.4rem', fontWeight: 900, color: '#E04E18' }}>
              {reward.bestStreak}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#8B6B55', fontWeight: 700 }}>seguidos</span>
          </div>
        )}
      </div>

      {/* Stickers */}
      {reward.stickers.length > 0 && (
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#8B6B55', marginBottom: 8 }}>
            🎁 Adesivos conquistados:
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {reward.stickers.map((s, i) => (
              <span
                key={i}
                className="animate-bounce-in"
                style={{ fontSize: '2.2rem', animationDelay: `${i * 0.12}s` }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onPlayAgain}
          className="game-btn"
          style={{
            background: 'linear-gradient(135deg, #FF6B35, #FF9A6C)',
            color: '#fff',
            padding: '0 28px',
            fontSize: '1rem',
            minHeight: 56,
            boxShadow: '0 6px 0 0 #E04E18',
          }}
        >
          🔄 Jogar de novo
        </button>
        <button
          onClick={() => {
            audioManager.playClick();
            window.history.back();
          }}
          className="game-btn"
          style={{
            background: '#fff',
            color: '#FF6B35',
            border: '3px solid #FF6B35',
            padding: '0 28px',
            fontSize: '1rem',
            minHeight: 56,
            boxShadow: '0 6px 0 0 rgba(224,78,24,0.3)',
          }}
        >
          🎮 Outros jogos
        </button>
      </div>
    </div>
  );
}
