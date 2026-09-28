"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Stage = "Applied" | "OA" | "Interview" | "Offer";
type Card = { id: string; role: string; org: string; stage: Stage };

const columns: Stage[] = ["Applied", "OA", "Interview", "Offer"];

// Example data only. Counts include applications not shown as cards.
const hidden: Record<Stage, number> = { Applied: 16, OA: 3, Interview: 1, Offer: 0 };

const start: Card[] = [
  { id: "a", role: "Backend Intern", org: "Cloud startup · Remote", stage: "Applied" },
  { id: "b", role: "Software Engineer Intern", org: "Fintech · Toronto", stage: "Applied" },
  { id: "c", role: "Platform Intern", org: "Bank · Toronto", stage: "OA" },
  { id: "d", role: "Full-stack Intern", org: "SaaS · Waterloo", stage: "Interview" },
  { id: "e", role: "SWE Intern", org: "Payments · Toronto", stage: "Offer" },
];

// Updates that play in on a loop: applications move forward on their own, then the board resets.
const MOVES: { id: string; to: Stage }[] = [
  { id: "a", to: "OA" },
  { id: "c", to: "Interview" },
];
const STEP_MS = 2600;

export function Tracker() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  // step 0 is the starting board; step n has the first n moves applied.
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setTimeout(() => setStep((n) => (n + 1) % (MOVES.length + 1)), STEP_MS);
    return () => window.clearTimeout(t);
  }, [inView, reduce, step]);

  const shown = reduce ? MOVES.length : step;
  const cards = start.map((c) => {
    const move = [...MOVES.slice(0, shown)].reverse().find((m) => m.id === c.id);
    return move ? { ...c, stage: move.to } : c;
  });
  const latest = shown > 0 ? MOVES[shown - 1] : null;

  const total = cards.length + Object.values(hidden).reduce((a, b) => a + b, 0);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[1.75rem] bg-surface shadow-[0_40px_100px_-50px_rgb(12_20_36/0.45)] ring-1 ring-rule"
    >
      <div className="flex flex-col gap-2 border-b border-rule px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="font-display text-lg font-semibold">Application tracker</p>
        <p className="flex items-center gap-2 text-sm text-slate">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-go/60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-go" />
          </span>
          {total} applications, updated for you
        </p>
      </div>

      <LayoutGroup>
        <div className="grid gap-3 bg-paper p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
          {columns.map((col) => {
            const colCards = cards.filter((c) => c.stage === col);
            const count = colCards.length + hidden[col];
            return (
              <div key={col} className="rounded-2xl bg-surface/70 p-3 ring-1 ring-rule">
                <p className="flex items-center justify-between px-1 pb-3">
                  <span className={cn("font-medium", col === "Offer" ? "text-ink" : "text-ink-soft")}>{col}</span>
                  <motion.span
                    key={count}
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "grid min-w-7 place-items-center rounded-full px-2 py-0.5 font-mono text-xs font-semibold",
                      col === "Offer" ? "bg-marker text-ink" : "bg-paper-deep text-ink",
                    )}
                  >
                    {count}
                  </motion.span>
                </p>
                <ul className="space-y-2">
                  {colCards.map((c) => {
                    const justMoved = latest?.id === c.id;
                    return (
                      <motion.li
                        key={c.id}
                        layoutId={c.id}
                        layout
                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                        className={cn(
                          "rounded-xl bg-surface px-3.5 py-3 shadow-[0_1px_2px_rgb(12_20_36/0.06)] ring-1 transition-shadow duration-700",
                          justMoved ? "ring-2 ring-cobalt/50" : "ring-rule",
                        )}
                      >
                        <p className="truncate font-medium text-ink">{c.role}</p>
                        <p className="truncate text-sm text-slate">{c.org}</p>
                        {justMoved && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-1.5 text-xs font-medium text-cobalt-deep"
                          >
                            Moved to {c.stage} just now
                          </motion.p>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
