import { useEffect, useState } from 'react'
import ReactHowler from 'react-howler';
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { renderCards } from './utils/renderCards';
import VideoClip from './components/VideoClip';
import SoundToggleButton from './components/SoundToggleButton';


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
  
    //---gloabal sound control---
    const [soundPlaying, setSoundPlaying] = useState(true); 
    const [muted, setMuted] = useState(true);




  function shuffleAndRender() {
    const new8 = renderCards(cards, selectedCards, 8);
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
        return 8;
    }
  };
  

  const handleCardClick = (cardCode) => {
    if (selectedCards.includes(cardCode)) {
      handleLose();
    } else {
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
    setSelectedCards([]);
    setScore(0);
    setVisibleCards([]); 
    setVideoEnded(false);
    setDeckLoaded(false);
    setGameState("loading");

  
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


    
    useEffect(() => {
      if(deckId && gameState === "loading") {
        //Draw all 52 cards from deck
        fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`)
        .then((response) => response.json())
        .then((data) => {
          if(data.success) {
            setCards(data.cards); //store 52 card objects
             // Preload all card images
          data.cards.forEach((card) => {
            const img = new Image();
            img.src = card.image; // Preload the card image
          });
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
      setVideoWatched(true); 
      setScore(0);
    };

    const quitGame = () => {
      setGameState("intro");
      setVideoWatched(false); 
      setScore(0);
      setBestScore(0); 
      setSoundPlaying(false); 
      setMuted(true);
    };
  
  

    return (
      
      <div>
        {gameState === "intro" && (
          <IntroScreen onStart={startGame}
           setDifficulty={setDifficulty}
           videoWatched={videoWatched}
           muted={muted}
           setMuted={setMuted}
            />
          )}

{gameState === "loading" && (
  <>
    
            <VideoClip
              src="/videos/spy-enter-casino.mp4"
              autoPlay
              loop={false}
              muted={true}
              playsInline
              onEnded={() => setVideoEnded(true)}
              style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
            />

         <SoundToggleButton muted={muted} setMuted={setMuted} />
           

             {/* Skip background music if iOS */}
             
            <ReactHowler
              src={["/audio/walking-at-night.mp3"]}
              playing={!muted}
              loop
              volume={1.2}
              muted={muted}
            />
          
        </>
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
          muted={muted}
          setMuted={setMuted}
          />
        )}

{gameState === "winTransition" && (
  <div className="video-overlay-container">
    
      
            <VideoClip
              src="/videos/spy-win-comp1.mp4"
              autoPlay
              playsInline
              loop={false}
              muted={false}
              style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
            />
         
         
               
            
   
      <ResultScreen
        isWin
        score={score}
        bestScore={bestScore}
        difficulty={difficulty}
        cardsToWin={getWinCondition()}
        onPlayAgain={restartGame}
        onQuit={quitGame}
        muted={muted}
        setMuted={setMuted}
      />
  </div>
)}

{gameState === "loseTransition" && (
  <div className="video-overlay-container">
    
            <VideoClip
              src="/videos/spy-lose-comp1.mp4"
              autoPlay
              playsInline
              loop={false}
              muted={false}
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
        muted={muted}
        setMuted={setMuted}
      />
  </div>
)}

     
      {gameState === "won" && (
        <ResultScreen
          isWin={true}
          score={score}
          bestScore={bestScore}
          onPlayAgain={restartGame}
          onQuit={quitGame}
          muted={muted}
        />
      )}

      
      {gameState === "lost" && (
        <ResultScreen
          isWin={false}
          score={score}
          bestScore={bestScore}
          onPlayAgain={restartGame}
          onQuit={quitGame}
          muted={muted}
        />
      )}
       </div>
      );

      
  }
  
  export default App;
 