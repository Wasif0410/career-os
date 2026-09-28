"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CheckGlyph } from "@/components/brand/glyphs";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
const LOOP_MS = 6000;

/** Counts up every few seconds while the element is on screen. Used as a key to replay animations. */
function useLoop(ref: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setTimeout(() => setTick((n) => n + 1), LOOP_MS);
    return () => window.clearTimeout(t);
  }, [inView, reduce, tick]);
  return tick;
}

const stages = [
  {
    title: "Set up",
    Visual: ContributionGraph,
    items: ["A GitHub that shows your work", "A resume built from scratch", "A LinkedIn recruiters read"],
  },
  {
    title: "Build",
    Visual: CourseProgress,
    items: ["Courses for the skills your target needs", "Real projects, planned with your coach", "Feedback on your code every week"],
  },
  {
    title: "Get hired",
    Visual: OfferPath,
    items: ["Applications sent and tracked for you", "OA and interview prep", "Your coach with you until the offer"],
  },
];

export function GroundUp() {
  const listRef = useRef<HTMLOListElement>(null);
  const tick = useLoop(listRef);
  return (
    <Section labelledBy="ground-up-title">
      <SectionHeading
        id="ground-up-title"
        title={
          <>
            We build you <span className="marker">from the ground up</span>
          </>
        }
        lead="Starting from zero is fine. Your coach sets everything up with you, and stays with you every week until you're hired."
      />

      <ol ref={listRef} className="mt-16 grid gap-4 md:grid-cols-3">
        {stages.map(({ title, Visual, items }, i) => (
          <Reveal as="li" key={title} delay={i * 0.08} className="h-full">
            <article className="flex h-full flex-col rounded-[1.75rem] bg-surface p-3 ring-1 ring-rule">
              <div className="grid h-40 place-items-center rounded-2xl bg-paper px-6">
                <Visual key={tick} />
              </div>
              <div className="px-5 pt-6 pb-5">
                <p className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-ink font-mono text-xs text-white">
                    {i + 1}
                  </span>
                  <span className="font-display text-2xl font-bold tracking-[-0.02em]">{title}</span>
                </p>
                <ul className="mt-5 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex gap-3 text-ink-soft">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-cobalt-wash text-cobalt-deep">
                        <CheckGlyph className="size-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* Small, wordless visuals. Example data only. */

// A GitHub-style contribution graph filling in: the first thing recruiters see on your profile.
function ContributionGraph() {
  const cols = 16;
  const rows = 5;
  const level = (c: number, r: number) => {
    const growth = c / cols; // more activity as the weeks go on
    const noise = ((c * 7 + r * 13) % 10) / 10;
    const v = growth * 0.85 + noise * 0.35;
    return v > 0.95 ? 4 : v > 0.7 ? 3 : v > 0.5 ? 2 : v > 0.3 ? 1 : 0;
  };
  const shades = ["bg-paper-deep", "bg-cobalt/25", "bg-cobalt/45", "bg-cobalt/70", "bg-cobalt"];
  return (
    <div className="grid w-full max-w-[16rem] gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} aria-hidden>
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        return (
          <motion.span
            key={i}
            className={cn("aspect-square rounded-[3px]", shades[level(c, r)])}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: c * 0.04 + r * 0.02, ease }}
          />
        );
      })}
    </div>
  );
}

function CourseProgress() {
  const courses = [
    { name: "Git and GitHub", value: 100 },
    { name: "Data structures", value: 100 },
    { name: "System design basics", value: 60 },
  ];
  return (
    <ul className="w-full max-w-[16rem] space-y-3" aria-hidden>
      {courses.map((c, i) => (
        <li key={c.name}>
          <p className="flex justify-between text-sm">
            <span className="text-ink">{c.name}</span>
            <span className="font-mono text-slate">{c.value}%</span>
          </p>
          <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-paper-deep">
            <motion.span
              className="block h-full rounded-full bg-cobalt"
              initial={{ width: 0 }}
              whileInView={{ width: `${c.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

function OfferPath() {
  const stops = ["Applied", "OA", "Interview", "Offer"];
  return (
    <div className="w-full max-w-[16rem]" aria-hidden>
      <div className="relative flex items-center justify-between">
        <span className="absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 bg-paper-deep" />
        <motion.span
          className="absolute top-1/2 left-2 h-0.5 -translate-y-1/2 bg-cobalt"
          initial={{ width: 0 }}
          whileInView={{ width: "calc(100% - 1rem)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.2, ease }}
        />
        {stops.map((s, i) => (
          <motion.span
            key={s}
            className={cn(
              "relative grid size-4 place-items-center rounded-full ring-4 ring-paper",
              i === stops.length - 1 ? "bg-marker" : "bg-cobalt",
            )}
            initial={{ scale: 0.5, opacity: 0.4 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.35 }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-slate">
        {stops.map((s) => (
          <span key={s} className={s === "Offer" ? "font-semibold text-ink" : undefined}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
