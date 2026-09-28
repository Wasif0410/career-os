import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import type { Coach } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CoachPortrait({ coach, className }: { coach: Coach; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden bg-paper-deep", className)}>
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
            className="absolute -bottom-[0.2em] left-6 font-display text-[11rem] leading-none font-extrabold tracking-[-0.06em] text-ink"
          >
            {coach.initials}
          </span>
          <span aria-hidden className="absolute top-6 right-6 size-5 rounded-full bg-marker ring-4 ring-paper-deep" />
        </>
      )}
    </div>
  );
}

export function CoachTopics({ coach, className }: { coach: Coach; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label={`${coach.name} coaches you on`}>
      {coach.coaches.map((topic) => (
        <li key={topic} className="rounded-full bg-marker-soft px-3 py-1 text-sm text-ink">
          {topic}
        </li>
      ))}
    </ul>
  );
}

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface ring-1 ring-rule">
      <CoachPortrait coach={coach} className="aspect-[2/1]" />
      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <p className="text-sm font-medium text-cobalt">{coach.focus}</p>
        <h3 className="mt-1 font-display text-[1.9rem] leading-tight font-bold tracking-[-0.025em]">
          {coach.fullName}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">{coach.bio}</p>
        <CoachTopics coach={coach} className="mt-6" />
        <div className="mt-auto pt-8">
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
