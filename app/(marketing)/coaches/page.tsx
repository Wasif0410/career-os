import type { Metadata } from "next";
import { CoachAvatar, CoachCompanies, CoachTopics } from "@/components/coaches/coach-card";
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
      <PageHeader title="Our coaches">
        We&apos;ve worked at AMD, RBC, Dayforce and Achievers, landing internship after internship. Now we help you do
        the same.
      </PageHeader>

      <div className="mx-auto max-w-6xl space-y-4 px-5 pt-14 sm:px-8 md:pt-16">
        {coaches.map((coach) => (
          <Reveal key={coach.slug}>
            <article
              id={coach.slug}
              className="grid gap-8 rounded-3xl bg-surface p-7 ring-1 ring-rule sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16"
            >
              <div>
                <CoachAvatar coach={coach} className="size-16 text-2xl" />
                <h2 className="mt-6 font-display text-[2.5rem] leading-tight tracking-[-0.02em] text-ink">
                  {coach.fullName}
                </h2>
                <p className="mt-1 font-medium text-cobalt">{coach.focus}</p>
                <CoachCompanies coach={coach} className="mt-6" />
              </div>
              <div className="flex flex-col">
                <p className="text-lead text-ink-soft">{coach.bio}</p>
                <p className="mt-8 text-sm font-medium text-ink">Coaches you on</p>
                <CoachTopics coach={coach} className="mt-3" />
                <div className="mt-auto pt-9">
                  <ButtonLink href={coach.bookingUrl ?? "#waitlist"} variant="primary" arrow>
                    {coach.bookingUrl ? `Book 15 minutes with ${coach.name}` : "Join the waitlist"}
                  </ButtonLink>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <section aria-labelledby="session-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal className="grid gap-x-16 gap-y-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
          <h2 id="session-title" className="text-display-m">
            How a session works
          </h2>
          <p className="text-lead lg:pb-1.5">Software scores your resume. Your coach decides what matters.</p>
        </Reveal>
        <Reveal className="mt-12">
          <SessionFlow />
        </Reveal>
      </section>
    </>
  );
}
