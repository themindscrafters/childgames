import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';
import type { Difficulty } from '../../../data/models';

const TOTAL_ROUNDS = 10;

const DIFFICULTY_SETTINGS: Record<Difficulty, { maxNumber: number; optionCount: number }> = {
  easy: { maxNumber: 5, optionCount: 2 },
  medium: { maxNumber: 10, optionCount: 3 },
  hard: { maxNumber: 20, optionCount: 4 },
};

const DOT_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#F97316', '#06B6D4',
];

function generateDotPositions(count: number): { x: number; y: number; color: string }[] {
  const positions: { x: number; y: number; color: string }[] = [];
  const gridSize = Math.ceil(Math.sqrt(count + 2));
  const cellSize = 100 / (gridSize + 1);

  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    let attempts = 0;
    do {
      x = cellSize + Math.random() * (100 - 2 * cellSize);
      y = cellSize + Math.random() * (100 - 2 * cellSize);
      attempts++;
    } while (
      attempts < 50 &&
      positions.some(
        (p) => Math.hypot(p.x - x, p.y - y) < cellSize * 0.8
      )
    );

    positions.push({
      x,
      y,
      color: DOT_COLORS[i % DOT_COLORS.length],
    });
  }
  return positions;
}

function generateOptions(correct: number, count: number, max: number): number[] {
  const options = new Set<number>([correct]);
  while (options.size < count) {
    const offset = Math.random() < 0.5 ? -1 : 1;
    const candidate = correct + offset * (Math.floor(Math.random() * 3) + 1);
    if (candidate >= 1 && candidate <= max && !options.has(candidate)) {
      options.add(candidate);
    }
  }
  return [...options].sort(() => Math.random() - 0.5);
}

export function NumberSenseGame() {
  const { currentStudent } = useApp();
  const difficultyManager = useRef(
    new DifficultyManager(currentStudent?.currentDifficulty ?? 'easy')
  ).current;
  const rewardSystem = useRef(new RewardSystem()).current;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [correctNumber, setCorrectNumber] = useState(1);
  const [options, setOptions] = useState<number[]>([]);
  const [dots, setDots] = useState<{ x: number; y: number; color: string }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [dotsVisible, setDotsVisible] = useState(false);
  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const settings = DIFFICULTY_SETTINGS[diff];
    const num = Math.floor(Math.random() * settings.maxNumber) + 1;
    const opts = generateOptions(num, settings.optionCount, settings.maxNumber);
    const dotPositions = generateDotPositions(num);

    setCorrectNumber(num);
    setOptions(opts);
    setDots(dotPositions);
    setSelected(null);
    setFeedback(null);
    setDotsVisible(false);

    setTimeout(() => setDotsVisible(true), 100);
    audioManager.speak(`Quantas bolinhas voce ve?`);
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

      if (num === correctNumber) {
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
    [feedback, correctNumber, round, score, generateRound, rewardSystem, difficultyManager]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          studentId: currentStudent.id,
          gameId: 'number-sense',
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
        gameName="Senso Numerico"
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
          <span style={{ fontSize: '24px' }}>{'123'}</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#10B981' }}>
            Senso Numerico
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

      {/* Dot display area */}
      <div
        style={{
          maxHeight: '60vh',
          position: 'relative',
          background: 'linear-gradient(135deg, #ECFDF5, #F0F9FF)',
          borderRadius: '24px',
          border: '3px solid #D1FAE5',
          minHeight: '200px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            paddingTop: '8px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#6B7280',
          }}
        >
          Quantas bolinhas?
        </div>
        {dots.map((dot, i) => (
          <div
            key={`${round}-${i}`}
            style={{
              position: 'absolute',
              left: `${dot.x}%`,
              top: `${dot.y * 0.8 + 15}%`,
              width: correctNumber <= 5 ? '48px' : correctNumber <= 10 ? '36px' : '28px',
              height: correctNumber <= 5 ? '48px' : correctNumber <= 10 ? '36px' : '28px',
              borderRadius: '50%',
              background: dot.color,
              boxShadow: `0 4px 8px ${dot.color}44`,
              transform: dotsVisible ? 'scale(1)' : 'scale(0)',
              transition: `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s`,
            }}
          />
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
          const isCorrectAnswer = feedback === 'correct' && num === correctNumber;
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
