"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import {
  ApplyGlyph,
  DiagnoseGlyph,
  GoalGlyph,
  ImproveGlyph,
  RepeatGlyph,
  TrackGlyph,
} from "@/components/brand/glyphs";
import { Reveal } from "@/components/ui/reveal";

const statusChips = [
  { label: "applied", tone: "bg-paper-deep text-ink-soft" },
  { label: "oa", tone: "bg-cobalt-wash text-cobalt-deep" },
  { label: "interview", tone: "bg-cobalt text-white" },
  { label: "needs you", tone: "bg-marker text-ink" },
];

const steps = [
  {
    Glyph: GoalGlyph,
    title: "Set your target",
    body: "Choose the role and the season, like a Summer 2027 SWE internship. Everything after this is measured against it.",
    artifact: <Mono>target → SWE intern · Summer 2027</Mono>,
  },
  {
    Glyph: DiagnoseGlyph,
    title: "See where you stand",
    body: "Upload your resume and get a score out of 100 for that target, with every fix ranked by how much it matters.",
    artifact: <Mono>readiness 74/100 · 6 fixes ranked</Mono>,
  },
  {
    Glyph: ImproveGlyph,
    title: "Improve with a coach",
    body: "Wasif or Abishek goes through your score, picks your top three gaps and writes your plan for this week and this month. Courses cover the skills in between.",
    artifact: (
      <p className="w-fit -rotate-1 rounded-md bg-marker-soft px-3 py-1.5 font-hand text-[0.98rem] text-ink">
        This week: cut to one page. Add tests to your best repo.
      </p>
    ),
  },
  {
    Glyph: ApplyGlyph,
    title: "Apply where you fit",
    body: "Every job gets a fit score and a reason. You approve the ones you want, and we submit them with your monthly credits.",
    artifact: <Mono>approved 6 · skipped 41 · credits left 4/10</Mono>,
  },
  {
    Glyph: TrackGlyph,
    title: "Track every application",
    body: "Applied, OA, interview, offer: one tracker, updated for you. Anything waiting on you goes to the top.",
    artifact: (
      <ul className="flex flex-wrap gap-1.5">
        {statusChips.map((s) => (
          <li key={s.label} className={`rounded-full px-2.5 py-1 font-mono text-[0.7rem] ${s.tone}`}>
            {s.label}
          </li>
        ))}
      </ul>
    ),
  },
  {
    Glyph: RepeatGlyph,
    title: "Then the loop closes",
    body: "Your results go back to your coach. Twelve applications and no OAs means the plan changes. It doesn't mean you should apply harder.",
    artifact: <Mono>12 applied · 0 OA → plan updated by your coach</Mono>,
  },
];

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <p className="w-fit rounded-md bg-paper px-2.5 py-1.5 font-mono text-[0.76rem] text-ink-soft ring-1 ring-rule">
      {children}
    </p>
  );
}

export function Loop() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="how-it-works" aria-labelledby="loop-title" className="border-y border-rule bg-surface">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2
              id="loop-title"
              className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
            >
              One loop, built around one goal.
            </h2>
            <p className="mt-5 max-w-sm text-lg leading-relaxed text-ink-soft">
              Getting better and getting hired run on the same profile. What happens in your applications decides what
              your coach works on next.
            </p>
          </Reveal>
        </div>

        <ol ref={listRef} className="relative">
          {/* Rail, drawn as you scroll */}
          <span aria-hidden className="absolute top-5 bottom-5 left-[1.4rem] w-px bg-rule" />
          <motion.span
            aria-hidden
            style={{ scaleY }}
            className="absolute top-5 bottom-5 left-[1.4rem] w-px origin-top bg-cobalt"
          />
          {steps.map(({ Glyph, title, body, artifact }, i) => (
            <Reveal as="li" key={title} className="relative grid grid-cols-[2.8rem_1fr] gap-5 pb-12 last:pb-0">
              <span className="relative z-10 grid size-11 place-items-center rounded-full bg-surface text-ink ring-1 ring-rule-strong">
                <Glyph className="size-5" />
              </span>
              <div className="pt-1">
                <p className="font-mono text-xs text-slate">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-display text-[1.45rem] leading-tight font-semibold tracking-[-0.015em]">
                  {title}
                </h3>
                <p className="mt-2 max-w-lg leading-relaxed text-ink-soft">{body}</p>
                <div className="mt-4">{artifact}</div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
