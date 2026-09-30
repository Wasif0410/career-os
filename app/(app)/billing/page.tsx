import type { Metadata } from "next";
import { ComingSoon } from "@/components/app/coming-soon";
import { PageTitle } from "@/components/app/page-title";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <>
      <PageTitle title="Billing" description="Your plan and what's left this month." />
      <ComingSoon phase="Phase 4">
        Your plan, credits left this month and a link to manage your subscription.
      </ComingSoon>
    </>
  );
}
