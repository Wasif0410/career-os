import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canAccess } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";
import { demoNextSession } from "@/lib/mock/home";
import {
  demoCurrentWeek,
  demoGaps,
  demoMonth,
  demoMonthGoals,
  demoNextWeek,
  demoPlanLength,
  demoPlanPhases,
  demoPlanWeeks,
  demoSessionNotes,
  demoStarterTasks,
} from "@/lib/mock/plan";
import { coaches } from "@/lib/site";
import { PlanView } from "./_components/plan-view";

export const metadata: Metadata = { title: "Plan" };

const toronto = { timeZone: "America/Toronto" } as const;
const sessionDay = new Intl.DateTimeFormat("en-US", { ...toronto, weekday: "short", month: "short", day: "numeric" });
const sessionTime = new Intl.DateTimeFormat("en-US", { ...toronto, hour: "numeric", minute: "2-digit" });
const monthName = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long" });

/*
 * The plan a coach writes with the student after each 1-1, as a board of this
 * week's tasks. Free students get starter steps from their score, and the
 * coach's parts say what Pro adds. Tier rules come from lib/access.ts.
 */
export default async function PlanPage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  const coached = canAccess(user, "plan");
  const phaseIndex = demoPlanPhases.findIndex((p) => demoCurrentWeek >= p.from && demoCurrentWeek <= p.to);
  const startsAt = new Date(demoNextSession.startsAt);

  return (
    <PlanView
      coached={coached}
      coach={demoSessionNotes[0].coach}
      current={demoCurrentWeek}
      length={demoPlanLength}
      phase={`Phase ${phaseIndex + 1} · ${demoPlanPhases[phaseIndex].title}`}
      weeks={coached ? demoPlanWeeks : []}
      nextWeek={demoNextWeek}
      nextSession={
        canAccess(user, "coaching.sessions")
          ? {
              day: sessionDay.format(startsAt),
              label: `${sessionDay.format(startsAt)} · ${sessionTime.format(startsAt)}`,
            }
          : undefined
      }
      starter={demoStarterTasks}
      notes={coached ? demoSessionNotes : []}
      gaps={coached ? demoGaps : []}
      month={monthName.format(new Date(`${demoMonth}-01T12:00:00Z`))}
      goals={coached ? demoMonthGoals : []}
      coaches={coaches.map((c) => ({ name: c.name, focus: c.focus }))}
      goal={user.target}
    />
  );
}
