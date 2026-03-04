"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  wordClassName?: string;
  filter?: boolean;
  duration?: number;
  staggerDelay?: number;
}

export function TextGenerateEffect({
  words,
  className = "",
  wordClassName = "",
  filter = true,
  duration = 0.5,
  staggerDelay = 0.06,
}: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();
  const wordArray = words.split(" ");

  useEffect(() => {
    if (!isInView) return;

    if (reducedMotion) {
      animate(
        "span",
        { opacity: 1, filter: "blur(0px)" },
        { duration: 0 }
      );
      return;
    }

    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration,
        delay: stagger(staggerDelay),
      }
    );
  }, [isInView, animate, reducedMotion, filter, duration, staggerDelay]);

  return (
    <div className={cn("font-bold", className)}>
      <motion.div ref={scope}>
        {wordArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className={cn("opacity-0 inline-block", wordClassName)}
            style={{
              filter: filter ? "blur(10px)" : "none",
            }}
          >
            {word}
            {idx < wordArray.length - 1 && "\u00A0"}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
