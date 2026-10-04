import { categoryHints } from "@/lib/mock/resume";
import type { ResumeScore } from "@/lib/mock/student";
import { cn } from "@/lib/utils";
import styles from "./resume.module.css";

/*
 * The whole score on one dark band, read left to right: the number, the four
 * categories it's made of, and where the fixes take it.
 */
export function ScoreBand({
  score,
  change,
  since,
  scoredOn,
  potential,
  style,
}: {
  score: ResumeScore;
  /** Change from the previous version. */
  change: number;
  /** "Sep 12" */
  since: string;
  /** "Sep 29" */
  scoredOn: string;
  /** The score with every fix made. */
  potential: number;
  style?: React.CSSProperties;
}) {
  const lowest = Math.min(...score.categories.map((c) => c.score));
  return (
    <section
      style={style}
      aria-label="Score"
      className="anim-fade-up grid gap-7 rounded-[22px] bg-navy p-6 text-white shadow-[0_24px_60px_-34px_rgb(10_24_69/0.8)] sm:p-8 @4xl:grid-cols-[auto_minmax(0,1fr)_auto] @4xl:items-center @4xl:gap-10"
    >
      <div>
        <p className="text-[0.8rem] text-white/60">Resume score · {scoredOn}</p>
        <p
          className="mt-1 font-display leading-none"
          role="img"
          aria-label={`Resume score: ${score.overall} out of 100`}
        >
          <span className="text-[5rem] tracking-[-0.035em]">{score.overall}</span>
          <span className="ml-1 text-[1.2rem] text-white/40">/100</span>
        </p>
        <p className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-1 font-mono text-[0.72rem] text-sky">
          {change >= 0 ? "+" : ""}
          {change} since {since}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-5 border-white/10 @2xl:grid-cols-4 @4xl:border-x @4xl:px-10">
        {score.categories.map((c, i) => {
          const isLowest = c.score === lowest;
          return (
            <li key={c.label} className="min-w-0">
              <p className="flex items-center gap-1.5 text-[0.8rem] text-white/70">
                <span className="truncate">{c.label}</span>
                {isLowest && (
                  <span className="rounded-full bg-sky px-1.5 py-px text-[0.58rem] font-semibold tracking-[0.04em] text-navy uppercase">
                    Lowest
                  </span>
                )}
              </p>
              <p className="mt-1.5 font-mono text-[1.5rem] leading-none font-semibold tracking-[-0.03em]">{c.score}</p>
              <span aria-hidden className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-white/12">
                <span
                  className={cn("block h-full rounded-full", isLowest ? "bg-white" : "bg-sky", styles.grow)}
                  style={{ width: `${c.score}%`, "--d": `${0.3 + i * 0.07}s` } as React.CSSProperties}
                />
              </span>
              <p className="mt-2 truncate text-[0.7rem] text-white/45">{categoryHints[c.label]}</p>
            </li>
          );
        })}
      </ul>

      <div className="@4xl:w-44">
        <p className="text-[0.8rem] text-white/60">With every fix</p>
        <p className="mt-1 font-display text-[3rem] leading-none tracking-[-0.03em] text-sky">{potential}</p>
        <span aria-hidden className="relative mt-3 block h-1.5 overflow-hidden rounded-full bg-white/12">
          <span
            className={cn(
              "absolute inset-y-0 left-0 rounded-full bg-[repeating-linear-gradient(135deg,rgb(168_185_255/0.5)_0_4px,transparent_4px_8px)]",
              styles.grow,
            )}
            style={{ width: `${potential}%`, "--d": "0.6s" } as React.CSSProperties}
          />
          <span
            className={cn("absolute inset-y-0 left-0 rounded-full bg-sky", styles.grow)}
            style={{ width: `${score.overall}%`, "--d": "0.4s" } as React.CSSProperties}
          />
        </span>
        <p className="mt-2 text-[0.7rem] text-white/45">
          +{potential - score.overall} from {score.fixes.length} fixes
        </p>
      </div>
    </section>
  );
}
