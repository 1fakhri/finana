"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CornerBracketCardProps {
  children: ReactNode;
  className?: string;
  bracketColor?: string;
}

export function CornerBracketCard({
  children,
  className = "",
  bracketColor,
}: CornerBracketCardProps) {
  const colorStyle = bracketColor
    ? { "--color-accent-primary": bracketColor } as React.CSSProperties
    : undefined;

  return (
    <div
      className={cn(
        "corner-bracket surface-card rounded-radius-sm p-6",
        className
      )}
      style={colorStyle}
    >
      <span className="bracket-bl" />
      <span className="bracket-br" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
