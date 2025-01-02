import React, { useState, useEffect } from "react";
import "/src/styles/GameScreen.css";
import "/src/styles/CardAnimate.css";

function GameScreen({
    visibleCards,
    onCardClick,
    cardsFlipped,
    score,
    bestScore,
    onLose,
    difficulty,
    cardsToWin,
    
  }) {
 
  const levelHeading = `Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
  const cardsToWinText = `Cards to Win: ${cardsToWin}`;
  

  const [timer, setTimer] = useState(null); // Timer in seconds

    // Map difficulty to time limits
    const timeLimits = {
      easy: 40, 
      medium: 90, 
      hard: 180, 
      "super-spy": 300, 
    };
  
    useEffect(() => {
      // Initialize timer based on difficulty
      setTimer(timeLimits[difficulty] || 300); // Default to 5 minutes
    }, [difficulty]);
  
    useEffect(() => {
      // Timer countdown logic
      if (timer === null) return;
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
  
        return () => clearInterval(interval); // Cleanup
      } else {
        // Trigger lose condition when timer reaches 0
        onLose();
      }
    }, [timer, onLose]);
  
    // Format timer as MM:SS
    const formatTime = (seconds) => {
      if (seconds === null) return "00:00"; 
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
  return (
    <div className="game-screen">
      <div className="timer-container">
        <h2>Poison Timer</h2>
        <p className="timer">{formatTime(timer)}</p>
      </div>

      <div className="level-container">
        <h2>Level: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
        <p>Cards to Win: {cardsToWin}</p> {/* Dynamically display cardsToWin */}
      </div>
      
      <div className="score-container">
        <p>Score:{score}</p> 
        <p>Best Score:{bestScore}</p> 
      </div>
      <div className="card-grid">
        {visibleCards.map((card) => (
          <div
            key={card.code}
            className={`card ${cardsFlipped ? "flipped" : ""}`}
            onClick={() => onCardClick(card.code)}
          >
            <div className="card-inner">
            <div className="card-front"></div>
            <div className="card-back">
            <img
              src={card.image}
              alt={`${card.value} of ${card.suit}`}
            />
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  }
  
  export default GameScreen