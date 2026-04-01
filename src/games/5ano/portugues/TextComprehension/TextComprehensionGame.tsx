import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyManager } from '../../../shared/DifficultyManager';
import { RewardSystem } from '../../../shared/RewardSystem';
import { audioManager } from '../../../shared/AudioManager';
import { saveSession } from '../../../../data/db';
import { useApp } from '../../../../hooks/useAppContext';
import { GameComplete } from '../../../../components/GameSelector/GameComplete';
import { getPassages } from './textsData';
import type { TextPassage } from './textsData';

const TOTAL_PASSAGES = 5;
const QUESTIONS_PER_PASSAGE = 2;
const TOTAL_ROUNDS = TOTAL_PASSAGES * QUESTIONS_PER_PASSAGE; // 10
const THEME_COLOR = '#4F46E5';
const THEME_LIGHT = '#EEF2FF';
const THEME_BORDER = '#C7D2FE';

export function TextComprehensionGame() {
  const { currentStudent } = useApp();
  const difficultyManager = useRef(
    new DifficultyManager(currentStudent?.current_difficulty ?? 'easy')
  ).current;
  const rewardSystem = useRef(new RewardSystem()).current;

  const [passages, setPassages] = useState<TextPassage[]>([]);
  const [passageIndex, setPassageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [passageVisible, setPassageVisible] = useState(false);
  const startTime = useRef(new Date());

  const totalAnswered = passageIndex * QUESTIONS_PER_PASSAGE + questionIndex;

  const loadPassages = useCallback(() => {
    const diff = difficultyManager.getDifficulty();
    const newPassages = getPassages(diff, TOTAL_PASSAGES);
    setPassages(newPassages);
  }, [difficultyManager]);

  useEffect(() => {
    loadPassages();
  }, []);

  useEffect(() => {
    setPassageVisible(false);
    setOptionsVisible(false);
    const t1 = setTimeout(() => setPassageVisible(true), 100);
    const t2 = setTimeout(() => setOptionsVisible(true), 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [passageIndex, questionIndex]);

  const currentPassage = passages[passageIndex];
  const currentQuestion = currentPassage?.questions[questionIndex];

  const handleSelect = useCallback(
    (optionIdx: number) => {
      if (feedback !== null || !currentQuestion) return;

      setSelectedOption(optionIdx);
      setAttempts((a) => a + 1);

      if (optionIdx === currentQuestion.correctIndex) {
        setFeedback('correct');
        setScore((s) => s + 1);
        const rewardState = rewardSystem.recordCorrect();
        difficultyManager.recordAnswer(true);
        setMessage(rewardState.message);
        audioManager.playCorrect();

        setTimeout(() => {
          advanceToNext(score + 1);
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
          setMessage('');
        }, 1200);
      }
    },
    [feedback, currentQuestion, score, rewardSystem, difficultyManager]
  );

  const advanceToNext = useCallback(
    (currentScore: number) => {
      const nextQuestionIdx = questionIndex + 1;

      if (nextQuestionIdx < QUESTIONS_PER_PASSAGE) {
        // Next question within same passage
        setQuestionIndex(nextQuestionIdx);
        setFeedback(null);
        setSelectedOption(null);
        setMessage('');
      } else {
        // Move to next passage
        const nextPassageIdx = passageIndex + 1;

        if (nextPassageIdx >= TOTAL_PASSAGES) {
          // Game complete
          finishGame(currentScore);
        } else {
          setPassageIndex(nextPassageIdx);
          setQuestionIndex(0);
          setFeedback(null);
          setSelectedOption(null);
          setMessage('');
        }
      }
    },
    [questionIndex, passageIndex]
  );

  const finishGame = useCallback(
    async (finalScore: number) => {
      setGameComplete(true);
      if (currentStudent?.id) {
        await saveSession({
          student_id: currentStudent.id,
          game_id: 'text-comprehension',
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
    setPassageIndex(0);
    setQuestionIndex(0);
    setScore(0);
    setAttempts(0);
    setHintsUsed(0);
    setGameComplete(false);
    setFeedback(null);
    setSelectedOption(null);
    setMessage('');
    startTime.current = new Date();
    loadPassages();
  }, [difficultyManager, rewardSystem, loadPassages]);

  if (gameComplete) {
    return (
      <GameComplete
        reward={rewardSystem.getState()}
        gameName="Compreensao de Texto"
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  if (!currentPassage || !currentQuestion) return null;

  const diffLabel: Record<string, string> = {
    easy: 'Facil',
    medium: 'Medio',
    hard: 'Dificil',
  };

  const typeLabel: Record<string, string> = {
    literal: 'Pergunta literal',
    inference: 'Inferencia',
    vocabulary: 'Vocabulario',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        padding: '12px 16px',
        gap: '10px',
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
          maxWidth: '640px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{'\uD83D\uDCD6'}</span>
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: THEME_COLOR }}>
            Compreensao de Texto
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              background: THEME_LIGHT,
              borderRadius: '16px',
              padding: '3px 10px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#4338CA',
            }}
          >
            {diffLabel[difficultyManager.getDifficulty()]}
          </span>
          <span style={{ fontSize: '18px' }}>{'\u2B50'} {score}</span>
        </div>
      </div>

      {/* Progress info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '640px',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '13px', color: '#6B7280' }}>
          Texto {passageIndex + 1}/{TOTAL_PASSAGES}
        </span>
        <span style={{ fontSize: '13px', color: '#6B7280' }}>
          Pergunta {questionIndex + 1}/{QUESTIONS_PER_PASSAGE}
        </span>
        <span style={{ fontSize: '13px', color: '#6B7280' }}>
          Total: {totalAnswered + 1}/{TOTAL_ROUNDS}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          height: '8px',
          background: '#E5E7EB',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(totalAnswered / TOTAL_ROUNDS) * 100}%`,
            background: `linear-gradient(90deg, ${THEME_COLOR}, #7C3AED)`,
            borderRadius: '8px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>

      {/* Streak indicator */}
      {rewardSystem.getState().streak >= 2 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#F59E0B',
            fontWeight: 'bold',
            flexShrink: 0,
          }}
        >
          {'\uD83D\uDD25'} {rewardSystem.getState().streak} seguidos!
        </div>
      )}

      {/* Passage Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          background: '#FFFBEB',
          borderRadius: '16px',
          border: '2px solid #FDE68A',
          padding: '16px 20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          flexShrink: 0,
          opacity: passageVisible ? 1 : 0,
          transform: passageVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Passage title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <span style={{ fontSize: '18px' }}>{'\uD83D\uDCDD'}</span>
          <span
            style={{
              fontSize: '17px',
              fontWeight: 'bold',
              color: '#92400E',
              fontFamily: "'Baloo 2', Georgia, serif",
            }}
          >
            {currentPassage.title}
          </span>
        </div>

        {/* Passage text */}
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.7,
            color: '#44403C',
            fontFamily: "'Baloo 2', Georgia, serif",
            margin: 0,
            textAlign: 'justify',
            maxHeight: '200px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {currentPassage.passage}
        </p>
      </div>

      {/* Question type badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '11px',
            padding: '2px 10px',
            borderRadius: '12px',
            background:
              currentQuestion.type === 'literal'
                ? '#DBEAFE'
                : currentQuestion.type === 'inference'
                  ? '#E0E7FF'
                  : '#FCE7F3',
            color:
              currentQuestion.type === 'literal'
                ? '#1E40AF'
                : currentQuestion.type === 'inference'
                  ? '#4338CA'
                  : '#BE185D',
            fontWeight: 600,
          }}
        >
          {typeLabel[currentQuestion.type]}
        </span>
      </div>

      {/* Question */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          background: `linear-gradient(135deg, ${THEME_LIGHT}, #F5F3FF)`,
          borderRadius: '14px',
          border: `2px solid ${THEME_BORDER}`,
          padding: '14px 18px',
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#312E81', lineHeight: 1.4 }}>
          {currentQuestion.question}
        </span>
      </div>

      {/* Feedback */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '26px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: feedback === 'correct' ? '#10B981' : feedback === 'wrong' ? '#EF4444' : 'transparent',
          transition: 'color 0.2s',
          flexShrink: 0,
        }}
      >
        {message || '\u00A0'}
      </div>

      {/* Options */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          maxWidth: '640px',
          paddingBottom: '16px',
          flexShrink: 0,
        }}
      >
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = feedback === 'correct' && idx === currentQuestion.correctIndex;
          const isWrongAnswer = feedback === 'wrong' && isSelected;
          const showCorrect = feedback === 'wrong' && idx === currentQuestion.correctIndex;

          let bgColor = '#FFFFFF';
          let borderColor = '#D1D5DB';
          let textColor = '#1F2937';
          let labelBg = '#F3F4F6';
          let labelColor = '#6B7280';

          if (isCorrectAnswer || showCorrect) {
            bgColor = '#D1FAE5';
            borderColor = '#10B981';
            textColor = '#065F46';
            labelBg = '#10B981';
            labelColor = '#FFFFFF';
          } else if (isWrongAnswer) {
            bgColor = '#FEE2E2';
            borderColor = '#EF4444';
            textColor = '#991B1B';
            labelBg = '#EF4444';
            labelColor = '#FFFFFF';
          }

          const labels = ['A', 'B', 'C', 'D'];

          return (
            <button
              key={`${passageIndex}-${questionIndex}-${idx}`}
              onClick={() => handleSelect(idx)}
              disabled={feedback !== null}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: `2px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: "'Baloo 2', system-ui, sans-serif",
                cursor: feedback !== null ? 'default' : 'pointer',
                transition: 'all 0.2s',
                transform: optionsVisible
                  ? isCorrectAnswer
                    ? 'scale(1.02)'
                    : isWrongAnswer
                      ? 'translateX(4px)'
                      : 'scale(1)'
                  : 'translateX(-10px)',
                opacity: optionsVisible ? 1 : 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: labelBg,
                  color: labelColor,
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {labels[idx]}
              </span>
              <span style={{ flex: 1, lineHeight: 1.4 }}>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
