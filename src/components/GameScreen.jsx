import React from "react";
import "/src/styles/GameScreen.css";

function GameScreen({
    visibleCards,
    onCardClick,
    score,
    bestScore
  }) {

  
  return (
    <div className="game-screen">
      <div className="score-container">
        <p>Score:{score}</p> 
        <p>Best Score:{bestScore}</p> 
      </div>
      <div className="card-grid">
        {visibleCards.map((card) => (
          <div
            key={card.code}
            className="card"
            onClick={() => onCardClick(card.code)}
          >
            <img
              src={card.image}
              alt={`${card.value} of ${card.suit}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
  
  }
  
  export default GameScreen