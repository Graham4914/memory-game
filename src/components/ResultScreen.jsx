import React from "react";
import "/src/styles/ResultScreen.css"
import ReactHowler from "react-howler";
import ButtonWithSound from "./ButtonWithSound";

// console.log("Muted state in IntroScreen:", muted);


function ResultScreen({ isWin, score, bestScore, onPlayAgain, onQuit, difficulty, cardsToWin, muted, setMuted }) {
    return (

      
      // <div className="result-container">
      <div className="result-overlay result-fade-up">
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
        <> <h2>Level: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
        <p>Cards to Win: {cardsToWin}</p>
        <p className="result-story">Your final score: {score}</p>
        <p className="result-story">Best score: {bestScore}</p>


        <div className="result-options">
                <ButtonWithSound
          className="result-button"
          onClick={() => {
            setTimeout(() => {
              onPlayAgain();
            }, 200);  
          }}
          muted={muted}  
        >
          {isWin ? "Play Again" : "Try Again"}
        </ButtonWithSound>

        <ButtonWithSound
          className="result-button"
          onClick={onQuit}
          muted={muted}  
        >
          Quit
        </ButtonWithSound>
        </div>
        
        </>
                <ReactHowler
          src={isWin ? ["/audio/resultpy.mp3"] : ["/audio/ominous.mp3"]}
          playing={!muted}
          loop={true}
          volume={0.09}
        />
       
      </div>
      
    );
  }
  
  export default ResultScreen;