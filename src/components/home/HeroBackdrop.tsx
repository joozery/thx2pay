"use client";

import { motion, useReducedMotion } from "motion/react";

export default function HeroBackdrop() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <motion.div className="hero-logo-grid" animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, 128], y: [0, 96] }} transition={{ duration: 32, ease: "linear", repeat: Infinity }}>
        {Array.from({ length: 288 }, (_, index) => (
          <span
            key={index}
            className={`hero-logo-tile ${(Math.floor(index / 24) + index % 24) % 2 === 0 ? "blue-logo" : "white-logo"}`}
          />
        ))}
      </motion.div>
    </div>
  );
}
