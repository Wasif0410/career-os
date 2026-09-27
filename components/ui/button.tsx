import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowGlyph } from "@/components/brand/glyphs";

type Variant = "primary" | "ink" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-cobalt text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(12_20_36/0.2)] hover:bg-cobalt-deep",
  ink: "bg-ink text-white hover:bg-ink-soft",
  ghost: "text-ink ring-1 ring-rule-strong ring-inset hover:bg-surface hover:ring-ink/30",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4.5 text-[0.92rem]",
  lg: "h-12 px-6 text-base",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  href,
  children,
  variant,
  size,
  arrow = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
}) {
  const external = /^https?:\/\//.test(href);
  const content = (
    <>
      {children}
      {arrow && <ArrowGlyph className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={buttonClass({ variant, size, className })}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass({ variant, size, className })}>
      {content}
    </Link>
  );
}
