import React from "react";

function SoundToggleButton({ muted, setMuted }) {
  return (
    <button className="sound-toggle-btn" onClick={() => setMuted(!muted)}>
      {muted ? "Sound: OFF" : "Sound: ON"}
    </button>
  );
}

export default SoundToggleButton;
