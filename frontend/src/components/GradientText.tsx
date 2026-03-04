"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}

export function GradientText({
  children,
  className = "",
  animate = true,
  as: Tag = "span",
}: GradientTextProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;

  return (
    <Tag
      className={`gradient-text ${shouldAnimate ? "gradient-text--animated" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
