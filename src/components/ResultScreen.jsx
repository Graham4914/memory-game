import React from "react";
import "/src/styles/ResultScreen.css"
function ResultScreen({ isWin, score, bestScore, onPlayAgain, onQuit, difficulty, cardsToWin }) {
    return (
      // <div className="result-container">
      <div className="result-overlay result-fade-up">
        {/* If you want a background image, you can do it via CSS or inline styling */}
        {/* e.g., style={{ background: "url('/images/win-bg.jpg') center/cover" }} */}
  
        {isWin ? (
          <>
          <h2 className="result-title">You Won!</h2>
          <p className="result-message">You have the antidote and will live to fight another day!</p>
          </>
    
        ) : (
          <>
          <h2 className="result-title">You Lost!</h2>
          <p className="result-message">Without the antidote you wont survive, its Game Over for you...</p>
          </>
        )}
        <h2>Level: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
        <p>Cards to Win: {cardsToWin}</p>
        <p className="result-story">Your final score: {score}</p>
        <p className="result-story">Best score: {bestScore}</p>
        <div className="result-options">
        <button className="result-button" onClick={onPlayAgain}>
          {isWin ? "Play Again" : "Try Again"}
        </button>
        <button className="result-button" onClick={onQuit}>Quit</button>
        </div>
      
      </div>
      // </div>
    );
  }
  
  export default ResultScreen;