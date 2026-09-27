"use client";

import { motion } from "motion/react";
import { CheckGlyph } from "@/components/brand/glyphs";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Row = {
  title: string;
  company: string;
  place: string;
  fit: number;
  decision: "approved" | "skipped";
  reason?: string;
};

const rows: Row[] = [
  { title: "ML Engineering Intern", company: "Shopify", place: "Remote, Canada", fit: 91, decision: "approved" },
  { title: "Data Science Intern", company: "Wealthsimple", place: "Toronto", fit: 84, decision: "approved" },
  { title: "Machine Learning Intern", company: "Cohere", place: "Toronto", fit: 79, decision: "approved" },
  { title: "Senior ML Engineer", company: "Series B startup", place: "Remote", fit: 22, decision: "skipped", reason: "Needs 5+ years" },
  { title: "ML Intern", company: "Retail company", place: "On-site, Seattle", fit: 38, decision: "skipped", reason: "Outside your locations" },
  { title: "Data Entry Clerk", company: "Staffing agency", place: "Hybrid", fit: 11, decision: "skipped", reason: "Keyword match only" },
];

const rules = [
  { title: "Every job gets a fit score and a reason", body: "You see why it matches and what's missing before you decide." },
  { title: "Nothing is sent until you approve it", body: "Approve or skip each match. You stay in control of your name." },
  { title: "Credits cap the volume on purpose", body: "Monthly credits keep applications focused on roles you can win." },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Relevance() {
  return (
    <section aria-labelledby="relevance-title" className="border-y border-rule bg-surface">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">Auto-apply, done carefully</p>
          <h2
            id="relevance-title"
            className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
          >
            Fewer applications. Better ones.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            Most auto-apply tools compete on volume. Sending hundreds of applications a week is how you end up ignored.
            Career OS applies only where you have a real shot, and only after you say yes.
          </p>
          <ul className="mt-9 space-y-5">
            {rules.map((rule) => (
              <li key={rule.title} className="flex gap-3.5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-cobalt text-white">
                  <CheckGlyph className="size-3.5" />
                </span>
                <div>
                  <p className="font-medium text-ink">{rule.title}</p>
                  <p className="mt-0.5 text-[0.95rem] text-slate">{rule.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="rounded-[1.4rem] bg-paper p-2 ring-1 ring-rule">
          <div className="flex items-center justify-between px-4 pt-3 pb-3">
            <p className="eyebrow">Matches for ML intern · Winter 2027</p>
            <p className="font-mono text-[0.68rem] tracking-wide text-slate/80">EXAMPLE</p>
          </div>
          <ul className="space-y-1.5">
            {rows.map((row, i) => {
              const skipped = row.decision === "skipped";
              return (
                <motion.li
                  key={row.title + row.company}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease }}
                  className={cn(
                    "grid grid-cols-[2.6rem_1fr_auto] items-center gap-3 rounded-xl px-3 py-3 sm:gap-4",
                    skipped ? "bg-transparent" : "bg-surface ring-1 ring-rule",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-lg font-mono text-sm font-semibold tabular-nums",
                      skipped ? "bg-paper-deep text-slate" : "bg-cobalt-wash text-cobalt-deep",
                    )}
                    aria-label={`Fit ${row.fit} out of 100`}
                  >
                    {row.fit}
                  </span>
                  <div className={cn("min-w-0", skipped && "opacity-60")}>
                    <p className="truncate text-[0.93rem] font-medium text-ink">{row.title}</p>
                    <p className="truncate text-[0.8rem] text-slate">
                      {row.company} · {row.place}
                    </p>
                  </div>
                  {skipped ? (
                    <span className="text-right font-mono text-[0.7rem] leading-tight text-slate">
                      skipped
                      <span className="block text-ink-soft/80 normal-case">{row.reason}</span>
                    </span>
                  ) : (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 500, damping: 24, delay: 0.5 + i * 0.12 }}
                      className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 font-mono text-[0.7rem] text-white"
                    >
                      <CheckGlyph className="size-3" /> approved
                    </motion.span>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
