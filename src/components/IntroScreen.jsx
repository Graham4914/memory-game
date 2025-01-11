import React, { useState, useRef } from "react";
import ReactHowler from "react-howler";
import "/src/styles/IntroScreen.css";
import VideoClip from "./VideoClip";
import SoundToggleButton from "./SoundToggleButton";
import ButtonWithSound from "./ButtonWithSound";

// A quick spinner component for demonstration
function Spinner() {
  return <div className="spinner">Loading cinematic assets...</div>;
}

function IntroScreen({ onStart, setDifficulty, videoWatched, muted, setMuted }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(videoWatched);
  
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  

  const videoRef = useRef(null);

  const handleWatchIntro = () => {
    
    setIntroStarted(true);
    setMuted(false);
   
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
  setVideoEnded(true);
};

  
const handleDifficultySelect = (diff) => {
  setSelectedDifficulty(diff);

  // 🔊 Add slight delay to allow click sound to play
  setTimeout(() => {
    setDifficulty(diff);
    onStart();  // Move to the next game state
  }, 200);  // 200ms delay (adjust if needed)
};




  const handleCanPlay = () => {
    setVideoLoaded(true);
  };





  return (
    <div className="intro-container">
   
      {!introStarted &&  (
        <div className="intro-background">
         
          
          {/* If the video is loaded, show "Watch Intro"; otherwise, show Spinner */}
          {!videoLoaded && <Spinner />}
          {videoLoaded && !videoEnded && (
            <>
             <header>
              <div className="game-logo-container">
  
              </div>
            
             </header>
            <ButtonWithSound className="intro-button watch-intro-btn" onClick={handleWatchIntro}>
              Watch Intro
            </ButtonWithSound>
            </>
            
           
            
            
           
          )}
        </div>
      )}

  
           <VideoClip
        className="intro-video"
        ref={videoRef}
        src="/videos/intro.mp4"
        autoPlay={introStarted}
        muted
        loop={false} 
        onCanPlayThrough={handleCanPlay}
        onEnded={handleVideoEnd}
        style={{ display: introStarted ? "block" : "none" }}
        
        // Enable the slowdown effect:
        enableSlowdown={true}
        nearEndThreshold={.8}    // start slowdown 2 seconds before end
        minPlaybackRate={0.5}     // slow to half speed
        slowdownInterval={100}    // reduce speed every 100ms
      />
    
      {/* 3) ReactHowler for spy track */}
      <ReactHowler
        src={["/audio/spyintro.wav"]}
        // playing={soundPlaying}
        loop
        volume={0.05}
        mute={muted}
      />
      <SoundToggleButton muted={muted} setMuted={setMuted} />
    

      {/* 5) Show overlay after video ends */}
      {videoEnded && (
        <div className="intro-overlay">
          <div className="intro-content-container fade-up">
          <h1 className="intro-title">Your Drink’s Been Spiked 001</h1>
          <p className="intro-story">The poison clock is ticking. You must win a lethal game of wits and memory to secure the antidote before time runs out...<br />
          One rule: <strong>Never pick the same card twice</strong></p>
          </div>
          
          {/* Difficulty Selection */}
          <div className="difficulty-options fade-up">
          <ButtonWithSound
    className={`difficulty-btn ${!selectedDifficulty ? "pulse" : ""}`}
    onClick={() => handleDifficultySelect("easy")}
    muted={muted}
  >
    Easy
  </ButtonWithSound>

  <ButtonWithSound
    className={`difficulty-btn ${!selectedDifficulty ? "pulse" : ""}`}
    onClick={() => handleDifficultySelect("medium")}
    muted={muted}
  >
    Medium
  </ButtonWithSound>

  <ButtonWithSound
    className={`difficulty-btn ${!selectedDifficulty ? "pulse" : ""}`}
    onClick={() => handleDifficultySelect("hard")}
    muted={muted}
  >
    Hard
  </ButtonWithSound>

  <ButtonWithSound
    className={`difficulty-btn ${!selectedDifficulty ? "pulse" : ""}`}
    onClick={() => handleDifficultySelect("super-spy")}
    muted={muted}
  >
    Super Spy
  </ButtonWithSound>
          </div>

      
        </div>
      )}
    </div>
  );
}
export default IntroScreen;
