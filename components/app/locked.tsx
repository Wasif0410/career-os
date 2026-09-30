import Link from "next/link";
import { canAccess, requiredTier, type Feature } from "@/lib/access";
import type { CurrentUser } from "@/lib/auth/user";
import { tiers } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LockGlyph } from "./lock-glyph";

/**
 * Shows `children` when the user's tier includes `feature`. Otherwise shows a
 * blurred preview with an "Unlock with Pro" link to /pricing. Every paywall in
 * the app goes through this, so the tier rules only live in lib/access.ts.
 */
export function Locked({
  user,
  feature,
  children,
  preview,
  className,
}: {
  user: Pick<CurrentUser, "tier">;
  feature: Feature;
  children: React.ReactNode;
  /** What to blur behind the lock. Defaults to `children`; pass example content if the real thing shouldn't reach the page. */
  preview?: React.ReactNode;
  className?: string;
}) {
  if (canAccess(user, feature)) return <>{children}</>;

  const tier = tiers.find((t) => t.id === requiredTier(feature));
  return (
    <div className={cn("relative isolate overflow-hidden rounded-xl", className)}>
      <div aria-hidden inert className="pointer-events-none blur-[5px] select-none">
        {preview ?? children}
      </div>
      <div className="absolute inset-0 grid place-items-center bg-surface/55 p-4">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-[0_8px_24px_-12px_rgb(10_20_51/0.6)] hover:bg-ink-soft"
        >
          <LockGlyph className="size-3.5" />
          Unlock with {tier?.name ?? "Pro"}
        </Link>
      </div>
    </div>
  );
}
