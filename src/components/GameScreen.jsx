import React from "react";

function GameScreen({ cards }) {
    return (
        <div>
            <h2>Memory Game</h2>
            <div className="card-grid">
                {cards.map((card) =>(
                    <div key={card.code} className="card">
                       <img src={card.image} alt={`${card.value} of ${card.suit}`} /> 
                       </div>
                ))}
            </div>
        </div>
    );
}
export default GameScreen;