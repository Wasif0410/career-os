import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowGlyph } from "@/components/brand/glyphs";

/**
 * On light pages: primary (navy) and ghost (outlined).
 * On deep blue: light (white, the main call to action) and outline (secondary).
 * accent: cobalt, for the one button that sits on a white card inside deep blue.
 */
type Variant = "primary" | "accent" | "light" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white shadow-[0_1px_2px_rgb(11_18_32/0.25)] hover:bg-ink-soft",
  accent:
    "bg-cobalt text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_8px_24px_-10px_rgb(36_71_245/0.9)] hover:bg-[#3556ff]",
  light: "bg-white text-ink shadow-[0_1px_0_rgb(255_255_255/0.4)_inset,0_10px_30px_-12px_rgb(168_185_255/0.55)] hover:bg-[#eef1ff]",
  ghost: "text-ink ring-1 ring-rule-strong ring-inset hover:bg-surface",
  outline: "text-white ring-1 ring-white/20 ring-inset hover:bg-white/[0.07]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.875rem]",
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
