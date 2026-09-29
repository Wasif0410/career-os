import { Hero } from "@/components/landing/hero";
import { Statement } from "@/components/landing/statement";
import { Journey } from "@/components/landing/journey";
import { Coaching } from "@/components/landing/coaching";
import { AutoApply } from "@/components/landing/auto-apply";
import { CoachesSection } from "@/components/landing/coaches-section";
import { Faq, type FaqItem } from "@/components/ui/faq";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

const faq: FaqItem[] = [
  {
    q: "Is the coaching done by AI?",
    a: "No. Every session is 1-1 with one of our coaches, the two people who built Career OS.",
  },
  {
    q: "I'm starting from zero. Is that okay?",
    a: "Yes. Your coach helps you set up your GitHub, build your first projects and write your resume from scratch.",
  },
  {
    q: "Will auto-apply look like spam?",
    a: "No. We only apply to jobs you approve, and monthly credits keep the volume low on purpose.",
  },
  {
    q: "Who can see my resume?",
    a: "Only you and your coaches.",
  },
  {
    q: "What's free?",
    a: "Your resume score with its most important fix, the first lesson of every course, and a preview of your job matches.",
  },
];

/*
 * The page alternates between deep blue (under a starfield) and light, one
 * idea per chapter:
 *   Deep blue: the promise, the product and the manifesto.
 *   Light:     how we guide you, as cards that stack while you scroll.
 *   Deep blue: auto-apply, the software doing the busywork.
 *   Light:     the people. Coaching from the ground up, and your coaches.
 *   Light:     questions (pricing lives on its own page).
 *   Deep blue: the close, running into the footer.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Statement />
      <Journey />
      <AutoApply />
      <Coaching />
      <CoachesSection />

      <Section id="faq" labelledBy="faq-title" tone="light" innerClassName="pt-0 md:pt-0">
        <div className="grid gap-10 border-t border-rule pt-24 md:pt-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHeading id="faq-title" title="Questions," muted="answered." stacked className="lg:self-start" />
          <Reveal delay={0.08}>
            <Faq items={faq} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
