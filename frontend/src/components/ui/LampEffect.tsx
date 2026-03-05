"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface LampProps {
  children: ReactNode;
  className?: string;
}

export function Lamp({ children, className }: LampProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full py-12",
        className
      )}
    >
      {/* Lamp glow — subtle gold line + radial bloom above text */}
      <div className="relative w-full flex items-center justify-center mb-6">
        {/* Gold line */}
        <motion.div
          initial={reducedMotion ? { width: "12rem", opacity: 1 } : { width: "0rem", opacity: 0 }}
          whileInView={reducedMotion ? {} : { width: "12rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(245, 197, 24, 0.7), transparent)",
          }}
        />

        {/* Radial bloom behind line */}
        <motion.div
          initial={reducedMotion ? { opacity: 0.4 } : { opacity: 0 }}
          whileInView={reducedMotion ? {} : { opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute w-48 h-24 -top-8 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(245, 197, 24, 0.15), transparent 70%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
