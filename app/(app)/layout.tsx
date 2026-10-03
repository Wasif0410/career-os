import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppSidebar, type SidebarAccount } from "@/components/app/app-nav";
import { AppHeader } from "@/components/app/app-header";
import { DemoTierSwitcher } from "@/components/app/demo-tier-switcher";
import { appNav } from "@/components/app/nav-items";
import { canAccess, limitFor } from "@/lib/access";
import { demoModeEnabled, getCurrentUser } from "@/lib/auth/current-user";
import { initials } from "@/lib/auth/user";
import { demoApplicationsUsed } from "@/lib/mock/home";
import { tiers } from "@/lib/site";

/*
 * The student app. It shares the root layout (fonts, tokens) with the
 * marketing site and nothing else: no marketing header, footer or effects, and
 * nothing on the marketing site links here yet.
 */

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Career OS" },
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  // Until auth exists there is no one to sign in, so the app is hidden in production.
  // With auth, this becomes redirect("/login").
  if (!user) notFound();

  const lockedHrefs = appNav.filter((item) => item.feature && !canAccess(user, item.feature)).map((item) => item.href);
  // Anyone without the paid plan's core features gets the upgrade prompts.
  const upgrade = !canAccess(user, "plan");
  const creditsTotal = limitFor(user, "applicationsPerMonth");
  const account: SidebarAccount = {
    initials: initials(user),
    name: `${user.firstName} ${user.lastName}`,
    planName: tiers.find((t) => t.id === user.tier)?.name ?? user.tier,
    credits:
      creditsTotal > 0 ? { left: Math.max(0, creditsTotal - demoApplicationsUsed), total: creditsTotal } : undefined,
    upgrade,
  };

  return (
    <div className="flex flex-1 bg-paper">
      <AppSidebar lockedHrefs={lockedHrefs} account={account} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader user={user} lockedHrefs={lockedHrefs} upgrade={upgrade} />
        <main id="main" className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-6 sm:px-8 sm:py-9 xl:px-10">
          {children}
        </main>
      </div>
      {demoModeEnabled && <DemoTierSwitcher tier={user.tier} />}
    </div>
  );
}
