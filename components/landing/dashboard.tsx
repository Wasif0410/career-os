"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Mark } from "@/components/brand/logo";
import {
  ApplyGlyph,
  BookGlyph,
  ChatGlyph,
  CheckGlyph,
  GoalGlyph,
  HomeGlyph,
  ImproveGlyph,
} from "@/components/brand/glyphs";
import {
  CardHeader,
  CheckBox,
  CoachAvatar,
  FitBadge,
  StatusPill,
  Toggle,
  type Status,
} from "@/components/landing/product-ui";
import { cn } from "@/lib/utils";

/*
 * The Career OS home screen for one example student, used as the hero visual.
 * The coach comes first: the next 1-1 and its agenda lead the screen, and the
 * software (matches, applications) works underneath. A short loop plays while
 * it's on screen: the coach replies, a job moves from Approve to Applied and
 * the plan ticks off. Example data only.
 */

const STEP_MS = 2200;
const STEPS = 4; // 0 coach typing · 1 reply + applying · 2 applied · 3 hold
const ease = [0.22, 1, 0.36, 1] as const;

const nav = [
  { label: "Home", Glyph: HomeGlyph },
  { label: "Coaching", Glyph: ChatGlyph, badge: "Thu" },
  { label: "Plan", Glyph: ImproveGlyph },
  { label: "Courses", Glyph: BookGlyph },
  { label: "Jobs", Glyph: GoalGlyph },
  { label: "Applications", Glyph: ApplyGlyph },
];

const agenda = [
  { text: "Go over your OA practice", done: true },
  { text: "Mock interview: arrays and hashing", done: false },
  { text: "Pick your next 10 roles together", done: false },
];

export function Dashboard({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setTimeout(() => setStep((n) => (n + 1) % STEPS), STEP_MS);
    return () => window.clearTimeout(t);
  }, [inView, reduce, step]);

  const s = reduce ? 2 : step;
  const replied = s >= 1;
  const applied = s >= 2;
  const jobs: { role: string; org: string; fit: number; status: Status }[] = [
    { role: "Software Engineer Intern", org: "Fintech · Toronto", fit: 91, status: "Applied" },
    { role: "Backend Intern", org: "Cloud startup · Remote", fit: 86, status: "Applied" },
    { role: "Platform Intern", org: "Bank · Toronto", fit: 82, status: s === 0 ? "Approve" : s === 1 ? "Applying" : "Applied" },
  ];
  const pipeline = [
    { label: "Applied", value: applied ? 24 : 23 },
    { label: "OAs", value: 6 },
    { label: "Interviews", value: 3 },
    { label: "Offers", value: 1 },
  ];
  const plan = [
    { text: "Deploy your ML project", done: true },
    { text: "Add results to 3 bullets", done: true },
    { text: "Approve this week's matches", done: applied },
  ];
  const planDone = plan.filter((p) => p.done).length;

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[1.75rem] bg-white/[0.06] p-2 shadow-[0_50px_140px_-40px_rgb(36_71_245/0.6)] ring-1 ring-white/12 backdrop-blur-sm sm:p-3",
        className,
      )}
    >
      <div
        className="overflow-hidden rounded-[1.25rem] bg-surface text-ink shadow-[0_30px_80px_-40px_rgb(5_11_36/0.8)]"
        aria-label="Example of the Career OS dashboard: your next session with your coach, your weekly plan, job matches and applications"
        role="img"
      >
        {/* Top bar */}
        <div className="flex h-12 items-center justify-between gap-4 border-b border-rule px-4 sm:px-5">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Mark className="size-5" />
            Career OS
          </span>
          <span className="flex items-center gap-3">
            <span className="hidden rounded-full bg-paper px-3 py-1 text-xs text-ink-soft ring-1 ring-rule sm:inline">
              Target · SWE intern, Summer 2027
            </span>
            <span className="grid size-7 place-items-center rounded-full bg-cobalt text-xs font-semibold text-white">M</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[12.5rem_minmax(0,1fr)]">
          {/* Sidebar */}
          <div className="hidden flex-col border-r border-rule bg-paper/70 p-3 md:flex">
            <ul className="space-y-0.5">
              {nav.map(({ label, Glyph, badge }, i) => (
                <li
                  key={label}
                  className={cn(
                    "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm",
                    i === 0 ? "bg-surface font-medium text-ink ring-1 ring-rule" : "text-slate",
                  )}
                >
                  <Glyph className="size-[18px]" />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="rounded-full bg-cobalt px-1.5 py-px text-[0.65rem] font-semibold text-white">{badge}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-auto rounded-xl bg-surface p-3 ring-1 ring-rule">
              <p className="text-xs text-slate">Auto-apply credits</p>
              <p className="mt-1 text-sm font-medium text-ink">{applied ? 5 : 6} of 10 left</p>
              <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-paper-deep">
                <motion.span
                  className="block h-full rounded-full bg-cobalt"
                  animate={{ width: applied ? "50%" : "60%" }}
                  transition={{ duration: 0.6, ease }}
                />
              </span>
            </div>
          </div>

          {/* Main */}
          <div className="min-w-0 p-4 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xl font-semibold tracking-[-0.025em] text-ink sm:text-2xl">
                  Good evening, Maya
                </p>
                <p className="mt-0.5 text-sm text-slate">Week 6 of your plan</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1 text-xs text-ink-soft ring-1 ring-rule">
                Readiness
                <span className="font-mono font-semibold text-ink">74</span>
                <span className="font-medium text-go">+26</span>
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-5">
              {/* Next session with your coach: the lead card. */}
              <div className="deep-blue relative isolate overflow-hidden rounded-2xl p-4 sm:p-5 lg:col-span-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="relative">
                      <CoachAvatar className="size-10 bg-cobalt ring-2 ring-white/15" />
                      <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-[#34d399] ring-2 ring-midnight" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">1-1 with your coach</span>
                      <span className="block truncate text-xs text-white/60">Thu · 6:00 PM · 45 min</span>
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">Join</span>
                </div>

                <p className="mt-5 text-xs font-medium text-sky">Agenda from your coach</p>
                <ol className="mt-2 space-y-2">
                  {agenda.map((a, i) => (
                    <li key={a.text} className="flex items-center gap-3 text-sm">
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full font-mono text-[0.65rem]",
                          a.done ? "bg-cobalt-bright text-white" : "text-white/70 ring-1 ring-white/25",
                        )}
                      >
                        {a.done ? <CheckGlyph className="size-3" /> : i + 1}
                      </span>
                      <span className={a.done ? "text-white/50 line-through" : "text-white/90"}>{a.text}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-4 min-h-[2.75rem] rounded-xl bg-white/[0.08] px-3.5 py-2.5 text-sm ring-1 ring-white/10">
                  <AnimatePresence mode="wait" initial={false}>
                    {replied ? (
                      <motion.p
                        key="reply"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="text-white/85"
                      >
                        “Great OA score. Thursday we run a mock interview.”
                      </motion.p>
                    ) : (
                      <motion.p
                        key="typing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-white/55"
                      >
                        Your coach is typing
                        <span className="flex gap-1" aria-hidden>
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="size-1 animate-bounce rounded-full bg-white/60 motion-reduce:animate-none"
                              style={{ animationDelay: `${d * 0.15}s` }}
                            />
                          ))}
                        </span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* This week's plan, written by the coach. */}
              <div className="rounded-2xl p-4 ring-1 ring-rule sm:p-5 lg:col-span-2">
                <CardHeader title="This week" meta={`${planDone} of 3 done`} />
                <p className="mt-0.5 text-xs text-slate">Set by your coach</p>
                <ul className="mt-4 space-y-3">
                  {plan.map((p) => (
                    <li key={p.text} className="flex items-center gap-3 text-sm">
                      <CheckBox done={p.done} />
                      <span className={cn("transition-colors duration-300", p.done ? "text-slate line-through" : "text-ink")}>
                        {p.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <span className="mt-5 block h-1.5 overflow-hidden rounded-full bg-paper-deep">
                  <motion.span
                    className="block h-full rounded-full bg-cobalt"
                    animate={{ width: `${(planDone / 3) * 100}%` }}
                    transition={{ duration: 0.6, ease }}
                  />
                </span>
              </div>

              {/* Matches */}
              <div className="rounded-2xl p-4 ring-1 ring-rule sm:p-5 lg:col-span-3">
                <CardHeader title="Job matches" meta={<Toggle label="Auto-apply" />} />
                <ul className="mt-3 space-y-1">
                  {jobs.map((j) => (
                    <li key={j.role} className="flex items-center gap-3 rounded-xl py-1.5">
                      <FitBadge value={j.fit} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{j.role}</span>
                        <span className="block truncate text-xs text-slate">{j.org}</span>
                      </span>
                      <StatusPill status={j.status} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applications */}
              <div className="hidden rounded-2xl p-4 ring-1 ring-rule sm:block sm:p-5 lg:col-span-2">
                <CardHeader title="Applications" meta="This season" />
                <ul className="mt-4 space-y-3">
                  {pipeline.map((p, i) => (
                    <li key={p.label} className="grid grid-cols-[5.25rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
                      <span className="text-slate">{p.label}</span>
                      <span className="h-2 overflow-hidden rounded-full bg-paper-deep">
                        <motion.span
                          className={cn("block h-full rounded-full", i === pipeline.length - 1 ? "bg-go" : "bg-cobalt")}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(6, (p.value / 24) * 100)}%` }}
                          transition={{ duration: 0.9, delay: 0.8 + i * 0.1, ease }}
                        />
                      </span>
                      <motion.span
                        key={p.value}
                        initial={{ opacity: 0.3, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-right font-mono font-semibold text-ink tabular-nums"
                      >
                        {p.value}
                      </motion.span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
