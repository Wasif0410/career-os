import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import type { Coach } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CoachPortrait({ coach, className }: { coach: Coach; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper-deep", className)}>
      {coach.photo ? (
        <Image
          src={coach.photo}
          alt={`Portrait of ${coach.fullName}`}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover"
        />
      ) : (
        <>
          <div aria-hidden className="paper-grid absolute inset-0 opacity-70" />
          <span
            aria-hidden
            className="absolute -bottom-[0.2em] left-5 font-display text-[11rem] leading-none font-extrabold tracking-[-0.06em] text-ink"
          >
            {coach.initials}
          </span>
          <span aria-hidden className="absolute top-5 right-5 size-5 rounded-full bg-marker ring-4 ring-paper-deep" />
          <span aria-hidden className="absolute right-5 bottom-4 -rotate-3 font-hand text-2xl text-ink-soft">
            {coach.name}
          </span>
        </>
      )}
    </div>
  );
}

export function Experience({ coach, className }: { coach: Coach; className?: string }) {
  return (
    <ul className={cn("divide-y divide-rule border-y border-rule", className)} aria-label={`${coach.name}'s experience`}>
      {coach.experience.map((e) => (
        <li key={e.org} className="flex items-baseline justify-between gap-4 py-2.5">
          <span className="font-semibold text-ink">{e.org}</span>
          <span className="text-right text-sm text-slate">{e.role}</span>
        </li>
      ))}
    </ul>
  );
}

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="flex h-full flex-col rounded-[1.4rem] bg-surface p-3 ring-1 ring-rule">
      <CoachPortrait coach={coach} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col px-3 pt-6 pb-3">
        <h3 className="font-display text-[1.75rem] leading-tight font-bold tracking-[-0.02em]">{coach.fullName}</h3>
        <p className="mt-0.5 text-slate">{coach.program}</p>
        <p className="mt-4 text-ink-soft">{coach.headline}</p>

        <Experience coach={coach} className="mt-5" />

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${coach.name} coaches you on`}>
          {coach.coaches.map((topic) => (
            <li key={topic} className="rounded-full bg-marker-soft px-3 py-1 text-sm text-ink">
              {topic}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-7">
          {coach.bookingUrl ? (
            <ButtonLink href={coach.bookingUrl} variant="ghost" arrow>
              Book 15 minutes with {coach.name}
            </ButtonLink>
          ) : (
            <ButtonLink href={`/coaches#${coach.slug}`} variant="ghost" arrow>
              More about {coach.name}
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}
