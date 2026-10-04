import Image from "next/image";
import type { CoachSlug } from "@/lib/mock/coaching";
import type { Coach } from "@/lib/site";
import { cn } from "@/lib/utils";

/* Small pieces shared by the booking card. */

/** What the page needs to know about a coach. Picked from lib/site.ts on the server. */
export type CoachInfo = Pick<Coach, "name" | "fullName" | "initials" | "focus" | "photo"> & { slug: CoachSlug };

/** The coach's photo, or their initial on cobalt, like the coach cards on the marketing site. */
export function CoachFace({ coach, className }: { coach: CoachInfo; className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[linear-gradient(145deg,var(--color-cobalt-bright),var(--color-cobalt-deep))] font-display text-[1.1rem] text-white",
        className,
      )}
    >
      {coach.photo ? (
        <Image src={coach.photo} alt="" fill sizes="64px" className="object-cover" />
      ) : (
        <span aria-hidden>{coach.initials}</span>
      )}
    </span>
  );
}

/** A numbered step heading: "1 Choose a call". */
export function StepTitle({ n, id, children }: { n: number; id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-4 flex items-center gap-2.5 text-[0.97rem] font-semibold">
      <span
        aria-hidden
        className="grid size-6 place-items-center rounded-full bg-navy font-mono text-[0.72rem] font-medium text-white"
      >
        {n}
      </span>
      {children}
    </h2>
  );
}

type IconProps = { className?: string };

function Icon({ className, children, size = 18 }: IconProps & { children: React.ReactNode; size?: number }) {
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-[18px] shrink-0", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const CalendarIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <rect x="2.5" y="3.5" width="13" height="12" rx="2" />
    <path d="M2.5 7.5h13M6 2v3M12 2v3" />
  </Icon>
);

export const ClockIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="9" cy="9" r="7" />
    <path d="M9 5v4l2.5 1.5" />
  </Icon>
);

export const GlobeIcon = ({ className }: IconProps) => (
  <Icon className={className} size={16}>
    <circle cx="8" cy="8" r="6.2" />
    <path d="M1.8 8h12.4M8 1.8c1.8 1.9 2.6 3.9 2.6 6.2S9.8 12.3 8 14.2C6.2 12.3 5.4 10.3 5.4 8S6.2 3.7 8 1.8z" />
  </Icon>
);

export const ChevronIcon = ({ className, left }: IconProps & { left?: boolean }) => (
  <Icon className={cn("size-4", className)} size={16}>
    <path d={left ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} strokeWidth="1.8" />
  </Icon>
);
