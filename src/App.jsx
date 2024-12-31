import { useEffect, useState } from 'react'
import IntroScreen from './components/IntroScreen';
import GameScreen from './components/GameScreen';

  function App() {
  //Gamestate - Appflow
  const [gameState, setGameState] = useState("intro");

  //API related state
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]); 

  //Game logic state
  const [selectedCards, setSelectedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  //Memory logic
  const handleCardClick = (cardCode) => {
    if (selectedCards.includes(cardCode)) {
      //lose condition
      setGameState("lost");
    } else {
      //Add card to selected
      setSelectedCards([...selectedCards, cardCode]);
      setScore(score + 1);
    }
   
  }


  const startGame = () => {
    //Reset states
    setSelectedCards([]);
    setScore(0);
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

    const handleWin = () => {
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
          <IntroScreen onStart={startGame} />
          )}

        {gameState === "loading" && (
         <p>Loading deck... Please wait.</p>
        )}

          
        {gameState === "playing" && (
          <GameScreen
          cards={cards}
          onCardClick={handleCardClick} 
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
          score={setScore}
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
 