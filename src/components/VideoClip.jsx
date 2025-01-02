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
export default function VideoClip({
  className = "",
  src,
  autoPlay = true,
  loop = false,
  muted = true,
  onEnded,
  style = {},
  onCanPlayThrough = "",

  // Additional slowdown props, with defaults:
  enableSlowdown = false,
  nearEndThreshold = 1.0,
  minPlaybackRate = 0.5,
  slowdownInterval = 100,
}) {
  const videoRef = useRef(null);

  // track if we're "near the end" so we can begin the slowdown
  const [isNearEnd, setIsNearEnd] = useState(false);
  // track current playback rate
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // handle time updates: check how close we are to the end
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

  // once isNearEnd is true, gradually ramp down from 1.0 to minPlaybackRate
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
      // pass down your style
      style={{ maxWidth: "100%", ...style }}
      // forward the onEnded callback if provided
      onCanPlayThrough={onCanPlayThrough}
      onEnded={onEnded}
      // attach timeUpdate event for slowdown detection
      onTimeUpdate={handleTimeUpdate}
    />
  );
}
