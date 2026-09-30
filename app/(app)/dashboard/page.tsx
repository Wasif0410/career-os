import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatGlyph, ImproveGlyph, TrackGlyph } from "@/components/brand/glyphs";
import { Card, CardTitle } from "@/components/app/card";
import { Locked } from "@/components/app/locked";
import { PageTitle } from "@/components/app/page-title";
import { ScoreRing } from "@/components/app/score-ring";
import { buttonClass } from "@/components/ui/button";
import { limitFor, type Feature, type TierId } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";
import { demoJobMatchCount, demoNextStep, demoResumeScore } from "@/lib/mock/student";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  const score = demoResumeScore;
  const [topFix, ...otherFixes] = score.fixes;
  const applications = limitFor(user, "applicationsPerMonth");
  const sessions = limitFor(user, "coachingSessionsPerMonth");

  return (
    <>
      <PageTitle
        title={`Good to see you, ${user.firstName}`}
        description={`Here's where your search for a ${user.target.role.toLowerCase()}, ${user.target.season}, stands.`}
      />

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        <Card className="lg:col-span-2">
          <CardTitle
            eyebrow="Resume"
            action={
              <Link href="/resume" className="text-sm font-medium text-cobalt hover:text-cobalt-deep">
                Full report
              </Link>
            }
          >
            Your resume score
          </CardTitle>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <ScoreRing value={score.overall} label="Resume score" />
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-medium tracking-wide text-slate uppercase">Fix this first</p>
              <p className="text-ink">{topFix}</p>
              <Locked user={user} feature="resume.fullReport" className="mt-5">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {score.categories.map((c) => (
                    <div key={c.label}>
                      <dt className="flex justify-between text-sm text-ink-soft">
                        {c.label}
                        <span className="font-medium text-ink tabular-nums">{c.score}</span>
                      </dt>
                      <dd className="mt-1 h-1.5 rounded-full bg-paper-deep">
                        <div className="h-full rounded-full bg-cobalt" style={{ width: `${c.score}%` }} />
                      </dd>
                    </div>
                  ))}
                </dl>
                <ol className="mt-5 list-decimal space-y-1.5 pl-5 text-sm text-ink-soft marker:text-slate">
                  {otherFixes.map((fix) => (
                    <li key={fix}>{fix}</li>
                  ))}
                </ol>
              </Locked>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardTitle eyebrow="Next step">{demoNextStep.title}</CardTitle>
          <p className="flex-1 text-sm text-ink-soft">{demoNextStep.body}</p>
          <Link
            href={demoNextStep.href}
            className={buttonClass({ variant: "primary", size: "sm", className: "mt-5 self-start" })}
          >
            {demoNextStep.cta}
          </Link>
        </Card>

        <Card>
          <CardTitle eyebrow="Jobs">{demoJobMatchCount} jobs match you</CardTitle>
          <p className="text-sm text-ink-soft">
            {Number.isFinite(limitFor(user, "visibleJobMatches"))
              ? `See your top ${limitFor(user, "visibleJobMatches")} now. Upgrade to see every match and why it fits.`
              : "Every match comes with a fit score and what's missing."}
          </p>
          <Link href="/jobs" className="mt-4 inline-block text-sm font-medium text-cobalt hover:text-cobalt-deep">
            View matches
          </Link>
        </Card>

        <FeatureCard
          user={user}
          feature="coaching.sessions"
          Glyph={ChatGlyph}
          eyebrow="Coaching"
          title="Your next session"
          body={
            sessions > 0
              ? `You have ${sessions} session${sessions === 1 ? "" : "s"} a month. Book one with Wasif or Abishek.`
              : ""
          }
          href="/coaching"
          cta="Book a session"
        />

        <FeatureCard
          user={user}
          feature="plan"
          Glyph={ImproveGlyph}
          eyebrow="Plan"
          title="This week's plan"
          body="Your coach writes your plan after each session. It shows up here."
          href="/plan"
          cta="Open your plan"
        />

        <FeatureCard
          user={user}
          feature="applications.tracker"
          Glyph={TrackGlyph}
          eyebrow="Applications"
          title="Application tracker"
          body={`0 of ${applications} applications used this month.`}
          href="/applications"
          cta="Open tracker"
          className="lg:col-span-3"
        />
      </div>
    </>
  );
}

function FeatureCard({
  user,
  feature,
  Glyph,
  eyebrow,
  title,
  body,
  href,
  cta,
  className,
}: {
  user: { tier: TierId };
  feature: Feature;
  Glyph: (props: { className?: string }) => React.ReactElement;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  className?: string;
}) {
  const content = (
    <>
      <p className="text-sm text-ink-soft">{body || "Included with Pro."}</p>
      <Link href={href} className="mt-4 inline-block text-sm font-medium text-cobalt hover:text-cobalt-deep">
        {cta}
      </Link>
    </>
  );
  return (
    <Card className={className}>
      <CardTitle eyebrow={eyebrow} action={<Glyph className="size-5 text-slate" />}>
        {title}
      </CardTitle>
      <Locked
        user={user}
        feature={feature}
        preview={
          <p className="text-sm text-ink-soft">
            Example content for {title.toLowerCase()} lives here once it&apos;s unlocked.
          </p>
        }
      >
        {content}
      </Locked>
    </Card>
  );
}
