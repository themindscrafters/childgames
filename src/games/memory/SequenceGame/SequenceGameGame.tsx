import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';
import type { Difficulty } from '../../../data/models';

interface ColorButton {
  id: number;
  color: string;
  activeColor: string;
  label: string;
  frequency: number;
}

const BUTTONS: ColorButton[] = [
  { id: 0, color: '#DC2626', activeColor: '#FCA5A5', label: 'Vermelho', frequency: 261 },
  { id: 1, color: '#2563EB', activeColor: '#93C5FD', label: 'Azul', frequency: 329 },
  { id: 2, color: '#16A34A', activeColor: '#86EFAC', label: 'Verde', frequency: 392 },
  { id: 3, color: '#EAB308', activeColor: '#FDE68A', label: 'Amarelo', frequency: 523 },
];

const LEVEL_CONFIG: Record<Difficulty, { startLength: number; maxLength: number }> = {
  easy: { startLength: 2, maxLength: 4 },
  medium: { startLength: 3, maxLength: 6 },
  hard: { startLength: 3, maxLength: 8 },
};

type Phase = 'idle' | 'showing' | 'input' | 'wrong' | 'levelUp' | 'complete';

export function SequenceGameGame() {
  const { currentStudent } = useApp();
  const difficultyRef = useRef(new DifficultyManager(currentStudent?.currentDifficulty ?? 'easy'));
  const rewardRef = useRef(new RewardSystem());

  const [phase, setPhase] = useState<Phase>('idle');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [shakeButton, setShakeButton] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sequenceLength, setSequenceLength] = useState(2);
  const [maxLength, setMaxLength] = useState(4);
  const [difficulty, setDifficulty] = useState<Difficulty>(difficultyRef.current.getDifficulty());
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const startTimeRef = useRef(new Date());
  const showingRef = useRef(false);

  const generateSequence = useCallback((length: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * 4));
  }, []);

  const flashButton = useCallback((buttonId: number): Promise<void> => {
    return new Promise((resolve) => {
      setActiveButton(buttonId);
      audioManager.playTone(BUTTONS[buttonId].frequency, 300);
      setTimeout(() => {
        setActiveButton(null);
        setTimeout(resolve, 200);
      }, 400);
    });
  }, []);

  const playSequence = useCallback(
    async (seq: number[]) => {
      showingRef.current = true;
      setPhase('showing');
      setPlayerInput([]);

      await new Promise((r) => setTimeout(r, 600));

      for (const btnId of seq) {
        if (!showingRef.current) return;
        await flashButton(btnId);
      }

      if (showingRef.current) {
        setPhase('input');
        showingRef.current = false;
      }
    },
    [flashButton]
  );

  const initGame = useCallback(() => {
    const diff = difficultyRef.current.getDifficulty();
    const config = LEVEL_CONFIG[diff];
    const seq = generateSequence(config.startLength);

    setDifficulty(diff);
    setSequenceLength(config.startLength);
    setMaxLength(config.maxLength);
    setSequence(seq);
    setPlayerInput([]);
    setScore(0);
    setCurrentLevel(1);
    setGameComplete(false);
    setMessage('');
    setAttempts(0);
    setCorrectAnswers(0);
    rewardRef.current.reset();
    startTimeRef.current = new Date();
    showingRef.current = false;

    audioManager.speak('Repita a sequencia de cores!');
    setTimeout(() => playSequence(seq), 1500);
  }, [generateSequence, playSequence]);

  useEffect(() => {
    initGame();
    return () => {
      showingRef.current = false;
    };
  }, [initGame]);

  const handleButtonPress = useCallback(
    async (buttonId: number) => {
      if (phase !== 'input' || gameComplete) return;

      audioManager.playTone(BUTTONS[buttonId].frequency, 200);
      setActiveButton(buttonId);
      setTimeout(() => setActiveButton(null), 200);

      const newInput = [...playerInput, buttonId];
      setPlayerInput(newInput);

      const inputIndex = newInput.length - 1;

      if (newInput[inputIndex] !== sequence[inputIndex]) {
        // Wrong
        setPhase('wrong');
        setShakeButton(buttonId);
        setAttempts((a) => a + 1);
        audioManager.playWrong();
        rewardRef.current.recordWrong();
        difficultyRef.current.recordAnswer(false);
        setMessage('Ops! Vamos tentar de novo!');

        setTimeout(() => {
          setShakeButton(null);
          playSequence(sequence);
        }, 1800);
        return;
      }

      if (newInput.length === sequence.length) {
        // Completed sequence
        setAttempts((a) => a + 1);
        setCorrectAnswers((c) => c + 1);
        const reward = rewardRef.current.recordCorrect();
        difficultyRef.current.recordAnswer(true);
        setScore((s) => s + sequenceLength * 10);
        setMessage(reward.message);
        audioManager.playCorrect();

        if (sequenceLength >= maxLength) {
          // Game complete
          setPhase('complete');
          setTimeout(async () => {
            setGameComplete(true);
            if (currentStudent?.id) {
              await saveSession({
                studentId: currentStudent.id,
                gameId: 'sequence-game',
                startedAt: startTimeRef.current,
                endedAt: new Date(),
                difficulty: difficultyRef.current.getDifficulty(),
                score: score + sequenceLength * 10,
                totalQuestions: maxLength - LEVEL_CONFIG[difficulty].startLength + 1,
                correctAnswers: correctAnswers + 1,
                attempts: attempts + 1,
                hintsUsed: 0,
                completed: true,
              });
            }
          }, 800);
          return;
        }

        // Next level
        setPhase('levelUp');
        const nextLength = sequenceLength + 1;
        const nextSeq = generateSequence(nextLength);

        setTimeout(() => {
          setSequenceLength(nextLength);
          setCurrentLevel((l) => l + 1);
          setSequence(nextSeq);
          playSequence(nextSeq);
        }, 1500);
      }
    },
    [
      phase,
      gameComplete,
      playerInput,
      sequence,
      sequenceLength,
      maxLength,
      playSequence,
      generateSequence,
      currentStudent,
      score,
      difficulty,
      correctAnswers,
      attempts,
    ]
  );

  const totalLevels = maxLength - LEVEL_CONFIG[difficulty].startLength + 1;
  const progressPercent = totalLevels > 0 ? ((currentLevel - 1) / totalLevels) * 100 : 0;

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardRef.current.getState()}
        gameName="Sequencia Magica"
        onPlayAgain={initGame}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Sequencia Magica</h2>
        <div style={styles.statsRow}>
          <span style={styles.stat}>⭐ {score}</span>
          <span style={styles.stat}>Nivel {currentLevel}</span>
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
            width: `${progressPercent}%`,
          }}
        />
      </div>

      <div style={styles.phaseLabel}>
        {phase === 'showing' && 'Observe a sequencia...'}
        {phase === 'input' && `Sua vez! (${playerInput.length}/${sequence.length})`}
        {phase === 'wrong' && 'Prestando atencao...'}
        {phase === 'levelUp' && 'Proximo nivel!'}
      </div>

      <div style={styles.quadrantGrid}>
        {BUTTONS.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleButtonPress(btn.id)}
            disabled={phase !== 'input'}
            aria-label={btn.label}
            style={{
              ...styles.quadrantBtn,
              background:
                activeButton === btn.id ? btn.activeColor : btn.color,
              transform:
                shakeButton === btn.id
                  ? 'translateX(-6px)'
                  : activeButton === btn.id
                  ? 'scale(0.95)'
                  : 'scale(1)',
              opacity: phase === 'showing' && activeButton !== btn.id ? 0.5 : 1,
              boxShadow:
                activeButton === btn.id
                  ? `0 0 30px ${btn.activeColor}, 0 0 60px ${btn.activeColor}40`
                  : `0 6px 20px ${btn.color}40`,
            }}
          >
            <span style={styles.quadrantLabel}>{btn.label}</span>
          </button>
        ))}
      </div>

      <div style={styles.sequenceDots}>
        {sequence.map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.dot,
              background:
                i < playerInput.length
                  ? BUTTONS[sequence[i]].color
                  : '#D1D5DB',
              transform: i < playerInput.length ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
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
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCA5A5 100%)',
    fontFamily: 'inherit',
    overflowY: 'auto',
  },
  header: {
    textAlign: 'center',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#92400E',
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
    color: '#78350F',
  },
  diffBadge: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    background: '#D97706',
    borderRadius: '12px',
    padding: '2px 12px',
  },
  messageBar: {
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#D97706',
    animation: 'fadeInMsg 0.3s ease',
  },
  progressBarOuter: {
    width: '100%',
    height: '10px',
    borderRadius: '5px',
    background: '#FDE68A',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #F59E0B, #D97706)',
    borderRadius: '5px',
    transition: 'width 0.5s ease',
  },
  phaseLabel: {
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#92400E',
    minHeight: '1.5em',
  },
  quadrantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '12px',
    maxHeight: '60vh',
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto',
  },
  quadrantBtn: {
    width: '100%',
    height: '100%',
    minWidth: '80px',
    minHeight: '80px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    WebkitTapHighlightColor: 'transparent',
    padding: 0,
  },
  quadrantLabel: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.9)',
    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
    userSelect: 'none',
  },
  sequenceDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: '8px 0',
    flexWrap: 'wrap' as const,
  },
  dot: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
};
