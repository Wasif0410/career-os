import Image from "next/image";
import { Starfield } from "@/components/brand/starfield";
import { ButtonLink } from "@/components/ui/button";
import { coachCompanies, type Coach } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Photo if one is set in lib/site.ts, otherwise the coach's initial. */
export function CoachAvatar({ coach, className }: { coach: Coach; className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[linear-gradient(145deg,var(--color-cobalt-bright),var(--color-cobalt-deep))] font-display text-2xl text-white",
        className,
      )}
    >
      {coach.photo ? (
        <Image src={coach.photo} alt={`Portrait of ${coach.fullName}`} fill sizes="96px" className="object-cover" />
      ) : (
        <span aria-hidden>{coach.initials}</span>
      )}
    </span>
  );
}

/** Where the coach has worked: real logos where we have them, plain text otherwise. */
export function CoachCompanies({ coach, className }: { coach: Coach; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-3", className)} aria-label={`Where ${coach.name} has worked`}>
      {coach.companies.map((name) => {
        const logo = coachCompanies.find((c) => c.name === name);
        if (!logo) {
          return (
            <li key={name} className="text-sm font-medium text-slate">
              {name}
            </li>
          );
        }
        // Logos render at 60% of their size in the hero strip.
        const width = Math.round(logo.width * 0.6);
        const height = Math.round(logo.height * 0.6);
        return (
          <li key={name} className="flex items-center">
            <Image
              src={logo.src}
              alt={logo.name}
              width={width}
              height={height}
              unoptimized
              className={logo.mono === "ink" ? "opacity-60 brightness-0" : "opacity-70 grayscale"}
              style={{ width, height }}
            />
          </li>
        );
      })}
    </ul>
  );
}

export function CoachTopics({ coach, className }: { coach: Coach; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label={`${coach.name} coaches you on`}>
      {coach.coaches.map((topic) => (
        <li key={topic} className="rounded-full bg-paper px-3 py-1 text-sm text-ink-soft ring-1 ring-rule">
          {topic}
        </li>
      ))}
    </ul>
  );
}

/** One company as a mark: its logo at a consistent optical size, or the name when there is no logo. */
function CompanyMark({ name }: { name: string }) {
  const logo = coachCompanies.find((c) => c.name === name);
  if (!logo) return <span className="text-[0.95rem] font-medium text-ink">{name}</span>;
  const width = Math.round(logo.width * 0.72);
  const height = Math.round(logo.height * 0.72);
  return (
    <Image
      src={logo.src}
      alt={logo.name}
      width={width}
      height={height}
      unoptimized
      className={logo.mono === "ink" ? "opacity-80 brightness-0" : "opacity-85 grayscale"}
      style={{ width, height }}
    />
  );
}

/**
 * A coach at a glance. Deep blue header with who they are, then where they've
 * worked and what they did there, what they coach you on, and one way to reach them.
 */
export function CoachProfile({ coach, className, seed = 1 }: { coach: Coach; className?: string; seed?: number }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[2rem] bg-surface shadow-[0_30px_80px_-50px_rgb(10_20_51/0.45)] ring-1 ring-rule",
        className,
      )}
    >
      <header className="deep-blue relative isolate overflow-hidden px-7 pt-7 pb-9 sm:px-9 sm:pt-9">
        <Starfield seed={seed} count={34} />
        <div className="flex items-start justify-between gap-4">
          <CoachAvatar coach={coach} className="size-16 text-3xl ring-4 ring-white/10" />
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85 ring-1 ring-white/15">
            {coach.focus}
          </span>
        </div>
        <h3 className="mt-10 font-display text-[2.4rem] leading-none tracking-[-0.022em] text-white">{coach.fullName}</h3>
      </header>

      <div className="flex flex-1 flex-col px-7 pt-7 pb-7 sm:px-9 sm:pb-9">
        <p className="text-xs font-medium tracking-[0.14em] text-slate uppercase">Experience</p>
        <ul className="mt-2 divide-y divide-rule" aria-label={`Where ${coach.name} has worked`}>
          {coach.experience.map((e) => (
            <li key={e.company} className="flex min-h-14 items-center justify-between gap-6 py-3">
              <CompanyMark name={e.company} />
              <span className="text-right text-sm text-slate">{e.role}</span>
            </li>
          ))}
        </ul>

        <p className="mt-7 text-xs font-medium tracking-[0.14em] text-slate uppercase">Coaches you on</p>
        <CoachTopics coach={coach} className="mt-3" />

        <div className="mt-auto pt-9">
          <ButtonLink href={coach.bookingUrl ?? `/coaches#${coach.slug}`} variant="primary" arrow>
            {coach.bookingUrl ? `Book 15 minutes with ${coach.name}` : `More about ${coach.name}`}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
