import React, { useState, useRef } from "react";
import ReactHowler from "react-howler";
import "/src/styles/IntroScreen.css";

// A quick spinner component for demonstration
function Spinner() {
  return <div className="spinner">Loading cinematic assets...</div>;
}

function IntroScreen({ onStart }) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [muted, setMuted] = useState(false);

  const videoRef = useRef(null);

  const handleCanPlay = () => {
    setVideoLoaded(true);
  };

  const handleWatchIntro = () => {
    setIntroStarted(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <div className="intro-container">
      {/* 
        1) Background image is shown only if the intro hasn’t started yet.
           The .intro-background class in CSS handles the background.
           If introStarted = true, we hide this div altogether with display: none 
           so the video can show.
      */}
      {!introStarted && (
        <div className="intro-background">
          {/* If the video is loaded, show "Watch Intro"; otherwise, show Spinner */}
          {!videoLoaded && <Spinner />}
          {videoLoaded && (
            <button className="intro-button watch-intro-btn" onClick={handleWatchIntro}>
              Watch Intro
            </button>
          )}
        </div>
      )}

      {/* 2) The actual video (hidden until introStarted = true) */}
      <video
        className="intro-video"
        ref={videoRef}
        src="/videos/intro.mp4"
        muted
        preload="auto"
        onCanPlayThrough={handleCanPlay}
        onEnded={handleVideoEnd}
        style={{ display: introStarted ? "block" : "none" }}
      />

      {/* 3) ReactHowler for your spy track */}
      <ReactHowler
        src={["/audio/spyintro.wav"]}
        playing={introStarted}
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
          <h1 className="intro-title">Super Spy Casino</h1>
          <p className="intro-story">
            You’ve been poisoned. Beat the house to win the antidote...
          </p>
          <button className="intro-button" onClick={onStart}>
            Enter the Casino
          </button>
        </div>
      )}
    </div>
  );
}

export default IntroScreen;
