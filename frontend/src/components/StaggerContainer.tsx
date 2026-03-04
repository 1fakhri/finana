"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  fadeInUp,
  fadeIn,
  scaleIn,
  safeStagger,
  safeVariants,
  noMotion,
} from "@/lib/motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

const directionVariants: Record<Direction, Variants> = {
  up: fadeInUp,
  down: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  },
  left: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  },
  right: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  },
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: Direction;
  variant?: "fade" | "scale" | "direction";
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
  direction = "up",
  variant = "direction",
  once = true,
}: StaggerContainerProps) {
  const reducedMotion = useReducedMotion();

  const containerVariants = safeStagger(staggerDelay, reducedMotion);

  let childVariants: Variants;
  if (reducedMotion) {
    childVariants = noMotion;
  } else {
    switch (variant) {
      case "fade":
        childVariants = fadeIn;
        break;
      case "scale":
        childVariants = scaleIn;
        break;
      default:
        childVariants = directionVariants[direction];
    }
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

/** Wrap individual items inside a StaggerContainer */
export function StaggerItem({
  children,
  className = "",
  direction = "up",
  variant = "direction",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  variant?: "fade" | "scale" | "direction";
}) {
  const reducedMotion = useReducedMotion();

  let itemVariants: Variants;
  if (reducedMotion) {
    itemVariants = noMotion;
  } else {
    switch (variant) {
      case "fade":
        itemVariants = fadeIn;
        break;
      case "scale":
        itemVariants = scaleIn;
        break;
      default:
        itemVariants = directionVariants[direction];
    }
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
