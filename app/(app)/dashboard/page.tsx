import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canAccess, limitFor } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  demoApplications,
  demoCourses,
  demoEvents,
  demoFreeEvents,
  demoNewMatchesThisWeek,
  demoNextSession,
  demoPlanWeek,
  demoReadiness,
  demoResumeHistory,
  demoStarterPlan,
  demoToday,
  demoTopMatches,
  demoWeekPlan,
} from "@/lib/mock/home";
import { demoJobMatchCount, demoResumeScore } from "@/lib/mock/student";
import { ApplicationsCard } from "./_components/applications-card";
import { CalendarRail } from "./_components/calendar-rail";
import { CoursesCard } from "./_components/courses-card";
import { Greeting } from "./_components/greeting";
import { MatchesCard } from "./_components/matches-card";
import { PlanCard } from "./_components/plan-card";
import { ResumeCard } from "./_components/resume-card";

export const metadata: Metadata = { title: "Dashboard" };

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/*
 * Home, most actionable first: the greeting and readiness badge, this week's
 * plan, applications and matches, then resume and courses, with the calendar
 * alongside.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  const coached = canAccess(user, "plan");
  const tracked = canAccess(user, "applications.tracker");

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="@container min-w-0 space-y-6">
        <Greeting
          firstName={user.firstName}
          today={demoToday}
          week={coached ? demoPlanWeek : undefined}
          readiness={demoReadiness}
        />
        <div className="pt-2">
          <PlanCard items={coached ? demoWeekPlan : demoStarterPlan} coached={coached} style={delay(0.08)} />
        </div>
        <div className="grid gap-6 @2xl:grid-cols-2">
          <ApplicationsCard data={demoApplications} locked={!tracked} style={delay(0.14)} />
          <MatchesCard
            matches={demoTopMatches.slice(0, Math.min(3, limitFor(user, "visibleJobMatches")))}
            total={demoJobMatchCount}
            newThisWeek={demoNewMatchesThisWeek}
            autoApply={canAccess(user, "applications.autoApply")}
            style={delay(0.2)}
          />
        </div>
        <div className="grid gap-6 @2xl:grid-cols-2">
          <ResumeCard user={user} score={demoResumeScore} history={demoResumeHistory} style={delay(0.26)} />
          <CoursesCard user={user} courses={demoCourses} style={delay(0.32)} />
        </div>
      </div>
      <CalendarRail
        today={demoToday}
        events={tracked ? demoEvents : demoFreeEvents}
        session={demoNextSession}
        coached={canAccess(user, "coaching.sessions")}
        style={delay(0.1)}
      />
    </div>
  );
}
