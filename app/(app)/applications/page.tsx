import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { PageTitle } from "@/components/app/page-title";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <>
      <PageTitle title="Applications" description="Every application and where it stands." />
      <ComingSoon phase="Phase 5">
        Track every application by status, with the ones that need you at the top.
      </ComingSoon>
    </>
  );
}
