import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { getDecimalQuestions, type DecimalQuestion } from './decimalData';

const TOTAL_ROUNDS = 10;

// ============================================================
// Visual components
// ============================================================

function ComparisonDisplay({
  a,
  b,
  visible,
}: {
  a: number;
  b: number;
  visible: boolean;
}) {
  const formatBR = (n: number) => n.toFixed(n % 1 === 0 ? 1 : 2).replace('.', ',');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      {/* Number A */}
      <div
        style={{
          background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
          borderRadius: '20px',
          padding: '16px 28px',
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1E40AF',
          boxShadow: '0 4px 14px rgba(59,130,246,0.2)',
          transform: visible ? 'scale(1)' : 'scale(0)',
          transition:
            'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
          fontFamily: "'Baloo 2', system-ui, sans-serif",
        }}
      >
        {formatBR(a)}
      </div>

      {/* VS badge */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#92400E',
          boxShadow: '0 3px 10px rgba(245,158,11,0.3)',
          transform: visible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
          transition:
            'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
          fontFamily: "'Baloo 2', system-ui, sans-serif",
        }}
      >
        VS
      </div>

      {/* Number B */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
          borderRadius: '20px',
          padding: '16px 28px',
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#9D174D',
          boxShadow: '0 4px 14px rgba(236,72,153,0.2)',
          transform: visible ? 'scale(1)' : 'scale(0)',
          transition:
            'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s',
          fontFamily: "'Baloo 2', system-ui, sans-serif",
        }}
      >
        {formatBR(b)}
      </div>
    </div>
  );
}

function OperationDisplay({
  question,
  visible,
}: {
  question: string;
  visible: boolean;
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
        borderRadius: '20px',
        padding: '20px 36px',
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#5B21B6',
        boxShadow: '0 4px 14px rgba(139,92,246,0.2)',
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        opacity: visible ? 1 : 0,
        transition:
          'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        fontFamily: "'Baloo 2', system-ui, sans-serif",
        textAlign: 'center',
        letterSpacing: '1px',
      }}
    >
      {question}
    </div>
  );
}

function IdentifyDisplay({
  question,
  visible,
}: {
  question: string;
  visible: boolean;
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
        borderRadius: '20px',
        padding: '20px 28px',
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#065F46',
        boxShadow: '0 4px 14px rgba(16,185,129,0.2)',
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        opacity: visible ? 1 : 0,
        transition:
          'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        fontFamily: "'Baloo 2', system-ui, sans-serif",
        textAlign: 'center',
        maxWidth: '400px',
      }}
    >
      {question}
    </div>
  );
}

// Number line visual for easy mode
function NumberLineVisual({
  a,
  b,
  visible,
}: {
  a: number;
  b: number;
  visible: boolean;
}) {
  const formatBR = (n: number) => n.toFixed(1).replace('.', ',');

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '320px',
        padding: '12px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.4s ease 0.4s',
      }}
    >
      {/* Number line bar */}
      <div style={{ position: 'relative', height: '40px' }}>
        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '0',
            right: '0',
            height: '4px',
            background: '#D1D5DB',
            borderRadius: '2px',
          }}
        />
        {/* Ticks at 0 and 1 */}
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '12px',
            width: '2px',
            height: '16px',
            background: '#9CA3AF',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '0',
            top: '12px',
            width: '2px',
            height: '16px',
            background: '#9CA3AF',
          }}
        />
        {/* Marker for A */}
        <div
          style={{
            position: 'absolute',
            left: `${a * 100}%`,
            top: '6px',
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#3B82F6',
            border: '3px solid #FFFFFF',
            boxShadow: '0 2px 6px rgba(59,130,246,0.4)',
          }}
        />
        {/* Marker for B */}
        <div
          style={{
            position: 'absolute',
            left: `${b * 100}%`,
            top: '6px',
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#EC4899',
            border: '3px solid #FFFFFF',
            boxShadow: '0 2px 6px rgba(236,72,153,0.4)',
          }}
        />
      </div>
      {/* Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#9CA3AF',
          fontWeight: 600,
        }}
      >
        <span>0</span>
        <span>1</span>
      </div>
      {/* Value labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '4px',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        <span style={{ color: '#3B82F6' }}>{formatBR(a)}</span>
        <span style={{ color: '#EC4899' }}>{formatBR(b)}</span>
      </div>
    </div>
  );
}

// ============================================================
// Main game component
// ============================================================

export function DecimalWorldGame() {
  const { currentStudent } = useApp();
  const difficultyManager = useRef(
    new DifficultyManager(currentStudent?.current_difficulty ?? 'easy')
  ).current;
  const rewardSystem = useRef(new RewardSystem()).current;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState<DecimalQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const questions = getDecimalQuestions(diff);

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
    setContentVisible(false);

    setTimeout(() => setContentVisible(true), 100);
    audioManager.speak(question.question);
  }, [difficultyManager, usedIndices]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleSelect = useCallback(
    (option: string) => {
      if (feedback !== null || !currentQuestion) return;

      setSelectedOption(option);
      setAttempts((a) => a + 1);
      audioManager.speak(option);

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
          student_id: currentStudent.id,
          game_id: 'decimal-world',
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
    setUsedIndices(new Set());
    startTime.current = new Date();
    generateRound();
  }, [difficultyManager, rewardSystem, generateRound]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardSystem.getState()}
        gameName="Mundo dos Decimais"
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

  // Choose icon based on question type
  const typeIcon =
    currentQuestion.type === 'compare'
      ? '⚖️'
      : currentQuestion.type === 'operation'
        ? '🧮'
        : '🔍';

  const typeLabel =
    currentQuestion.type === 'compare'
      ? 'Comparação'
      : currentQuestion.type === 'operation'
        ? 'Operação'
        : 'Identificação';

  // Color theme per type
  const themeColor =
    currentQuestion.type === 'compare'
      ? '#3B82F6'
      : currentQuestion.type === 'operation'
        ? '#8B5CF6'
        : '#10B981';

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
          <span style={{ fontSize: '24px' }}>{'💰'}</span>
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#14B8A6',
            }}
          >
            Mundo dos Decimais
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

      {/* Question type badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: `${themeColor}10`,
          border: `2px solid ${themeColor}30`,
          borderRadius: '16px',
          padding: '6px 16px',
          fontSize: '14px',
          fontWeight: 600,
          color: themeColor,
          flexShrink: 0,
        }}
      >
        <span>{typeIcon}</span>
        {typeLabel}
      </div>

      {/* Main display area */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
          borderRadius: '24px',
          border: `3px solid ${themeColor}30`,
          padding: '24px 20px',
          width: '100%',
          maxWidth: '500px',
          minHeight: '140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        {/* Question text for non-compare types, or as label for compare */}
        {currentQuestion.type === 'compare' && currentQuestion.display ? (
          <>
            <div
              style={{
                fontSize: '18px',
                color: '#374151',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              {currentQuestion.question}
            </div>
            <ComparisonDisplay
              a={currentQuestion.display.a}
              b={currentQuestion.display.b}
              visible={contentVisible}
            />
            {/* Show number line for easy comparison */}
            {difficultyManager.getDifficulty() === 'easy' && (
              <NumberLineVisual
                a={currentQuestion.display.a}
                b={currentQuestion.display.b}
                visible={contentVisible}
              />
            )}
          </>
        ) : currentQuestion.type === 'operation' ? (
          <OperationDisplay
            question={currentQuestion.question}
            visible={contentVisible}
          />
        ) : (
          <IdentifyDisplay
            question={currentQuestion.question}
            visible={contentVisible}
          />
        )}
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

      {/* Answer options */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
          maxWidth: '400px',
          padding: '0 0 16px',
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

          // Option letter label
          const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

          return (
            <button
              key={`${round}-${idx}`}
              onClick={() => handleSelect(option)}
              disabled={feedback !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '14px 18px',
                borderRadius: '16px',
                border: `3px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: "'Baloo 2', system-ui, sans-serif",
                cursor: feedback !== null ? 'default' : 'pointer',
                transition: 'all 0.25s ease',
                transform: isCorrectAnswer
                  ? 'scale(1.02)'
                  : isWrongAnswer
                    ? 'scale(0.98)'
                    : contentVisible
                      ? 'translateX(0)'
                      : 'translateX(30px)',
                opacity: contentVisible ? 1 : 0,
                transitionDelay: contentVisible ? `${idx * 0.08}s` : '0s',
                boxShadow: `0 3px 10px rgba(0,0,0,0.06)`,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                textAlign: 'left',
              }}
            >
              {/* Option letter circle */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCorrectAnswer
                    ? '#10B981'
                    : isWrongAnswer
                      ? '#EF4444'
                      : `${themeColor}15`,
                  color: isCorrectAnswer || isWrongAnswer ? '#FFFFFF' : themeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {isCorrectAnswer
                  ? '\u2713'
                  : isWrongAnswer
                    ? '\u2717'
                    : optionLetter}
              </div>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
