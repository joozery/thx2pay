"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

export default function RevealSection({ children, ...props }: HTMLMotionProps<"section">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
