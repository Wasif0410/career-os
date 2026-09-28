import type { Metadata } from "next";
import { CoachPortrait, CoachTopics } from "@/components/coaches/coach-card";
import { SessionFlow } from "@/components/landing/coaches-section";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { coaches } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coaches",
  description:
    "Meet the Career OS coaches, Wasif Saeed and Abishek Naathan. Between them: AMD, RBC, Dayforce, Achievers and more.",
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
        We&apos;ve worked at AMD, RBC, Dayforce and Achievers, landing internship after internship. Now we help you do
        the same.
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-5 px-5 sm:px-8">
        {coaches.map((coach, i) => (
          <Reveal key={coach.slug}>
            <article
              id={coach.slug}
              className="grid overflow-hidden rounded-[1.75rem] bg-surface ring-1 ring-rule md:grid-cols-2"
            >
              <CoachPortrait coach={coach} className={i % 2 ? "md:order-2 md:aspect-auto" : "md:aspect-auto"} />
              <div className="flex flex-col p-7 sm:p-10">
                <p className="text-sm font-medium text-cobalt">{coach.focus}</p>
                <h2 className="mt-1 font-display text-4xl font-bold tracking-[-0.025em]">{coach.fullName}</h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{coach.bio}</p>
                <CoachTopics coach={coach} className="mt-6" />
                <div className="mt-auto pt-9">
                  <ButtonLink href={coach.bookingUrl ?? "#waitlist"} variant="ink" arrow>
                    {coach.bookingUrl ? `Book 15 minutes with ${coach.name}` : "Join the waitlist"}
                  </ButtonLink>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <section aria-labelledby="session-title" className="mx-auto max-w-6xl px-5 py-28 sm:px-8 md:py-36">
        <Reveal className="max-w-2xl">
          <h2
            id="session-title"
            className="text-display-m"
          >
            How a session works
          </h2>
          <p className="text-lead mt-5">
            Software scores your resume. Your coach decides what matters.
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <SessionFlow />
        </Reveal>
      </section>
    </>
  );
}
