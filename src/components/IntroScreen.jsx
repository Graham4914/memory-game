import React, { useState, useRef } from "react";
import ReactHowler from "react-howler";
import "/src/styles/IntroScreen.css";
import VideoClip from "./VideoClip";
import SoundToggleButton from "./SoundToggleButton";
import ButtonWithSound from "./ButtonWithSound";
import { FaGithub } from 'react-icons/fa';


function IntroScreen({ onStart, setDifficulty, videoWatched, muted, setMuted}) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(videoWatched);
  
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  

  const videoRef = useRef(null);



  const handleWatchIntro = () => {
    setIntroStarted(true);
    setMuted(false);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleCanPlay = () => {
    setVideoLoaded(true);
  };

  
  const handleDifficultySelect = (diff) => {
    setSelectedDifficulty(diff);
    setDifficulty(diff);
    onStart(diff);
  };


  return (
    <div className="intro-container">
   
      {!introStarted &&  (
        <div className="intro-background">
        
          { !videoEnded && (
            <>
             <header>
              <div className="game-logo-container"></div>
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
          src="/videos/intro-comp1.mp4"
          autoPlay={introStarted}
          muted
          playsInline
          loop={false}
          onCanPlayThrough={handleCanPlay}
          onVideoReady={() => {
            setVideoLoaded(true); 
            console.log("Video is ready!");
          }}
          onEnded={handleVideoEnd}
          style={{ display: introStarted ? "block" : "none" }}
          // enableSlowdown={true}
          nearEndThreshold={0.8}
          minPlaybackRate={0.5}
          slowdownInterval={100}
        />
      
    
    
    
        <ReactHowler
          src={["/audio/spyintro.wav"]}
          loop
          volume={0.05}
          mute={muted}
          playing={!muted && introStarted}
        />
      
      <SoundToggleButton muted={muted} setMuted={setMuted} />
    

      {videoEnded && (
        <div className="intro-overlay">
          <div className="intro-content-container fade-up">
          <h1 className="intro-title">Your Drink’s Been Spiked 001</h1>
          <p className="intro-story">The poison clock is ticking. You must win a lethal game of wits and memory to secure the antidote before time runs out...<br />
          One rule: <strong>Never pick the same card twice</strong></p>
          </div>
          
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
               {/* GitHub Icon and Credit */}
      <div className="credit bottom-center">
        <a href="https://github.com/Graham4914/memory-game" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
          <FaGithub size={20} />
        </a>
        <span>by G Sharman</span>
      </div>
       
      
    </div>
    
  );
  
}
export default IntroScreen;
