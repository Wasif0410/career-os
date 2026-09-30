import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { PageTitle } from "@/components/app/page-title";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageTitle title="Profile" description="Your target, education, skills, projects and experience." />
      <ComingSoon phase="Phase 3">View and edit everything from onboarding, plus projects and experience.</ComingSoon>
    </>
  );
}
