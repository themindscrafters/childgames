import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';
import type { Difficulty } from '../../../data/models';

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJI_SETS = {
  animals: ['🐶', '🐱', '🐰', '🐻', '🦊', '🐸', '🐵', '🐷', '🐮', '🐔'],
  fruits: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝', '🍌', '🍉'],
  objects: ['⭐', '🌈', '🎈', '🎁', '🚀', '🌻', '🦋', '🎨', '🏀', '🎵'],
};

const GRID_CONFIG: Record<Difficulty, { cols: number; rows: number; pairs: number }> = {
  easy: { cols: 2, rows: 2, pairs: 2 },
  medium: { cols: 3, rows: 2, pairs: 3 },
  hard: { cols: 4, rows: 3, pairs: 6 },
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function MemoryCardsGame() {
  const { currentStudent } = useApp();
  const difficultyRef = useRef(new DifficultyManager(currentStudent?.current_difficulty ?? 'easy'));
  const rewardRef = useRef(new RewardSystem());

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(difficultyRef.current.getDifficulty());
  const startTimeRef = useRef(new Date());

  const generateCards = useCallback((diff: Difficulty) => {
    const config = GRID_CONFIG[diff];
    const allEmojis = shuffleArray([
      ...EMOJI_SETS.animals,
      ...EMOJI_SETS.fruits,
      ...EMOJI_SETS.objects,
    ]);
    const selected = allEmojis.slice(0, config.pairs);
    const cardEmojis = shuffleArray([...selected, ...selected]);

    return cardEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false,
    }));
  }, []);

  const initGame = useCallback(() => {
    const diff = difficultyRef.current.getDifficulty();
    const config = GRID_CONFIG[diff];
    const newCards = generateCards(diff);
    setCards(newCards);
    setFlippedIds([]);
    setIsChecking(false);
    setScore(0);
    setAttempts(0);
    setMatchedPairs(0);
    setTotalPairs(config.pairs);
    setGameComplete(false);
    setMessage('');
    setDifficulty(diff);
    rewardRef.current.reset();
    startTimeRef.current = new Date();
    audioManager.speak('Encontre os pares iguais!');
  }, [generateCards]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking || gameComplete) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;
      if (flippedIds.length >= 2) return;

      audioManager.playClick();

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));

      if (newFlipped.length === 2) {
        setIsChecking(true);
        setAttempts((a) => a + 1);

        const [firstId, secondId] = newFlipped;
        const first = cards.find((c) => c.id === firstId)!;
        const second = cards.find((c) => c.id === secondId)!;

        if (first.emoji === second.emoji) {
          // Match found
          setTimeout(() => {
            audioManager.playCorrect();
            const reward = rewardRef.current.recordCorrect();
            difficultyRef.current.recordAnswer(true);
            setMessage(reward.message);

            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, matched: true, flipped: true }
                  : c
              )
            );
            setScore((s) => s + 10);
            setMatchedPairs((m) => {
              const newMatched = m + 1;
              if (newMatched >= totalPairs) {
                setTimeout(async () => {
                  setGameComplete(true);
                  if (currentStudent?.id) {
                    await saveSession({
                      student_id: currentStudent.id,
                      game_id: 'memory-cards',
                      started_at: startTimeRef.current?.toISOString() ?? new Date().toISOString(),
                      ended_at: new Date().toISOString(),
                      difficulty: difficultyRef.current.getDifficulty(),
                      score: score + 10,
                      total_questions: totalPairs,
                      correct_answers: newMatched,
                      attempts: attempts + 1,
                      hints_used: 0,
                      completed: true,
                    });
                  }
                }, 600);
              }
              return newMatched;
            });
            setFlippedIds([]);
            setIsChecking(false);
          }, 400);
        } else {
          // No match
          setTimeout(() => {
            audioManager.playWrong();
            rewardRef.current.recordWrong();
            difficultyRef.current.recordAnswer(false);
            setMessage('Tente de novo!');

            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, flipped: false }
                  : c
              )
            );
            setFlippedIds([]);
            setIsChecking(false);
          }, 1500);
        }
      }
    },
    [cards, flippedIds, isChecking, gameComplete, totalPairs, currentStudent, score, attempts]
  );

  const gridConfig = GRID_CONFIG[difficulty];

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardRef.current.getState()}
        gameName="Jogo da Memoria"
        onPlayAgain={initGame}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Jogo da Memoria</h2>
        <div style={styles.statsRow}>
          <span style={styles.stat}>⭐ {score}</span>
          <span style={styles.stat}>
            {matchedPairs}/{totalPairs} pares
          </span>
          <span style={styles.diffBadge}>{difficultyRef.current.getConfig().label}</span>
        </div>
      </div>

      {message && (
        <div style={styles.messageBar} key={message + Date.now()}>
          {message}
        </div>
      )}

      <div style={styles.progressBarOuter}>
        <div
          style={{
            ...styles.progressBarInner,
            width: `${totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0}%`,
          }}
        />
      </div>

      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            style={{
              ...styles.cardBtn,
              ...(card.matched ? styles.cardMatched : {}),
            }}
            disabled={card.flipped || card.matched || isChecking}
            aria-label={card.flipped || card.matched ? card.emoji : 'Carta virada'}
          >
            <div
              style={{
                ...styles.cardInner,
                transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              <div style={styles.cardFront}>
                <span style={styles.cardQuestion}>?</span>
              </div>
              <div style={styles.cardBack}>
                <span style={styles.cardEmoji}>{card.emoji}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes matchPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '16px',
    gap: '12px',
    background: 'linear-gradient(135deg, #EDE9FE 0%, #DBEAFE 100%)',
    fontFamily: 'inherit',
    overflowY: 'auto',
  },
  header: {
    textAlign: 'center',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#5B21B6',
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '6px',
    flexWrap: 'wrap' as const,
  },
  stat: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#4C1D95',
  },
  diffBadge: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    background: '#7C3AED',
    borderRadius: '12px',
    padding: '2px 12px',
  },
  messageBar: {
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#7C3AED',
    animation: 'fadeInMsg 0.3s ease',
  },
  progressBarOuter: {
    width: '100%',
    height: '10px',
    borderRadius: '5px',
    background: '#C4B5FD',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #8B5CF6, #6D28D9)',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  grid: {
    display: 'grid',
    gap: '12px',
    maxHeight: '60vh',
    alignContent: 'center',
    justifyItems: 'center',
    maxWidth: '500px',
    width: '100%',
    margin: '0 auto',
  },
  cardBtn: {
    width: '100%',
    aspectRatio: '1',
    minWidth: '80px',
    minHeight: '80px',
    maxWidth: '120px',
    maxHeight: '120px',
    perspective: '600px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    WebkitTapHighlightColor: 'transparent',
  },
  cardMatched: {
    animation: 'matchPulse 0.5s ease',
  },
  cardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.5s ease',
    transformStyle: 'preserve-3d',
  },
  cardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #7C3AED, #3B82F6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
  },
  cardQuestion: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: 'rgba(255,255,255,0.7)',
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '16px',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotateY(180deg)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '3px solid #C4B5FD',
  },
  cardEmoji: {
    fontSize: '2.8rem',
  },
};
