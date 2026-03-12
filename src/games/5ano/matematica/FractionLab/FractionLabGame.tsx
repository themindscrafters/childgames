import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { getFractionQuestions, type FractionQuestion } from './fractionData';

const TOTAL_ROUNDS = 10;

const FILL_COLOR = '#10B981';
const EMPTY_COLOR = '#E5E7EB';
const FILL_COLOR_ALT = '#3B82F6';

// ============================================================
// Visual components for fraction representation
// ============================================================

function CircleFraction({
  numerator,
  denominator,
  size = 180,
}: {
  numerator: number;
  denominator: number;
  size?: number;
}) {
  const filledDegrees = (numerator / denominator) * 360;

  // Build dividing lines for sectors
  const lines = [];
  for (let i = 0; i < denominator; i++) {
    const angle = (i / denominator) * 360;
    lines.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '2px',
          height: '50%',
          background: '#FFFFFF',
          transformOrigin: 'top center',
          transform: `rotate(${angle}deg)`,
          zIndex: 2,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `conic-gradient(${FILL_COLOR} 0deg ${filledDegrees}deg, ${EMPTY_COLOR} ${filledDegrees}deg 360deg)`,
        boxShadow: '0 6px 20px rgba(0,0,0,0.12), inset 0 0 0 3px rgba(255,255,255,0.3)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {lines}
      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          zIndex: 3,
        }}
      />
    </div>
  );
}

function BarFraction({
  numerator,
  denominator,
  width = 280,
  height = 60,
}: {
  numerator: number;
  denominator: number;
  width?: number;
  height?: number;
}) {
  const segments = [];
  const segWidth = width / denominator;

  for (let i = 0; i < denominator; i++) {
    const isFilled = i < numerator;
    segments.push(
      <div
        key={i}
        style={{
          width: `${segWidth}px`,
          height: `${height}px`,
          background: isFilled ? FILL_COLOR_ALT : EMPTY_COLOR,
          borderRight:
            i < denominator - 1 ? '2px solid #FFFFFF' : 'none',
          transition: `background 0.3s ease ${i * 0.08}s`,
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        border: '3px solid #FFFFFF',
      }}
    >
      {segments}
    </div>
  );
}

// ============================================================
// Main game component
// ============================================================

export function FractionLabGame() {
  const { currentStudent } = useApp();
  const difficultyManager = useRef(
    new DifficultyManager(currentStudent?.currentDifficulty ?? 'easy')
  ).current;
  const rewardSystem = useRef(new RewardSystem()).current;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState<FractionQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [visualVisible, setVisualVisible] = useState(false);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const questions = getFractionQuestions(diff);

    let availableIndices = Array.from(
      { length: questions.length },
      (_, i) => i
    ).filter((i) => !usedIndices.has(i));

    if (availableIndices.length === 0) {
      setUsedIndices(new Set());
      availableIndices = Array.from({ length: questions.length }, (_, i) => i);
    }

    const randomIdx =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setUsedIndices((prev) => new Set(prev).add(randomIdx));

    const question = questions[randomIdx];
    setCurrentQuestion(question);
    setSelectedOption(null);
    setFeedback(null);
    setVisualVisible(false);

    setTimeout(() => setVisualVisible(true), 100);
    audioManager.speak('Qual fração está representada na figura?');
  }, [difficultyManager, usedIndices]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleSelect = useCallback(
    (option: string) => {
      if (feedback !== null || !currentQuestion) return;

      setSelectedOption(option);
      setAttempts((a) => a + 1);
      audioManager.speak(option.replace('/', ' sobre '));

      if (option === currentQuestion.correct) {
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
          setSelectedOption(null);
        }, 1200);
      }
    },
    [
      feedback,
      currentQuestion,
      round,
      score,
      generateRound,
      rewardSystem,
      difficultyManager,
    ]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          studentId: currentStudent.id,
          gameId: 'fraction-lab',
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
    setUsedIndices(new Set());
    startTime.current = new Date();
    generateRound();
  }, [difficultyManager, rewardSystem, generateRound]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardSystem.getState()}
        gameName="Laboratório de Frações"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentQuestion) return null;

  const diffLabel =
    difficultyManager.getDifficulty() === 'easy'
      ? 'Fácil'
      : difficultyManager.getDifficulty() === 'medium'
        ? 'Médio'
        : 'Difícil';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '16px',
        gap: '14px',
        fontFamily: "'Baloo 2', system-ui, sans-serif",
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
          width: '100%',
          maxWidth: '600px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{'🍕'}</span>
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#059669',
            }}
          >
            Laboratório de Frações
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
          <span style={{ fontSize: '20px' }}>
            {'\u2B50'} {score}
          </span>
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

      {/* Question prompt */}
      <div
        style={{
          fontSize: '18px',
          color: '#374151',
          fontWeight: 600,
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        Qual fração a figura representa?
      </div>

      {/* Visual fraction display */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)',
          borderRadius: '24px',
          border: '3px solid #A7F3D0',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '180px',
          transform: visualVisible ? 'scale(1)' : 'scale(0.8)',
          opacity: visualVisible ? 1 : 0,
          transition:
            'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
        }}
      >
        {currentQuestion.visual === 'circle' ? (
          <CircleFraction
            numerator={currentQuestion.numerator}
            denominator={currentQuestion.denominator}
          />
        ) : (
          <BarFraction
            numerator={currentQuestion.numerator}
            denominator={currentQuestion.denominator}
          />
        )}

        {/* Fraction label under visual */}
        <div
          style={{
            marginTop: '14px',
            fontSize: '14px',
            color: '#6B7280',
            fontWeight: 600,
          }}
        >
          {currentQuestion.numerator} parte{currentQuestion.numerator > 1 ? 's' : ''}{' '}
          pintada{currentQuestion.numerator > 1 ? 's' : ''} de{' '}
          {currentQuestion.denominator}
        </div>
      </div>

      {/* Feedback message */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '32px',
          fontSize: '20px',
          fontWeight: 'bold',
          color:
            feedback === 'correct'
              ? '#10B981'
              : feedback === 'wrong'
                ? '#EF4444'
                : 'transparent',
          transition: 'color 0.2s',
        }}
      >
        {message || '\u00A0'}
      </div>

      {/* Fraction options */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          padding: '4px 0 16px',
          flexShrink: 0,
        }}
      >
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer =
            feedback === 'correct' && option === currentQuestion.correct;
          const isWrongAnswer = feedback === 'wrong' && isSelected;
          const showCorrectHint =
            feedback === 'wrong' && option === currentQuestion.correct;

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
          } else if (showCorrectHint) {
            bgColor = '#DBEAFE';
            borderColor = '#3B82F6';
            textColor = '#1E40AF';
          }

          // Parse fraction for display
          const [num, den] = option.split('/');

          return (
            <button
              key={`${round}-${idx}`}
              onClick={() => handleSelect(option)}
              disabled={feedback !== null}
              style={{
                minWidth: '100px',
                minHeight: '100px',
                borderRadius: '20px',
                border: `3px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: "'Baloo 2', system-ui, sans-serif",
                cursor: feedback !== null ? 'default' : 'pointer',
                transition: 'all 0.25s ease',
                transform: isCorrectAnswer
                  ? 'scale(1.1)'
                  : isWrongAnswer
                    ? 'scale(0.95)'
                    : 'scale(1)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '12px 16px',
              }}
            >
              <span style={{ fontSize: '28px', lineHeight: 1 }}>{num}</span>
              <div
                style={{
                  width: '40px',
                  height: '3px',
                  background: textColor,
                  borderRadius: '2px',
                }}
              />
              <span style={{ fontSize: '28px', lineHeight: 1 }}>{den}</span>
            </button>
          );
        })}
      </div>

      {/* Color legend */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          fontSize: '13px',
          color: '#6B7280',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '4px',
              background:
                currentQuestion.visual === 'circle'
                  ? FILL_COLOR
                  : FILL_COLOR_ALT,
            }}
          />
          Pintado
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '4px',
              background: EMPTY_COLOR,
            }}
          />
          Vazio
        </div>
      </div>
    </div>
  );
}
