import Link from "next/link";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

/*
 * The small pieces every Home card is built from, so the cards read as one
 * system: a panel, its heading row, a text link, a thin meter and a Pro tag.
 */

export function Panel({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <section
      style={style}
      className={cn(
        "anim-fade-up min-w-0 rounded-[18px] bg-surface p-5 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] ring-1 ring-rule sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHead({
  title,
  sub,
  action,
  className,
}: {
  title: string;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em]">{title}</h2>
        {sub && <p className="mt-0.5 text-[0.8rem] text-slate">{sub}</p>}
      </div>
      {action}
    </header>
  );
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex shrink-0 items-center gap-1 text-[0.82rem] font-medium whitespace-nowrap text-cobalt hover:text-cobalt-deep",
        className,
      )}
    >
      {children}
      <ArrowGlyph className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}

/** A thin bar that fills on load. Decorative: the number beside it says the same thing. */
export function Meter({
  value,
  className,
  barClassName,
  delay,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <span aria-hidden className={cn("block h-1.5 overflow-hidden rounded-full bg-paper-deep", className)}>
      <span
        className={cn("block h-full rounded-full bg-cobalt", styles.grow, barClassName)}
        style={{ width: `${pct}%`, ...(delay !== undefined ? { "--d": `${delay}s` } : {}) } as React.CSSProperties}
      />
    </span>
  );
}

export function ProTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full bg-cobalt-wash px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.06em] text-cobalt-deep uppercase",
        className,
      )}
    >
      Pro
    </span>
  );
}

export function CheckBox({ done }: { done: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-[18px] shrink-0 place-items-center rounded-[5px]",
        done ? "bg-ink text-white" : "bg-surface ring-1 ring-rule-strong ring-inset",
      )}
    >
      {done && <CheckGlyph className="size-3" />}
    </span>
  );
}
