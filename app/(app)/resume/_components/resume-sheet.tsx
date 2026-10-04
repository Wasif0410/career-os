import { ArrowGlyph } from "@/components/brand/glyphs";
import type { FixMark, ResumeBlock, ResumeDoc } from "@/lib/mock/resume";
import { cn } from "@/lib/utils";
import styles from "./resume.module.css";

/*
 * The student's resume as a page. Two ways to look at it:
 * - "fixes": the lines the picked fix points at are highlighted, with its
 *   suggestion written underneath like a note in the margin.
 * - "skim": what a recruiter takes in on a first pass. Headings, titles and
 *   dates stay sharp, and only the first words of each line do; the rest fades.
 */

export type SheetMode = "fixes" | "skim";

/** Text with "[number]"-style blanks drawn as small chips, so it's clear the student fills them in. */
export function WithBlanks({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith("[") ? (
          <span
            key={i}
            className="mx-px rounded bg-surface px-1 py-px font-mono text-[0.86em] text-cobalt-deep ring-1 ring-cobalt/20 ring-inset"
          >
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** The first `words` words at full strength, the rest faded. */
function Skimmed({ text, words }: { text: string; words: number }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.slice(0, words).join(" ")}
      {parts.length > words && (
        <span className="text-ink-soft/25 transition-colors duration-500"> {parts.slice(words).join(" ")}</span>
      )}
    </>
  );
}

/** One line of the page. `flush` drops its top margin when it sits inside a highlight. */
function Line({
  block,
  cut = false,
  flush = false,
  skim = false,
}: {
  block: ResumeBlock;
  cut?: boolean;
  flush?: boolean;
  skim?: boolean;
}) {
  const strike = cut && "line-through decoration-ink/40";
  switch (block.kind) {
    case "heading":
      return (
        <p
          className={cn(
            "border-b border-ink/70 pb-0.5 text-[0.68rem] font-bold tracking-[0.14em] text-ink uppercase",
            !flush && "mt-5",
          )}
        >
          {block.text}
        </p>
      );
    case "row":
      return (
        <p className={cn("flex justify-between gap-3", !flush && "mt-2.5")}>
          <span className={cn("font-semibold text-ink", strike)}>{block.text}</span>
          <span className="shrink-0 text-slate">{block.meta}</span>
        </p>
      );
    case "bullet":
      return (
        <p className={cn("pl-3.5 -indent-3.5", !flush && "mt-1", strike)}>
          • {skim ? <Skimmed text={block.text} words={3} /> : block.text}
        </p>
      );
    case "text":
      return (
        <p className={cn(!flush && "mt-2", strike)}>{skim ? <Skimmed text={block.text} words={4} /> : block.text}</p>
      );
  }
}

export function ResumeSheet({
  doc,
  marks,
  rank,
  mode,
}: {
  doc: ResumeDoc;
  marks: FixMark[];
  rank: number;
  mode: SheetMode;
}) {
  const skim = mode === "skim";
  const byLine = new Map(skim ? [] : marks.map((m) => [m.line, m]));
  return (
    <article
      aria-label="Your resume"
      className="relative isolate mx-auto w-full max-w-[680px] overflow-visible rounded-md bg-surface px-6 py-8 text-[0.84rem] leading-relaxed text-ink-soft shadow-[0_1px_0_rgb(12_20_36/0.04),0_30px_60px_-30px_rgb(12_20_36/0.45)] ring-1 ring-rule sm:px-12 sm:py-12"
    >
      {skim && (
        // Where the eye goes on a first pass: across the top, then down the left edge.
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-md bg-[radial-gradient(70%_14%_at_30%_7%,rgb(36_71_245/0.13),transparent),linear-gradient(90deg,rgb(36_71_245/0.09),transparent_45%)]",
            styles.fade,
          )}
        />
      )}
      <p className="font-display text-[2rem] leading-none tracking-[-0.015em] text-ink">{doc.name}</p>
      <p className="mt-1.5 text-[0.76rem] text-slate">{doc.contact}</p>
      {doc.blocks.map((block) => {
        const mark = byLine.get(block.id);
        if (!mark) return <Line key={block.id} block={block} skim={skim} />;
        return (
          <div
            // Re-mounts when the fix changes, so the highlight animates in again.
            key={`${rank}-${block.id}`}
            className={cn(
              "relative -mx-2.5 rounded-lg bg-[#ebe8ff] px-2.5 py-1.5 ring-1 ring-[#4b3fd1]/20 ring-inset",
              block.kind === "heading" ? "mt-4" : "mt-1.5",
              styles.mark,
            )}
          >
            <span
              aria-hidden
              className="absolute top-1.5 -left-5 grid size-5 place-items-center rounded-full bg-[#4b3fd1] font-mono text-[0.62rem] font-semibold text-white sm:-left-9"
            >
              {rank}
            </span>
            <Line block={block} cut={mark.label === "Cut"} flush />
            <p className="mt-1.5 flex gap-2 rounded-md bg-surface/85 px-2.5 py-1.5 text-[0.78rem] leading-snug text-ink">
              <b className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#4b3fd1]">
                {mark.label === "Move" && <ArrowGlyph className="size-3 -rotate-90" />}
                {mark.label}
              </b>
              <span>
                <WithBlanks text={mark.text} />
              </span>
            </p>
          </div>
        );
      })}
    </article>
  );
}
