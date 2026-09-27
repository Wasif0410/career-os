import { cn } from "@/lib/utils";

/**
 * The mark: an open loop (get better → get hired → repeat) with the goal
 * sitting in the gap. The loop only closes when you land the role.
 */
export const MARK_ARC = "M24.67 9.23A11 11 0 1 0 24.67 22.77";

export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={MARK_ARC} fill="none" stroke="currentColor" strokeWidth="4.6" strokeLinecap="round" />
      <circle cx="27.2" cy="16" r="3.3" className="fill-cobalt" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <Mark />
      <span className="font-display text-[1.28rem] leading-none font-bold tracking-[-0.02em]">
        Career
        <span className="ml-[0.18em] font-mono text-[0.78em] font-medium tracking-normal text-slate">OS</span>
      </span>
    </span>
  );
}
