import { useEffect, useState } from 'react'
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { renderCards } from './utils/renderCards';
import VideoClip from './components/VideoClip';

  function App() {
  //Gamestate - Appflow
  const [gameState, setGameState] = useState("intro");
  const [difficulty, setDifficulty] = useState(null);

  //API related state
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]); 

  //Game logic state
  const [selectedCards, setSelectedCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]); 
  const [videoWatched, setVideoWatched] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

    // -------------- For parallel loading --------------
    const [videoEnded, setVideoEnded] = useState(false);
    const [deckLoaded, setDeckLoaded] = useState(false);
  

  function shuffleAndRender() {
    console.log("Shuffling cards with current state:", { cards, selectedCards });
    const new8 = renderCards(cards, selectedCards, 8);
    console.log("New visible cards:", new8);
    setVisibleCards(new8);
  }

  const getWinCondition = () => {
    switch (difficulty) {
      case "easy":
        return 8;
      case "medium":
        return 16;
      case "hard":
        return 32;
      case "super-spy":
        return 52;
      default:
        return 8; // Fallback for safety
    }
  };
  

  const handleCardClick = (cardCode) => {
    console.log("Clicked card code:", cardCode);
  
    if (selectedCards.includes(cardCode)) {
      handleLose();
      console.log("Animation started");
      
    } else {
      console.log("New card selected:", cardCode);
      const newSelected = [...selectedCards, cardCode];
      setSelectedCards(newSelected);
   
      setTimeout(() => {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          setBestScore((prevBestScore) => Math.max(prevBestScore, newScore));
          const winCondition = getWinCondition();
          
          if (newScore >= winCondition) {
            handleWin();
          } 
          return newScore;  
        });
      }, 100); 

    }
  };

  

  const startGame = () => {
    //Reset states
    setSelectedCards([]);
    setScore(0);
    setVisibleCards([]); 
    setVideoEnded(false);
    setDeckLoaded(false);
    setGameState("loading");

  // Now go to "loading"
  setGameState("loading");
    //Fetch a new shuffeled deck
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setDeckId(data.deck_id); //Store new deck id
      } else {
        console.error("Deck creation not successfull:", data);
      }
    })
    .catch((err) => {
      console.error("Error creating deck:", err)
    });
  };


    //Useeffect to fecth all 52 cards with valkid deckID
    useEffect(() => {
      if(deckId && gameState === "loading") {
        //Draw all 52 cards from deck
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`)
        .then((response) => response.json())
        .then((data) => {
          if(data.success) {
            console.log("Fetched cards:", data.cards);
               
            setCards(data.cards); //store 52 card objects
             // Preload all card images
          data.cards.forEach((card) => {
            const img = new Image();
            img.src = card.image; // Preload the card image
          });
          console.log("All card images preloaded");

            // setGameState("playing");
            setDeckLoaded(true);

          } else {
            console.error("Error drawing cards: ",data);
          }
        })
        .catch((err) => {
          console.error("Error drawing cards:", err)
        });
      }
    }, [deckId, gameState]);

    useEffect(() => {
      if (gameState === "loading" && deckLoaded && videoEnded) {
        shuffleAndRender();
        setGameState("playing");
      }
    }, [gameState, deckLoaded, videoEnded]);

   
    const handleWin = () => {
      console.log("Current Score:", score, "Best Score:", bestScore);
      setGameState("winTransition");
      if (score > bestScore) {
        setBestScore(score);
      }
    };

    const handleLose = () => {
      setGameState("loseTransition");
    };

    const restartGame = () => {
      setGameState("intro")
      setVideoWatched(true); // Skip video on replay
      setScore(0);
    };

    const quitGame = () => {
      // This is used if user wants to exit completely
      setGameState("intro");
      setVideoWatched(false); // so next time, we see the intro
      setScore(0);
      setBestScore(0); // you can decide if you want to reset bestScore
    };
  


    return (
      <div>
        {gameState === "intro" && (
          <IntroScreen onStart={startGame}
           setDifficulty={setDifficulty}
           videoWatched={videoWatched}
            />
          )}

        {gameState === "loading" && (
           <VideoClip
           src="/videos/001EnterCasino.mp4"
           autoPlay
           loop={false}
           muted={false}
           onEnded={() => setVideoEnded(true)}
           style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
         />
          
         
        )}

          
        {gameState === "playing" && (
          <GameScreen
          visibleCards={visibleCards}
          shuffleAndRender={shuffleAndRender}
          cards={cards}
          onCardClick={handleCardClick}  
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
          score={score}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          bestScore={bestScore}
          onWin={handleWin}
          onLose={handleLose}
          difficulty={difficulty}
          cardsToWin={getWinCondition()}
          />
        )}

{gameState === "winTransition" && (
  <div className="video-overlay-container">
    <VideoClip
      src="/videos/spywin.mp4"
      autoPlay
      loop={false}
      muted={false}
      // onEnded={() => setGameState("won")} // optional
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />

    {/* Overlaid Result */}
  
      <ResultScreen
        isWin
        score={score}
        bestScore={bestScore}
        difficulty={difficulty}
        cardsToWin={getWinCondition()}
        onPlayAgain={restartGame}
        onQuit={quitGame}
      />
    
  </div>
)}

{gameState === "loseTransition" && (
  <div className="video-overlay-container">
    <VideoClip
      src="/videos/spylose.mp4"
      autoPlay
      loop={false}
      muted={false}
      // e.g. onEnded={() => setGameState("lost")}
      style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
    />

    
      <ResultScreen

        isWin={false}
        score={score}
        difficulty={difficulty}
        cardsToWin={getWinCondition()}
        bestScore={bestScore}
        onPlayAgain={restartGame}
        onQuit={quitGame}
      />

  </div>
)}

      {/* WON -> SHOW RESULT SCREEN */}
      {gameState === "won" && (
        <ResultScreen
          isWin={true}
          score={score}
          bestScore={bestScore}
          onPlayAgain={restartGame}
          onQuit={quitGame}
        />
      )}

      {/* LOST -> SHOW RESULT SCREEN */}
      {gameState === "lost" && (
        <ResultScreen
          isWin={false}
          score={score}
          bestScore={bestScore}
          onPlayAgain={restartGame}
          onQuit={quitGame}
        />
      )}
       </div>
      );
  }
  
  export default App;
 