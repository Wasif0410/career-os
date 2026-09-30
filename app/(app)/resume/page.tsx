import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { PageTitle } from "@/components/app/page-title";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <>
      <PageTitle title="Resume" description="Upload your resume and get it scored." />
      <ComingSoon phase="Phase 3">
        Upload a PDF and get a score out of 100, category scores and a ranked list of fixes.
      </ComingSoon>
    </>
  );
}
