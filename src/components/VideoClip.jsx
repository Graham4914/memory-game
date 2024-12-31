
import React from "react";

export default function VideoClip({
  src,
  autoPlay = true,
  loop = false,
  muted = true,
  onEnded,
  style,
}) {
  return (
    <video
      src={src}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      onEnded={onEnded}
      style={{ maxWidth: "100%", ...style }}
    />
  );
}
