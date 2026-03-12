import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { getQuestionsForDifficulty, getEventByName, HISTORICAL_EVENTS } from './timelineData';
import type { TimelineQuestion } from './timelineData';

const TOTAL_ROUNDS = 10;

export function HistoryTimelineGame() {
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
  const [questions, setQuestions] = useState<TimelineQuestion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');

  const startTime = useRef(new Date());

  // Timeline dots for visual element
  const timelineDots = useMemo(() => {
    return HISTORICAL_EVENTS.map((evt, i) => ({
      year: evt.year,
      emoji: evt.emoji,
      label: evt.event,
      position: (i / (HISTORICAL_EVENTS.length - 1)) * 100,
    }));
  }, []);

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const qs = getQuestionsForDifficulty(diff, TOTAL_ROUNDS);
    setQuestions(qs);
    setRound(0);
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
    setShowDescription(false);
  }, [difficultyManager]);

  useEffect(() => {
    generateRound();
  }, []);

  const currentQuestion = questions[round];

  const relatedEvent = currentQuestion?.relatedEvent
    ? getEventByName(currentQuestion.relatedEvent)
    : HISTORICAL_EVENTS[round % HISTORICAL_EVENTS.length];

  const handleSelect = useCallback(
    (option: string) => {
      if (feedback !== null || !currentQuestion) return;

      setSelected(option);
      setAttempts((a) => a + 1);

      if (option === currentQuestion.correct) {
        setFeedback('correct');
        setScore((s) => s + 1);
        const rewardState = rewardSystem.recordCorrect();
        difficultyManager.recordAnswer(true);
        setMessage(rewardState.message);
        audioManager.playCorrect();

        if (currentQuestion.relatedEvent) {
          const evt = getEventByName(currentQuestion.relatedEvent);
          if (evt) {
            setCurrentDescription(evt.description);
            setShowDescription(true);
          }
        }

        setTimeout(() => {
          const nextRound = round + 1;
          if (nextRound >= TOTAL_ROUNDS) {
            finishGame(score + 1);
          } else {
            setRound(nextRound);
            setSelected(null);
            setFeedback(null);
            setShowHint(false);
            setShowDescription(false);
          }
        }, showDescription ? 3000 : 1500);
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
    [feedback, currentQuestion, round, score, rewardSystem, difficultyManager, showDescription]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          studentId: currentStudent.id,
          gameId: 'history-timeline',
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
    setShowDescription(false);
    startTime.current = new Date();
    generateRound();
  }, [difficultyManager, rewardSystem, generateRound]);

  const handleHint = useCallback(() => {
    if (currentQuestion?.hint && !showHint) {
      setShowHint(true);
      setHintsUsed((h) => h + 1);
      audioManager.speak(currentQuestion.hint);
    }
  }, [currentQuestion, showHint]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardSystem.getState()}
        gameName="Linha do Tempo"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  const diffLabel =
    difficultyManager.getDifficulty() === 'easy'
      ? 'Fácil'
      : difficultyManager.getDifficulty() === 'medium'
        ? 'Médio'
        : 'Difícil';

  return (
    <div style={styles.container}>
      {/* Scroll texture overlay */}
      <div style={styles.scrollTexture} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <span style={{ fontSize: '28px' }}>📜</span>
          <span style={styles.title}>Linha do Tempo</span>
        </div>
        <div style={styles.statsRow}>
          <span style={styles.diffBadge}>{diffLabel}</span>
          <span style={styles.roundText}>
            {round + 1}/{TOTAL_ROUNDS}
          </span>
          <span style={styles.scoreText}>⭐ {score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressOuter}>
        <div
          style={{
            ...styles.progressInner,
            width: `${(round / TOTAL_ROUNDS) * 100}%`,
          }}
        />
      </div>

      {/* Streak */}
      {rewardSystem.getState().streak >= 2 && (
        <div style={styles.streak}>
          🔥 {rewardSystem.getState().streak} seguidos!
        </div>
      )}

      {/* Mini timeline */}
      <div style={styles.timelineContainer}>
        <div style={styles.timelineLine} />
        {timelineDots.map((dot, i) => {
          const isRelated = relatedEvent?.event === dot.label;
          const isAnswered = feedback === 'correct' && isRelated;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${dot.position}%`,
                top: '50%',
                transform: `translate(-50%, -50%) scale(${isAnswered ? 1.4 : 1})`,
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                zIndex: isAnswered ? 2 : 1,
              }}
            >
              <span
                style={{
                  fontSize: isAnswered ? '20px' : '14px',
                  filter: 'grayscale(0.5)',
                  opacity: isAnswered ? 1 : 0.6,
                  transition: 'all 0.3s ease',
                }}
              >
                {dot.emoji}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  color: isAnswered ? '#92400E' : '#B45309',
                  opacity: isAnswered ? 1 : 0.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {isAnswered ? dot.year : '•'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Event display - only show after correct answer */}
      {feedback === 'correct' && relatedEvent && (
        <div
          style={{
            ...styles.eventArea,
            transform: 'scale(1)',
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div style={styles.eventEmoji}>{relatedEvent.emoji}</div>
          <div style={styles.eventName}>{relatedEvent.event}</div>
          <div style={styles.eventYear}>{relatedEvent.year}</div>
          <div style={styles.eventPeriod}>{relatedEvent.period}</div>
        </div>
      )}

      {/* Question */}
      {currentQuestion && (
        <div style={styles.questionCard}>
          <p style={styles.questionText}>{currentQuestion.question}</p>
          {currentQuestion.hint && !showHint && feedback === null && (
            <button onClick={handleHint} style={styles.hintBtn}>
              💡 Dica
            </button>
          )}
          {showHint && currentQuestion.hint && (
            <p style={styles.hintText}>💡 {currentQuestion.hint}</p>
          )}
        </div>
      )}

      {/* Description after correct answer */}
      {showDescription && currentDescription && (
        <div style={styles.descriptionBox}>
          📖 {currentDescription}
        </div>
      )}

      {/* Feedback */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '28px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: feedback === 'correct' ? '#065F46' : feedback === 'wrong' ? '#991B1B' : 'transparent',
          transition: 'color 0.2s',
          fontFamily: "'Baloo 2', system-ui, sans-serif",
        }}
      >
        {message || '\u00A0'}
      </div>

      {/* Options */}
      {currentQuestion && (
        <div
          style={{
            ...styles.optionsGrid,
            gridTemplateColumns: currentQuestion.options.length === 2 ? '1fr 1fr' : 'repeat(2, 1fr)',
          }}
        >
          {currentQuestion.options.map((option) => {
            const isSelected = selected === option;
            const isCorrectAnswer = feedback === 'correct' && option === currentQuestion.correct;
            const isWrongAnswer = feedback === 'wrong' && isSelected;

            let bgColor = '#FFFBEB';
            let borderColor = '#FDE68A';
            let textColor = '#78350F';
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
                key={option}
                onClick={() => handleSelect(option)}
                disabled={feedback !== null}
                style={{
                  ...styles.optionBtn,
                  background: bgColor,
                  borderColor,
                  color: textColor,
                  transform: isCorrectAnswer
                    ? 'scale(1.05)'
                    : isWrongAnswer
                      ? 'translateX(4px)'
                      : 'scale(1)',
                  cursor: feedback !== null ? 'default' : 'pointer',
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    padding: '16px',
    gap: '10px',
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 30%, #FFFBEB 100%)',
    fontFamily: "'Baloo 2', system-ui, sans-serif",
    userSelect: 'none',
    WebkitUserSelect: 'none',
    overflowY: 'auto',
    position: 'relative',
  },
  scrollTexture: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(146, 64, 14, 0.03) 30px, rgba(146, 64, 14, 0.03) 31px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  header: {
    textAlign: 'center',
    zIndex: 1,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
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
    gap: '14px',
    marginTop: '6px',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  diffBadge: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    background: '#D97706',
    borderRadius: '12px',
    padding: '2px 12px',
  },
  roundText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#92400E',
  },
  scoreText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#78350F',
  },
  progressOuter: {
    width: '100%',
    maxWidth: '500px',
    height: '8px',
    borderRadius: '4px',
    background: 'rgba(146, 64, 14, 0.15)',
    overflow: 'hidden',
    zIndex: 1,
  },
  progressInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #D97706, #F59E0B)',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  streak: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#92400E',
    fontWeight: 'bold',
    zIndex: 1,
  },
  timelineContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    height: '50px',
    zIndex: 1,
    margin: '4px 0',
  },
  timelineLine: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    height: '3px',
    background: 'linear-gradient(90deg, #D97706, #92400E)',
    borderRadius: '2px',
    transform: 'translateY(-50%)',
  },
  eventArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    background: '#FFFBEB',
    borderRadius: '20px',
    padding: '12px 28px',
    boxShadow: '0 4px 20px rgba(146, 64, 14, 0.12)',
    border: '2px solid #FDE68A',
    zIndex: 1,
  },
  eventEmoji: {
    fontSize: '48px',
    lineHeight: 1,
  },
  eventName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#92400E',
    textAlign: 'center',
  },
  eventYear: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#D97706',
  },
  eventPeriod: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#B45309',
    textTransform: 'uppercase' as const,
    letterSpacing: '1.5px',
  },
  questionCard: {
    background: '#FFFBEB',
    borderRadius: '20px',
    padding: '16px 20px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 4px 16px rgba(146, 64, 14, 0.08)',
    border: '1px solid #FDE68A',
    zIndex: 1,
  },
  questionText: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#78350F',
    lineHeight: 1.5,
    margin: 0,
  },
  hintBtn: {
    marginTop: '8px',
    background: 'rgba(217, 119, 6, 0.15)',
    color: '#92400E',
    border: '1px solid #FDE68A',
    borderRadius: '12px',
    padding: '6px 16px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Baloo 2', system-ui, sans-serif",
    WebkitTapHighlightColor: 'transparent',
  },
  hintText: {
    marginTop: '8px',
    fontSize: '0.9rem',
    color: '#92400E',
    fontStyle: 'italic',
    margin: '8px 0 0',
  },
  descriptionBox: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid #A7F3D0',
    borderRadius: '16px',
    padding: '10px 16px',
    fontSize: '0.9rem',
    color: '#065F46',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    zIndex: 1,
  },
  optionsGrid: {
    display: 'grid',
    gap: '10px',
    maxWidth: '500px',
    width: '100%',
    zIndex: 1,
  },
  optionBtn: {
    padding: '14px 12px',
    borderRadius: '16px',
    border: '2px solid #FDE68A',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    textAlign: 'center',
    lineHeight: 1.3,
    boxShadow: '0 2px 8px rgba(146, 64, 14, 0.06)',
  },
};
