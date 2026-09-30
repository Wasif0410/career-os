import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppSidebar } from "@/components/app/app-nav";
import { AppHeader } from "@/components/app/app-header";
import { appNav } from "@/components/app/nav-items";
import { canAccess } from "@/lib/access";
import { demoModeEnabled, getCurrentUser } from "@/lib/auth/current-user";

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

  return (
    <div className="flex flex-1 bg-paper">
      <AppSidebar lockedHrefs={lockedHrefs} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader user={user} lockedHrefs={lockedHrefs} demo={demoModeEnabled} />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
