import Link from "next/link";
import { CheckGlyph } from "@/components/brand/glyphs";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";
import { tiers } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The three plans. The featured plan always stands apart from the page it sits on:
 * deep blue on a light page, white on a deep blue one.
 */
export function TierCards({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {tiers.map((tier, i) => {
        const featured = !!tier.featured;
        // "inverse" cards are the dark ones: every plan on a dark page except the featured one, and vice versa.
        const inverse = dark !== featured;
        return (
          <Reveal key={tier.id} delay={i * 0.07} className="h-full">
            <article
              className={cn(
                "relative flex h-full flex-col rounded-3xl p-7 sm:p-8",
                featured &&
                  !dark &&
                  "deep-blue shadow-[0_40px_90px_-40px_rgb(36_71_245/0.75)] ring-1 ring-cobalt-bright/30",
                featured && dark && "bg-surface text-ink shadow-[0_40px_100px_-40px_rgb(93_123_255/0.6)]",
                !featured && !dark && "bg-surface ring-1 ring-rule",
                !featured && dark && "bg-white/[0.035] text-white ring-1 ring-white/10",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-[1.75rem] leading-none tracking-[-0.02em]">{tier.name}</h3>
                {featured && (
                  <span className="rounded-full bg-cobalt px-2.5 py-1 text-xs font-medium text-white">
                    Includes coaching
                  </span>
                )}
              </div>
              <p className={cn("mt-2 text-sm", inverse ? "text-white/55" : "text-slate")}>{tier.goal}</p>

              <p className="mt-7 flex items-baseline gap-1.5">
                <span className="font-display text-[3.5rem] leading-none tracking-[-0.03em]">${tier.price}</span>
                <span className={cn("text-sm", inverse ? "text-white/55" : "text-slate")}>
                  {tier.price === 0 ? "forever" : "per month"}
                </span>
              </p>
              <p className={cn("mt-4 text-[0.95rem] leading-relaxed", inverse ? "text-white/65" : "text-slate")}>
                {tier.blurb}
              </p>

              <ul className={cn("mt-6 space-y-2.5 border-t pt-6", inverse ? "border-white/10" : "border-rule")}>
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className={cn("flex gap-2.5 text-[0.93rem]", inverse ? "text-white/85" : "text-ink-soft")}
                  >
                    <CheckGlyph className={cn("mt-0.5 size-4 shrink-0", inverse ? "text-sky" : "text-cobalt")} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Link
                  href="#waitlist"
                  className={buttonClass({
                    variant: featured ? (dark ? "accent" : "light") : dark ? "outline" : "ghost",
                    size: "lg",
                    className: "w-full",
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
