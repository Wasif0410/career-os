import Link from "next/link";
import { ApplyGlyph, ArrowGlyph, BookGlyph, DiagnoseGlyph, GoalGlyph, TrackGlyph } from "@/components/brand/glyphs";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
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
    <Section labelledBy="services-title">
      <SectionHeading
        id="services-title"
        title="Everything you need to land the internship"
        lead="Real coaches and smart software, in one place."
      />

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {/* Coaching leads. It's the thing software can't do. */}
        <Reveal className="md:col-span-2 md:row-span-2">
          <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-ink p-7 text-white md:p-10">
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
            <h3 className="text-display-m mt-7">
              1-1 coaching
            </h3>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">
              Sessions with coaches who&apos;ve landed the internships you want. They find your gaps and build your
              plan.
            </p>

            {/* A session, prepared before you join. Example only. */}
            <div className="mt-auto w-full max-w-sm pt-8">
            <div className="rounded-2xl bg-surface p-5 text-ink shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)]">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-lg font-semibold">Your next session</p>
                <p className="text-sm text-slate">Thu · 6:00 PM</p>
              </div>
              <ol className="mt-3 space-y-2 border-t border-rule pt-3">
                {["Rewrite your project bullets", "Pick 10 roles to apply to", "Plan your OA prep"].map((item, i) => (
                  <li key={item} className="flex items-center gap-3 text-[0.95rem]">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-marker text-xs font-semibold">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
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
            <article className="h-full rounded-[1.75rem] bg-surface p-7 ring-1 ring-rule">
              <Glyph className="size-7 text-ink" />
              <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.01em]">{title}</h3>
              <p className="mt-1.5 text-ink-soft">{body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
