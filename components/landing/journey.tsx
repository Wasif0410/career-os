"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Starfield } from "@/components/brand/starfield";
import {
  CardHeader,
  CheckBox,
  CoachMessage,
  FitBadge,
  ProductCard,
  StatusPill,
  Toggle,
} from "@/components/landing/product-ui";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    week: "Week 1",
    title: "Pick a target you can win",
    body: "Your coach helps you choose the role, the season and when to apply.",
    Visual: TargetVisual,
  },
  {
    week: "Week 3",
    title: "Close your gaps",
    body: "A score, a weekly plan and 1-1 sessions show you exactly what to fix.",
    Visual: GapsVisual,
  },
  {
    week: "Week 6",
    title: "Apply on autopilot",
    body: "A tailored resume goes to every job you approve, and every application is tracked.",
    Visual: ApplyVisual,
  },
  {
    week: "Week 12",
    title: "Land the offer",
    body: "Your coach preps you for every OA and interview until it comes in.",
    Visual: OfferVisual,
  },
];

const desktopQuery = "(min-width: 1024px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(desktopQuery);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(desktopQuery).matches,
    () => false,
  );
}

/**
 * The four stages as cards that stack as you scroll: each one pins near the
 * top, the next slides up over it, and the ones underneath settle back a
 * little. The last card, the offer, is the deep blue one. On phones the cards
 * simply follow each other.
 */
export function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // On phones the cards sit side by side and swipe; this tracks which one is showing for the dots.
  const [shown, setShown] = useState(0);
  const onSwipe = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const i = Math.round(el.scrollLeft / (card.offsetWidth + 12));
    setShown((prev) => (prev === i ? prev : Math.min(steps.length - 1, Math.max(0, i))));
  };

  return (
    <Section id="journey" labelledBy="journey-title" tone="light" className="overflow-visible">
      <SectionHeading
        id="journey-title"
        title="We guide you"
        muted="the whole way."
        lead="From picking a target to signing an offer, your coach is with you every week."
        center
      />

      <div
        ref={ref}
        onScroll={desktop ? undefined : onSwipe}
        className={cn(
          "mt-12 md:mt-16 lg:mt-0",
          // Phones and tablets: a swipeable row of cards. Desktop: the scroll stack.
          "-mx-5 flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden",
          "lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0",
          reduce && "lg:space-y-4",
        )}
      >
        {steps.map((step, i) => (
          <StepCard key={step.title} step={step} index={i} progress={scrollYProgress} stacked={desktop && !reduce} />
        ))}
        {/* Scroll room after the last card: sticky elements can only hold while their parent continues,
            so this lets the finished stack sit on screen before the section moves on. */}
        {desktop && !reduce && <div aria-hidden className="h-[35vh]" />}
      </div>

      {/* Where you are in the row, on phones and tablets */}
      <div className="mt-6 flex justify-center gap-2 lg:hidden" aria-hidden>
        {steps.map((s, i) => (
          <span
            key={s.title}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === shown ? "w-6 bg-cobalt" : "w-1.5 bg-rule-strong",
            )}
          />
        ))}
      </div>
    </Section>
  );
}

function StepCard({
  step,
  index,
  progress,
  stacked,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
  stacked: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  // Remounting the visual each time the card comes back into view replays its animation.
  const inView = useInView(ref, { amount: 0.4 });
  const total = steps.length;
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.035]);
  const finale = index === total - 1;
  const { Visual } = step;

  return (
    <div
      // Every wrapper is the same height, so the whole stack stays stuck together and leaves together.
      className={cn(
        "w-[88%] max-w-[26rem] shrink-0 snap-center lg:w-auto lg:max-w-none",
        stacked && "sticky top-0 h-[88vh]",
      )}
      style={stacked ? { paddingTop: `calc(6.5rem + ${index * 1.5}rem)` } : undefined}
    >
      <motion.article
        ref={ref}
        style={stacked ? { scale, transformOrigin: "50% 0%" } : undefined}
        className={cn(
          "relative isolate grid h-full grid-cols-1 overflow-hidden rounded-[1.75rem] lg:h-auto lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:rounded-[2rem]",
          finale
            ? "deep-blue shadow-[0_40px_100px_-40px_rgb(36_71_245/0.6)] ring-1 ring-white/10"
            : "bg-surface shadow-[0_30px_80px_-50px_rgb(10_20_51/0.45)] ring-1 ring-rule",
        )}
      >
        {finale && <Starfield seed={71} count={45} />}
        <div className="flex flex-col justify-between gap-5 p-6 sm:p-10 lg:gap-10 lg:p-12">
          <p className={cn("text-sm font-medium", finale ? "text-sky" : "text-cobalt")}>{step.week}</p>
          <div>
            <h3
              className={cn(
                "font-display text-[clamp(1.85rem,3.6vw,3.25rem)] leading-[1.04] tracking-[-0.022em]",
                finale ? "text-white" : "text-ink",
              )}
            >
              {step.title}
            </h3>
            <p
              className={cn(
                "mt-3 max-w-sm text-base leading-relaxed sm:mt-4 sm:text-[1.05rem]",
                finale ? "text-white/65" : "text-slate",
              )}
            >
              {step.body}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "m-1.5 grid grid-cols-1 place-items-center rounded-[1.4rem] px-2 py-4 sm:m-3 sm:min-h-[22rem] sm:rounded-[1.6rem] sm:px-10 sm:py-12",
            finale ? "bg-white/[0.05] ring-1 ring-white/10" : "bg-[linear-gradient(160deg,#eef2ff_0%,#dde5ff_100%)]",
          )}
        >
          <div className="w-full max-w-md min-w-0">
            <Visual key={inView ? "in" : "out"} />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

/* One product card per stage. Example data only. Everything lands within half a second. */

const item = (i: number, base = 0.08) => ({
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, delay: base + i * 0.06, ease },
});

function TargetVisual() {
  const fields = [
    ["Role", "Software engineering intern"],
    ["Season", "Summer 2027"],
    ["Location", "Toronto or remote"],
  ];
  return (
    <ProductCard>
      <CardHeader title="Your target" meta="Set with your coach" />
      <dl className="mt-3 divide-y divide-rule">
        {fields.map(([k, v], i) => (
          <motion.div key={k} className="flex items-center justify-between gap-4 py-3 text-sm" {...item(i)}>
            <dt className="text-slate">{k}</dt>
            <dd className="font-medium text-ink">{v}</dd>
          </motion.div>
        ))}
      </dl>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3, ease }}
        className="mt-4 border-t border-rule pt-4"
      >
        <CoachMessage text="Applications open in 6 weeks. Let's get your resume ready first." time="2m ago" />
      </motion.div>
    </ProductCard>
  );
}

function GapsVisual() {
  const fixes = [
    { text: "Add results to your bullets", points: 9, done: true },
    { text: "Deploy your ML project", points: 7, done: true },
    { text: "Cut your resume to one page", points: 4, done: false },
  ];
  return (
    <ProductCard>
      <CardHeader title="Resume score" meta="Reviewed with your coach" />
      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-4xl font-semibold tracking-[-0.04em] text-slate/60 line-through decoration-2">62</span>
        <motion.span
          className="text-5xl font-semibold tracking-[-0.04em] text-cobalt"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease }}
        >
          78
        </motion.span>
        <span className="text-sm text-slate">/100</span>
      </div>
      <p className="mt-5 text-xs font-medium text-slate">Top fixes, ranked</p>
      <ul className="mt-2 divide-y divide-rule">
        {fixes.map((f, i) => (
          <motion.li key={f.text} className="flex items-center gap-3 py-2.5 text-sm" {...item(i, 0.12)}>
            <CheckBox done={f.done} />
            <span className={cn("flex-1", f.done ? "text-slate line-through" : "text-ink")}>{f.text}</span>
            <span className="font-mono text-xs font-semibold text-go">+{f.points}</span>
          </motion.li>
        ))}
      </ul>
    </ProductCard>
  );
}

function ApplyVisual() {
  const jobs = [
    { role: "Software Engineer Intern", org: "Fintech · Toronto", fit: 91, status: "Applied" as const },
    { role: "Backend Intern", org: "Cloud startup · Remote", fit: 86, status: "Applied" as const },
    { role: "Platform Intern", org: "Bank · Toronto", fit: 82, status: "Applying" as const },
    { role: "Full-stack Intern", org: "SaaS · Waterloo", fit: 79, status: "Queued" as const },
  ];
  return (
    <ProductCard>
      <CardHeader title="Matches for you" meta={<Toggle label="Auto-apply" />} />
      <ul className="mt-2">
        {jobs.map((j, i) => (
          <motion.li key={j.role} className="flex items-center gap-3 py-2" {...item(i)}>
            <FitBadge value={j.fit} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">{j.role}</span>
              <span className="block truncate text-xs text-slate">{j.org}</span>
            </span>
            <StatusPill status={j.status} />
          </motion.li>
        ))}
      </ul>
    </ProductCard>
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
    <ProductCard>
      <CardHeader title="Your season" meta="Summer 2027" />
      <ul className="mt-4 space-y-3">
        {funnel.map((f, i) => (
          <li key={f.label} className="grid grid-cols-[5.25rem_minmax(0,1fr)_1.5rem] items-center gap-3 text-sm">
            <span className="text-slate">{f.label}</span>
            <span className="h-2 overflow-hidden rounded-full bg-paper-deep">
              <motion.span
                className={cn("block h-full rounded-full", i === funnel.length - 1 ? "bg-go" : "bg-cobalt")}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(6, (f.value / funnel[0].value) * 100)}%` }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.07, ease }}
              />
            </span>
            <span className="text-right font-mono font-semibold text-ink tabular-nums">{f.value}</span>
          </li>
        ))}
      </ul>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.35, ease }}
        className="deep-blue mt-5 flex items-center justify-between gap-4 rounded-xl px-4 py-3.5"
      >
        <div className="min-w-0">
          <p className="text-xs text-white/60">Offer received</p>
          <p className="truncate text-base font-semibold tracking-[-0.015em] sm:text-lg">SWE Intern, Summer 2027</p>
        </div>
        <span className="shrink-0 rounded-full bg-go px-2.5 py-1 text-xs font-medium text-white">Accepted</span>
      </motion.div>
    </ProductCard>
  );
}
