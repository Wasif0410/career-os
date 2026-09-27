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
          alt={`Portrait of ${coach.name}`}
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
          <span className="absolute right-5 bottom-4 -rotate-3 font-hand text-2xl text-ink-soft">{coach.name}</span>
        </>
      )}
    </div>
  );
}

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="flex h-full flex-col rounded-[1.4rem] bg-surface p-3 ring-1 ring-rule">
      <CoachPortrait coach={coach} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">{coach.name}</h3>
          <p className="font-mono text-[0.7rem] tracking-wide text-slate uppercase">{coach.role}</p>
        </div>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{coach.builds}</p>
        <p className="eyebrow mt-5">Coaches you on</p>
        <ul className="mt-2 space-y-1.5">
          {coach.coaches.map((topic) => (
            <li key={topic} className="flex items-baseline gap-2.5 text-[0.95rem]">
              <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-marker ring-1 ring-ink/20" />
              {topic}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
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
