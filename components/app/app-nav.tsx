"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { LockGlyph } from "./lock-glyph";
import { accountNav, appNav } from "./nav-items";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Sidebar on desktop. `lockedHrefs` comes from the server so the tier rules stay in lib/access.ts. */
export function AppSidebar({ lockedHrefs }: { lockedHrefs: string[] }) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-rule bg-surface px-3 py-4 md:flex">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-3 text-[0.95rem] font-semibold text-ink">
        <Mark className="size-6" />
        Career OS
      </Link>
      <nav aria-label="App" className="flex flex-1 flex-col gap-0.5">
        {appNav.map(({ label, href, Glyph }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 text-[0.92rem] transition-colors",
                active ? "bg-cobalt-wash font-medium text-cobalt-deep" : "text-ink-soft hover:bg-paper",
              )}
            >
              <Glyph className="size-5" />
              <span className="flex-1">{label}</span>
              {lockedHrefs.includes(href) && <LockGlyph className="size-3.5 text-slate" label="Locked" />}
            </Link>
          );
        })}
      </nav>
      <nav aria-label="Account" className="flex flex-col gap-0.5 border-t border-rule pt-3">
        {accountNav.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={cn(
              "flex h-9 items-center rounded-lg px-3 text-sm transition-colors",
              isActive(pathname, href) ? "bg-cobalt-wash font-medium text-cobalt-deep" : "text-slate hover:bg-paper",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

/** On phones the sections scroll sideways under the header instead of taking up a sidebar. */
export function AppTabs({ lockedHrefs }: { lockedHrefs: string[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="App" className="-mx-4 overflow-x-auto px-4 md:hidden">
      <ul className="flex gap-1 pb-2">
        {appNav.map(({ label, href }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.85rem] whitespace-nowrap ring-1 ring-inset",
                  active ? "bg-ink text-white ring-ink" : "bg-surface text-ink-soft ring-rule",
                )}
              >
                {label}
                {lockedHrefs.includes(href) && <LockGlyph className="size-3" label="Locked" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
