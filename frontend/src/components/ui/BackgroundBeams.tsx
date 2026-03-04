"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BackgroundBeamsProps {
  className?: string;
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient id="beam-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(245, 197, 24, 0)" />
            <stop offset="40%" stopColor="rgba(245, 197, 24, 0.08)" />
            <stop offset="60%" stopColor="rgba(245, 197, 24, 0.15)" />
            <stop offset="100%" stopColor="rgba(245, 197, 24, 0)" />
          </linearGradient>
          <linearGradient id="beam-white" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.03)" />
            <stop offset="60%" stopColor="rgba(255, 255, 255, 0.06)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>

        {/* Gold beams */}
        <path d="M-50 0 L400 600" stroke="url(#beam-gold)" strokeWidth="0.5" className="beam beam--1" />
        <path d="M100 -50 L550 550" stroke="url(#beam-gold)" strokeWidth="0.8" className="beam beam--2" />
        <path d="M350 -100 L800 500" stroke="url(#beam-gold)" strokeWidth="0.5" className="beam beam--3" />
        <path d="M600 -50 L1050 550" stroke="url(#beam-white)" strokeWidth="0.4" className="beam beam--4" />
        <path d="M800 -100 L1250 500" stroke="url(#beam-gold)" strokeWidth="0.6" className="beam beam--5" />

        {/* Subtle cross beams */}
        <path d="M200 -50 L-200 400" stroke="url(#beam-white)" strokeWidth="0.3" className="beam beam--6" />
        <path d="M900 -50 L500 500" stroke="url(#beam-white)" strokeWidth="0.3" className="beam beam--7" />
      </svg>
    </div>
  );
}
