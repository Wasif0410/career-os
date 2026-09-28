"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CheckGlyph } from "@/components/brand/glyphs";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const CYCLE_MS = 6500;
const ease = [0.22, 1, 0.36, 1] as const;

const phases = [
  {
    title: "Pick a target you can win",
    body: "Your coach helps you choose the role and season, and maps out when to apply.",
    Visual: TargetVisual,
  },
  {
    title: "Close your gaps with a coach",
    body: "A resume score, a weekly plan and 1-1 sessions show you exactly what to work on.",
    Visual: ImproveVisual,
  },
  {
    title: "Apply on autopilot",
    body: "We send a tailored resume to every job you approve, and track every application.",
    Visual: ApplyVisual,
  },
  {
    title: "Interview and get the offer",
    body: "Your coach preps you for OAs and interviews until the offer comes in.",
    Visual: OfferVisual,
  },
];

export function Journey() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "0px 0px -30% 0px" });
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const auto = !reduce && inView;

  // Keep stepping through the phases. Hovering pauses; picking one jumps there and the cycle continues.
  useEffect(() => {
    if (!auto || hovering) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % phases.length), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [active, auto, hovering]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = phases.length - 1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") select(active === last ? 0 : active + 1, true);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") select(active === 0 ? last : active - 1, true);
    else return;
    e.preventDefault();
  };

  const { Visual } = phases[active];

  return (
    <Section id="journey" labelledBy="journey-title" tone="surface">
        <SectionHeading
          id="journey-title"
          title={
            <>
              We guide you <span className="marker">the whole way</span>
            </>
          }
          lead="From picking a target to signing an offer, you never do it alone."
        />

        <div
          ref={rootRef}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          className="mt-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10"
        >
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="How Career OS guides you"
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 lg:justify-center"
          >
            {phases.map((p, i) => {
              const selected = i === active;
              return (
                <button
                  key={p.title}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`journey-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="journey-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    "relative overflow-hidden rounded-2xl px-5 py-4 text-left transition-colors duration-300",
                    selected ? "bg-paper ring-1 ring-rule" : "hover:bg-paper/60",
                  )}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm transition-colors duration-300",
                        selected ? "bg-ink text-white" : "bg-paper-deep text-slate",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        "font-display text-xl font-semibold tracking-[-0.015em] transition-colors",
                        !selected && "text-ink/55",
                      )}
                    >
                      {p.title}
                    </span>
                  </span>
                  <AnimatePresence initial={false}>
                    {selected && (
                      <motion.span
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="block overflow-hidden pl-12 text-ink-soft"
                      >
                        <span className="block pt-2">{p.body}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {selected && auto && (
                    <motion.span
                      key={`bar-${active}`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-cobalt"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hovering ? 0 : 1 }}
                      transition={{ duration: hovering ? 0 : CYCLE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div
            id="journey-panel"
            role="tabpanel"
            aria-labelledby={`journey-tab-${active}`}
            className="relative isolate grid min-h-[25rem] place-items-center overflow-hidden rounded-[1.75rem] bg-paper p-5 ring-1 ring-rule sm:min-h-[29rem] sm:p-10"
          >
            <div aria-hidden className="paper-grid absolute inset-0 -z-10 opacity-70" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.4, ease }}
                className="w-full max-w-md"
              >
                <Visual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
    </Section>
  );
}

/* One clean card per phase. Example data only. */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface p-6 shadow-[0_24px_60px_-30px_rgb(12_20_36/0.35)] ring-1 ring-rule",
        className,
      )}
    >
      {children}
    </div>
  );
}

function TargetVisual() {
  const milestones = [
    { label: "Resume ready", done: true },
    { label: "Applications open", done: false },
    { label: "Interviews", done: false },
  ];
  return (
    <Card>
      <p className="text-sm text-slate">Your target</p>
      <p className="mt-1 font-display text-3xl font-bold tracking-[-0.02em]">SWE intern</p>
      <p className="text-lg text-ink-soft">Summer 2027 · Toronto or remote</p>
      <div className="mt-7 grid grid-cols-3 gap-2">
        {milestones.map((m, i) => (
          <div key={m.label}>
            <motion.div
              className={cn("h-1.5 origin-left rounded-full", m.done ? "bg-cobalt" : "bg-paper-deep")}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease }}
            />
            <p className={cn("mt-2 text-sm", m.done ? "text-ink" : "text-slate")}>{m.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 -rotate-1 font-hand text-lg leading-snug text-ink">
        <span className="marker">Applications open in 6 weeks.</span> Let&apos;s get your resume ready first.
      </p>
      <p className="mt-1 -rotate-1 font-hand text-slate">— Your coach</p>
    </Card>
  );
}

function ImproveVisual() {
  const tasks = ["Cut your resume to one page", "Deploy your ML project", "Add results to 3 bullets"];
  const circumference = 2 * Math.PI * 34;
  return (
    <Card>
      <div className="flex items-center gap-5">
        <div className="relative size-20 shrink-0">
          <svg viewBox="0 0 80 80" className="size-20 -rotate-90" aria-hidden>
            <circle cx="40" cy="40" r="34" fill="none" strokeWidth="7" className="stroke-paper-deep" />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              className="stroke-cobalt"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference * (1 - 0.48) }}
              animate={{ strokeDashoffset: circumference * (1 - 0.81) }}
              transition={{ duration: 1.4, delay: 0.3, ease }}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-mono text-xl font-semibold">81</span>
        </div>
        <div>
          <p className="font-display text-xl font-semibold">Readiness up 33 points</p>
          <p className="text-slate">After three weeks with your coach</p>
        </div>
      </div>
      <div className="mt-6 rounded-xl bg-marker-soft p-4">
        <p className="font-hand text-lg font-bold">This week</p>
        <ul className="mt-1 space-y-1">
          {tasks.map((t, i) => {
            const done = i < 2;
            return (
              <li key={t} className="flex items-center gap-2.5 font-hand text-lg text-ink">
                <motion.span
                  className="grid size-4 shrink-0 place-items-center rounded border-2 border-ink/70"
                  initial={{ backgroundColor: "rgba(12, 20, 36, 0)" }}
                  animate={{ backgroundColor: done ? "rgba(12, 20, 36, 1)" : "rgba(12, 20, 36, 0)" }}
                  transition={{ delay: 0.6 + i * 0.4 }}
                >
                  {done && <CheckGlyph className="size-3 text-white" />}
                </motion.span>
                <span className={cn(done && "text-ink/60 line-through")}>{t}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

function ApplyVisual() {
  const jobs = [
    { role: "Software Engineer Intern", org: "Fintech · Toronto", fit: 91, status: "Applied" },
    { role: "Backend Intern", org: "Cloud startup · Remote", fit: 86, status: "Applied" },
    { role: "Platform Intern", org: "Bank · Toronto", fit: 82, status: "Applying" },
    { role: "Full-stack Intern", org: "SaaS · Waterloo", fit: 79, status: "Queued" },
  ];
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4 px-1 pb-3">
        <p className="font-display text-lg font-semibold">Auto-apply</p>
        <p className="text-sm text-slate">Tailored resume on each</p>
      </div>
      <ul className="space-y-1.5">
        {jobs.map((j, i) => (
          <motion.li
            key={j.role}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease }}
            className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-cobalt-wash font-mono text-sm font-semibold text-cobalt-deep">
              {j.fit}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{j.role}</span>
              <span className="block truncate text-sm text-slate">{j.org}</span>
            </span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                j.status === "Applied" && "bg-ink text-white",
                j.status === "Applying" && "bg-cobalt text-white",
                j.status === "Queued" && "bg-surface text-slate ring-1 ring-rule",
              )}
            >
              {j.status}
            </span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

function OfferVisual() {
  const funnel = [
    { label: "Applied", value: 24 },
    { label: "OAs", value: 6 },
    { label: "Interviews", value: 3 },
    { label: "Offers", value: 1 },
  ];
  return (
    <Card>
      <ul className="space-y-3">
        {funnel.map((f, i) => (
          <li key={f.label} className="grid grid-cols-[5.5rem_1fr_1.5rem] items-center gap-3">
            <span className="text-sm text-slate">{f.label}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-paper-deep">
              <motion.span
                className={cn("block h-full rounded-full", i === funnel.length - 1 ? "bg-marker" : "bg-cobalt")}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(6, (f.value / funnel[0].value) * 100)}%` }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
              />
            </span>
            <span className="text-right font-mono text-sm font-semibold tabular-nums">{f.value}</span>
          </li>
        ))}
      </ul>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5, ease }}
        className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-ink px-5 py-4 text-white"
      >
        <div>
          <p className="text-sm text-white/60">Offer received</p>
          <p className="font-display text-xl font-semibold">SWE Intern, Summer 2027</p>
        </div>
        <span className="rounded-md bg-marker px-2 py-1 text-sm font-semibold text-ink">Accepted</span>
      </motion.div>
    </Card>
  );
}
