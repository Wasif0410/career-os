import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { demoApplicationsUsed, demoNextSession, demoWeekPlan } from "@/lib/mock/home";
import { demoJobMatchCount, demoNextStep, demoResumeScore } from "@/lib/mock/student";
import { ApplicationsCard, CoachingCard, GroupTitle, JobsCard, PlanCard, ResumeCard } from "./_components/home-cards";
import { HomeHero } from "./_components/home-hero";

export const metadata: Metadata = { title: "Dashboard" };

/*
 * Home: a welcome with the one next step, then two groups of cards. Where the
 * student stands (resume, jobs), and their coaching and applications.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  return (
    <div className="space-y-12 sm:space-y-14">
      <HomeHero user={user} nextStep={demoNextStep} />

      <section aria-labelledby="standing-title">
        <GroupTitle id="standing-title">Where you stand</GroupTitle>
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <ResumeCard user={user} score={demoResumeScore} className="lg:col-span-2" />
          <JobsCard user={user} count={demoJobMatchCount} />
        </div>
      </section>

      <section aria-labelledby="coaching-title">
        <GroupTitle id="coaching-title">Coaching and applications</GroupTitle>
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          <CoachingCard user={user} session={demoNextSession} />
          <PlanCard user={user} items={demoWeekPlan} />
          <ApplicationsCard user={user} used={demoApplicationsUsed} />
        </div>
      </section>
    </div>
  );
}
