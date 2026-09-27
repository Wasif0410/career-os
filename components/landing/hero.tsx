import type { CSSProperties } from "react";
import { GoalConsole } from "@/components/landing/goal-console";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

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
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-10 pb-16 sm:px-8 md:pt-16 lg:grid-cols-[1fr_minmax(0,33rem)] lg:gap-14 lg:pb-24">
        <div>
          <p className="eyebrow anim-fade-up">For CS students chasing internships &amp; new-grad roles</p>

          <h1
            id="hero-title"
            className="mt-5 font-display text-[clamp(2.9rem,7.4vw,5.4rem)] leading-[0.95] font-bold tracking-[-0.035em] text-ink"
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
            className="anim-fade-up mt-6 max-w-[34rem] text-[1.08rem] leading-relaxed text-ink-soft sm:text-lg"
            style={delay(0.45)}
          >
            Pick a target, like a Winter 2027 ML internship. Career OS scores where you stand, two real coaches fix your
            biggest gaps, and applications only go to jobs that fit you.
          </p>

          <div className="anim-fade-up mt-8 max-w-[31rem]" style={delay(0.55)}>
            <WaitlistForm source="hero" />
            <p className="mt-3 pl-5 text-sm text-slate">Free tier at launch. No card needed.</p>
          </div>
        </div>

        <GoalConsole />
      </div>

      <ul
        className="anim-fade-up mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 border-t border-rule px-5 py-5 font-mono text-[0.74rem] tracking-wide text-slate uppercase sm:px-8"
        style={delay(0.9)}
      >
        <li>Coached by people, not a chatbot</li>
        <li>You approve every application</li>
        <li>Your resume stays private</li>
      </ul>
    </section>
  );
}
