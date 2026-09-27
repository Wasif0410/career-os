import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { Journey } from "@/components/landing/journey";
import { Optimizer } from "@/components/landing/optimizer";
import { CoachesSection } from "@/components/landing/coaches-section";
import { TierCards } from "@/components/pricing/tier-cards";
import { Faq, type FaqItem } from "@/components/ui/faq";
import { Reveal } from "@/components/ui/reveal";
import { ArrowGlyph } from "@/components/brand/glyphs";

const faq: FaqItem[] = [
  {
    q: "Is the coaching done by AI?",
    a: "No. Every session is with Wasif or Abishek, the two people who built Career OS.",
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

const heading = "font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Journey />

      <section aria-labelledby="tailor-title">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
          <Reveal className="max-w-2xl">
            <h2 id="tailor-title" className={heading}>
              Auto-apply, with a resume <span className="marker">tailored for every job.</span>
            </h2>
            <p className="mt-5 text-lg text-ink-soft">
              Approve the jobs you want. We rewrite your resume for each one, your coach signs off, and we send it.
            </p>
          </Reveal>
          <div className="mt-14">
            <Optimizer />
          </div>
        </div>
      </section>

      <CoachesSection />

      <section aria-labelledby="pricing-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="pricing-title" className={`max-w-xl ${heading}`}>
            Start free. Pay when you want a coach.
          </h2>
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-1.5 font-medium text-cobalt hover:text-cobalt-deep"
          >
            Compare plans
            <ArrowGlyph className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <div className="mt-12">
          <TierCards />
        </div>
      </section>

      <section aria-labelledby="faq-title" className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <h2 id="faq-title" className={heading}>
              Questions
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <Faq items={faq} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
