import { setDemoTier } from "@/app/actions/demo-tier";
import { tierOrder, type TierId } from "@/lib/access";
import { tiers } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Development and preview only: view the app as a Free, Pro or Elite student. Floats in the corner, out of the way. */
export function DemoTierSwitcher({ tier }: { tier: TierId }) {
  return (
    <form
      action={setDemoTier}
      aria-label="Demo tier"
      className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-ink/90 py-1 pr-1 pl-3 text-xs text-white/65 shadow-[0_12px_30px_-10px_rgb(5_11_36/0.55)] backdrop-blur"
    >
      Demo
      <div className="flex rounded-full bg-white/[0.08] p-0.5">
        {tierOrder.map((id) => (
          <button
            key={id}
            type="submit"
            name="tier"
            value={id}
            aria-pressed={id === tier}
            className={cn(
              "h-7 rounded-full px-2.5 text-xs font-medium transition-colors",
              id === tier ? "bg-white text-ink" : "text-white/70 hover:text-white",
            )}
          >
            {tiers.find((t) => t.id === id)?.name}
          </button>
        ))}
      </div>
    </form>
  );
}
