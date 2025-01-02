import { useEffect, useState } from 'react'
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';
import { renderCards } from './utils/renderCards';

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
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

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
  



  //Memory logic
  const handleCardClick = (cardCode) => {
    console.log("Clicked card code:", cardCode);
  
    if (selectedCards.includes(cardCode)) {
      console.log("Card already selected. Losing the game...");
      handleLose();
    } else {
      console.log("New card selected:", cardCode);
      const newSelected = [...selectedCards, cardCode];
      setSelectedCards(newSelected);
      console.log("Updated selected cards:", newSelected);
  
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        console.log("Updated score:", newScore);

        setBestScore((prevBestScore) => Math.max(prevBestScore, newScore));

        const winCondition = getWinCondition();

        // Check for win condition
      if (newScore >= winCondition) { // Adjust this based on your win condition
        handleWin();
      } else {
        shuffleAndRender(); // Re-render the cards
      }
      return newScore;
       
      });
    }
  };
  


  const startGame = () => {
    //Reset states
    setSelectedCards([]);
    setScore(0);
    setGameState("loading");
    setVisibleCards([]); 

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
            setGameState("playing");
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
      if (gameState === "playing" && cards.length > 0) {
        console.log("Cards are ready. Calling shuffleAndRender.");
        shuffleAndRender();
      }
    }, [cards, gameState]);

    const handleWin = () => {
      console.log("Current Score:", score, "Best Score:", bestScore);
      setGameState("won");
      if (score > bestScore) {
        setBestScore(score);
      }
    };

    const handleLose = () => {
      setGameState("lost");
    };

    const restartGame = () => {
      setGameState("intro")
    };

  


    return (
      <div>
        {gameState === "intro" && (
          <IntroScreen onStart={startGame} setDifficulty={setDifficulty} />
          )}

        {gameState === "loading" && (
         <p>Loading deck... Please wait.</p>
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
          bestScore={bestScore}
          onWin={handleWin}
          onLose={handleLose}
          />
        )}

        {gameState === "won" && (
             <div>
             <h2>You Won!</h2>
             <p>Your final score: {score}</p>
             <p>Best score: {bestScore}</p>
             <button onClick={restartGame}>Back to Intro</button>
           </div>
         )}
   
         {gameState === "lost" && (
           <div>
             <h2>Game Over!</h2>
             <p>Your final score: {score}</p>
             <p>Best score: {bestScore}</p>
             <button onClick={restartGame}>Back to Intro</button>
           </div>
         )}
       </div>
      );
  }
  
  export default App;
 