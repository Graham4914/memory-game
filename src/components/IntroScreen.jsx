import React from "react";


const IntroScreen = ({ onStart}) => {
    return (
        <div>
            <h1>Welcome to the Memory Game!</h1>
            <button onClick={onStart}>Start Game</button>
        </div>
    );
};

export default IntroScreen;