import Link from "next/link";
import { Mark } from "@/components/brand/logo";
import { initials, type CurrentUser } from "@/lib/auth/user";
import { AppTabs } from "./app-nav";

/*
 * The phone top bar: logo, Upgrade on Free and the profile, with the sections
 * scrolling underneath. On wider screens the sidebar carries all of this.
 */
export function AppHeader({
  user,
  lockedHrefs,
  upgrade,
}: {
  user: CurrentUser;
  lockedHrefs: string[];
  /** Show the Upgrade button (Free). Decided on the server from lib/access.ts. */
  upgrade: boolean;
}) {
  return (
    <header className="deep-blue sticky top-0 z-30 px-4 pt-3 md:hidden">
      <div className="flex h-10 items-center justify-between gap-3 pb-2">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
          <Mark className="size-6" />
          Career OS
        </Link>
        <div className="flex items-center gap-2">
          {upgrade && (
            <Link
              href="/pricing"
              className="inline-flex h-8 items-center rounded-full bg-white px-3.5 text-[0.8rem] font-medium text-ink"
            >
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
