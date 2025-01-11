import React, { useState } from "react";
import ReactHowler from "react-howler";

function ButtonWithSound({ onClick, children, className, disabled, muted }) {
  const [playClickSound, setPlayClickSound] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;

    console.log("🔊 Button clicked:", className);  // ✅ Debugging
    
      // 🔄 Reset sound to avoid lag or overlap
      setPlayClickSound(false);
      setTimeout(() => setPlayClickSound(true), 0);
  
      if (onClick) onClick(e);  // Preserve original click behavior
    };

  return (
    <>
      <button onClick={handleClick} className={className} disabled={disabled}>
        {children}
      </button>

      {/* 🔊 Button Click Sound */}
      <ReactHowler
        src={["/audio/buttonclick.mp3"]}
        playing={playClickSound && !muted}

        onEnd={() => setPlayClickSound(false)}  // Reset after playing
        volume={1}
      />
    </>
  );
}

export default ButtonWithSound;
