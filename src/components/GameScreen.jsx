import React from "react";
import "/src/styles/GameScreen.css";

function GameScreen({ cards, onCardClick, score }) {
    //Render first 10 cards
    const visibleCards = cards.slice(0, 10);
    return (
        <div>
            <div className="score-display">Score: {score}</div>
            <div className="card-grid">
                {visibleCards.map((card) =>(
                    <div key={card.code}
                     className="card"
                     onClick={() => onCardClick(card.code)}
                     >
                       <img src={card.image} alt={`${card.value} of ${card.suit}`} /> 
                       </div>
                ))}
            </div>
        </div>
    );
}
export default GameScreen;