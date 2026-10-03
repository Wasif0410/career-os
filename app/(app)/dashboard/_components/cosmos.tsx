import { cn } from "@/lib/utils";
import styles from "./home.module.css";

/*
 * A slowly drifting star field for deep blue tiles. Seeded, so the server
 * always draws the same sky; each layer is stacked twice so the drift loops
 * without a seam. Stops moving under reduced motion.
 */

type Star = { x: number; y: number; size: number; opacity: number; duration: number; delay: number };

function sky(seed: number, count: number, near: boolean): Star[] {
  let a = seed;
  const rand = () => (a = (a * 16807) % 2147483647) / 2147483647;
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return Array.from({ length: count }, () => ({
    x: r2(rand() * 100),
    y: r2(rand() * 100),
    size: r2(near ? 1.4 + rand() * 1.4 : 0.6 + rand()),
    opacity: r2(near ? 0.55 + rand() * 0.4 : 0.2 + rand() * 0.45),
    duration: r2(3 + rand() * 4),
    delay: r2(rand() * 5),
  }));
}

const far = sky(7, 30, false);
const near = sky(19, 12, true);

function Layer({ stars, speed }: { stars: Star[]; speed: number }) {
  return (
    <div
      className={cn("absolute inset-x-0 top-0 h-[200%]", styles.drift)}
      style={{ "--speed": `${speed}s` } as React.CSSProperties}
    >
      {[0, 50].map((offset) =>
        stars.map((s, i) => (
          <span
            key={`${offset}-${i}`}
            className="star-twinkle absolute rounded-full bg-white"
            style={
              {
                left: `${s.x}%`,
                top: `${offset + s.y / 2}%`,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                boxShadow: s.size > 2.2 ? "0 0 6px rgb(168 185 255 / 0.8)" : undefined,
                "--o": s.opacity,
                "--dur": `${s.duration}s`,
                "--delay": `${s.delay}s`,
              } as React.CSSProperties
            }
          />
        )),
      )}
    </div>
  );
}

export function Cosmos({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div
        className={cn(
          "absolute top-[15%] left-[20%] h-[75%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(93_123_255/0.22),transparent)] blur-[10px]",
          styles.nebula,
        )}
      />
      <Layer stars={far} speed={90} />
      <Layer stars={near} speed={50} />
    </div>
  );
}
