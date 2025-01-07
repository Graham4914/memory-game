import React, { memo } from "react";
import { motion } from "framer-motion";

const Card = memo(({ card, flipPhase, onPhaseComplete, onClick }) => {
 
  let targetRotation = 180;
  if (flipPhase === 1) {
    targetRotation = 0; 
  } else if (flipPhase === 2) {
    targetRotation = 180;   
  }
  return (
    <div className="card">
      <motion.div
      className="card-inner"
      onClick={onClick} 
      animate={{ rotateY: targetRotation }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
   
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
          src="/images/back-of-card.webp" 
          alt="Card Back"
        />
      </div>
    </motion.div>
    </div>
    
  );
});
export default Card;


