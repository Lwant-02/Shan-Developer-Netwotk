"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds before it animates in. Stagger siblings by increasing this. */
  delay?: number;
};

// Fades and lifts its children in on mount. The single client leaf in an otherwise
// server-rendered tree — keep it wrapping the smallest thing that needs to move, not
// a whole page. Honors prefers-reduced-motion by rendering the final state at once.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      data-slot="reveal"
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.5, delay, ease: "easeOut" }
      }
    >
      {children}
    </motion.div>
  );
}
