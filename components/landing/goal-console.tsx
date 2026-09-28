"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Target = {
  id: string;
  role: string;
  season: string;
  score: number;
  gaps: string[];
  note: string;
  matches: number;
};

// Example data only.
const TARGETS: Target[] = [
  {
    id: "ml",
    role: "ML intern",
    season: "Winter 2027",
    score: 62,
    gaps: ["No deployed project", "Bullets lack results", "PyTorch not listed"],
    note: "Ship one real project before November.",
    matches: 14,
  },
  {
    id: "swe",
    role: "SWE intern",
    season: "Summer 2027",
    score: 74,
    gaps: ["Only class projects", "No tests in your repos", "Resume is two pages"],
    note: "One page first. Then give a project real users.",
    matches: 31,
  },
  {
    id: "data",
    role: "Data analyst",
    season: "New grad 2027",
    score: 58,
    gaps: ["SQL only from class", "No business questions", "Skills read like a list"],
    note: "Answer one real question with public data.",
    matches: 9,
  },
];

const CYCLE_MS = 7000;
const RING_R = 44;
const RING_C = 2 * Math.PI * RING_R;
const ease = [0.22, 1, 0.36, 1] as const;

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (!enabled) {
      from.current = target;
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const next = Math.round(origin + (target - origin) * (1 - Math.pow(1 - t, 4)));
      setValue(next);
      from.current = next;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);

  return enabled ? value : target;
}

export function GoalConsole({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const [index, setIndex] = useState(0);
  // The first report waits for the page-load sequence; later switches animate right away.
  const [switched, setSwitched] = useState(false);
  const late = switched ? 0 : 0.9;
  const [hovering, setHovering] = useState(false);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const target = TARGETS[index];
  const score = useCountUp(target.score, !reduce);

  // Keep cycling through targets. Hovering pauses; a click jumps ahead and the cycle carries on from there.
  useEffect(() => {
    if (reduce || hovering || !inView) return;
    const timer = window.setTimeout(() => {
      setSwitched(true);
      setIndex((i) => (i + 1) % TARGETS.length);
    }, CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [index, reduce, hovering, inView]);

  const select = useCallback((i: number, focus = false) => {
    setSwitched(true);
    setIndex(i);
    if (focus) tabsRef.current[i]?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = TARGETS.length - 1;
    if (e.key === "ArrowRight") select(index === last ? 0 : index + 1, true);
    else if (e.key === "ArrowLeft") select(index === 0 ? last : index - 1, true);
    else if (e.key === "Home") select(0, true);
    else if (e.key === "End") select(last, true);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      style={{ "--d": "0.35s" } as React.CSSProperties}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className={cn(
        "anim-fade-up relative rounded-[1.75rem] bg-surface shadow-[0_1px_0_rgb(12_20_36/0.04),0_30px_70px_-30px_rgb(12_20_36/0.35)] ring-1 ring-rule",
        className,
      )}
    >
      {/* Target switcher */}
      <div className="border-b border-rule p-3">
        <div
          role="tablist"
          aria-label="Example targets"
          onKeyDown={onKeyDown}
          className="grid grid-cols-3 gap-1 rounded-2xl bg-paper p-1"
        >
          {TARGETS.map((t, i) => {
            const selected = i === index;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`target-tab-${t.id}`}
                aria-selected={selected}
                aria-controls="target-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(i)}
                className={cn(
                  "relative isolate flex min-w-0 flex-col rounded-xl px-2.5 py-2 text-left transition-colors sm:px-3",
                  selected ? "text-white" : "text-ink-soft hover:bg-surface",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="target-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    className="absolute inset-0 rounded-xl bg-ink"
                  />
                )}
                <span className="relative text-[0.8rem] leading-tight font-medium sm:text-[0.86rem]">{t.role}</span>
                <span
                  className={cn(
                    "relative mt-0.5 font-mono text-[0.66rem] leading-tight sm:text-[0.7rem]",
                    selected ? "text-white/65" : "text-slate",
                  )}
                >
                  {t.season}
                </span>
                {selected && !reduce && (
                  <motion.span
                    key={`progress-${index}`}
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hovering || !inView ? 0 : 1 }}
                    transition={{ duration: hovering || !inView ? 0 : CYCLE_MS / 1000, ease: "linear" }}
                    className="absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-marker"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div id="target-panel" role="tabpanel" aria-labelledby={`target-tab-${target.id}`}>
        <div className="flex items-center gap-5 px-5 pt-6 pb-5 sm:gap-8 sm:px-6">
          {/* Readiness ring */}
          <div className="relative size-24 shrink-0 sm:size-28">
            <svg viewBox="0 0 100 100" className="size-24 -rotate-90 sm:size-28" aria-hidden>
              <circle cx="50" cy="50" r={RING_R} fill="none" strokeWidth="8" className="stroke-paper-deep" />
              <motion.circle
                cx="50"
                cy="50"
                r={RING_R}
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className="stroke-cobalt"
                strokeDasharray={RING_C}
                initial={{ strokeDashoffset: RING_C }}
                animate={{ strokeDashoffset: RING_C * (1 - target.score / 100) }}
                transition={{ duration: 0.9, delay: switched ? 0 : 0.5, ease }}
              />
            </svg>
            <p className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-[1.7rem] leading-none font-semibold tabular-nums sm:text-3xl">{score}</span>
              <span className="mt-1 text-xs text-slate">readiness</span>
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate">Top gaps</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ol
                key={target.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease }}
                className="mt-2 space-y-2"
              >
                {target.gaps.map((gap, i) => (
                  <li key={gap} className="flex items-baseline gap-2.5 text-[0.95rem] text-ink">
                    <span className="font-mono text-xs text-slate">{i + 1}</span>
                    {i === 0 ? (
                      <motion.span
                        className="marker font-medium whitespace-nowrap"
                        initial={{ "--marker-progress": 0 } as Record<string, number>}
                        animate={{ "--marker-progress": 1 } as Record<string, number>}
                        transition={{ duration: 0.7, delay: 0.2 + late, ease }}
                      >
                        {gap}
                      </motion.span>
                    ) : (
                      <span>{gap}</span>
                    )}
                  </li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </div>

        {/* Coach note */}
        <div className="px-5 pb-6 sm:px-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={target.id}
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.5 + late, ease: "easeInOut" }}
              className="-rotate-[0.6deg] rounded-xl bg-marker-soft px-4 py-3"
            >
              <blockquote className="font-hand text-[1.08rem] leading-snug text-ink">“{target.note}”</blockquote>
              <figcaption className="font-hand text-slate">— Your coach</figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Jobs */}
        <div className="flex items-center justify-between gap-4 border-t border-rule px-5 py-4 sm:px-6">
          <p className="text-ink-soft">
            <span className="font-mono font-semibold text-ink tabular-nums">{target.matches}</span> roles match your
            target
          </p>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-cobalt-wash px-3 py-1 text-sm font-medium text-cobalt-deep">
            <span aria-hidden className="size-1.5 rounded-full bg-cobalt" />
            Auto-apply ready
          </span>
        </div>
      </div>
    </div>
  );
}
