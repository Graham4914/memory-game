import React from "react";
import "/src/styles/GameScreen.css";

function GameScreen({
    visibleCards,
    shuffleAndRender,
    selectedCards,
    setSelectedCards,
    score,
    setScore,
    onWin,
    onLose,

  }) {
   const handleCardClick = (clickedCode) => {
    if (selectedCards.includes(clickedCode)) {
      // Trigger loss condition
      onLose();
    } else {
      // Add card to selected cards
      setSelectedCards([...selectedCards, clickedCode]);
      setScore(score + 1);

      // Check for win condition
      if (score + 1 >= 8) { // Adjust this based on your win condition
        onWin();
      } else {
        // Re-render 8 new cards
        shuffleAndRender();
      }
    }
  };
  
    return (
      <div>
        <div className="card-grid">
          {visibleCards.map((card) => (
            <div
              key={card.code}
              className="card"
              onClick={() => handleCardClick(card.code)}
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