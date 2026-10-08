"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { LockGlyph } from "./lock-glyph";
import { appNav } from "./nav-items";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** What the sidebar shows about the signed-in student. Worked out on the server so tier rules stay in lib/access.ts. */
export type SidebarAccount = {
  initials: string;
  name: string;
  planName: string;
  /** Auto-apply credits left this month, when the plan has any. */
  credits?: { left: number; total: number };
  /** Show the upgrade card (Free). */
  upgrade: boolean;
};

/*
 * The desktop sidebar: a deep blue column like the marketing site's night
 * sections. Below 1280px it folds to icons so the page keeps its room.
 */
export function AppSidebar({ lockedHrefs, account }: { lockedHrefs: string[]; account: SidebarAccount }) {
  const pathname = usePathname();
  return (
    <aside className="deep-blue sticky top-0 isolate hidden h-dvh w-[76px] shrink-0 flex-col overflow-hidden px-3 py-5 md:flex xl:w-60">
      <Link
        href="/dashboard"
        className="mb-7 flex items-center justify-center gap-2.5 text-[0.95rem] font-semibold text-white xl:justify-start xl:px-2.5"
      >
        <Mark className="size-6" />
        <span className="hidden xl:inline">Career OS</span>
      </Link>

      <nav aria-label="App" className="flex flex-1 flex-col items-center gap-0.5 xl:items-stretch">
        {appNav.map(({ label, href, Glyph }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex size-11 items-center justify-center gap-3 rounded-xl text-[0.9rem] transition-colors xl:h-10 xl:w-auto xl:justify-start xl:px-2.5",
                active
                  ? "bg-white/10 font-medium text-white ring-1 ring-white/10 ring-inset"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <Glyph className="size-5 shrink-0" />
              <span className="sr-only xl:not-sr-only xl:flex-1">{label}</span>
              {lockedHrefs.includes(href) && (
                <LockGlyph className="hidden size-3.5 opacity-50 xl:block" label="Locked" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-3">
        {account.credits && (
          <div className="hidden rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/[0.08] ring-inset xl:block">
            <p className="text-xs text-white/60">Auto-apply credits</p>
            <p className="mt-0.5 font-mono text-sm font-medium text-white">
              {account.credits.left} of {account.credits.total} left
            </p>
            <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-cobalt-bright"
                style={{ width: `${(account.credits.left / account.credits.total) * 100}%` }}
              />
            </span>
          </div>
        )}
        {account.upgrade && (
          <div className="hidden rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/[0.08] ring-inset xl:block">
            <p className="text-xs text-white/60">{account.planName} plan</p>
            <p className="mt-0.5 text-[0.85rem] leading-snug font-medium text-white">
              Get a coach, a weekly plan and auto-apply.
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-flex h-8 items-center rounded-full bg-white px-3.5 text-[0.8rem] font-medium text-ink hover:bg-[#eef1ff]"
            >
              Upgrade
            </Link>
          </div>
        )}
        {account.upgrade && (
          <Link
            href="/pricing"
            title="Upgrade"
            className="mx-auto grid size-10 place-items-center rounded-full bg-white text-ink hover:bg-[#eef1ff] xl:hidden"
          >
            <span className="sr-only">Upgrade</span>
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
              <path
                d="M8 12.5V3.5M4 7.5l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
        <div className="flex items-center justify-center gap-2.5 border-t border-white/[0.08] pt-3.5 xl:justify-between xl:px-2.5">
          <Link
            href="/profile"
            title="Profile"
            aria-current={isActive(pathname, "/profile") ? "page" : undefined}
            className="flex min-w-0 items-center gap-2.5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cobalt text-xs font-semibold text-white">
              {account.initials}
            </span>
            <span className="hidden min-w-0 xl:block">
              <span className="block truncate text-[0.82rem] text-white">{account.name}</span>
              <span className="block text-xs text-white/55">{account.planName} plan</span>
            </span>
          </Link>
          <Link
            href="/billing"
            aria-current={isActive(pathname, "/billing") ? "page" : undefined}
            className="hidden text-xs text-white/55 hover:text-white xl:block"
          >
            Billing
          </Link>
        </div>
      </div>
    </aside>
  );
}

/** On phones the sections scroll sideways under the top bar instead of taking up a sidebar. */
export function AppTabs({ lockedHrefs }: { lockedHrefs: string[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="App" className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4 md:hidden">
      <ul className="flex gap-1 pb-2.5">
        {appNav.map(({ label, href, Glyph }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-lg px-3 text-[0.85rem] whitespace-nowrap",
                  active ? "bg-white/10 font-medium text-white ring-1 ring-white/10 ring-inset" : "text-white/60",
                )}
              >
                <Glyph className="size-4" />
                {label}
                {lockedHrefs.includes(href) && <LockGlyph className="size-3 opacity-60" label="Locked" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
