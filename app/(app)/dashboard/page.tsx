import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canAccess, limitFor } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";
import {
  demoApplications,
  demoCourses,
  demoEvents,
  demoFreeEvents,
  demoPlanWeek,
  demoReadiness,
  demoResumeHistory,
  demoResumeHistoryDates,
  demoStarterPlan,
  demoToday,
  demoTopMatches,
  demoWeekPlan,
} from "@/lib/mock/home";
import { demoJobMatchCount, demoResumeScore } from "@/lib/mock/student";
import { CalendarRail } from "./_components/calendar-rail";
import { Greeting } from "./_components/greeting";
import { MatchesPanel } from "./_components/matches-panel";
import { ApplicationsTile, CoursesTile, ReadinessTile, ResumeTile } from "./_components/tiles";
import { WeekList } from "./_components/week-list";

export const metadata: Metadata = { title: "Dashboard" };

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/*
 * Home, laid out like a bento board: the greeting, four stat tiles
 * (applications, resume, readiness, courses), then this week's plan beside the
 * top matches, with the calendar and what's coming up on the right.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  const coached = canAccess(user, "plan");
  const tracked = canAccess(user, "applications.tracker");

  return (
    <div className="grid gap-8 xl:mr-[max(0px,calc(400px_-_(100vw_-_1720px)_/_2))]">
      <div className="@container min-w-0 space-y-6">
        <Greeting firstName={user.firstName} today={demoToday} week={coached ? demoPlanWeek : undefined} />

        <div className="grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-5">
          <div className="@4xl:col-span-2">
            <ApplicationsTile
              stages={[
                { label: "Applied", count: demoApplications.applied.count },
                { label: "In review", count: demoApplications.in_review.count },
                { label: "OA", count: demoApplications.oa.count },
                { label: "Interview", count: demoApplications.interview.count },
                { label: "Offer", count: demoApplications.offer.count },
              ]}
              locked={!tracked}
              style={delay(0.06)}
            />
          </div>
          <div className="@4xl:col-span-3">
            <ResumeTile
              score={demoResumeScore}
              history={demoResumeHistory}
              dates={demoResumeHistoryDates}
              style={delay(0.12)}
            />
          </div>
          <div className="@4xl:col-span-3">
            <ReadinessTile readiness={demoReadiness} style={delay(0.18)} />
          </div>
          <div className="@4xl:col-span-2">
            <CoursesTile courses={demoCourses} allLessons={canAccess(user, "courses.allLessons")} style={delay(0.24)} />
          </div>
        </div>

        <div className="grid gap-5 @4xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <WeekList items={coached ? demoWeekPlan : demoStarterPlan} coached={coached} style={delay(0.3)} />
          <MatchesPanel
            matches={demoTopMatches.slice(0, Math.min(3, limitFor(user, "visibleJobMatches")))}
            total={demoJobMatchCount}
            autoApply={canAccess(user, "applications.autoApply")}
            style={delay(0.36)}
          />
        </div>
      </div>
      <CalendarRail
        today={demoToday}
        events={tracked ? demoEvents : demoFreeEvents}
        coached={canAccess(user, "coaching.sessions")}
        style={delay(0.12)}
      />
    </div>
  );
}
