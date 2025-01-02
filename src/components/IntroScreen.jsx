import React, { useState, useRef } from "react";
import ReactHowler from "react-howler";
import "/src/styles/IntroScreen.css";
import VideoClip from "./VideoClip";

// A quick spinner component for demonstration
function Spinner() {
  return <div className="spinner">Loading cinematic assets...</div>;
}

function IntroScreen({ onStart, setDifficulty, videoWatched }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(videoWatched);
  const [muted, setMuted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [soundPlaying, setSoundPlaying] = useState(true); // Default to playing sound

  const videoRef = useRef(null);

  const handleWatchIntro = () => {
    setIntroStarted(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
  setVideoEnded(true);
};

  
  const handleDifficultySelect = (diff) => {
    setSelectedDifficulty(diff);
  };


 const handleEnterCasino = () => {
  if (!selectedDifficulty) {
    alert("Please select a difficulty first!");
    return;
  }
  
  setDifficulty(selectedDifficulty);
  onStart(); 
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
            <button className="intro-button watch-intro-btn" onClick={handleWatchIntro}>
              Watch Intro
            </button>
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
        playing={soundPlaying}
        loop
        volume={0.1}
        mute={muted}
      />

      {/* 4) Sound toggle in top-right */}
      <button className="sound-toggle-btn" onClick={() => setMuted(!muted)}>
        {muted ? "Sound: OFF" : "Sound: ON"}
      </button>

      {/* 5) Show overlay after video ends */}
      {videoEnded && (
        <div className="intro-overlay">
          <h1 className="intro-title fade-up">Your Drink’s Been Spiked, Agent.</h1>
          <p className="intro-story fade-up">The clock is ticking. Outplay this casino in a lethal game of wits to secure the antidote.<br />
          One rule: <strong>never pick the same card twice</strong>. One misstep—and the poison wins.</p>

          {/* Difficulty Selection */}
          <div className="difficulty-options fade-up">
            <button className={`difficulty-btn ${!selectedDifficulty ? "pulse" : ""}`} onClick={() => handleDifficultySelect("easy")}>Easy</button>
            <button className={`difficulty-btn ${!selectedDifficulty ? "pulse" : ""}`} onClick={() => handleDifficultySelect("medium")}>Medium</button>
            <button className={`difficulty-btn ${!selectedDifficulty ? "pulse" : ""}`} onClick={() => handleDifficultySelect("hard")}>Hard</button>
            <button className={`difficulty-btn ${!selectedDifficulty ? "pulse" : ""}`} onClick={() => handleDifficultySelect("super-spy")}>Super Spy</button>
          </div>

          <button 
          className={`intro-button ${selectedDifficulty ? "pulse" : ""}`}
          onClick={handleEnterCasino}
          >
            Enter the Casino
          </button>
        </div>
      )}
    </div>
  );
}
export default IntroScreen;
