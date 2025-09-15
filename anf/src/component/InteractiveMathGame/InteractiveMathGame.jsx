import React, { useState, useEffect } from 'react';
import './InteractiveMathGame.css';

const InteractiveMathGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [difficulty, setDifficulty] = useState('easy');

  const generateProblem = () => {
    let num1, num2, operator, answer;
    
    switch(difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = '+';
        answer = num1 + num2;
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        operator = Math.random() > 0.5 ? '+' : '-';
        answer = operator === '+' ? num1 + num2 : num1 - num2;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = Math.random() > 0.3 ? '×' : (Math.random() > 0.5 ? '+' : '-');
        if (operator === '×') {
          answer = num1 * num2;
        } else if (operator === '+') {
          answer = num1 + num2;
        } else {
          answer = num1 - num2;
        }
        break;
      default:
        num1 = 2; num2 = 2; operator = '+'; answer = 4;
    }

    setCurrentProblem({ num1, num2, operator, answer });
    setUserAnswer('');
    setFeedback('');
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    generateProblem();
  };

  const checkAnswer = () => {
    if (!currentProblem || !userAnswer) return;

    const userAnswerNum = parseInt(userAnswer);
    if (userAnswerNum === currentProblem.answer) {
      setScore(prev => prev + (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
      setFeedback('✅ Correct!');
      setTimeout(() => {
        setFeedback('');
        generateProblem();
      }, 1000);
    } else {
      setFeedback('❌ Try again!');
      setTimeout(() => setFeedback(''), 1000);
    }
  };

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <div className="interactive-math-game">
      <div className="game-header">
        <h2>🧮 Math Challenge</h2>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {!gameActive ? (
        <div className="game-start-screen">
          <div className="difficulty-selector">
            <h3>Choose Difficulty:</h3>
            <div className="difficulty-buttons">
              <button 
                className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                🟢 Easy
              </button>
              <button 
                className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                🟡 Medium
              </button>
              <button 
                className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                🔴 Hard
              </button>
            </div>
          </div>
          <button className="start-game-btn" onClick={startGame}>
            🚀 Start Game
          </button>
        </div>
      ) : (
        <div className="game-play-screen">
          <div className="math-problem">
            <div className="problem-display">
              <span className="number">{currentProblem?.num1}</span>
              <span className="operator">{currentProblem?.operator}</span>
              <span className="number">{currentProblem?.num2}</span>
              <span className="equals">=</span>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className="answer-input"
                autoFocus
              />
            </div>
          </div>

          {feedback && (
            <div className={`feedback ${feedback.includes('✅') ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}

          <div className="game-controls">
            <button className="check-btn" onClick={checkAnswer}>
              ✅ Check Answer
            </button>
            <button className="skip-btn" onClick={generateProblem}>
              ⏭️ Skip
            </button>
          </div>
        </div>
      )}

      {!gameActive && score > 0 && (
        <div className="game-results">
          <h3>Game Over!</h3>
          <p className="final-score">Final Score: {score}</p>
          <div className="performance-rating">
            {score >= 20 ? '🏆 Math Genius!' :
             score >= 15 ? '⭐ Excellent!' :
             score >= 10 ? '👍 Good Job!' :
             '💪 Keep Practicing!'}
          </div>
          <button className="play-again-btn" onClick={startGame}>
            🔄 Play Again
          </button>
        </div>
      )}

      {/* Animated Math Elements */}
      <div className="game-background-elements">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="math-symbol"
            style={{
              animationDelay: `${i * 0.5}s`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          >
            {['+', '−', '×', '÷', '=', 'π', '√', '∞'][i]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveMathGame;
