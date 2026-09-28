import type { CSSProperties } from "react";
import Image from "next/image";
import { GoalConsole } from "@/components/landing/goal-console";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { coachCompanies } from "@/lib/site";

const plain = ["Land", "the", "role", "you're", "actually"];
const marked = ["aiming", "for."];

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <span className="anim-rise inline-block" style={delay(0.05 + i * 0.055)}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="paper-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_35%,black,transparent)]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-12 pb-16 sm:px-8 md:pt-20 lg:grid-cols-[1fr_minmax(0,31rem)] lg:gap-16 lg:pb-24">
        <div>
          <h1
            id="hero-title"
            className="text-display-xl text-ink"
          >
            {plain.map((w, i) => (
              <span key={w}>
                <Word i={i}>{w}</Word>{" "}
              </span>
            ))}
            <span className="marker anim-marker" style={delay(0.75)}>
              {marked.map((w, i) => (
                <span key={w}>
                  <Word i={plain.length + i}>{w}</Word>
                  {i < marked.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="text-lead anim-fade-up mt-7 max-w-[33rem]"
            style={delay(0.45)}
          >
            Coaches who&apos;ve landed the internships guide you the whole way. We apply to the right jobs for you.
          </p>

          <div className="anim-fade-up mt-8 max-w-[31rem]" style={delay(0.55)}>
            <WaitlistForm source="hero" />
          </div>
        </div>

        <GoalConsole />
      </div>

      {/* Credibility, straight under the hero. */}
      <div className="anim-fade-up border-y border-rule bg-surface" style={delay(0.9)}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:justify-between lg:gap-10">
          <p className="shrink-0 text-ink-soft">Coached by people who&apos;ve worked at</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
            {coachCompanies.map((c) => (
              <li key={c.name} className="flex items-center">
                <Image
                  src={c.src}
                  alt={c.name}
                  width={c.width}
                  height={c.height}
                  unoptimized
                  className={
                    c.mono === "ink"
                      ? "opacity-60 brightness-0 transition-opacity hover:opacity-90"
                      : "opacity-70 grayscale transition-opacity hover:opacity-100"
                  }
                  style={{ width: c.width, height: c.height }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
