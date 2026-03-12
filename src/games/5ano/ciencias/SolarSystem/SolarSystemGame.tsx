import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { getQuestionsForDifficulty, getPlanetByName, PLANETS } from './solarData';
import type { SolarQuestion } from './solarData';

const TOTAL_ROUNDS = 10;

function generateStars(count: number): { x: number; y: number; size: number; opacity: number; delay: number }[] {
  const stars: { x: number; y: number; size: number; opacity: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      delay: Math.random() * 3,
    });
  }
  return stars;
}

export function SolarSystemGame() {
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
  const [questions, setQuestions] = useState<SolarQuestion[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [currentFunFact, setCurrentFunFact] = useState('');
  const [planetVisible, setPlanetVisible] = useState(false);
  const startTime = useRef(new Date());

  const stars = useMemo(() => generateStars(60), []);

  const generateRound = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const qs = getQuestionsForDifficulty(diff, TOTAL_ROUNDS);
    setQuestions(qs);
    setRound(0);
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
    setShowFunFact(false);
    setPlanetVisible(false);
    setTimeout(() => setPlanetVisible(true), 100);
  }, [difficultyManager]);

  useEffect(() => {
    generateRound();
  }, []);

  const currentQuestion = questions[round];

  const relatedPlanet = currentQuestion?.planetRelated
    ? getPlanetByName(currentQuestion.planetRelated)
    : PLANETS[round % PLANETS.length];

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

        if (currentQuestion.planetRelated) {
          const planet = getPlanetByName(currentQuestion.planetRelated);
          if (planet) {
            setCurrentFunFact(planet.funFact);
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
            setPlanetVisible(false);
            setTimeout(() => setPlanetVisible(true), 100);
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
          studentId: currentStudent.id,
          gameId: 'solar-system',
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
        gameName="Sistema Solar"
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
      {/* Stars background */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            background: '#fff',
            opacity: star.opacity,
            animation: `twinkle ${2 + star.delay}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <span style={{ fontSize: '28px' }}>🪐</span>
          <span style={styles.title}>Sistema Solar</span>
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

      {/* Planet display — only shown after correct answer */}
      {feedback === 'correct' && relatedPlanet && (
        <div
          style={{
            ...styles.planetArea,
            transform: 'scale(1)',
            animation: 'planetReveal 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              lineHeight: 1,
              filter: `drop-shadow(0 0 20px ${relatedPlanet.color}66)`,
            }}
          >
            {relatedPlanet.emoji}
          </div>
          <div style={{ ...styles.planetName, color: relatedPlanet.color }}>
            {relatedPlanet.name}
          </div>
        </div>
      )}
      {/* Decorative space icon before answering */}
      {feedback !== 'correct' && (
        <div
          style={{
            ...styles.planetArea,
            transform: planetVisible ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div style={{ fontSize: '52px', lineHeight: 1, filter: 'drop-shadow(0 0 16px rgba(167,139,250,0.4))' }}>
            🌌
          </div>
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
          🌟 {currentFunFact}
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

            let bgColor = 'rgba(255, 255, 255, 0.1)';
            let borderColor = 'rgba(255, 255, 255, 0.2)';
            let textColor = '#E2E8F0';
            if (isCorrectAnswer) {
              bgColor = 'rgba(16, 185, 129, 0.3)';
              borderColor = '#10B981';
              textColor = '#6EE7B7';
            } else if (isWrongAnswer) {
              bgColor = 'rgba(239, 68, 68, 0.3)';
              borderColor = '#EF4444';
              textColor = '#FCA5A5';
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
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes planetReveal {
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
    background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
    fontFamily: "'Baloo 2', system-ui, sans-serif",
    userSelect: 'none',
    WebkitUserSelect: 'none',
    overflowY: 'auto',
    position: 'relative',
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
    color: '#C4B5FD',
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
    background: '#7C3AED',
    borderRadius: '12px',
    padding: '2px 12px',
  },
  roundText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#A5B4FC',
  },
  scoreText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#FDE68A',
  },
  progressOuter: {
    width: '100%',
    maxWidth: '500px',
    height: '8px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    zIndex: 1,
  },
  progressInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  streak: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#FDE68A',
    fontWeight: 'bold',
    zIndex: 1,
  },
  planetArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    zIndex: 1,
  },
  planetName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
  },
  questionCard: {
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '16px 20px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    zIndex: 1,
  },
  questionText: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#E2E8F0',
    lineHeight: 1.5,
    margin: 0,
  },
  hintBtn: {
    marginTop: '8px',
    background: 'rgba(251, 191, 36, 0.2)',
    color: '#FDE68A',
    border: '1px solid rgba(251, 191, 36, 0.3)',
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
    color: '#FDE68A',
    fontStyle: 'italic',
    margin: '8px 0 0',
  },
  funFact: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '16px',
    padding: '10px 16px',
    fontSize: '0.9rem',
    color: '#6EE7B7',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    zIndex: 1,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    maxWidth: '500px',
    width: '100%',
    zIndex: 1,
  },
  optionBtn: {
    padding: '14px 12px',
    borderRadius: '16px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    textAlign: 'center',
    lineHeight: 1.3,
  },
};
