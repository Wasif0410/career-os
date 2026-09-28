import { MARK_ARC } from "@/components/brand/logo";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { Reveal } from "@/components/ui/reveal";

export function WaitlistSection({ source }: { source: string }) {
  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative isolate mx-auto max-w-[88rem] overflow-hidden rounded-[2rem] bg-ink px-5 py-20 text-white sm:px-8 md:py-28">
        {/* The mark, oversized, with the goal dot lit in marker. */}
        <svg
          viewBox="0 0 32 32"
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-40 -z-10 size-[34rem] text-white/[0.06] md:-right-24 md:size-[42rem]"
        >
          <path d={MARK_ARC} fill="none" stroke="currentColor" strokeWidth="4.6" strokeLinecap="round" />
          <circle cx="27.2" cy="16" r="3.3" className="fill-marker/80" />
        </svg>

        <div className="mx-auto grid max-w-6xl items-end gap-12 md:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2
              id="waitlist-title"
              className="text-display-l"
            >
              Start with your score.
            </h2>
            <p className="text-lead mt-5 max-w-md text-white/70">
              Join the waitlist. We&apos;ll email you when your spot opens.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <WaitlistForm source={source} withTarget tone="dark" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
