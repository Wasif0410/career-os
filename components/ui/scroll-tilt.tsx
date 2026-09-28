"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Product windows tilt back slightly and straighten up as they scroll into place.
 * Linked to scroll position, so it plays forwards and backwards with the page.
 */
export function ScrollTilt({
  children,
  className,
  from = 12,
}: {
  children: React.ReactNode;
  className?: string;
  /** Starting tilt in degrees. */
  from?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [from, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.4, 1]);

  return (
    <div ref={ref} className={cn("[perspective:1800px]", className)}>
      <motion.div style={reduce ? undefined : { rotateX, scale, opacity, transformOrigin: "50% 0%" }}>
        {children}
      </motion.div>
    </div>
  );
}
