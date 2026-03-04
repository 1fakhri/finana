"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  duration?: number;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
}

export function Marquee({
  children,
  duration = 30,
  className = "",
  pauseOnHover = true,
  reverse = false,
}: MarqueeProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className={`marquee-track ${pauseOnHover ? "" : "[&]:hover:![animation-play-state:running]"}`}
        style={{
          "--marquee-duration": `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: reducedMotion ? "paused" : "running",
        } as React.CSSProperties}
      >
        {/* Duplicate content for seamless loop — items must be direct flex children */}
        {children}
        {children}
      </div>
    </div>
  );
}

interface MarqueeItemProps {
  children: ReactNode;
  className?: string;
}

export function MarqueeItem({ children, className = "" }: MarqueeItemProps) {
  return (
    <div className={`flex items-center shrink-0 px-6 ${className}`}>
      {children}
    </div>
  );
}
