import { ButtonLink } from "@/components/ui/button";
import type { CurrentUser } from "@/lib/auth/user";
import { HeroSky } from "./hero-sky";

/** The welcome at the top of Home: who it's for, what they're aiming at and the one thing to do next. */
export function HomeHero({
  user,
  nextStep,
}: {
  user: Pick<CurrentUser, "firstName" | "target">;
  nextStep: { title: string; href: string; cta: string };
}) {
  return (
    <section
      aria-labelledby="home-title"
      className="deep-blue relative isolate overflow-hidden rounded-3xl px-6 py-10 shadow-[0_30px_80px_-40px_rgb(36_71_245/0.55)] ring-1 ring-white/10 sm:px-10 sm:py-14"
    >
      <HeroSky />
      <p className="eyebrow text-sky">
        {user.target.season} · {user.target.role}
      </p>
      <h1
        id="home-title"
        className="mt-4 font-display text-[2.5rem] leading-[1.04] tracking-[-0.022em] text-balance sm:text-[3.4rem]"
      >
        Good to see you, <em className="text-sky">{user.firstName}</em>
      </h1>
      <p className="mt-4 max-w-md text-[1.05rem] text-white/70 sm:text-lg">
        Next step: <span className="text-white">{nextStep.title}</span>
      </p>
      <ButtonLink href={nextStep.href} variant="light" arrow className="mt-8">
        {nextStep.cta}
      </ButtonLink>
    </section>
  );
}
