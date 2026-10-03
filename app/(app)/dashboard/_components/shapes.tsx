import { cn } from "@/lib/utils";

/*
 * The playful shape tucked into the corner of each tile, in the spirit of the
 * reference dashboard but cosmic: a sparkle, a ringed planet, a crescent moon
 * and a starburst. Decorative only.
 */

type ShapeProps = { className?: string };

export function Sparkle({ className }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("absolute -z-10", className)}>
      <path
        d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Planet({ className }: ShapeProps) {
  return (
    <svg viewBox="0 0 120 100" aria-hidden className={cn("absolute -z-10", className)}>
      <circle cx="60" cy="50" r="30" fill="currentColor" />
      <ellipse
        cx="60"
        cy="52"
        rx="56"
        ry="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        transform="rotate(-14 60 52)"
      />
    </svg>
  );
}

export function Moon({ className }: ShapeProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("absolute -z-10", className)}>
      <path d="M62 6 A46 46 0 1 0 94 70 A38 38 0 1 1 62 6 Z" fill="currentColor" />
    </svg>
  );
}

export function Starburst({ className }: ShapeProps) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 16 - Math.PI / 2;
    const r = i % 2 === 0 ? 50 : 30;
    return `${Math.round((50 + r * Math.cos(angle)) * 10) / 10},${Math.round((50 + r * Math.sin(angle)) * 10) / 10}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn("absolute -z-10", className)}>
      <polygon points={points} fill="currentColor" strokeLinejoin="round" />
    </svg>
  );
}
