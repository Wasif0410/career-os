import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { Loop } from "@/components/landing/loop";
import { CoachesSection } from "@/components/landing/coaches-section";
import { Relevance } from "@/components/landing/relevance";
import { TierCards } from "@/components/pricing/tier-cards";
import { Faq, type FaqItem } from "@/components/ui/faq";
import { Reveal } from "@/components/ui/reveal";
import { ArrowGlyph } from "@/components/brand/glyphs";

const faq: FaqItem[] = [
  {
    q: "Is the coaching done by AI?",
    a: "No. Every coaching session is with Wasif or Abishek, the two people who built Career OS. Software handles the scoring, matching and tracking so your session time goes to decisions.",
  },
  {
    q: "Will auto-apply get me flagged or look like spam?",
    a: "Career OS only applies to jobs you approve, each with a fit score and a reason. Monthly credits keep the volume low on purpose, and we check each job platform's terms before automating anything on it.",
  },
  {
    q: "Who can see my resume?",
    a: "You and your coaches. Resumes are stored privately and every account can only read its own data.",
  },
  {
    q: "What do I get for free?",
    a: "Your resume score out of 100 with the most important fix, the first lesson of every course, and a preview of how many jobs match your target.",
  },
  {
    q: "Who is Career OS for?",
    a: "CS and software engineering students, internship seekers, new grads, and early-career candidates in software, AI/ML and data.",
  },
  {
    q: "When can I start?",
    a: "We're letting students in a group at a time. Join the waitlist and we'll email you when your spot opens.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Loop />
      <CoachesSection />
      <Relevance />

      <section aria-labelledby="pricing-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">Pricing</p>
            <h2
              id="pricing-title"
              className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
            >
              Start free. Pay when you want a coach.
            </h2>
          </div>
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-1.5 font-medium text-cobalt hover:text-cobalt-deep"
          >
            Compare every feature
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
            <p className="eyebrow">Questions</p>
            <h2
              id="faq-title"
              className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
            >
              What students ask us first.
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
