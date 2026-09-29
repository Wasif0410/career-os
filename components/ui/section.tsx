import { Starfield } from "@/components/brand/starfield";
import { cn } from "@/lib/utils";

/** A stable number from a string, so each deep blue section gets its own sky. */
function seedFrom(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Every landing section shares one width, one side padding and one vertical rhythm.
 * `tone`:
 *   night: flat midnight, the quiet body of a deep blue chapter (default)
 *   dark:  deep blue with a cobalt light from above, to open a chapter
 *   light: the soft blue-white page
 * Deep blue sections get a starfield unless `stars` is false.
 */
export function Section({
  id,
  labelledBy,
  tone = "night",
  stars = true,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  labelledBy: string;
  tone?: "night" | "dark" | "light";
  stars?: boolean;
  className?: string;
  /** Classes for the inner container, e.g. to tighten the top when a section continues the one above. */
  innerClassName?: string;
  children: React.ReactNode;
}) {
  const deep = tone !== "light";
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative isolate overflow-hidden",
        tone === "night" && "night",
        tone === "dark" && "deep-blue",
        tone === "light" && "bg-paper text-ink",
        className,
      )}
    >
      {deep && stars && <Starfield seed={seedFrom(labelledBy)} count={70} />}
      <div className={cn("mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 md:py-32", innerClassName)}>{children}</div>
    </section>
  );
}
