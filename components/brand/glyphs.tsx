import { cn } from "@/lib/utils";

/**
 * Career OS glyph set. Drawn on a 24px grid, 1.6 stroke, square-ish joins,
 * with a single cobalt detail per glyph.
 */
type GlyphProps = { className?: string };

function Frame({ className, children }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Set a target: a stake in the ground on a timeline. */
export function GoalGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path d="M3 19h18" />
      <path d="M8 19V5" />
      <path d="M8 5h9l-2.2 3L17 11H8" className="fill-cobalt stroke-cobalt" />
      <path d="M15 19v-2M19 19v-2M4 19v-2" />
    </Frame>
  );
}

/** Diagnose: a gauge with the needle short of full. */
export function DiagnoseGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l3.6-5.2" className="stroke-cobalt" strokeWidth="2" />
      <circle cx="12" cy="17" r="1.4" className="fill-cobalt stroke-cobalt" />
      <path d="M6.3 11.3l1.1.9M12 7.2v1.3M17.7 11.3l-1.1.9" />
    </Frame>
  );
}

/** Improve: a line of your resume, marked up and rewritten. */
export function ImproveGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <rect x="3.5" y="9.2" width="12.5" height="5" rx="1" className="fill-cobalt/20 stroke-none" />
      <path d="M4 6h16M4 11.7h11M4 17.5h9" />
      <path d="M17.5 16.2l2.8-2.8 1.2 1.2-2.8 2.8-1.7.5z" />
    </Frame>
  );
}

/** Apply: a document that leaves with a check. */
export function ApplyGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path d="M13.5 3.5H6.8a1.3 1.3 0 0 0-1.3 1.3v14.4a1.3 1.3 0 0 0 1.3 1.3h10.4a1.3 1.3 0 0 0 1.3-1.3V8.5z" />
      <path d="M13.5 3.5v5h5" />
      <path d="M8.8 14.2l2.2 2.1 4.3-4.6" className="stroke-cobalt" strokeWidth="2" />
    </Frame>
  );
}

/** Track: the application pipeline, furthest stage lit. */
export function TrackGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path d="M5 12h14" strokeDasharray="0.1 3.2" />
      <circle cx="4.5" cy="12" r="1.9" />
      <circle cx="10" cy="12" r="1.9" />
      <circle cx="15.5" cy="12" r="1.9" />
      <circle cx="20" cy="12" r="2.2" className="fill-cobalt stroke-cobalt" />
    </Frame>
  );
}

/** Repeat: the loop returning with what it learned. */
export function RepeatGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M17.8 3.2l-.4 3.6-3.6-.3" />
      <circle cx="12" cy="12" r="2" className="fill-cobalt stroke-cobalt" />
    </Frame>
  );
}

/** Coaching: a conversation, with a cobalt reply. */
export function ChatGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path d="M4.5 5.5h11a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H10l-3.5 3v-3h-2A1.5 1.5 0 0 1 3 13V7a1.5 1.5 0 0 1 1.5-1.5z" />
      <path d="M17 9h2.5A1.5 1.5 0 0 1 21 10.5V16a1.5 1.5 0 0 1-1.5 1.5H18v2.5l-3-2.5h-3" className="stroke-cobalt" />
    </Frame>
  );
}

/** Home: a dashboard of four tiles, one lit. */
export function HomeGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" className="fill-cobalt stroke-cobalt" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </Frame>
  );
}

/** Learn: an open book with a cobalt bookmark. */
export function BookGlyph({ className }: GlyphProps) {
  return (
    <Frame className={className}>
      <path d="M12 6.5C10.2 5.2 7.6 4.8 4 5v13c3.6-.2 6.2.2 8 1.5 1.8-1.3 4.4-1.7 8-1.5V5c-3.6-.2-6.2.2-8 1.5z" />
      <path d="M12 6.5v13" />
      <path d="M15.2 5.7v5.1l1.4-1.1 1.4 1.1V5.2" className="fill-cobalt stroke-cobalt" />
    </Frame>
  );
}

export function ArrowGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" className={cn("size-4", className)} aria-hidden fill="none">
      <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" className={cn("size-4", className)} aria-hidden fill="none">
      <path d="M3.2 8.4l3 2.9 6.6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
