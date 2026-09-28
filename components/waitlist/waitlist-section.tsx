import { Starfield } from "@/components/brand/starfield";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { Reveal } from "@/components/ui/reveal";

/** The closing band on every page. Deep blue under a starfield, running straight into the footer. */
export function WaitlistSection({ source }: { source: string }) {
  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="deep-blue relative isolate overflow-hidden">
      <Starfield seed={97} count={110} />
      <div className="mx-auto max-w-6xl px-5 py-28 text-center sm:px-8 md:py-40">
        <Reveal>
          <h2 id="waitlist-title" className="text-display-l mx-auto max-w-[14ch]">
            Start with your <em className="text-sky">score.</em>
          </h2>
          <p className="text-lead mx-auto mt-6 max-w-md text-white/65">
            Join the waitlist. We&apos;ll email you when your spot opens.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-10 max-w-xl text-left">
          <WaitlistForm source={source} withTarget tone="dark" />
        </Reveal>
      </div>
    </section>
  );
}
