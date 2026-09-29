import { Optimizer } from "@/components/landing/optimizer";
import { ScrollTilt } from "@/components/ui/scroll-tilt";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const facts = [
  { title: "Only jobs that fit", body: "Every match comes with a fit score and a reason." },
  { title: "Nothing sent without you", body: "You approve each job before we apply." },
  { title: "Every application tracked", body: "Applied, OA, interview and offer, updated for you." },
];

/** The key moment of the page, set on the full-width deep blue band. */
export function AutoApply() {
  return (
    <Section id="auto-apply" labelledBy="auto-apply-title" tone="dark">
      <SectionHeading
        id="auto-apply-title"
        title="Auto-apply,"
        muted="tailored to every job."
        lead="Approve the jobs you want. We tailor your resume for each one, your coach signs off, and we apply."
        dark
        center
      />

      <ScrollTilt className="mt-14 md:mt-16">
        <Optimizer />
      </ScrollTilt>

      <Reveal>
        <ul className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {facts.map((f) => (
            <li key={f.title} className="border-t border-white/12 pt-6">
              <p className="flex items-center gap-2.5 font-display text-2xl tracking-[-0.015em] text-white">
                <span aria-hidden className="size-1.5 rounded-full bg-cobalt-bright" />
                {f.title}
              </p>
              <p className="mt-1.5 text-white/60">{f.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
