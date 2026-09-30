import { setDemoTier } from "@/app/actions/demo-tier";
import { tierOrder, type TierId } from "@/lib/access";
import { tiers } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Development and preview only: view the app as a Free, Pro or Elite student. */
export function DemoTierSwitcher({ tier }: { tier: TierId }) {
  return (
    <form action={setDemoTier} className="flex items-center gap-2" aria-label="Demo tier">
      <span className="hidden text-xs whitespace-nowrap text-slate lg:inline">Demo as</span>
      <div className="flex rounded-full bg-paper p-0.5 ring-1 ring-rule">
        {tierOrder.map((id) => (
          <button
            key={id}
            type="submit"
            name="tier"
            value={id}
            aria-pressed={id === tier}
            className={cn(
              "h-7 rounded-full px-2.5 text-xs font-medium transition-colors",
              id === tier ? "bg-surface text-ink shadow-sm ring-1 ring-rule" : "text-slate hover:text-ink",
            )}
          >
            {tiers.find((t) => t.id === id)?.name}
          </button>
        ))}
      </div>
    </form>
  );
}
