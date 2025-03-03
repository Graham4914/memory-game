import React, { useRef, useState, useEffect, forwardRef} from "react";

/**
 * VideoClip component with optional slow-mo near the end.
 *
 * Props:
 *   src              (string)   - video source URL
 *   autoPlay         (boolean)  - play automatically when loaded
 *   loop             (boolean)  - loop the video
 *   muted            (boolean)  - mute the video
 *   onEnded          (function) - callback for end-of-video
 *   style            (object)   - inline styles
 *
 *   // Additional slow-mo props (optional):
 *   enableSlowdown   (boolean)  - if true, slow down near end
 *   nearEndThreshold (number)   - how many seconds before end to start slow
 *   minPlaybackRate  (number)   - slowest speed we drop to
 *   slowdownInterval (number)   - how many ms between each speed decrement
 */
const VideoClip = forwardRef(({
  className = "",
  src,
  autoPlay = true,
  loop = false,
  muted = true,
  onEnded,
  style = {},
  onCanPlayThrough,
  playsInline,
  onVideoReady,
  enableSlowdown = false,
  nearEndThreshold = 1.0,
  minPlaybackRate = 0.5,
  slowdownInterval = 100,
}, ref) => {
  const videoRef = ref || useRef(null);

  
  const [isNearEnd, setIsNearEnd] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

 
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;

    if (
      enableSlowdown &&
      !isNearEnd &&
      duration - currentTime <= nearEndThreshold
    ) {
      setIsNearEnd(true);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;
    if (!enableSlowdown) return;

    let intervalId;
    if (isNearEnd) {
      intervalId = setInterval(() => {
        setPlaybackRate((rate) => {
          let newRate = rate - 0.05;
          if (newRate <= minPlaybackRate) {
            newRate = minPlaybackRate;
            clearInterval(intervalId);
          }
          return newRate;
        });
      }, slowdownInterval);
    }

    return () => clearInterval(intervalId);
  }, [isNearEnd, enableSlowdown, minPlaybackRate, slowdownInterval]);

  // whenever playbackRate changes, apply it to the actual video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // handle autoPlay logic
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play();
    }
  }, [autoPlay, src]);


  
  

  return (
    <video
      className={className}
      ref={videoRef}
      src={src}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      onVideoReady={onVideoReady}
      
      style={{ maxWidth: "100%", ...style }}
      
      onCanPlayThrough={onCanPlayThrough}
      onEnded={onEnded}
    
      
      onTimeUpdate={handleTimeUpdate}
    />
    
  );
});
export default VideoClip;