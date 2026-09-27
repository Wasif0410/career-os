"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Mark } from "@/components/brand/logo";
import { CheckGlyph } from "@/components/brand/glyphs";
import { cn } from "@/lib/utils";

/**
 * 0 idle · 1 read posting · 2-4 inspect three lines · 5 optimize · 6 tailored · 7 coach approves · 8 auto-apply
 */
type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
const TIMELINE: [Stage, number][] = [
  [1, 0],
  [2, 900],
  [3, 2100],
  [4, 3300],
  [5, 4500],
  [6, 5500],
  [7, 7400],
  [8, 8600],
];

const LENS = 104; // px, diameter
const R = LENS / 2;
const ZOOM = 1.7;
const ease = [0.22, 1, 0.36, 1] as const;

const keywords = ["PyTorch", "Deployed to users", "Measurable impact"];

const lines = [
  {
    before: "Made a machine learning model to classify images.",
    after: "Trained a PyTorch CNN that sorts 10 plant diseases at 94% accuracy.",
    tag: "+ metric",
  },
  {
    before: "Worked on a web app for the project.",
    after: "Deployed it as a web app used 200+ times by classmates.",
    tag: "+ deployed",
  },
];

const queue = [
  { role: "ML Engineering Intern", org: "Fintech · Toronto" },
  { role: "Machine Learning Intern", org: "AI startup · Remote" },
  { role: "Data Science Intern", org: "Bank · Toronto" },
];

const statusText: Record<Stage, string> = {
  0: "",
  1: "Reading the job",
  2: "Checking bullets",
  3: "Checking bullets",
  4: "Checking skills",
  5: "Optimizing",
  6: "Sent to your coach",
  7: "Approved",
  8: "Applying",
};

type BodyProps = {
  variant: "before" | "after";
  flagged: boolean[];
  revealed?: boolean;
  targetRefs?: React.RefObject<(HTMLElement | null)[]>;
};

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

/** The resume itself. Rendered for the page and again, magnified, inside the lens. */
function ResumeBody({ variant, flagged, revealed = false, targetRefs }: BodyProps) {
  const setRef = (i: number) => (el: HTMLElement | null) => {
    if (targetRefs?.current) targetRefs.current[i] = el;
  };
  const after = variant === "after" && revealed;

  return (
    <div className="text-[0.8rem] leading-relaxed text-ink-soft">
      <p className="font-display text-xl leading-none font-bold tracking-[-0.01em] text-ink">Jordan Lee</p>
      <p className="mt-1 text-[0.72rem] text-slate">Toronto, ON · Computer Science, Class of 2027</p>

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

      <Section title="Projects">
        <p className="font-semibold text-ink">Plant Disease Classifier</p>
        {lines.map((line, i) => (
          <p key={line.before} className="mt-0.5 pl-3 -indent-3">
            •{" "}
            {after ? (
              <>
                <motion.span
                  className="rounded bg-cobalt-wash px-0.5 text-ink [box-decoration-break:clone]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.45, ease: "easeOut" }}
                >
                  {line.after}
                </motion.span>{" "}
                <motion.span
                  className="rounded-full bg-cobalt px-1.5 py-px text-[0.62rem] font-medium whitespace-nowrap text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.45 }}
                >
                  {line.tag}
                </motion.span>
              </>
            ) : (
              <span ref={setRef(i)} className={cn("transition-all", flagged[i] && flagClass)}>
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
                transition={{ delay: 1 }}
              >
                PyTorch
              </motion.span>
              , TensorFlow, SQL, Git
            </>
          ) : (
            <span ref={setRef(2)} className={cn("transition-all", flagged[2] && flagClass)}>
              Python, TensorFlow, SQL, Git
            </span>
          )}
        </p>
      </Section>
    </div>
  );
}

export function Optimizer() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<(HTMLElement | null)[]>([]);
  const inView = useInView(rootRef, { once: true, margin: "0px 0px -35% 0px" });
  const [stage, setStage] = useState<Stage>(0);
  const [run, setRun] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);
  const inner = useTransform([lensX, lensY], ([x, y]: number[]) => {
    return `translate(${R - (x + R) * ZOOM}px, ${R - (y + R) * ZOOM}px) scale(${ZOOM})`;
  });

  // Keep the magnified copy the same width as the page it mirrors.
  useLayoutEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPageWidth(el.offsetWidth));
    // Park the lens over the middle of the page so it never flashes in the corner.
    lensX.set(el.offsetWidth * 0.55 - R);
    lensY.set(el.offsetHeight * 0.45 - R);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lensX, lensY]);

  const lensTarget = useCallback((i: number) => {
    const el = targetRefs.current[i];
    if (!el) return null;
    const cx = el.offsetLeft + Math.min(el.offsetWidth * 0.5, 150);
    const cy = el.offsetTop + el.offsetHeight / 2;
    return { x: cx - R, y: cy - R };
  }, []);

  // Run the timeline once the section is on screen.
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const t = window.setTimeout(() => setStage(8), 0);
      return () => window.clearTimeout(t);
    }
    const timers = TIMELINE.map(([s, at]) => window.setTimeout(() => setStage(s), at));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduce, run]);

  // Move the lens to the line being inspected.
  useEffect(() => {
    if (stage < 2 || stage > 4) return;
    const target = lensTarget(stage - 2);
    if (!target) return;
    const opts = { duration: 0.7, ease };
    const a = animate(lensX, target.x, opts);
    const b = animate(lensY, target.y, opts);
    return () => {
      a.stop();
      b.stop();
    };
  }, [stage, lensTarget, lensX, lensY]);

  const flagged = [stage >= 2, stage >= 3, stage >= 4];
  const showLens = stage >= 2 && stage <= 4;
  const tailored = stage >= 6;

  const replay = () => {
    setStage(0);
    setRun((r) => r + 1);
  };

  return (
    <div ref={rootRef}>
      {/* The job */}
      <div className="flex flex-col gap-3 rounded-2xl bg-surface px-5 py-4 ring-1 ring-rule sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink">
          <span className="text-slate">Applying to </span>
          <span className="font-display font-semibold">ML Engineering Intern</span>
          <span className="text-slate"> · Fintech, Toronto</span>
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="What the job asks for">
          {keywords.map((k, i) => (
            <li
              key={k}
              className={cn(
                "rounded-full px-3 py-1 text-sm ring-1 transition-colors duration-500",
                stage >= 1 ? "bg-cobalt-wash text-cobalt-deep ring-transparent" : "text-slate ring-rule",
              )}
              style={{ transitionDelay: stage >= 1 ? `${i * 0.2}s` : "0s" }}
            >
              {k}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_5.5rem_1fr] lg:gap-4">
        {/* Before */}
        <div>
          <PageLabel label="Your resume" score={62} />
          <div className="relative rounded-xl bg-surface p-6 shadow-[0_2px_0_rgb(12_20_36/0.03),0_20px_50px_-28px_rgb(12_20_36/0.4)] ring-1 ring-rule sm:p-7" ref={pageRef}>
            <ResumeBody variant="before" flagged={flagged} targetRefs={targetRefs} />

            <AnimatePresence>
              {showLens && pageWidth > 0 && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-0 z-10"
                  style={{ x: lensX, y: lensY }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative" style={{ width: LENS, height: LENS }}>
                    <span className="absolute right-[-26px] bottom-[-26px] h-11 w-3.5 origin-top -rotate-45 rounded-full bg-ink" />
                    <div className="absolute inset-0 overflow-hidden rounded-full bg-surface shadow-[0_14px_30px_-10px_rgb(12_20_36/0.55)] ring-[5px] ring-ink">
                      <motion.div
                        className="absolute top-0 left-0 p-6 sm:p-7"
                        style={{ width: pageWidth, transform: inner, transformOrigin: "0 0" }}
                      >
                        <ResumeBody variant="before" flagged={flagged} />
                      </motion.div>
                      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Optimizer */}
        <div className="flex items-center justify-center gap-3 lg:flex-col lg:self-center">
          <motion.div
            className={cn(
              "grid size-16 shrink-0 place-items-center rounded-full bg-ink text-white shadow-[0_10px_30px_-10px_rgb(12_20_36/0.6)] transition-transform duration-300",
              stage === 5 && "scale-110",
            )}
            animate={stage === 5 ? { rotate: 360 } : { rotate: 0 }}
            transition={stage === 5 ? { duration: 1.2, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
          >
            <Mark className="size-8" />
          </motion.div>
          <p aria-live="polite" className="min-h-5 font-mono text-xs text-slate lg:text-center">
            {statusText[stage]}
          </p>
        </div>

        {/* After */}
        <div>
          <PageLabel label="Tailored for this job" score={tailored ? 88 : null} highlight />
          <div className="relative">
            <div
              className={cn(
                "relative overflow-hidden rounded-xl bg-surface p-6 shadow-[0_2px_0_rgb(12_20_36/0.03),0_20px_50px_-28px_rgb(12_20_36/0.4)] ring-1 transition-opacity duration-500 sm:p-7",
                tailored ? "opacity-100 ring-cobalt/40" : "opacity-45 ring-rule",
              )}
            >
              <ResumeBody variant="after" flagged={[false, false, false]} revealed={tailored} />
              {stage === 5 && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cobalt/20 to-transparent"
                  initial={{ top: "-15%" }}
                  animate={{ top: "105%" }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            <AnimatePresence>
              {stage >= 7 && (
                <motion.figure
                  initial={{ opacity: 0, y: -10, rotate: 6 }}
                  animate={{ opacity: 1, y: 0, rotate: 3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="relative mt-4 ml-auto w-52 rounded-lg sm:absolute sm:-right-4 sm:-bottom-14 sm:mt-0 bg-marker-soft px-3.5 py-2.5 shadow-[0_12px_28px_-14px_rgb(12_20_36/0.5)] sm:-right-4"
                >
                  <p className="flex items-center justify-between">
                    <span className="rounded border-2 border-go px-1 text-[0.62rem] font-bold tracking-wide text-go uppercase">
                      Approved
                    </span>
                    <span className="font-hand text-sm text-slate">Abishek</span>
                  </p>
                  <blockquote className="mt-1 font-hand leading-snug text-ink">
                    “Lead with the deployed app in interviews.”
                  </blockquote>
                </motion.figure>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Auto-apply */}
      <div className="mt-8 rounded-2xl bg-surface p-5 ring-1 ring-rule sm:mt-20 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-lg font-semibold">Auto-apply</p>
          <p className="text-sm text-slate">Jobs you approved, each with its own tailored resume</p>
        </div>
        <ul className="mt-4 grid gap-2 md:grid-cols-3">
          {queue.map((job, i) => (
            <QueueRow key={job.role} job={job} sent={stage >= 8} delay={i * 0.6} />
          ))}
        </ul>
      </div>

      {stage >= 8 && !reduce && (
        <button
          type="button"
          onClick={replay}
          className="mt-4 text-sm font-medium text-cobalt hover:text-cobalt-deep"
        >
          Replay
        </button>
      )}
    </div>
  );
}

function PageLabel({ label, score, highlight = false }: { label: string; score: number | null; highlight?: boolean }) {
  return (
    <div className="mb-3 flex items-baseline justify-between px-1">
      <p className="font-medium text-ink">{label}</p>
      <p className="text-sm text-slate">
        Fit{" "}
        <span
          className={cn(
            "font-mono text-base font-semibold tabular-nums",
            highlight && score !== null ? "text-cobalt" : "text-ink",
          )}
        >
          {score ?? "—"}
        </span>
      </p>
    </div>
  );
}

function QueueRow({ job, sent, delay }: { job: { role: string; org: string }; sent: boolean; delay: number }) {
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!sent) {
      const t = window.setTimeout(() => setApplied(false), 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setApplied(true), delay * 1000 + 400);
    return () => window.clearTimeout(t);
  }, [sent, delay]);

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-paper px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{job.role}</p>
        <p className="truncate text-sm text-slate">{job.org}</p>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {applied ? (
          <motion.span
            key="applied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-white"
          >
            <CheckGlyph className="size-3" /> Applied
          </motion.span>
        ) : (
          <motion.span
            key="queued"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="shrink-0 rounded-full bg-surface px-2.5 py-1 text-xs text-slate ring-1 ring-rule"
          >
            {sent ? "Sending" : "Queued"}
          </motion.span>
        )}
      </AnimatePresence>
    </li>
  );
}
