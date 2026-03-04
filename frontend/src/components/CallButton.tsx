"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { springBouncy } from "@/lib/motion";

interface CallButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function CallButton({
  label = "CALL NOW",
  onClick,
  className = "",
}: CallButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Outer wrapper for the ripple rings */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring layers */}
        {!reducedMotion && (
          <>
            <span className="call-button-ring call-button-ring--1" />
            <span className="call-button-ring call-button-ring--2" />
            <span className="call-button-ring call-button-ring--3" />
          </>
        )}

        {/* Main button */}
        <motion.button
          onClick={onClick}
          whileTap={reducedMotion ? undefined : { scale: 0.92 }}
          whileHover={reducedMotion ? undefined : { scale: 1.06 }}
          transition={springBouncy}
          className="call-button-orb"
          aria-label={label}
        >
          {/* Rotating conic gradient border */}
          <span
            className={`call-button-border ${reducedMotion ? "" : "call-button-border--animated"}`}
          />

          {/* Inner face */}
          <span className="call-button-face">
            <Phone className="h-8 w-8 text-bg-void" strokeWidth={2.5} />
          </span>
        </motion.button>
      </div>

      {/* Label */}
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-accent-primary">
        {label}
      </span>
    </div>
  );
}
