"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { springTransition } from "@/lib/motion";

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
}

export function InteractiveCard({
  children,
  className = "",
  glowColor = "rgba(245, 197, 24, 0.08)",
  maxTilt = 4,
}: InteractiveCardProps) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      const glowXPercent = (x / rect.width) * 100;
      const glowYPercent = (y / rect.height) * 100;

      cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      cardRef.current.style.setProperty("--card-glow-x", `${glowXPercent}%`);
      cardRef.current.style.setProperty("--card-glow-y", `${glowYPercent}%`);
    },
    [reducedMotion, maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  }, []);

  if (reducedMotion) {
    return (
      <div className={`surface-elevated rounded-radius-lg transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(245,197,24,0.12)] ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={`interactive-card surface-elevated rounded-radius-lg ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={springTransition}
      style={{ willChange: "transform" }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
