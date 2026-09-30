import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { PageTitle } from "@/components/app/page-title";

export const metadata: Metadata = { title: "Plan" };

export default function PlanPage() {
  return (
    <>
      <PageTitle title="Plan" description="What to do this week and this month." />
      <ComingSoon phase="Phase 5">Your coach writes this after each session. Tick items off as you go.</ComingSoon>
    </>
  );
}
