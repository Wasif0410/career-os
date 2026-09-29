import type { CSSProperties } from "react";
import Image from "next/image";
import { Starfield } from "@/components/brand/starfield";
import { Dashboard } from "@/components/landing/dashboard";
import { ScrollTilt } from "@/components/ui/scroll-tilt";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { coachCompanies } from "@/lib/site";
import { cn } from "@/lib/utils";

const words = ["Land", "the", "role", "you're", "actually", "aiming", "for."];
// "actually" carries the italic accent.
const accent = 4;
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** Deep blue from the top of the page to the logo strip; the product window floats in the middle. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="deep-blue relative isolate -mt-16 overflow-hidden">
      <Starfield seed={11} count={120} />
      {/* One soft cobalt light behind the product window. */}
      <div
        aria-hidden
        className="absolute top-[44%] left-1/2 -z-10 h-[36rem] w-[64rem] max-w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(36_71_245/0.38),transparent)]"
      />

      <div className="mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-36 md:pt-44">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <h1 id="hero-title" className="text-display-xl max-w-[11ch] text-white">
            {words.map((w, i) => (
              <span key={w}>
                <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span className="anim-rise inline-block" style={delay(0.04 + i * 0.05)}>
                    {i === accent ? <em className="pr-[0.04em] text-sky">{w}</em> : w}
                  </span>
                </span>
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <div className="anim-fade-up lg:pb-2" style={delay(0.35)}>
            <p className="text-lead max-w-[30rem] text-white/65">
              A coach who&apos;s landed the internships guides you every week. We apply to the right jobs for you.
            </p>
            <WaitlistForm source="hero" tone="dark" className="mt-6 max-w-[30rem]" />
          </div>
        </div>

        <div className="anim-fade-up mt-10 sm:mt-14 md:mt-20" style={delay(0.5)}>
          <ScrollTilt from={10}>
            <Dashboard />
          </ScrollTilt>
        </div>
      </div>

      {/* Credibility, straight under the product. */}
      <div className="anim-fade-up mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20" style={delay(0.7)}>
        <p className="text-center text-sm text-white/45">Coached by people who&apos;ve worked at</p>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-5 sm:gap-x-16 sm:gap-y-6">
          {coachCompanies.map((c) => (
            <li key={c.name} className="flex items-center">
              <Image
                src={c.src}
                alt={c.name}
                width={c.width}
                height={c.height}
                unoptimized
                // Logos render at 70% on phones so all five fit on two rows.
                className={cn(
                  "h-[calc(var(--h)*0.7)] w-[calc(var(--w)*0.7)] transition-opacity sm:h-(--h) sm:w-(--w)",
                  c.mono === "ink"
                    ? "opacity-60 brightness-0 invert hover:opacity-90"
                    : "opacity-70 grayscale invert hover:opacity-95",
                )}
                style={{ "--w": `${c.width}px`, "--h": `${c.height}px` } as CSSProperties}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
