import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { PageTitle } from "@/components/app/page-title";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesPage() {
  return (
    <>
      <PageTitle title="Courses" description="Short lessons on targeting, resumes and interviews." />
      <ComingSoon phase="Phase 3">The first lesson of every course is free. The rest unlock with Pro.</ComingSoon>
    </>
  );
}
