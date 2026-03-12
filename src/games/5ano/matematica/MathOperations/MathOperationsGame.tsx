import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { generateProblem, type MathProblem } from './operationsData';

const TOTAL_ROUNDS = 10;

export function MathOperationsGame() {
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
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const problem = generateProblem(diff);

    setCurrentProblem(problem);
    setSelectedOption(null);
    setFeedback(null);
    setAnimateIn(false);
    setShowPulse(false);

    setTimeout(() => setAnimateIn(true), 50);
  }, [difficultyManager]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleSelect = useCallback(
    (option: number) => {
      if (feedback !== null || !currentProblem) return;

      setSelectedOption(option);
      setAttempts((a) => a + 1);

      if (option === currentProblem.answer) {
        setFeedback('correct');
        setScore((s) => s + 1);
        const rewardState = rewardSystem.recordCorrect();
        difficultyManager.recordAnswer(true);
        setMessage(rewardState.message);
        audioManager.playCorrect();
        setShowPulse(true);

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
    [feedback, currentProblem, round, score, generateRound, rewardSystem, difficultyManager]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          studentId: currentStudent.id,
          gameId: 'math-operations',
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
        gameName="Operacoes Avancadas"
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

  const progressPercent = ((round) / TOTAL_ROUNDS) * 100;

  // Detect operation type for theming
  const hasMultiply = currentProblem?.question.includes('\u00D7');
  const hasDivide = currentProblem?.question.includes('\u00F7');
  const accentColor = hasDivide ? '#0D9488' : '#059669';
  const accentColorLight = hasDivide ? '#CCFBF1' : '#D1FAE5';
  const accentColorBorder = hasDivide ? '#5EEAD4' : '#6EE7B7';

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
        background: 'linear-gradient(180deg, #F0FDFA 0%, #F8FFFE 100%)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{'\uD83E\uDDEE'}</span>
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#0F766E' }}>
            Operacoes Avancadas
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              background: '#CCFBF1',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#134E4A',
            }}
          >
            {diffLabel}
          </span>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            {round + 1}/{TOTAL_ROUNDS}
          </span>
          <span style={{ fontSize: '18px' }}>{'\u2B50'} {score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '8px',
          background: '#99F6E4',
          borderRadius: '4px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #14B8A6, #0D9488)',
            borderRadius: '4px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* Reward streak */}
      {rewardSystem.getState().streak >= 2 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#F59E0B',
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          {'\uD83D\uDD25'} {rewardSystem.getState().streak} seguidos!
        </div>
      )}

      {/* Problem display area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '500px',
          minHeight: '180px',
          background: `linear-gradient(135deg, ${accentColorLight}, #F0FDFA)`,
          borderRadius: '24px',
          border: `3px solid ${accentColorBorder}`,
          padding: '28px 20px',
          gap: '16px',
          boxShadow: `0 8px 24px ${accentColor}12`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative math symbols */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '12px',
            fontSize: '20px',
            opacity: 0.15,
          }}
        >
          {'\u00D7 \u00F7 + \u2212'}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            fontSize: '20px',
            opacity: 0.15,
          }}
        >
          {'= \u00D7 \u00F7 +'}
        </div>

        <div
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#134E4A',
            textAlign: 'center',
          }}
        >
          Resolva a operacao:
        </div>

        {/* The math problem */}
        <div
          style={{
            fontSize: 'clamp(32px, 8vw, 56px)',
            fontWeight: 'bold',
            color: '#0F172A',
            letterSpacing: '3px',
            textAlign: 'center',
            transform: animateIn ? 'scale(1)' : 'scale(0.7)',
            opacity: animateIn ? 1 : 0,
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            padding: '8px 16px',
            borderRadius: '16px',
            background: showPulse
              ? 'rgba(16, 185, 129, 0.1)'
              : 'transparent',
          }}
        >
          {currentProblem?.question || '...'}
        </div>

        {/* Operation type indicator */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              background: hasDivide ? '#F0FDFA' : '#ECFDF5',
              border: `1px solid ${accentColorBorder}`,
              borderRadius: '8px',
              padding: '2px 10px',
              fontSize: '12px',
              color: accentColor,
              fontWeight: 600,
            }}
          >
            {hasMultiply && hasDivide
              ? 'Multiplicacao e Divisao'
              : hasDivide
                ? 'Divisao'
                : 'Multiplicacao'}
          </span>
        </div>
      </div>

      {/* Feedback message */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '28px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#EF4444' : 'transparent',
          transition: 'color 0.2s',
          flexShrink: 0,
        }}
      >
        {message || '\u00A0'}
      </div>

      {/* Option buttons - 2x2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          padding: '4px 0 16px',
          flexShrink: 0,
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {currentProblem?.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer = feedback === 'correct' && option === currentProblem.answer;
          const isWrongAnswer = feedback === 'wrong' && isSelected;
          const isRevealCorrect = feedback === 'wrong' && option === currentProblem.answer;

          let bgColor = '#FFFFFF';
          let borderColor = '#D1D5DB';
          let textColor = '#1F2937';
          let shadow = '0 4px 12px rgba(0,0,0,0.06)';

          if (isCorrectAnswer) {
            bgColor = '#D1FAE5';
            borderColor = '#10B981';
            textColor = '#065F46';
            shadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
          } else if (isWrongAnswer) {
            bgColor = '#FEE2E2';
            borderColor = '#EF4444';
            textColor = '#991B1B';
            shadow = '0 4px 16px rgba(239, 68, 68, 0.2)';
          } else if (isRevealCorrect) {
            bgColor = '#ECFDF5';
            borderColor = '#6EE7B7';
            textColor = '#065F46';
          }

          return (
            <button
              key={`${option}-${idx}`}
              onClick={() => handleSelect(option)}
              disabled={feedback !== null}
              style={{
                minHeight: '72px',
                borderRadius: '16px',
                border: `3px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: 'clamp(22px, 5vw, 32px)',
                fontWeight: 'bold',
                fontFamily: "'Baloo 2', system-ui, sans-serif",
                cursor: feedback !== null ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                transform: isCorrectAnswer
                  ? 'scale(1.06)'
                  : isWrongAnswer
                    ? 'translateX(4px)'
                    : animateIn
                      ? 'translateY(0)'
                      : 'translateY(20px)',
                opacity: animateIn ? 1 : 0,
                transitionDelay: `${idx * 0.06}s`,
                boxShadow: shadow,
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                padding: '8px 16px',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Inline keyframe for pulse */}
      <style>{`
        @keyframes correctPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}
