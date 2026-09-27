import type { Metadata } from "next";
import { CoachPortrait } from "@/components/coaches/coach-card";
import { SessionFlow } from "@/components/landing/coaches-section";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { coaches } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coaches",
  description:
    "Career OS coaching is 1-1 with Wasif and Abishek, the two people who built it. Meet them and see how a session works.",
  alternates: { canonical: "/coaches" },
};

export default function CoachesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The coaches"
        title={
          <>
            Two people. <span className="marker">Real</span> advice.
          </>
        }
      >
        Career OS coaching isn&apos;t a chatbot. It&apos;s 1-1 time with the two people who built the product, prepared
        from your score, your plan and your application results.
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
                <p className="font-mono text-[0.7rem] tracking-wide text-slate uppercase">{coach.role}</p>
                <h2 className="mt-2 font-display text-4xl font-bold tracking-[-0.025em]">{coach.name}</h2>
                <p className="mt-2 text-ink-soft">{coach.builds}</p>
                <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">{coach.bio}</p>

                {coach.highlights.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {coach.highlights.map((h) => (
                      <li key={h} className="rounded-full bg-paper px-3 py-1 text-sm ring-1 ring-rule">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="eyebrow mt-7">Coaches you on</p>
                <ul className="mt-2 flex flex-wrap gap-2">
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
          <p className="eyebrow">How a session works</p>
          <h2
            id="session-title"
            className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
          >
            Sessions start where your data ends.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Software can score a resume and track an application. It can&apos;t tell you which of ten fixes matters for
            the role you want, or when a plan has stopped working. That&apos;s what the sessions are for.
          </p>
        </Reveal>
        <Reveal className="mt-10">
          <SessionFlow />
        </Reveal>
      </section>
    </>
  );
}
