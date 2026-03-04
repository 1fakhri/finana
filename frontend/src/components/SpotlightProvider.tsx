"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface SpotlightProviderProps {
  children: ReactNode;
  className?: string;
}

export function SpotlightProvider({ children, className = "" }: SpotlightProviderProps) {
  const reducedMotion = useReducedMotion();
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !spotlightRef.current) return;
      spotlightRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
      spotlightRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
    },
    [reducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion || !spotlightRef.current) return;
    spotlightRef.current.classList.add("spotlight-effect--active");
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (!spotlightRef.current) return;
    spotlightRef.current.classList.remove("spotlight-effect--active");
  }, []);

  // Skip spotlight entirely on reduced motion
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`spotlight-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={spotlightRef} className="spotlight-effect" />
      {children}
    </div>
  );
}
