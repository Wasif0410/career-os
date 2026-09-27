import Link from "next/link";
import { CheckGlyph } from "@/components/brand/glyphs";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";
import { tiers } from "@/lib/site";
import { cn } from "@/lib/utils";

export function TierCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {tiers.map((tier, i) => {
        const featured = tier.featured;
        return (
          <Reveal key={tier.id} delay={i * 0.07} className="h-full">
            <article
              className={cn(
                "relative flex h-full flex-col rounded-[1.4rem] p-7",
                featured ? "bg-ink text-white" : "bg-surface ring-1 ring-rule",
              )}
            >
              {featured && (
                <span className="absolute top-6 right-6 -rotate-3 rounded-md bg-marker px-2 py-0.5 font-hand text-[0.95rem] text-ink">
                  includes coaching
                </span>
              )}
              <p className={cn("eyebrow", featured && "!text-white/60")}>{tier.goal}</p>
              <h3 className="mt-2 font-display text-3xl font-bold tracking-[-0.02em]">{tier.name}</h3>
              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-bold tracking-[-0.03em]">${tier.price}</span>
                <span className={cn("text-sm", featured ? "text-white/60" : "text-slate")}>
                  {tier.price === 0 ? "forever" : "per month"}
                </span>
              </p>
              <p className={cn("mt-3 text-[0.95rem] leading-relaxed", featured ? "text-white/75" : "text-ink-soft")}>
                {tier.blurb}
              </p>
              <ul className={cn("mt-6 space-y-2.5 border-t pt-6", featured ? "border-white/15" : "border-rule")}>
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[0.93rem]">
                    <CheckGlyph
                      className={cn("mt-0.5 size-4 shrink-0", featured ? "text-marker" : "text-cobalt")}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  href="#waitlist"
                  className={buttonClass({
                    variant: featured ? "primary" : "ghost",
                    size: "lg",
                    className: cn("w-full", featured && "bg-marker text-ink shadow-none hover:bg-marker-soft"),
                  })}
                >
                  Join the waitlist
                </Link>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
