import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { PageTitle } from "@/components/app/page-title";

export const metadata: Metadata = { title: "Jobs" };

export default function JobsPage() {
  return (
    <>
      <PageTitle title="Jobs" description="Roles that fit your target, ranked by fit." />
      <ComingSoon phase="Phase 3">
        Your job matches, with a fit score, why they match and what&apos;s missing.
      </ComingSoon>
    </>
  );
}
