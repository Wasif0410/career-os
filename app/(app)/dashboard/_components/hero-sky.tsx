import { cn } from "@/lib/utils";

/*
 * A still night sky for the Home hero: seeded stars and a soft cobalt glow.
 * Unlike the marketing Starfield it never moves on scroll, since the app has no
 * scroll effects. Some stars twinkle unless reduced motion is on.
 * Stars lean to the right so the greeting on the left stays clean.
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

// Rounded, so every render produces identical style strings.
const r2 = (n: number) => Math.round(n * 100) / 100;

const stars: Star[] = (() => {
  const rand = generator(11);
  return Array.from({ length: 46 }, () => {
    const bright = rand() < 0.12;
    return {
      x: r2(Math.sqrt(rand()) * 100),
      y: r2(rand() * 100),
      size: r2(bright ? 1.8 + rand() * 1.1 : 0.8 + rand() * 0.8),
      opacity: r2(bright ? 0.7 + rand() * 0.3 : 0.15 + rand() * 0.4),
      twinkle: rand() < 0.35,
      duration: r2(3 + rand() * 4),
      delay: r2(rand() * 6),
    };
  });
})();

export function HeroSky({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute -top-32 -right-24 size-[26rem] rounded-full bg-cobalt/25 blur-3xl" />
      {stars.map((s, i) => (
        <span
          key={i}
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
      ))}
    </div>
  );
}
