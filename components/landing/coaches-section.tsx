import { CoachProfile } from "@/components/coaches/coach-card";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { coaches } from "@/lib/site";

/** What happens around a session. Used on the Coaches page. */
export function SessionFlow() {
  const phases = [
    { when: "Before", what: "Your coach reads your score and your latest results." },
    { when: "During", what: "You agree on the top three gaps to close next." },
    { when: "After", what: "Your plan for the week lands in your dashboard." },
  ];
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {phases.map((p) => (
        <li key={p.when} className="rounded-3xl bg-surface p-6 ring-1 ring-rule sm:p-7">
          <p className="font-display text-2xl tracking-[-0.015em] text-ink">{p.when}</p>
          <p className="mt-1.5 text-slate">{p.what}</p>
        </li>
      ))}
    </ol>
  );
}

export function CoachesSection() {
  return (
    <Section id="coaches" labelledBy="coaches-title" tone="light" innerClassName="pt-0 md:pt-0">
      <div className="border-t border-rule pt-24 md:pt-28">
        <SectionHeading
          id="coaches-title"
          title="Coached by people"
          muted="who just did it."
          lead="We've worked at AMD, RBC, Dayforce and Achievers, landing internship after internship. Now we help you do the same."
          aside={
            <ButtonLink href="/coaches" variant="ghost" arrow>
              Meet the coaches
            </ButtonLink>
          }
        />
        <div className="mt-14 grid grid-cols-1 gap-5 md:mt-16 lg:grid-cols-2">
          {coaches.map((coach, i) => (
            <Reveal key={coach.slug} delay={0.06 + i * 0.08} className="h-full">
              <CoachProfile coach={coach} seed={301 + i * 17} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
