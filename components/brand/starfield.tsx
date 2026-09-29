"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/*
 * A night sky for deep blue surfaces: two layers of stars that drift at
 * different speeds as the page scrolls (parallax), some of them twinkling.
 * Positions come from a seeded generator, so the server and the browser draw
 * the same sky and every section gets its own.
 */

type Star = { x: number; y: number; size: number; opacity: number; twinkle: boolean; duration: number; delay: number };

function generator(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rounded, so server and browser render identical style strings.
const r2 = (n: number) => Math.round(n * 100) / 100;

function makeSky(seed: number, count: number) {
  const rand = generator(seed);
  const star = (): Star => {
    const bright = rand() < 0.1;
    return {
      x: r2(rand() * 100),
      y: r2(rand() * 100),
      size: r2(bright ? 2 + rand() * 1.2 : 0.9 + rand() * 0.9),
      opacity: r2(bright ? 0.75 + rand() * 0.25 : 0.18 + rand() * 0.42),
      twinkle: rand() < 0.4,
      duration: r2(3 + rand() * 4),
      delay: r2(rand() * 6),
    };
  };
  const far: Star[] = [];
  const near: Star[] = [];
  for (let i = 0; i < count; i++) (i % 3 === 0 ? near : far).push(star());
  return { far, near };
}

function StarDot({ s }: { s: Star }) {
  return (
    <span
      className={cn("absolute rounded-full bg-white", s.twinkle && "star-twinkle")}
      style={
        {
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          opacity: s.opacity,
          boxShadow: s.size > 2 ? "0 0 6px rgb(168 185 255 / 0.75)" : undefined,
          "--o": s.opacity,
          "--dur": `${s.duration}s`,
          "--delay": `${s.delay}s`,
        } as React.CSSProperties
      }
    />
  );
}

export function Starfield({ seed = 1, count = 80, className }: { seed?: number; count?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yFar = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  const yNear = useTransform(scrollYProgress, [0, 1], [-72, 72]);
  const { far, near } = useMemo(() => makeSky(seed, count), [seed, count]);

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <motion.div className="absolute inset-x-0 -inset-y-20" style={reduce ? undefined : { y: yFar }}>
        {far.map((s, i) => (
          <StarDot key={i} s={s} />
        ))}
      </motion.div>
      <motion.div className="absolute inset-x-0 -inset-y-20" style={reduce ? undefined : { y: yNear }}>
        {near.map((s, i) => (
          <StarDot key={i} s={s} />
        ))}
      </motion.div>
    </div>
  );
}
