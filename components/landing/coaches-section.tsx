import { CoachCard } from "@/components/coaches/coach-card";
import { Reveal } from "@/components/ui/reveal";
import { coaches } from "@/lib/site";

export function SessionFlow() {
  const phases = [
    { when: "Before", what: "Your coach reads your score and your results." },
    { when: "During", what: "You agree on your top 3 gaps." },
    { when: "After", what: "Your plan for the week lands in your dashboard." },
  ];
  return (
    <ol className="grid gap-px overflow-hidden rounded-2xl bg-rule ring-1 ring-rule md:grid-cols-3">
      {phases.map((p) => (
        <li key={p.when} className="bg-surface p-6">
          <p className="font-hand text-2xl text-ink">{p.when}</p>
          <p className="mt-1.5 text-ink-soft">{p.what}</p>
        </li>
      ))}
    </ol>
  );
}

export function CoachesSection() {
  return (
    <section id="coaches" aria-labelledby="coaches-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className="max-w-2xl">
        <h2
          id="coaches-title"
          className="font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
        >
          Our coaches
        </h2>
        <p className="mt-5 text-lg text-ink-soft">
          Eight tech internships between them, at AMD, RBC, Dayforce and more. They&apos;ve been exactly where you
          are.
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
    </section>
  );
}
