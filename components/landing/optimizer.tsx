"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Mark } from "@/components/brand/logo";
import { CheckGlyph } from "@/components/brand/glyphs";
import { cn } from "@/lib/utils";

/** 0 idle · 1 scan · 2 rewrite · 3 coach reviewing · 4 approved, applying · 5 applied */
type Phase = 0 | 1 | 2 | 3 | 4 | 5;

const LENS = 88; // px diameter
const R = LENS / 2;
const ZOOM = 1.75;
const SWEEP_PX_PER_S = 260;

const keywords = ["PyTorch", "Deployed to users", "Measurable impact"];
const steps = ["Scan", "Rewrite", "Coach approves", "Applied"];

const lines = [
  {
    before: "Made a machine learning model to classify images.",
    after: "Trained a PyTorch CNN that sorts 10 plant diseases at 94% accuracy.",
  },
  {
    before: "Worked on a web app for the project.",
    after: "Deployed it as a web app used 200+ times by classmates.",
  },
];

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

type Point = { x: number; y: number };

/**
 * Move the lens from where it is to `to` on its own animation-frame loop, resolving on arrival.
 * Resolves early if `alive` turns false, so a replay never fights an older run.
 */
function glide(
  pos: { current: Point },
  to: Point,
  seconds: number,
  curve: "linear" | "out",
  apply: () => void,
  alive: () => boolean,
) {
  return new Promise<void>((resolve) => {
    const from = { ...pos.current };
    const start = performance.now();
    const step = (now: number) => {
      if (!alive()) return resolve();
      const t = seconds > 0 ? Math.min(1, (now - start) / (seconds * 1000)) : 1;
      const k = curve === "linear" ? t : 1 - Math.pow(1 - t, 3);
      pos.current = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k };
      apply();
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

const lensTransform = ({ x, y }: Point) => `translate(${x}px, ${y}px)`;
const zoomTransform = ({ x, y }: Point) => `translate(${R - (x + R) * ZOOM}px, ${R - (y + R) * ZOOM}px) scale(${ZOOM})`;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="border-b border-ink/70 pb-0.5 text-[0.66rem] font-bold tracking-[0.14em] text-ink uppercase">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const flagClass = "underline decoration-stop decoration-wavy decoration-[1.5px] underline-offset-[5px]";

type BodyProps = {
  variant: "before" | "after";
  flagged: boolean[];
  tailored?: boolean;
  targetRefs?: React.RefObject<(HTMLElement | null)[]>;
};

/** The resume. Rendered on the page and again, magnified, inside the lens. */
function ResumeBody({ variant, flagged, tailored = false, targetRefs }: BodyProps) {
  const setRef = (i: number) => (el: HTMLElement | null) => {
    if (targetRefs?.current) targetRefs.current[i] = el;
  };
  const after = variant === "after" && tailored;

  return (
    <div className="text-[0.8rem] leading-relaxed text-ink-soft">
      <p className="font-display text-2xl leading-none font-medium tracking-[-0.01em] text-ink">Jordan Lee</p>
      <p className="mt-1 text-[0.72rem] text-slate">Toronto, ON · Computer Science, Class of 2027</p>

      {/* On phones the resume shows only the parts that change, so the demo fits on one screen. */}
      <div className="hidden sm:block">
      <Section title="Education">
        <p className="flex justify-between gap-3">
          <span className="font-semibold text-ink">B.Sc. Computer Science</span>
          <span className="shrink-0 text-slate">2023 – 2027</span>
        </p>
      </Section>

      <Section title="Experience">
        <p className="flex justify-between gap-3">
          <span className="font-semibold text-ink">IT Support Assistant, Campus IT</span>
          <span className="shrink-0 text-slate">2025</span>
        </p>
        <p className="mt-0.5 pl-3 -indent-3">• Resolved 30+ support tickets a week for students and staff.</p>
      </Section>
      </div>

      <Section title="Projects">
        <p className="font-semibold text-ink">Plant Disease Classifier</p>
        {lines.map((line, i) => (
          <p key={line.before} className="mt-0.5 pl-3 -indent-3">
            •{" "}
            {after ? (
              <motion.span
                className="rounded bg-cobalt-wash px-0.5 text-ink [box-decoration-break:clone]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.35, ease: "easeOut" }}
              >
                {line.after}
              </motion.span>
            ) : (
              <span ref={setRef(i)} className={cn("transition-all duration-300", flagged[i] && flagClass)}>
                {line.before}
              </span>
            )}
          </p>
        ))}
      </Section>

      <Section title="Skills">
        <p>
          {after ? (
            <>
              Python,{" "}
              <motion.span
                className="rounded bg-cobalt-wash px-0.5 font-medium text-cobalt-deep"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                PyTorch
              </motion.span>
              , TensorFlow, SQL, Git
            </>
          ) : (
            <span ref={setRef(2)} className={cn("transition-all duration-300", flagged[2] && flagClass)}>
              Python, TensorFlow, SQL, Git
            </span>
          )}
        </p>
      </Section>
    </div>
  );
}

const pageClass =
  "relative rounded-xl bg-surface p-6 shadow-[0_2px_0_rgb(12_20_36/0.03),0_20px_50px_-28px_rgb(12_20_36/0.4)] ring-1 sm:p-7";

export function Optimizer() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<(HTMLElement | null)[]>([]);
  const runRef = useRef(0);
  // Not `once`: the demo loops while it's on screen and stops when it scrolls away.
  const inView = useInView(rootRef, { margin: "0px 0px -20% 0px" });

  const [phase, setPhase] = useState<Phase>(0);
  const [flagged, setFlagged] = useState([false, false, false]);
  const [tailored, setTailored] = useState(false);
  const [lensOn, setLensOn] = useState(false);
  const [pageWidth, setPageWidth] = useState(0);

  // The lens position lives outside React state and is written straight to the DOM each frame.
  const pos = useRef<Point>({ x: 0, y: 0 });
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const apply = useCallback(() => {
    if (lensRef.current) lensRef.current.style.transform = lensTransform(pos.current);
    if (zoomRef.current) zoomRef.current.style.transform = zoomTransform(pos.current);
  }, []);

  // Position the lens as soon as it exists. React never renders its transform, so re-renders don't reset it.
  useLayoutEffect(() => {
    if (pageWidth > 0) apply();
  }, [pageWidth, apply]);

  // The magnified copy must be exactly as wide as the page so its lines wrap the same way.
  useLayoutEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPageWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Line boxes of a flagged phrase, in page coordinates. Wrapped phrases give one box per line. */
  const lineBoxes = useCallback((i: number) => {
    const el = targetRefs.current[i];
    const page = pageRef.current;
    if (!el || !page) return [];
    const p = page.getBoundingClientRect();
    return Array.from(el.getClientRects()).map((r) => ({
      start: r.left - p.left,
      end: r.right - p.left,
      mid: r.top - p.top + r.height / 2,
    }));
  }, []);

  const run = useCallback(
    async (token: number) => {
      const alive = () => token === runRef.current;
      // The whole demo repeats until it scrolls out of view.
      for (;;) {
        setLensOn(false);
        setPhase(1);
        setFlagged([false, false, false]);
        setTailored(false);
        await sleep(600);
        if (!alive()) return;

        // Scan: the lens reads each weak line from its first word to its last.
        const first = lineBoxes(0)[0];
        if (first) {
          pos.current = { x: first.start - R, y: first.mid - R };
          apply();
        }
        setLensOn(true);
        for (let i = 0; i < 3; i++) {
          for (const box of lineBoxes(i)) {
            const from = { x: box.start - R, y: box.mid - R };
            const to = { x: box.end - R, y: box.mid - R };
            await glide(pos, from, 0.45, "out", apply, alive);
            if (!alive()) return;
            await glide(pos, to, Math.max(0.5, (to.x - from.x) / SWEEP_PX_PER_S), "linear", apply, alive);
            if (!alive()) return;
          }
          setFlagged((f) => f.map((v, j) => (j === i ? true : v)));
          await sleep(200);
          if (!alive()) return;
        }
        setLensOn(false);

        setPhase(2);
        await sleep(1600);
        if (!alive()) return;
        setTailored(true);
        await sleep(1600);
        if (!alive()) return;
        setPhase(3);
        await sleep(1500);
        if (!alive()) return;
        setPhase(4);
        await sleep(1200);
        if (!alive()) return;
        setPhase(5);
        await sleep(3800);
        if (!alive()) return;
      }
    },
    [apply, lineBoxes],
  );

  useEffect(() => {
    if (!inView) return;
    const token = ++runRef.current;
    const t = window.setTimeout(() => {
      if (reduce) {
        setFlagged([true, true, true]);
        setTailored(true);
        setPhase(5);
      } else {
        void run(token);
      }
    }, 0);
    return () => {
      window.clearTimeout(t);
      // Invalidate this run so any pending steps stop.
      runRef.current = token + 1;
    };
  }, [inView, reduce, run]);

  return (
    <div
      ref={rootRef}
      className="overflow-hidden rounded-3xl bg-surface text-ink shadow-[0_50px_120px_-40px_rgb(0_0_0/0.65)] ring-1 ring-white/10"
    >
      {/* The job */}
      <div className="flex flex-col gap-4 border-b border-rule px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-white">
            <Mark className="size-6" />
          </span>
          <div>
            <p className="text-lg leading-tight font-semibold tracking-[-0.015em]">ML Engineering Intern</p>
            <p className="text-sm text-slate">Fintech · Toronto</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="What the job asks for">
          {keywords.map((k, i) => (
            <li
              key={k}
              className={cn(
                "rounded-full px-3 py-1 text-sm ring-1 transition-colors duration-500",
                phase >= 1 ? "bg-cobalt-wash text-cobalt-deep ring-transparent" : "text-slate ring-rule",
              )}
              style={{ transitionDelay: phase >= 1 ? `${i * 0.15}s` : "0s" }}
            >
              {k}
            </li>
          ))}
        </ul>
      </div>

      {/* Before and after */}
      <div className="grid bg-paper lg:grid-cols-2">
        <div className="p-5 sm:p-8">
          <PageLabel label="Your resume" fit={62} />
          <div ref={pageRef} className={cn(pageClass, "ring-rule")}>
            <ResumeBody variant="before" flagged={flagged} targetRefs={targetRefs} />

            {pageWidth > 0 && (
              <div
                ref={lensRef}
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 z-10"
              >
                <motion.div
                  className="relative"
                  style={{ width: LENS, height: LENS }}
                  initial={false}
                  animate={lensOn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="absolute right-[-22px] bottom-[-22px] h-10 w-3 origin-top -rotate-45 rounded-full bg-ink" />
                  <div className="absolute inset-0 overflow-hidden rounded-full bg-surface shadow-[0_14px_30px_-10px_rgb(12_20_36/0.55)] ring-4 ring-ink">
                    <div
                      ref={zoomRef}
                      className="absolute top-0 left-0 p-6 sm:p-7"
                      style={{ width: pageWidth, transformOrigin: "0 0" }}
                    >
                      <ResumeBody variant="before" flagged={flagged} />
                    </div>
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 via-transparent to-transparent" />
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        <div className="relative border-t border-rule p-5 sm:p-8 lg:border-t-0 lg:border-l">
          {/* The optimizer sits on the seam between the two pages. */}
          <motion.span
            aria-hidden
            className="absolute top-0 left-1/2 z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-white shadow-[0_10px_24px_-10px_rgb(12_20_36/0.6)] lg:top-1/2 lg:left-0"
            animate={phase === 2 ? { rotate: 360 } : { rotate: 0 }}
            transition={phase === 2 ? { duration: 1.1, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
          >
            <Mark className="size-7" />
          </motion.span>

          <PageLabel
            label={phase >= 4 ? "Approved by your coach" : "Tailored for this job"}
            fit={tailored ? 88 : null}
            approved={phase >= 4}
            accent
          />
          <div
            className={cn(
              pageClass,
              "overflow-hidden transition-[opacity,box-shadow] duration-500",
              tailored ? "opacity-100" : "opacity-40",
              phase >= 4 ? "ring-2 ring-go/60" : tailored ? "ring-cobalt/40" : "ring-rule",
            )}
          >
            <ResumeBody variant="after" flagged={[false, false, false]} tailored={tailored} />
            {phase === 2 && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cobalt/20 to-transparent"
                initial={{ top: "-15%" }}
                animate={{ top: "105%" }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-4 border-t border-rule px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-2" aria-label="Progress">
          {steps.map((label, i) => {
            const n = i + 1;
            const done = phase > n;
            const current = phase === n;
            return (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full text-xs transition-colors duration-300",
                    done && "bg-ink text-white",
                    current && "bg-cobalt text-white",
                    !done && !current && "bg-paper-deep text-slate",
                  )}
                  aria-hidden
                >
                  {done ? <CheckGlyph className="size-3.5" /> : n}
                </span>
                <span className={cn("text-sm", done || current ? "font-medium text-ink" : "text-slate")}>
                  {label}
                  <span className="sr-only">{done ? " (done)" : current ? " (in progress)" : ""}</span>
                </span>
                {i < steps.length - 1 && <span aria-hidden className="mx-1 hidden h-px w-6 bg-rule sm:block" />}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function PageLabel({
  label,
  fit,
  approved = false,
  accent = false,
}: {
  label: string;
  fit: number | null;
  approved?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      <p className={cn("flex items-center gap-1.5 font-medium", approved ? "text-go" : "text-ink")}>
        {approved && <CheckGlyph className="size-4" />}
        {label}
      </p>
      <p className="text-sm text-slate">
        Fit{" "}
        <span className={cn("font-mono text-base font-semibold tabular-nums", accent && fit ? "text-cobalt" : "text-ink")}>
          {fit ?? "—"}
        </span>
      </p>
    </div>
  );
}
