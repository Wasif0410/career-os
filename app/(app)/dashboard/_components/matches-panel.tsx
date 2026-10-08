"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import type { Match } from "@/lib/mock/home";
import { cn } from "@/lib/utils";
import { Panel } from "./panel";

/*
 * Top matches as a list with a details panel, like the reference's patient
 * list and visit details: pick a match to see why it fits and what's missing.
 * `autoApply` comes from lib/access.ts on the server.
 */
export function MatchesPanel({
  matches,
  total,
  autoApply,
  style,
}: {
  matches: Match[];
  total: number;
  autoApply: boolean;
  style?: React.CSSProperties;
}) {
  const [selected, setSelected] = useState(0);
  const m = matches[selected];

  return (
    <Panel style={style} className="rounded-[22px]">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[1.05rem] font-semibold tracking-[-0.015em]">Top matches</h2>
        <Link
          href="/jobs"
          className="group inline-flex items-center gap-1 text-[0.8rem] font-medium text-cobalt hover:text-cobalt-deep"
        >
          All {total}
          <ArrowGlyph className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </header>

      <div className="grid gap-4 @lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ul className="grid content-start gap-2" aria-label="Matches">
          {matches.map((match, i) => (
            <li key={`${match.role}-${match.org}`}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={i === selected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                  i === selected ? "bg-[#ebe8ff] ring-1 ring-[#4b3fd1]/15 ring-inset" : "bg-paper/70 hover:bg-paper",
                )}
              >
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface font-mono text-[0.8rem] font-semibold text-cobalt-deep ring-1 ring-rule ring-inset"
                  aria-label={`Fit ${match.fit} out of 100`}
                >
                  {match.fit}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.85rem] font-medium">{match.role}</span>
                  <span className="block truncate text-[0.75rem] text-slate">
                    {match.org} · {match.place}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {!autoApply && (
            <li className="px-1 pt-1 text-[0.75rem] text-slate">
              {total - matches.length} more with Pro ·{" "}
              <Link href="/pricing" className="font-medium text-cobalt hover:text-cobalt-deep">
                See Pro
              </Link>
            </li>
          )}
        </ul>

        <div className="rounded-2xl bg-[#ebe8ff] p-4" aria-live="polite">
          <p className="text-[0.95rem] font-semibold">{m.role}</p>
          <p className="text-[0.78rem] text-ink/60">
            {m.org} · {m.place} · closes {m.closes}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-[0.7rem] text-white">Fit {m.fit}</span>
            {autoApply && m.status === "applied" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-go-wash px-2.5 py-0.5 text-[0.7rem] font-medium text-go">
                <CheckGlyph className="size-3" /> Applied
              </span>
            )}
          </div>
          <p className="mt-3.5 text-[0.7rem] tracking-[0.04em] text-ink/55 uppercase">Why it fits</p>
          <ul className="mt-1.5 grid gap-1 text-[0.8rem]">
            {m.reasons.map((r) => (
              <li key={r} className="flex gap-2">
                <CheckGlyph className="mt-0.5 size-3.5 shrink-0 text-[#4b3fd1]" />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.7rem] tracking-[0.04em] text-ink/55 uppercase">What&apos;s missing</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {m.missing.map((s) => (
              <span
                key={s}
                className="rounded-full bg-surface px-2.5 py-0.5 text-[0.72rem] text-ink-soft ring-1 ring-[#4b3fd1]/15 ring-inset"
              >
                {s}
              </span>
            ))}
          </div>
          {!(autoApply && m.status === "applied") && (
            <Link
              href={autoApply ? "/jobs" : "/pricing"}
              className="mt-4 inline-flex h-8 items-center rounded-full bg-ink px-3.5 text-[0.78rem] font-medium text-white hover:bg-ink-soft"
            >
              {autoApply ? "Approve" : "Auto-apply with Pro"}
            </Link>
          )}
        </div>
      </div>
    </Panel>
  );
}
