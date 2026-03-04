"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

interface Particle {
  id: number;
  left: string;
  bottom: string;
  duration: string;
  delay: string;
  drift: string;
  opacity: number;
  size: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 40}%`,
    duration: `${6 + Math.random() * 6}s`,
    delay: `${Math.random() * 6}s`,
    drift: `${(Math.random() - 0.5) * 40}px`,
    opacity: 0.15 + Math.random() * 0.35,
    size: 2 + Math.random() * 2,
  }));
}

export function FloatingParticles({ count = 18, className = "" }: FloatingParticlesProps) {
  const reducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(generateParticles(count));
  }, [count]);

  if (reducedMotion || particles.length === 0) return null;

  return (
    <div className={`particles-canvas ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: `${p.size}px`,
            height: `${p.size}px`,
            "--particle-duration": p.duration,
            "--particle-delay": p.delay,
            "--particle-drift": p.drift,
            "--particle-opacity": p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
