import React, { memo } from "react";
import { motion } from "framer-motion";

const Card = memo(({ card, flipPhase, onPhaseComplete, onClick }) => {
  // Determine the target rotation based on flipPhase
  let targetRotation = 180;
  if (flipPhase === 1) {
    targetRotation = 0; // from 0° to 180°
  } else if (flipPhase === 2) {
    targetRotation = 180;   // from 180° back to 0°
  }
  return (
    <div className="card">
      <motion.div
      className="card-inner"
      onClick={onClick} // user clicks => triggers parent's "handleUserClick"
      animate={{ rotateY: targetRotation }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      /**
       * This fires when the motion div finishes animating from the current rotateY
       * to the targetRotation. We'll invoke onPhaseComplete if we're in flipPhase 1 or 2.
       */
      onAnimationComplete={() => {
        if (flipPhase !== 0 && onPhaseComplete) {
          onPhaseComplete(flipPhase);
        }
      }}
    >
      {/* FRONT */}
  <    div className="card-front">
        <img src={card.image} alt={`${card.value} of ${card.suit}`} 
        />
      </div>

      {/* BACK */}
        <div className="card-back">
        <img
          src="/images/back-of-card.webp" // Replace with your own back image
          alt="Card Back"
        />
      </div>
    </motion.div>
    </div>
    
  );
});
export default Card;


