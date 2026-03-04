"use client";

import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Wraps framer-motion's useReducedMotion hook.
 * Returns true when the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
