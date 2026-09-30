import Link from "next/link";
import { Mark } from "@/components/brand/logo";
import { buttonClass } from "@/components/ui/button";
import { initials, type CurrentUser } from "@/lib/auth/user";
import { AppTabs } from "./app-nav";
import { DemoTierSwitcher } from "./demo-tier-switcher";
import { TierBadge } from "./tier-badge";

export function AppHeader({
  user,
  lockedHrefs,
  demo,
}: {
  user: CurrentUser;
  lockedHrefs: string[];
  /** Show the demo tier switcher. True until real accounts exist. */
  demo: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-surface/90 px-4 pt-3 backdrop-blur sm:px-6 md:pb-3">
      <div className="flex h-10 items-center justify-between gap-3 pb-1 md:pb-0">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-ink md:hidden">
          <Mark className="size-6" />
          <span className="sr-only sm:not-sr-only">Career OS</span>
        </Link>
        <p className="hidden truncate rounded-full bg-paper px-3 py-1 text-xs text-ink-soft ring-1 ring-rule md:block">
          Target · {user.target.role}, {user.target.season}
        </p>
        <div className="flex items-center gap-2 sm:gap-3">
          {demo && <DemoTierSwitcher tier={user.tier} />}
          <TierBadge tier={user.tier} className="hidden sm:inline-flex" />
          {user.tier === "free" && (
            <Link href="/pricing" className={buttonClass({ variant: "accent", size: "sm" })}>
              Upgrade
            </Link>
          )}
          <Link
            href="/profile"
            className="grid size-8 place-items-center rounded-full bg-cobalt text-xs font-semibold text-white"
            aria-label={`Your profile: ${user.firstName} ${user.lastName}`}
          >
            {initials(user)}
          </Link>
        </div>
      </div>
      <AppTabs lockedHrefs={lockedHrefs} />
    </header>
  );
}
