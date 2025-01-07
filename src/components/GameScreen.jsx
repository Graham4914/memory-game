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
    shuffleAndRender,
    onLose,
    difficulty,
    cardsToWin,   
  }) {
  
    
  const [flipPhase, setFlipPhase] = useState(0);
  const [cardsFlippedCount, setCardsFlippedCount] = useState(0);

   
    const handleUserClick = (cardCode) => {
      onCardClick(cardCode);
      setFlipPhase(1);
      setCardsFlippedCount(0);
    };


    const handlePhaseComplete = (phase) => {
      if (phase === 1) {
        // another card finished flipping 0->180
        setCardsFlippedCount((count) => count + 1);
      } else if (phase === 2) {
        // another card finished flipping 180->0
        // do whatever is needed for the final step
        // or track another separate count
      }
    };

      // Whenever cardsFlippedCount changes, check if all have reported in
  useEffect(() => {
    if (flipPhase === 1 && cardsFlippedCount === visibleCards.length) {
      // All cards done with the first flip => now do the shuffle
      shuffleAndRender();
      // Then flip them back
      setFlipPhase(2);
      // (If you want, reset cardsFlippedCount for phase 2)
      setCardsFlippedCount(0);
    } else if (flipPhase === 2 && cardsFlippedCount === visibleCards.length) {
      // All done flipping back => set flipPhase=0
      setFlipPhase(0);
    }
  }, [flipPhase, cardsFlippedCount, visibleCards, shuffleAndRender]);
    

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
            flipPhase={flipPhase}
            onPhaseComplete={handlePhaseComplete}
            onClick={() => handleUserClick(card.code)}
          />
        ))}
      </div>
    </div>
  );
  
  }
  
  export default React.memo(GameScreen)