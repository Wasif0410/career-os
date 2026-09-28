import { CoachCard } from "@/components/coaches/coach-card";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
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
    <Section id="coaches" labelledBy="coaches-title">
      <SectionHeading
        id="coaches-title"
        title="Our coaches"
        lead="We've worked at AMD, RBC, Dayforce and Achievers, landing internship after internship. Now we help you do the same."
      />

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        {coaches.map((coach, i) => (
          <Reveal key={coach.slug} delay={i * 0.08} className="h-full">
            <CoachCard coach={coach} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
