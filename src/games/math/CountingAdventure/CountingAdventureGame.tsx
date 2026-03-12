import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';
import type { Difficulty } from '../../../data/models';

const TOTAL_ROUNDS = 10;

interface Theme {
  emoji: string;
  name: string;
  namePlural: string;
}

const THEMES: Theme[] = [
  { emoji: '\uD83C\uDF4E', name: 'maca', namePlural: 'macas' },
  { emoji: '\uD83D\uDC1F', name: 'peixe', namePlural: 'peixes' },
  { emoji: '\u2B50', name: 'estrela', namePlural: 'estrelas' },
  { emoji: '\uD83C\uDF3A', name: 'flor', namePlural: 'flores' },
  { emoji: '\uD83E\uDD8B', name: 'borboleta', namePlural: 'borboletas' },
];

const DIFFICULTY_SETTINGS: Record<Difficulty, { minCount: number; maxCount: number; optionCount: number }> = {
  easy: { minCount: 1, maxCount: 5, optionCount: 2 },
  medium: { minCount: 3, maxCount: 8, optionCount: 3 },
  hard: { minCount: 5, maxCount: 12, optionCount: 4 },
};

function generateOptions(correct: number, count: number, min: number, max: number): number[] {
  const options = new Set<number>([correct]);
  while (options.size < count) {
    const offset = Math.random() < 0.5 ? -1 : 1;
    const candidate = correct + offset * (Math.floor(Math.random() * 3) + 1);
    if (candidate >= min && candidate <= max && !options.has(candidate)) {
      options.add(candidate);
    } else {
      const fallback = min + Math.floor(Math.random() * (max - min + 1));
      if (!options.has(fallback)) {
        options.add(fallback);
      }
    }
  }
  return [...options].sort(() => Math.random() - 0.5);
}

function generateObjectPositions(count: number): { x: number; y: number; delay: number; rotation: number }[] {
  const positions: { x: number; y: number; delay: number; rotation: number }[] = [];
  const gridCols = Math.ceil(Math.sqrt(count * 1.5));
  const gridRows = Math.ceil(count / gridCols);
  const cellW = 80 / gridCols;
  const cellH = 70 / gridRows;

  for (let i = 0; i < count; i++) {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);
    positions.push({
      x: 10 + col * cellW + Math.random() * cellW * 0.4,
      y: 10 + row * cellH + Math.random() * cellH * 0.4,
      delay: i * 0.15,
      rotation: Math.random() * 30 - 15,
    });
  }
  return positions;
}

export function CountingAdventureGame() {
  const { currentStudent } = useApp();
  const difficultyManager = useRef(
    new DifficultyManager(currentStudent?.currentDifficulty ?? 'easy')
  ).current;
  const rewardSystem = useRef(new RewardSystem()).current;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(1);
  const [options, setOptions] = useState<number[]>([]);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [objects, setObjects] = useState<{ x: number; y: number; delay: number; rotation: number }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [objectsVisible, setObjectsVisible] = useState(false);
  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const settings = DIFFICULTY_SETTINGS[diff];
    const count = settings.minCount + Math.floor(Math.random() * (settings.maxCount - settings.minCount + 1));
    const newTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const opts = generateOptions(count, settings.optionCount, settings.minCount, settings.maxCount);
    const positions = generateObjectPositions(count);

    setCorrectCount(count);
    setTheme(newTheme);
    setOptions(opts);
    setObjects(positions);
    setSelected(null);
    setFeedback(null);
    setObjectsVisible(false);

    setTimeout(() => setObjectsVisible(true), 100);

    const itemName = count === 1 ? newTheme.name : newTheme.namePlural;
    audioManager.speak(`Quantos ${itemName} voce ve?`);
  }, [difficultyManager]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleSelect = useCallback(
    (num: number) => {
      if (feedback !== null) return;

      setSelected(num);
      setAttempts((a) => a + 1);
      audioManager.speak(String(num));

      if (num === correctCount) {
        setFeedback('correct');
        setScore((s) => s + 1);
        const rewardState = rewardSystem.recordCorrect();
        difficultyManager.recordAnswer(true);
        setMessage(rewardState.message);
        audioManager.playCorrect();

        setTimeout(() => {
          const nextRound = round + 1;
          if (nextRound >= TOTAL_ROUNDS) {
            finishGame(score + 1);
          } else {
            setRound(nextRound);
            generateRound();
          }
        }, 1500);
      } else {
        setFeedback('wrong');
        const rewardState = rewardSystem.recordWrong();
        difficultyManager.recordAnswer(false);
        setMessage(rewardState.message);
        audioManager.playWrong();

        setTimeout(() => {
          setFeedback(null);
          setSelected(null);
        }, 1200);
      }
    },
    [feedback, correctCount, round, score, generateRound, rewardSystem, difficultyManager]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          studentId: currentStudent.id,
          gameId: 'counting-adventure',
          startedAt: startTime.current,
          endedAt: new Date(),
          difficulty: difficultyManager.getDifficulty(),
          score: finalScore,
          totalQuestions: TOTAL_ROUNDS,
          correctAnswers: finalScore,
          attempts,
          hintsUsed,
          completed: true,
        });
      }
    },
    [currentStudent, difficultyManager, attempts, hintsUsed]
  );

  const handlePlayAgain = useCallback(() => {
    difficultyManager.reset();
    rewardSystem.reset();
    setRound(0);
    setScore(0);
    setAttempts(0);
    setHintsUsed(0);
    setGameComplete(false);
    startTime.current = new Date();
    generateRound();
  }, [difficultyManager, rewardSystem, generateRound]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardSystem.getState()}
        gameName="Aventura de Contagem"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  const diffLabel =
    difficultyManager.getDifficulty() === 'easy'
      ? 'Facil'
      : difficultyManager.getDifficulty() === 'medium'
        ? 'Medio'
        : 'Dificil';

  const itemName = correctCount === 1 ? theme.name : theme.namePlural;
  const emojiSize = correctCount <= 5 ? '48px' : correctCount <= 8 ? '38px' : '30px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '16px',
        gap: '12px',
        fontFamily: 'inherit',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{theme.emoji}</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#059669' }}>
            Aventura de Contagem
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              background: '#FEF3C7',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {diffLabel}
          </span>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>
            {round + 1}/{TOTAL_ROUNDS}
          </span>
          <span style={{ fontSize: '20px' }}>{'\u2B50'} {score}</span>
        </div>
      </div>

      {/* Reward streak */}
      {rewardSystem.getState().streak >= 2 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#F59E0B',
            fontWeight: 'bold',
          }}
        >
          {'\uD83D\uDD25'} {rewardSystem.getState().streak} seguidos!
        </div>
      )}

      {/* Question */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#374151',
          padding: '4px 0',
          flexShrink: 0,
        }}
      >
        Quantos {itemName} voce ve?
      </div>

      {/* Objects display area */}
      <div
        style={{
          maxHeight: '60vh',
          position: 'relative',
          background: 'linear-gradient(135deg, #FEF3C7, #ECFDF5)',
          borderRadius: '24px',
          border: '3px solid #D1FAE5',
          minHeight: '200px',
          overflow: 'hidden',
        }}
      >
        {objects.map((obj, i) => (
          <div
            key={`${round}-${i}`}
            style={{
              position: 'absolute',
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              fontSize: emojiSize,
              transform: objectsVisible
                ? `scale(1) rotate(${obj.rotation}deg)`
                : 'scale(0) rotate(0deg)',
              transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${obj.delay}s`,
              lineHeight: 1,
            }}
          >
            {theme.emoji}
          </div>
        ))}
      </div>

      {/* Feedback message */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '32px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#EF4444' : 'transparent',
          transition: 'color 0.2s',
        }}
      >
        {message || '\u00A0'}
      </div>

      {/* Number options */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '8px 0 16px',
          flexShrink: 0,
        }}
      >
        {options.map((num) => {
          const isSelected = selected === num;
          const isCorrectAnswer = feedback === 'correct' && num === correctCount;
          const isWrongAnswer = feedback === 'wrong' && isSelected;

          let bgColor = '#FFFFFF';
          let borderColor = '#D1D5DB';
          let textColor = '#1F2937';
          if (isCorrectAnswer) {
            bgColor = '#D1FAE5';
            borderColor = '#10B981';
            textColor = '#065F46';
          } else if (isWrongAnswer) {
            bgColor = '#FEE2E2';
            borderColor = '#EF4444';
            textColor = '#991B1B';
          }

          return (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              disabled={feedback !== null}
              style={{
                minWidth: '88px',
                minHeight: '88px',
                borderRadius: '20px',
                border: `3px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: '36px',
                fontWeight: 'bold',
                cursor: feedback !== null ? 'default' : 'pointer',
                transition: 'all 0.2s',
                transform: isCorrectAnswer
                  ? 'scale(1.1)'
                  : isWrongAnswer
                    ? 'translateX(4px)'
                    : 'scale(1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
