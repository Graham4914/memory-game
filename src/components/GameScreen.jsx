import React, { memo, useState, useEffect } from "react";
import "/src/styles/GameScreen.css";
import { motion } from "framer-motion";
import Card from "./card";
import "/src/styles/CardAnimate.css";



function GameScreen({
    visibleCards,
    onCardClick,
    score,
    bestScore,
    isAnimating,
    setIsAnimating,
    onLose,
    difficulty,
    cardsToWin,   
  }) {
  
    
 
  

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
    <Card
    key={card.code}
    card={card}
    onClick={() => onCardClick(card.code)}
    isFlipped={isAnimating} // Flip all cards during animation
  />
        ))}
      </div>
    </div>
  );
  
  }
  
  export default memo(GameScreen)