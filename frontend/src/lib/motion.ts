import type { Variants, Transition } from "framer-motion";

/* ==========================================================
   Shared Framer-Motion Variants & Transitions
   ========================================================== */

// --- Transitions ---

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 25,
};

export const smoothTransition: Transition = {
  type: "tween",
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

// --- Variants ---

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

export function staggerContainer(staggerDelay = 0.08): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };
}

// --- Reduced-motion-safe variants ---
// Return empty states so elements render immediately without animation.

export const noMotion: Variants = {
  hidden: {},
  visible: {},
};

export function safeVariants(
  variants: Variants,
  prefersReducedMotion: boolean
): Variants {
  return prefersReducedMotion ? noMotion : variants;
}

export function safeStagger(
  staggerDelay: number,
  prefersReducedMotion: boolean
): Variants {
  return prefersReducedMotion ? noMotion : staggerContainer(staggerDelay);
}
