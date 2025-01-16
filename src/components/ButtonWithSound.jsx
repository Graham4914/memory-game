import React, { useState } from "react";
import ReactHowler from "react-howler";

function ButtonWithSound({ onClick, children, className, disabled, muted }) {
  const [playClickSound, setPlayClickSound] = useState(false);

  const handleClick = (e) => {
    if (disabled) return;


      setPlayClickSound(true);

  
      if (onClick) onClick(e); 
    };

  return (
    <>
      <button onClick={handleClick} className={className} disabled={disabled}>
        {children}
      </button>

      {/* Button Click Sound */}
      <ReactHowler
        src={["/audio/buttonclick.mp3"]}
        playing={playClickSound && !muted}
        preload={true}
        onEnd={() => setPlayClickSound(false)}  
      />
    </>
  );
}

export default ButtonWithSound;
