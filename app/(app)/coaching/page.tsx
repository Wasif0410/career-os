import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { PageTitle } from "@/components/app/page-title";

export const metadata: Metadata = { title: "Coaching" };

export default function CoachingPage() {
  return (
    <>
      <PageTitle title="Coaching" description="Book sessions with Wasif or Abishek." />
      <ComingSoon phase="Phase 5">
        Book 1-1 sessions, see upcoming and past sessions, and read the notes from each one.
      </ComingSoon>
    </>
  );
}
