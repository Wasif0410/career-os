import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { demoApplicationsUsed, demoNextSession, demoWeekPlan } from "@/lib/mock/home";
import { demoJobMatchCount, demoNextStep, demoResumeScore } from "@/lib/mock/student";
import { ApplicationsCard, CoachingCard, JobsCard, PlanCard, ResumeCard } from "./_components/home-cards";
import { HomeHero } from "./_components/home-hero";

export const metadata: Metadata = { title: "Dashboard" };

/*
 * Home: a welcome with the one next step, then the cards: resume and jobs on
 * top, coaching, plan and applications below.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  return (
    <div className="space-y-5">
      <HomeHero user={user} nextStep={demoNextStep} />
      <div className="grid gap-5 lg:grid-cols-3">
        <ResumeCard user={user} score={demoResumeScore} className="lg:col-span-2" />
        <JobsCard user={user} count={demoJobMatchCount} />
        <CoachingCard user={user} session={demoNextSession} />
        <PlanCard user={user} items={demoWeekPlan} />
        <ApplicationsCard user={user} used={demoApplicationsUsed} />
      </div>
    </div>
  );
}
