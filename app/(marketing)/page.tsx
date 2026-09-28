import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Statement } from "@/components/landing/statement";
import { Journey } from "@/components/landing/journey";
import { Coaching } from "@/components/landing/coaching";
import { AutoApply } from "@/components/landing/auto-apply";
import { CoachesSection } from "@/components/landing/coaches-section";
import { TierCards } from "@/components/pricing/tier-cards";
import { Faq, type FaqItem } from "@/components/ui/faq";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowGlyph } from "@/components/brand/glyphs";

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
 *   Deep blue: pricing.
 *   Light:     questions.
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

      <Section id="pricing" labelledBy="pricing-title" tone="dark">
        <SectionHeading
          id="pricing-title"
          title="Start free."
          muted="Upgrade for a coach."
          dark
          aside={
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-1.5 font-medium text-sky transition-colors hover:text-white"
            >
              Compare plans
              <ArrowGlyph className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />
        <div className="mt-14 md:mt-16">
          <TierCards tone="dark" />
        </div>
      </Section>

      <Section id="faq" labelledBy="faq-title" tone="light">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <SectionHeading id="faq-title" title="Questions," muted="answered." stacked className="lg:self-start" />
          <Reveal delay={0.08}>
            <Faq items={faq} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
