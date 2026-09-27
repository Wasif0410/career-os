import type { Metadata } from "next";
import { CoachPortrait, Experience } from "@/components/coaches/coach-card";
import { SessionFlow } from "@/components/landing/coaches-section";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { coaches } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coaches",
  description:
    "Meet the Career OS coaches, Wasif Saeed and Abishek Naathan: eight tech internships between them, at AMD, RBC, Dayforce and more.",
  alternates: { canonical: "/coaches" },
};

export default function CoachesPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            Our <span className="marker">coaches</span>
          </>
        }
      >
        Eight tech internships between them. They&apos;ve been exactly where you are, and they built Career OS to get you
        there faster.
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-5 px-5 sm:px-8">
        {coaches.map((coach, i) => (
          <Reveal key={coach.slug}>
            <article
              id={coach.slug}
              className="grid gap-8 rounded-[1.6rem] bg-surface p-3 ring-1 ring-rule md:grid-cols-[0.9fr_1.1fr] md:gap-12"
            >
              <CoachPortrait coach={coach} className={i % 2 ? "md:order-2" : undefined} />
              <div className="flex flex-col px-3 pb-5 md:py-6 md:pr-8">
                <h2 className="font-display text-4xl font-bold tracking-[-0.025em]">{coach.fullName}</h2>
                <p className="mt-1 text-slate">{coach.program}</p>
                <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">{coach.bio}</p>
                <p className="mt-3 text-ink-soft">{coach.builds}</p>

                <Experience coach={coach} className="mt-6" />

                {coach.highlights.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {coach.highlights.map((h) => (
                      <li key={h} className="rounded-full bg-paper px-3 py-1 text-sm ring-1 ring-rule">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${coach.name} coaches you on`}>
                  {coach.coaches.map((topic) => (
                    <li key={topic} className="rounded-full bg-marker-soft px-3 py-1 text-sm text-ink">
                      {topic}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <ButtonLink href={coach.bookingUrl ?? "#waitlist"} variant="ink" arrow>
                    {coach.bookingUrl ? `Book 15 minutes with ${coach.name}` : "Join the waitlist"}
                  </ButtonLink>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <section aria-labelledby="session-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal className="max-w-2xl">
          <h2
            id="session-title"
            className="font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
          >
            Sessions start where your data ends.
          </h2>
          <p className="mt-5 text-lg text-ink-soft">Software scores your resume. Your coach decides what matters.</p>
        </Reveal>
        <Reveal className="mt-10">
          <SessionFlow />
        </Reveal>
      </section>
    </>
  );
}
