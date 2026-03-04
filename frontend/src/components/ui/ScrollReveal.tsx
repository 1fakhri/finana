"use client";

import { type ReactNode } from "react";
import { motion, type Variants, type TargetAndTransition } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RevealDirection = "up" | "down" | "left" | "right";
type RevealVariant = "fade" | "scale" | "blur";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  margin?: string;
}

const getTransform = (direction: RevealDirection, distance: number) => {
  switch (direction) {
    case "up": return { y: distance };
    case "down": return { y: -distance };
    case "left": return { x: distance };
    case "right": return { x: -distance };
  }
};

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  variant = "fade",
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  margin = "-80px",
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const transform = getTransform(direction, distance);
  const initial: TargetAndTransition = { opacity: 0, ...transform };
  const animate: TargetAndTransition = { opacity: 1, x: 0, y: 0 };

  if (variant === "scale") {
    initial.scale = 0.92;
    animate.scale = 1;
  }
  if (variant === "blur") {
    initial.filter = "blur(10px)";
    animate.filter = "blur(0px)";
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* Staggered scroll reveal for groups of children */
interface ScrollRevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
  margin?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function ScrollRevealGroup({
  children,
  className = "",
  stagger = 0.1,
  once = true,
  margin = "-80px",
}: ScrollRevealGroupProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants: Variants = {
    ...containerVariants,
    visible: {
      transition: { staggerChildren: stagger },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
