import Link from "next/link";
import { ApplyGlyph, ArrowGlyph, BookGlyph, DiagnoseGlyph, GoalGlyph, TrackGlyph } from "@/components/brand/glyphs";
import { Reveal } from "@/components/ui/reveal";
import { coaches } from "@/lib/site";

const services = [
  { Glyph: DiagnoseGlyph, title: "Resume score", body: "A score for your target role, with every fix ranked." },
  { Glyph: BookGlyph, title: "Courses and guides", body: "Learn the exact skills your gaps point to." },
  { Glyph: GoalGlyph, title: "Job matching", body: "Only roles you can win, each with a reason." },
  { Glyph: ApplyGlyph, title: "Auto-apply", body: "A tailored resume for every job, sent for you." },
  { Glyph: TrackGlyph, title: "Application tracker", body: "Every application and OA in one place." },
];

export function Services() {
  return (
    <section aria-labelledby="services-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal>
        <h2
          id="services-title"
          className="max-w-2xl font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
        >
          Everything you need to get hired
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {/* Coaching leads. It's the thing software can't do. */}
        <Reveal className="md:col-span-2 md:row-span-2">
          <article className="relative flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-ink p-7 text-white md:p-9">
            <div className="flex -space-x-3">
              {coaches.map((c) => (
                <span
                  key={c.slug}
                  className="grid size-14 place-items-center rounded-full bg-paper font-display text-2xl font-extrabold text-ink ring-4 ring-ink"
                  aria-hidden
                >
                  {c.initials}
                </span>
              ))}
            </div>
            <h3 className="mt-7 font-display text-[clamp(2rem,4vw,3rem)] leading-none font-bold tracking-[-0.03em]">
              1-1 coaching
            </h3>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">
              Real sessions with {coaches.map((c) => c.name).join(" or ")}. They find your top 3 gaps and write your
              plan.
            </p>

            <div className="mt-8 w-full max-w-sm -rotate-1 rounded-xl bg-marker-soft p-5 font-hand text-[1.1rem] leading-relaxed text-ink md:mt-auto">
              <p className="font-bold">This week</p>
              <p>
                <span className="line-through decoration-2">Cut resume to one page</span>
              </p>
              <p>Add tests to your best repo</p>
              <p>Apply to the 6 roles we approved</p>
            </div>

            <Link
              href="/coaches"
              className="group mt-8 inline-flex w-fit items-center gap-1.5 font-medium text-marker hover:text-marker-soft"
            >
              Meet your coaches
              <ArrowGlyph className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </article>
        </Reveal>

        {services.map(({ Glyph, title, body }, i) => (
          <Reveal key={title} delay={0.05 * (i + 1)}>
            <article className="h-full rounded-[1.4rem] bg-surface p-6 ring-1 ring-rule">
              <Glyph className="size-7 text-ink" />
              <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="mt-1.5 text-ink-soft">{body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
