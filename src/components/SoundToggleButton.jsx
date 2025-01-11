import React from "react";
import ButtonWithSound from "./ButtonWithSound";

function SoundToggleButton({ muted, setMuted }) {
  return (
    <ButtonWithSound
    onClick={() => setMuted(!muted)}
    className="sound-toggle-btn"
    muted={muted}  // 🔊 Pass the muted state
  >
    {muted ? "Sound: OFF" : "Sound: ON"}
  </ButtonWithSound>
  );
}

export default SoundToggleButton;
