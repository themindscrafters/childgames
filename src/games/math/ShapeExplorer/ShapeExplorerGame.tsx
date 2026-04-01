import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../shared/DifficultyManager';
import { RewardSystem } from '../../shared/RewardSystem';
import { audioManager } from '../../shared/AudioManager';
import { saveSession } from '../../../data/db';
import { useApp } from '../../../hooks/useAppContext';
import { GameComplete } from '../../../components/GameSelector/GameComplete';
import type { Difficulty } from '../../../data/models';

const TOTAL_ROUNDS = 10;

interface ShapeDef {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

const ALL_SHAPES: ShapeDef[] = [
  { id: 'circle', name: 'Circulo', color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'square', name: 'Quadrado', color: '#3B82F6', bgColor: '#DBEAFE' },
  { id: 'triangle', name: 'Triangulo', color: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'rectangle', name: 'Retangulo', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'star', name: 'Estrela', color: '#8B5CF6', bgColor: '#EDE9FE' },
  { id: 'heart', name: 'Coracao', color: '#EC4899', bgColor: '#FCE7F3' },
];

const DIFFICULTY_SETTINGS: Record<Difficulty, { shapeCount: number; optionCount: number }> = {
  easy: { shapeCount: 3, optionCount: 2 },
  medium: { shapeCount: 4, optionCount: 3 },
  hard: { shapeCount: 6, optionCount: 4 },
};

function ShapeSVG({ shapeId, color, size }: { shapeId: string; color: string; size: number }) {
  const s = size;
  const half = s / 2;

  switch (shapeId) {
    case 'circle':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <circle cx={half} cy={half} r={half * 0.85} fill={color} />
        </svg>
      );
    case 'square':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <rect
            x={s * 0.1}
            y={s * 0.1}
            width={s * 0.8}
            height={s * 0.8}
            rx={s * 0.05}
            fill={color}
          />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon
            points={`${half},${s * 0.08} ${s * 0.92},${s * 0.88} ${s * 0.08},${s * 0.88}`}
            fill={color}
          />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width={s} height={s * 0.65} viewBox={`0 0 ${s} ${s * 0.65}`}>
          <rect
            x={s * 0.05}
            y={s * 0.05}
            width={s * 0.9}
            height={s * 0.55}
            rx={s * 0.04}
            fill={color}
          />
        </svg>
      );
    case 'star': {
      const cx = half;
      const cy = half;
      const outerR = half * 0.85;
      const innerR = half * 0.35;
      const points: string[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / 2) * -1 + (i * Math.PI) / 5;
        points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          <polygon points={points.join(' ')} fill={color} />
        </svg>
      );
    }
    case 'heart': {
      const w = s;
      const h = s;
      return (
        <svg width={w} height={h} viewBox="0 0 100 100">
          <path
            d="M50 88 C25 65, 0 50, 0 30 C0 13, 13 0, 28 0 C38 0, 46 5, 50 14 C54 5, 62 0, 72 0 C87 0, 100 13, 100 30 C100 50, 75 65, 50 88Z"
            fill={color}
          />
        </svg>
      );
    }
    default:
      return null;
  }
}

function MiniShape({ shapeId, color, size }: { shapeId: string; color: string; size: number }) {
  return <ShapeSVG shapeId={shapeId} color={color} size={size} />;
}

function generateOptions(correct: ShapeDef, count: number, pool: ShapeDef[]): ShapeDef[] {
  const options = new Set<string>([correct.id]);
  const result: ShapeDef[] = [correct];

  const available = pool.filter((s) => s.id !== correct.id);
  const shuffled = [...available].sort(() => Math.random() - 0.5);

  for (const shape of shuffled) {
    if (result.length >= count) break;
    if (!options.has(shape.id)) {
      options.add(shape.id);
      result.push(shape);
    }
  }

  return result.sort(() => Math.random() - 0.5);
}

export function ShapeExplorerGame() {
  const { currentStudent } = useApp();
  const difficultyManager = useRef(
    new DifficultyManager(currentStudent?.current_difficulty ?? 'easy')
  ).current;
  const rewardSystem = useRef(new RewardSystem()).current;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentShape, setCurrentShape] = useState<ShapeDef>(ALL_SHAPES[0]);
  const [options, setOptions] = useState<ShapeDef[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [shapeVisible, setShapeVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const settings = DIFFICULTY_SETTINGS[diff];
    const availableShapes = ALL_SHAPES.slice(0, settings.shapeCount);
    const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    const opts = generateOptions(shape, settings.optionCount, availableShapes);

    setCurrentShape(shape);
    setOptions(opts);
    setSelected(null);
    setFeedback(null);
    setShapeVisible(false);
    setAnimationPhase(0);

    setTimeout(() => {
      setShapeVisible(true);
      setAnimationPhase(1);
    }, 100);

    audioManager.speak(`Qual e essa forma? Toque no nome correto.`);
  }, [difficultyManager]);

  useEffect(() => {
    generateRound();
  }, []);

  // Gentle continuous animation
  useEffect(() => {
    if (!shapeVisible || feedback !== null) return;
    const interval = setInterval(() => {
      setAnimationPhase((p) => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [shapeVisible, feedback]);

  const handleSelect = useCallback(
    (shape: ShapeDef) => {
      if (feedback !== null) return;

      setSelected(shape.id);
      setAttempts((a) => a + 1);
      audioManager.speak(shape.name);

      if (shape.id === currentShape.id) {
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
    [feedback, currentShape, round, score, generateRound, rewardSystem, difficultyManager]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          student_id: currentStudent.id,
          game_id: 'shape-explorer',
          started_at: startTime.current.toISOString(),
          ended_at: new Date().toISOString(),
          difficulty: difficultyManager.getDifficulty(),
          score: finalScore,
          total_questions: TOTAL_ROUNDS,
          correct_answers: finalScore,
          attempts,
          hints_used: hintsUsed,
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
        gameName="Explorador de Formas"
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

  const rotationAngle = Math.sin(animationPhase * 0.03) * 8;
  const scaleValue = 1 + Math.sin(animationPhase * 0.02) * 0.05;

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
          <span style={{ fontSize: '24px' }}>{'\uD83D\uDD36'}</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#14B8A6' }}>
            Explorador de Formas
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
        Qual e essa forma?
      </div>

      {/* Shape display area */}
      <div
        style={{
          maxHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${currentShape.bgColor}, #F9FAFB)`,
          borderRadius: '24px',
          border: `3px solid ${currentShape.color}33`,
          minHeight: '180px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            transform: shapeVisible
              ? `scale(${scaleValue}) rotate(${rotationAngle}deg)`
              : 'scale(0) rotate(0deg)',
            transition: shapeVisible ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: `drop-shadow(0 8px 24px ${currentShape.color}44)`,
          }}
        >
          <ShapeSVG shapeId={currentShape.id} color={currentShape.color} size={160} />
        </div>
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

      {/* Shape option buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '8px 0 16px',
          flexShrink: 0,
        }}
      >
        {options.map((shape) => {
          const isSelected = selected === shape.id;
          const isCorrectAnswer = feedback === 'correct' && shape.id === currentShape.id;
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
              key={shape.id}
              onClick={() => handleSelect(shape)}
              disabled={feedback !== null}
              style={{
                minWidth: '120px',
                minHeight: '88px',
                borderRadius: '20px',
                border: `3px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: feedback !== null ? 'default' : 'pointer',
                transition: 'all 0.2s',
                transform: isCorrectAnswer
                  ? 'scale(1.05)'
                  : isWrongAnswer
                    ? 'translateX(4px)'
                    : 'scale(1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 16px',
              }}
            >
              <MiniShape shapeId={shape.id} color={shape.color} size={36} />
              <span>{shape.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
