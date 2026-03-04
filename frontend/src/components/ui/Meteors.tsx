"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MeteorsProps {
  count?: number;
  className?: string;
}

interface MeteorData {
  left: string;
  delay: string;
  duration: string;
  size: string;
}

export function Meteors({ count = 12, className }: MeteorsProps) {
  const [meteors, setMeteors] = useState<MeteorData[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const generated: MeteorData[] = Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${1.5 + Math.random() * 3}s`,
      size: `${1 + Math.random() * 1.5}px`,
    }));
    setMeteors(generated);
  }, [count]);

  if (reducedMotion || meteors.length === 0) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {meteors.map((m, i) => (
        <span
          key={i}
          className="meteor absolute top-0 rotate-[215deg]"
          style={{
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
            width: m.size,
          }}
        />
      ))}
    </div>
  );
}
