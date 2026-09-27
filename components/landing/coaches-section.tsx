import { CoachCard } from "@/components/coaches/coach-card";
import { Reveal } from "@/components/ui/reveal";
import { coaches } from "@/lib/site";

export function SessionFlow() {
  const phases = [
    {
      when: "Before",
      what: "Your coach reads your score, your plan and your latest application results. No time spent catching up.",
    },
    {
      when: "During",
      what: "You agree on the three gaps that matter most for your target, and how to close each one.",
    },
    {
      when: "After",
      what: "A written plan lands in your dashboard: this week, this month. You tick it off as you go.",
    },
  ];
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl bg-rule ring-1 ring-rule md:grid-cols-3">
      {phases.map((p) => (
        <li key={p.when} className="bg-surface p-6">
          <p className="font-hand text-2xl text-ink">{p.when}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{p.what}</p>
        </li>
      ))}
    </ol>
  );
}

export function CoachesSection() {
  return (
    <section id="coaches" aria-labelledby="coaches-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">The coaches</p>
        <h2
          id="coaches-title"
          className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
        >
          Software does the prep. <span className="marker">People</span> give the advice.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Every paid plan includes 1-1 sessions with the two people who built Career OS. The software scores and
          tracks, so your session goes to decisions, not data entry.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {coaches.map((coach, i) => (
          <Reveal key={coach.slug} delay={i * 0.08}>
            <CoachCard coach={coach} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-5">
        <SessionFlow />
      </Reveal>

      <Reveal className="mt-8">
        <p className="text-[0.95rem] text-slate">
          We take a limited number of students each month so every session gets proper prep.
        </p>
      </Reveal>
    </section>
  );
}
