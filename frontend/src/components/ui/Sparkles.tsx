"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface SparkleData {
  id: string;
  x: string;
  y: string;
  size: number;
  delay: number;
  color: string;
}

interface SparklesProps {
  children?: ReactNode;
  className?: string;
  sparkleCount?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
}

const generateSparkle = (
  color: string,
  minSize: number,
  maxSize: number
): SparkleData => ({
  id: `${Date.now()}-${Math.random()}`,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: minSize + Math.random() * (maxSize - minSize),
  delay: Math.random() * 0.5,
  color,
});

function SparkleIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z"
        fill={color}
      />
    </svg>
  );
}

export function Sparkles({
  children,
  className,
  sparkleCount = 8,
  color = "rgba(245, 197, 24, 0.8)",
  minSize = 8,
  maxSize = 16,
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<SparkleData[]>([]);
  const reducedMotion = useReducedMotion();

  const refresh = useCallback(() => {
    setSparkles(
      Array.from({ length: sparkleCount }, () =>
        generateSparkle(color, minSize, maxSize)
      )
    );
  }, [sparkleCount, color, minSize, maxSize]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (reducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            className="pointer-events-none absolute z-20"
            style={{ left: sparkle.x, top: sparkle.y }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          >
            <SparkleIcon size={sparkle.size} color={sparkle.color} />
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
