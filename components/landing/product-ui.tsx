import { CheckGlyph } from "@/components/brand/glyphs";
import { cn } from "@/lib/utils";

/*
 * Small pieces of the Career OS product, shared by every visual on the site
 * so they all read as one app. Everything here is example data.
 */

export function ProductCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface p-4 ring-1 ring-rule shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, meta }: { title: string; meta?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {meta && <div className="text-xs text-slate">{meta}</div>}
    </div>
  );
}

/** A neutral coach avatar. Coaches aren't named in examples. */
export function CoachAvatar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-ink", className)}
    >
      <svg viewBox="0 0 32 32" className="size-full">
        <circle cx="16" cy="12.5" r="5.2" fill="#fff" fillOpacity="0.9" />
        <path d="M6 29c1.4-5.6 5.5-8.6 10-8.6s8.6 3 10 8.6" fill="#fff" fillOpacity="0.9" />
      </svg>
    </span>
  );
}

export function CoachMessage({ text, time = "now", className }: { text: string; time?: string; className?: string }) {
  return (
    <div className={cn("flex gap-3", className)}>
      <CoachAvatar />
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2 text-xs">
          <span className="font-semibold text-ink">Your coach</span>
          <span className="text-slate">{time}</span>
        </p>
        <p className="mt-1 rounded-2xl rounded-tl-md bg-paper px-3.5 py-2.5 text-sm leading-snug text-ink-soft">{text}</p>
      </div>
    </div>
  );
}

export function FitBadge({ value, muted = false }: { value: number; muted?: boolean }) {
  return (
    <span
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg font-mono text-sm font-semibold tabular-nums",
        muted ? "bg-paper-deep text-slate" : "bg-cobalt-wash text-cobalt-deep",
      )}
      aria-label={`Fit ${value} out of 100`}
    >
      {value}
    </span>
  );
}

export type Status = "Applied" | "Applying" | "Approve" | "Queued";

export function StatusPill({ status }: { status: Status }) {
  if (status === "Applied") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-white">
        <CheckGlyph className="size-3" /> Applied
      </span>
    );
  }
  if (status === "Applying") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-cobalt px-2.5 py-1 text-xs font-medium text-white">
        <span className="size-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" /> Applying
      </span>
    );
  }
  if (status === "Approve") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium text-cobalt-deep ring-1 ring-cobalt/40 ring-inset">
        Approve
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs text-slate ring-1 ring-rule ring-inset">
      Queued
    </span>
  );
}

export function Toggle({ label, on = true }: { label: string; on?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-slate">
      {label}
      <span
        aria-hidden
        className={cn("relative h-4 w-7 rounded-full transition-colors", on ? "bg-cobalt" : "bg-rule-strong")}
      >
        <span
          className={cn(
            "absolute top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform",
            on ? "translate-x-3.5" : "translate-x-0.5",
          )}
        />
      </span>
    </span>
  );
}

export function CheckBox({ done }: { done: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[5px] ring-1 transition-colors duration-300",
        done ? "bg-ink text-white ring-ink" : "bg-surface ring-rule-strong",
      )}
    >
      {done && <CheckGlyph className="size-3" />}
    </span>
  );
}
