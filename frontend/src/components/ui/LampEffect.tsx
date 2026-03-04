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
        "relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden w-full",
        className
      )}
    >
      {/* Lamp light cone */}
      <div className="relative flex w-full flex-1 items-center justify-center isolate">
        {/* Left beam */}
        <motion.div
          initial={reducedMotion ? { width: "15rem" } : { width: "8rem" }}
          whileInView={reducedMotion ? {} : { width: "15rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          className="absolute inset-auto right-1/2 top-0 h-56 overflow-visible"
          style={{
            background:
              "conic-gradient(from 70deg at center top, rgba(245, 197, 24, 0.2), transparent 60%)",
          }}
        />
        {/* Right beam */}
        <motion.div
          initial={reducedMotion ? { width: "15rem" } : { width: "8rem" }}
          whileInView={reducedMotion ? {} : { width: "15rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          className="absolute inset-auto left-1/2 top-0 h-56 overflow-visible"
          style={{
            background:
              "conic-gradient(from 290deg at center top, transparent 40%, rgba(245, 197, 24, 0.2))",
          }}
        />

        {/* Center glow bloom */}
        <motion.div
          initial={reducedMotion ? { opacity: 0.5, width: "20rem" } : { opacity: 0, width: "10rem" }}
          whileInView={reducedMotion ? {} : { opacity: 0.5, width: "20rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
          className="absolute inset-auto top-0 h-36 -translate-y-[30%] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245, 197, 24, 0.3), transparent 70%)",
          }}
        />

        {/* Top edge line */}
        <motion.div
          initial={reducedMotion ? { width: "15rem" } : { width: "0rem" }}
          whileInView={reducedMotion ? {} : { width: "15rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
          className="absolute inset-auto top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(245, 197, 24, 0.6), transparent)",
          }}
        />

        {/* Diffused bottom glow */}
        <motion.div
          initial={reducedMotion ? { opacity: 0.3 } : { opacity: 0 }}
          whileInView={reducedMotion ? {} : { opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          className="absolute inset-auto top-12 h-48 w-full"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(245, 197, 24, 0.12), transparent)",
          }}
        />
      </div>

      {/* Content below lamp */}
      <div className="relative z-10 -mt-24">{children}</div>
    </div>
  );
}
