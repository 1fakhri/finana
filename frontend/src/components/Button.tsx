"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { springTransition } from "@/lib/motion";

type ButtonVariant = "primary" | "kill" | "secondary" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-gradient-to-br from-accent-primary to-accent-warm",
    "text-bg-void font-semibold",
    "shadow-[0_2px_8px_rgba(245,197,24,0.15),0_0_0_1px_rgba(245,197,24,0.1)]",
    "shimmer-effect",
  ].join(" "),

  kill: [
    "bg-gradient-to-br from-kill to-[#C73435]",
    "text-white font-bold uppercase tracking-[0.1em]",
    "shadow-[0_2px_8px_rgba(232,65,66,0.15)]",
  ].join(" "),

  secondary: [
    "bg-transparent",
    "border border-white/6",
    "text-text-primary font-medium",
    "hover:border-[rgba(245,197,24,0.2)] hover:bg-[rgba(245,197,24,0.04)]",
    "active:bg-[rgba(245,197,24,0.08)]",
  ].join(" "),

  ghost: [
    "bg-transparent border-none",
    "text-text-secondary font-medium",
    "hover:text-text-primary",
    "active:text-accent-primary",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs rounded-radius-sm min-h-[36px]",
  default: "px-7 py-3 text-sm rounded-radius-md min-h-[44px]",
  lg: "px-8 py-3.5 text-sm rounded-radius-md min-h-[48px]",
};

// Variants that get hover/tap spring effects
const springVariants = new Set<ButtonVariant>(["primary", "kill"]);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "default", className = "", children, disabled, ...props }, ref) => {
    const reducedMotion = useReducedMotion();
    const hasSpring = springVariants.has(variant) && !disabled;

    const motionProps: Partial<HTMLMotionProps<"button">> =
      hasSpring && !reducedMotion
        ? {
            whileHover: { scale: 1.02, y: -1 },
            whileTap: { scale: 0.97, y: 0 },
            transition: springTransition,
          }
        : {};

    return (
      <motion.button
        ref={ref}
        className={[
          "inline-flex items-center justify-center gap-2",
          "cursor-pointer select-none",
          "transition-shadow duration-[200ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          "tracking-[0.02em]",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        disabled={disabled}
        {...motionProps}
        {...(props as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariant };
