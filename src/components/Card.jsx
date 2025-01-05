
import React, { memo } from "react";
import { motion } from "framer-motion";

const Card = memo(({ card, onClick, isFlipped }) => (
  <motion.div
    className="card"
    onClick={onClick}
    animate={{ rotateY: isFlipped ? 180 : 0 }}
    transition={{ duration: 1.0, ease: "easeInOut" }}
  >
    <div className="card-inner">
      {/* Front */}
      <motion.div className="card-front">
        <img src={card.image} alt={`${card.value} of ${card.suit}`} />
      </motion.div>
      {/* Back */}
      <motion.div className="card-back" />
    </div>
  </motion.div>
));

export default Card;
