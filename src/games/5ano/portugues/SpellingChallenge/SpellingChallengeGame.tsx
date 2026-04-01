import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { SPELLING_DATA, type SpellingQuestion } from './spellingData';

const TOTAL_ROUNDS = 10;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function SpellingChallengeGame() {
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
  const [currentQuestion, setCurrentQuestion] = useState<SpellingQuestion | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showRule, setShowRule] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const usedQuestions = useRef<Set<string>>(new Set());
  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const pool = SPELLING_DATA[diff].filter(
      (q) => !usedQuestions.current.has(q.word)
    );
    const available = pool.length > 0 ? pool : SPELLING_DATA[diff];
    const question = pickRandom(available);
    usedQuestions.current.add(question.word);

    setCurrentQuestion(question);
    setShuffledOptions(shuffleArray(question.options));
    setSelectedOption(null);
    setFeedback(null);
    setShowRule(false);
    setAnimateIn(false);

    setTimeout(() => setAnimateIn(true), 50);
  }, [difficultyManager]);

  useEffect(() => {
    generateRound();
  }, []);

  const handleSelect = useCallback(
    (option: string) => {
      if (feedback !== null || !currentQuestion) return;

      setSelectedOption(option);
      setAttempts((a) => a + 1);

      if (option === currentQuestion.correct) {
        setFeedback('correct');
        setScore((s) => s + 1);
        const rewardState = rewardSystem.recordCorrect();
        difficultyManager.recordAnswer(true);
        setMessage(rewardState.message);
        audioManager.playCorrect();

        setTimeout(() => {
          setShowRule(true);
        }, 600);

        setTimeout(() => {
          const nextRound = round + 1;
          if (nextRound >= TOTAL_ROUNDS) {
            finishGame(score + 1);
          } else {
            setRound(nextRound);
            generateRound();
          }
        }, 2200);
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
    [feedback, currentQuestion, round, score, generateRound, rewardSystem, difficultyManager]
  );

  const handleHint = useCallback(() => {
    if (!currentQuestion || feedback !== null) return;
    setHintsUsed((h) => h + 1);
    setShowRule(true);
  }, [currentQuestion, feedback]);

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          student_id: currentStudent.id,
          game_id: 'spelling-challenge',
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
    usedQuestions.current.clear();
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
        gameName="Desafio Ortografico"
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

  // Parse display to render the gap visually
  const renderWordDisplay = () => {
    if (!currentQuestion) return null;
    const parts = currentQuestion.display.split('___');
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2px',
          fontSize: 'clamp(28px, 6vw, 48px)',
          fontWeight: 'bold',
          fontFamily: "'Baloo 2', system-ui, sans-serif",
          color: '#1E293B',
          letterSpacing: '2px',
          transform: animateIn ? 'scale(1)' : 'scale(0.8)',
          opacity: animateIn ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <span>{parts[0]}</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 'clamp(50px, 12vw, 90px)',
            height: 'clamp(40px, 8vw, 60px)',
            background: feedback === 'correct'
              ? 'linear-gradient(135deg, #D1FAE5, #A7F3D0)'
              : feedback === 'wrong'
                ? 'linear-gradient(135deg, #FEE2E2, #FECACA)'
                : 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
            borderRadius: '12px',
            border: feedback === 'correct'
              ? '3px solid #10B981'
              : feedback === 'wrong'
                ? '3px solid #EF4444'
                : '3px dashed #3B82F6',
            margin: '0 4px',
            padding: '0 8px',
            fontSize: 'clamp(22px, 5vw, 38px)',
            color: feedback === 'correct'
              ? '#065F46'
              : feedback === 'wrong'
                ? '#991B1B'
                : '#3B82F6',
            transition: 'all 0.3s ease',
            boxShadow: feedback === 'correct'
              ? '0 0 20px rgba(16, 185, 129, 0.3)'
              : feedback === 'wrong'
                ? '0 0 20px rgba(239, 68, 68, 0.3)'
                : '0 4px 12px rgba(59, 130, 246, 0.15)',
          }}
        >
          {feedback === 'correct' ? currentQuestion.correct : selectedOption || '?'}
        </span>
        <span>{parts[1]}</span>
      </div>
    );
  };

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
        fontFamily: "'Baloo 2', system-ui, sans-serif",
        userSelect: 'none',
        WebkitUserSelect: 'none',
        overflowY: 'auto',
        background: 'linear-gradient(180deg, #FFF7ED 0%, #FFFBF5 100%)',
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
          <span style={{ fontSize: '24px' }}>{'\u270D\uFE0F'}</span>
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#D97706' }}>
            Desafio Ortografico
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              background: '#FEF3C7',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#92400E',
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
          background: '#FDE68A',
          borderRadius: '4px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #F59E0B, #D97706)',
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

      {/* Word display area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '500px',
          minHeight: '140px',
          background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
          borderRadius: '24px',
          border: '3px solid #FDE68A',
          padding: '24px 16px',
          gap: '12px',
          boxShadow: '0 8px 24px rgba(217, 119, 6, 0.08)',
        }}
      >
        <div
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#92400E',
            textAlign: 'center',
          }}
        >
          Complete a palavra com a opcao correta:
        </div>
        {renderWordDisplay()}
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

      {/* Rule hint */}
      {showRule && currentQuestion && (
        <div
          style={{
            width: '100%',
            maxWidth: '500px',
            background: feedback === 'correct'
              ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
              : 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
            borderRadius: '12px',
            padding: '10px 16px',
            fontSize: '13px',
            color: feedback === 'correct' ? '#065F46' : '#1E40AF',
            textAlign: 'center',
            fontWeight: 500,
            border: feedback === 'correct' ? '1px solid #A7F3D0' : '1px solid #BFDBFE',
            animation: 'fadeSlideIn 0.3s ease',
            flexShrink: 0,
          }}
        >
          {'\uD83D\uDCA1'} Regra: {currentQuestion.rule}
        </div>
      )}

      {/* Option buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '8px 0 16px',
          flexShrink: 0,
          width: '100%',
          maxWidth: '500px',
        }}
      >
        {shuffledOptions.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer = feedback === 'correct' && option === currentQuestion?.correct;
          const isWrongAnswer = feedback === 'wrong' && isSelected;

          let bgColor = '#FFFFFF';
          let borderColor = '#D1D5DB';
          let textColor = '#1F2937';
          let shadow = '0 4px 12px rgba(0,0,0,0.06)';

          if (isCorrectAnswer) {
            bgColor = '#D1FAE5';
            borderColor = '#10B981';
            textColor = '#065F46';
            shadow = '0 4px 16px rgba(16, 185, 129, 0.25)';
          } else if (isWrongAnswer) {
            bgColor = '#FEE2E2';
            borderColor = '#EF4444';
            textColor = '#991B1B';
            shadow = '0 4px 16px rgba(239, 68, 68, 0.2)';
          }

          return (
            <button
              key={`${option}-${idx}`}
              onClick={() => handleSelect(option)}
              disabled={feedback !== null}
              style={{
                minWidth: '100px',
                minHeight: '64px',
                borderRadius: '16px',
                border: `3px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: 'clamp(18px, 4vw, 26px)',
                fontWeight: 'bold',
                fontFamily: "'Baloo 2', system-ui, sans-serif",
                cursor: feedback !== null ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                transform: isCorrectAnswer
                  ? 'scale(1.08)'
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
                padding: '8px 20px',
                letterSpacing: '1px',
              }}
            >
              {option || '(nada)'}
            </button>
          );
        })}
      </div>

      {/* Hint button */}
      {!showRule && feedback === null && (
        <button
          onClick={handleHint}
          style={{
            background: 'transparent',
            border: '2px solid #D1D5DB',
            borderRadius: '12px',
            padding: '6px 16px',
            fontSize: '13px',
            color: '#6B7280',
            cursor: 'pointer',
            fontFamily: "'Baloo 2', system-ui, sans-serif",
            fontWeight: 500,
            transition: 'all 0.2s',
            flexShrink: 0,
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          {'\uD83D\uDCA1'} Ver dica
        </button>
      )}

      {/* Inline keyframe animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
