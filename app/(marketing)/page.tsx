import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { Journey } from "@/components/landing/journey";
import { GroundUp } from "@/components/landing/ground-up";
import { Optimizer } from "@/components/landing/optimizer";
import { Tracker } from "@/components/landing/tracker";
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

// Sections alternate paper and surface backgrounds so each one reads as its own band.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Journey />
      <GroundUp />

      <Section labelledBy="tailor-title" tone="surface">
        <SectionHeading
          id="tailor-title"
          title={
            <>
              Auto-apply, with a resume <span className="marker">tailored to every job</span>
            </>
          }
          lead="Approve the jobs you want. We tailor your resume for each one, your coach signs off, we apply, and we track every application."
        />
        <Reveal className="mt-16">
          <Optimizer />
        </Reveal>
        <Reveal className="mt-6">
          <Tracker />
        </Reveal>
      </Section>

      <CoachesSection />

      <Section labelledBy="pricing-title" tone="surface">
        <SectionHeading
          id="pricing-title"
          title="Start free. Upgrade when you want a coach."
          lead={
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-1.5 font-medium text-cobalt hover:text-cobalt-deep"
            >
              Compare plans
              <ArrowGlyph className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />
        <div className="mt-16">
          <TierCards tone="surface" />
        </div>
      </Section>

      <Section labelledBy="faq-title">
        <div className="mx-auto max-w-3xl">
          <SectionHeading id="faq-title" title="Questions" />
          <Reveal delay={0.08} className="mt-12">
            <Faq items={faq} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
