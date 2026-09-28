import { cn } from "@/lib/utils";

/**
 * Every landing section shares one width, one side padding and one vertical rhythm.
 * `tone` alternates the background so sections read as distinct bands.
 */
export function Section({
  id,
  labelledBy,
  tone = "paper",
  className,
  children,
}: {
  id?: string;
  labelledBy: string;
  tone?: "paper" | "surface";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(tone === "surface" && "border-y border-rule bg-surface", className)}
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">{children}</div>
    </section>
  );
}
