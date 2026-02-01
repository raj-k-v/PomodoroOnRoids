import { useState } from "react";
import { motion } from "framer-motion";
import {
  startBrownNoise,
  stopBrownNoise,
  playClick
} from "../utils/sound";

export default function BrownNoiseButton({ compact = false }) {
  const [on, setOn] = useState(false);

  function toggle() {
    playClick();
    setOn(prev => {
      if (!prev) startBrownNoise();
      else stopBrownNoise();
      return !prev;
    });
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        glass-btn
        cursor-pointer
        ${compact ? "px-5 py-2 text-sm" : "px-4 py-2 text-sm"}
        font-semibold
        tracking-wide
        ${
          on
            ? "text-white shadow-[0_0_28px_rgba(255,255,255,0.45)]"
            : "text-red-400 opacity-80 hover:opacity-100"
        }
      `}
    >
      Brown Noise {on ? "ON" : "OFF"}
    </motion.button>
  );
}
