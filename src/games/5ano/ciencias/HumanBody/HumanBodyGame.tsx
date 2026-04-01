import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { getQuestionsForDifficulty, getOrganByName, ORGANS } from './bodyData';
import type { BodyQuestion } from './bodyData';

const TOTAL_ROUNDS = 10;

export function HumanBodyGame() {
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
  const [questions, setQuestions] = useState<BodyQuestion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [currentFunFact, setCurrentFunFact] = useState('');
  const [organVisible, setOrganVisible] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);
  const startTime = useRef(new Date());

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const qs = getQuestionsForDifficulty(diff, TOTAL_ROUNDS);
    setQuestions(qs);
    setRound(0);
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
    setShowFunFact(false);
    setOrganVisible(false);
    setTimeout(() => setOrganVisible(true), 100);
  }, [difficultyManager]);

  useEffect(() => {
    generateRound();
  }, []);

  // Heartbeat pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive((p) => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentQuestion = questions[round];

  const relatedOrgan = currentQuestion?.organRelated
    ? getOrganByName(currentQuestion.organRelated)
    : ORGANS[round % ORGANS.length];

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

        if (currentQuestion.organRelated) {
          const organ = getOrganByName(currentQuestion.organRelated);
          if (organ) {
            setCurrentFunFact(organ.funFact);
            setShowFunFact(true);
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
            setShowFunFact(false);
            setOrganVisible(false);
            setTimeout(() => setOrganVisible(true), 100);
          }
        }, showFunFact ? 3000 : 1500);
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
    [feedback, currentQuestion, round, score, rewardSystem, difficultyManager, showFunFact]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          student_id: currentStudent.id,
          game_id: 'human-body',
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
    setShowFunFact(false);
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
        gameName="Corpo Humano"
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
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <span
            style={{
              fontSize: '28px',
              display: 'inline-block',
              transform: pulseActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            ❤️
          </span>
          <span style={styles.title}>Corpo Humano</span>
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

      {/* Organ display — only revealed after correct answer */}
      {feedback === 'correct' && relatedOrgan && (
        <div
          style={{
            ...styles.organArea,
            transform: 'scale(1)',
            animation: 'organReveal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div style={styles.organEmoji}>{relatedOrgan.emoji}</div>
          <div style={styles.organName}>{relatedOrgan.name}</div>
          <div style={styles.organSystem}>Sistema {relatedOrgan.system}</div>
        </div>
      )}
      {/* Decorative icon before answering */}
      {feedback !== 'correct' && (
        <div
          style={{
            ...styles.organArea,
            transform: organVisible ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div style={{ fontSize: '48px', lineHeight: 1 }}>🩺</div>
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

      {/* Fun fact */}
      {showFunFact && currentFunFact && (
        <div style={styles.funFact}>
          🔬 {currentFunFact}
        </div>
      )}

      {/* Feedback */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '28px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#EF4444' : 'transparent',
          transition: 'color 0.2s',
          fontFamily: "'Baloo 2', system-ui, sans-serif",
        }}
      >
        {message || '\u00A0'}
      </div>

      {/* Options */}
      {currentQuestion && (
        <div style={styles.optionsGrid}>
          {currentQuestion.options.map((option) => {
            const isSelected = selected === option;
            const isCorrectAnswer = feedback === 'correct' && option === currentQuestion.correct;
            const isWrongAnswer = feedback === 'wrong' && isSelected;

            let bgColor = '#FFFFFF';
            let borderColor = '#FECDD3';
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

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes organReveal {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
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
    justifyContent: 'flex-start',
    height: '100%',
    padding: '16px',
    gap: '10px',
    background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)',
    fontFamily: "'Baloo 2', system-ui, sans-serif",
    userSelect: 'none',
    WebkitUserSelect: 'none',
    overflowY: 'auto',
  },
  header: {
    textAlign: 'center',
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
    color: '#9F1239',
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
    background: '#E11D48',
    borderRadius: '12px',
    padding: '2px 12px',
  },
  roundText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#BE123C',
  },
  scoreText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#9F1239',
  },
  progressOuter: {
    width: '100%',
    maxWidth: '500px',
    height: '8px',
    borderRadius: '4px',
    background: '#FECDD3',
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #E11D48, #FB7185)',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  streak: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#E11D48',
    fontWeight: 'bold',
  },
  organArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    background: '#FFFFFF',
    borderRadius: '24px',
    padding: '16px 32px',
    boxShadow: '0 4px 20px rgba(225, 29, 72, 0.12)',
    border: '2px solid #FECDD3',
  },
  organEmoji: {
    fontSize: '56px',
    lineHeight: 1,
  },
  organName: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#9F1239',
  },
  organSystem: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#FB7185',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  questionCard: {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '16px 20px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 4px 16px rgba(225, 29, 72, 0.08)',
    border: '1px solid #FECDD3',
  },
  questionText: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#1F2937',
    lineHeight: 1.5,
    margin: 0,
  },
  hintBtn: {
    marginTop: '8px',
    background: '#FEF3C7',
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
  funFact: {
    background: '#ECFDF5',
    border: '1px solid #A7F3D0',
    borderRadius: '16px',
    padding: '10px 16px',
    fontSize: '0.9rem',
    color: '#065F46',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    maxWidth: '500px',
    width: '100%',
  },
  optionBtn: {
    padding: '14px 12px',
    borderRadius: '16px',
    border: '2px solid #FECDD3',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    textAlign: 'center',
    lineHeight: 1.3,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
};
