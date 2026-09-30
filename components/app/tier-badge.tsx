import type { TierId } from "@/lib/access";
import { tiers } from "@/lib/site";
import { cn } from "@/lib/utils";

const styles: Record<TierId, string> = {
  free: "bg-paper text-ink-soft ring-rule-strong",
  pro: "bg-cobalt-wash text-cobalt-deep ring-cobalt/25",
  elite: "bg-ink text-white ring-ink",
};

export function TierBadge({ tier, className }: { tier: TierId; className?: string }) {
  const name = tiers.find((t) => t.id === tier)?.name ?? tier;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ring-1 ring-inset",
        styles[tier],
        className,
      )}
    >
      {name}
    </span>
  );
}
