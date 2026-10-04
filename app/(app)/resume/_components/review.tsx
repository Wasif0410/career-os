"use client";

import Link from "next/link";
import { useState } from "react";
import { LockGlyph } from "@/components/app/lock-glyph";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import type { ResumeDoc, ResumeFix } from "@/lib/mock/resume";
import { cn } from "@/lib/utils";
import { setFixDone, useDoneFixes } from "./done-store";
import { ResumeSheet, type SheetMode } from "./resume-sheet";

/*
 * The working part of the page: the resume itself, and the fixes beside it.
 * Opening a fix shows exactly which lines it means, with a suggestion under
 * each. The student ticks fixes off as they go, then uploads the new version.
 * Fixes the plan doesn't include arrive without their wording (the server
 * leaves it out), so only their category and points show.
 */

export type LockedFix = Pick<ResumeFix, "rank" | "category" | "gain">;

const SKIM_SOURCE = "https://www.theladders.com/static/images/basicSite/pdfs/TheLadders-EyeTracking-StudyC2.pdf";

function ModeSwitch({ mode, onChange }: { mode: SheetMode; onChange: (m: SheetMode) => void }) {
  const options: { id: SheetMode; label: string }[] = [
    { id: "fixes", label: "Fixes" },
    { id: "skim", label: "7-second skim" },
  ];
  return (
    <div role="group" aria-label="View" className="inline-flex rounded-full bg-surface p-1 ring-1 ring-rule">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={mode === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "h-8 rounded-full px-3.5 text-[0.8rem] font-medium transition-colors",
            mode === o.id ? "bg-ink text-white" : "text-slate hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function FixCard({ fix, open, done, onOpen }: { fix: ResumeFix; open: boolean; done: boolean; onOpen: () => void }) {
  const panelId = `fix-${fix.rank}`;
  const blanks = fix.marks.some((m) => m.text.includes("["));
  return (
    <li
      className={cn(
        "rounded-2xl transition-colors",
        open ? "bg-[#ebe8ff] ring-1 ring-[#4b3fd1]/15 ring-inset" : "bg-paper/70 hover:bg-paper",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl font-mono text-[0.85rem] font-semibold",
            done
              ? "bg-go text-white"
              : open
                ? "bg-[#4b3fd1] text-white"
                : "bg-surface text-cobalt-deep ring-1 ring-rule ring-inset",
          )}
        >
          {done ? <CheckGlyph className="size-4" /> : fix.rank}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block text-[0.88rem] leading-snug font-medium",
              done && "text-slate line-through decoration-rule-strong",
            )}
          >
            <span className="sr-only">{done ? "Done: " : ""}</span>
            {fix.title}
          </span>
          <span className="block text-[0.75rem] text-slate">{fix.category}</span>
        </span>
        <span className={cn("shrink-0 font-mono text-[0.78rem] font-semibold", done ? "text-slate" : "text-go")}>
          +{fix.gain}
        </span>
      </button>
      {open && (
        <div id={panelId} className="px-3 pb-3.5">
          <p className="text-[0.86rem] leading-snug text-ink">{fix.text}</p>
          <p className="mt-2 text-[0.75rem] text-ink/55">
            Marked on {fix.marks.length} {fix.marks.length === 1 ? "line" : "lines"}
            {blanks && " · fill the blanks with your own real numbers"}
          </p>
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFixDone(fix.rank, !done)}
              aria-pressed={done}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[0.78rem] font-medium transition-colors",
                done ? "bg-go-wash text-go hover:bg-go-wash/70" : "bg-ink text-white hover:bg-ink-soft",
              )}
            >
              {done && <CheckGlyph className="size-3.5" />}
              {done ? "Done" : "Mark as done"}
            </button>
            <Link
              href={fix.learn.href}
              className="group inline-flex h-8 items-center gap-1 rounded-full bg-surface px-3.5 text-[0.78rem] font-medium text-ink ring-1 ring-[#4b3fd1]/15 hover:bg-paper"
            >
              {fix.learn.label}
              <ArrowGlyph className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}

export function Review({
  fixes,
  locked,
  doc,
  skimNote,
  style,
}: {
  fixes: ResumeFix[];
  locked: LockedFix[];
  doc: ResumeDoc;
  /** What a first-pass skim of this resume shows, in a sentence. */
  skimNote: string;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(fixes[0]?.rank ?? 1);
  const [mode, setMode] = useState<SheetMode>("fixes");
  const doneRanks = useDoneFixes();
  const shown = fixes.find((f) => f.rank === open) ?? fixes[0];
  const total = fixes.length + locked.length;
  const done = fixes.filter((f) => doneRanks.includes(f.rank)).length;
  const lockedGain = locked.reduce((n, f) => n + f.gain, 0);

  return (
    <section
      style={style}
      aria-label="Review"
      className="anim-fade-up grid overflow-clip rounded-[22px] bg-surface shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] ring-1 ring-rule @4xl:grid-cols-[minmax(0,1fr)_360px]"
    >
      {/* The page, on a desk */}
      <div className="min-w-0 bg-[#e9edf7] px-4 py-5 sm:px-8 sm:py-7">
        <div className="mx-auto mb-5 flex max-w-[680px] flex-wrap items-center justify-between gap-3">
          <ModeSwitch mode={mode} onChange={setMode} />
          <span className="text-[0.75rem] text-slate">
            {mode === "fixes" ? `Showing fix ${shown.rank}` : "What a recruiter sees first"}
          </span>
        </div>
        {mode === "skim" && (
          <div className="mx-auto mb-5 max-w-[680px] rounded-2xl bg-navy px-4 py-3.5 text-[0.82rem] leading-snug text-white">
            <p>
              Recruiters spend about 7 seconds on a first look: across the top, then down the left edge.{" "}
              <span className="text-sky">{skimNote}</span>
            </p>
            <a
              href={SKIM_SOURCE}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-block text-[0.72rem] text-white/55 underline-offset-2 hover:text-white hover:underline"
            >
              Eye-tracking study, 2018
            </a>
          </div>
        )}
        <ResumeSheet doc={doc} marks={shown.marks} rank={shown.rank} mode={mode} />
      </div>

      {/* The fixes. First on phones, beside the page on wide screens. */}
      <div className="order-first border-rule p-5 sm:p-6 @4xl:order-none @4xl:border-l">
        <div className="@4xl:sticky @4xl:top-6">
          <header className="flex items-center justify-between gap-3">
            <h2 className="text-[1.05rem] font-semibold tracking-[-0.015em]">Fixes</h2>
            <span className="font-mono text-[0.75rem] text-slate">
              {done} of {total} done
            </span>
          </header>
          <ol aria-hidden className="mt-3 flex gap-1">
            {Array.from({ length: total }, (_, i) => (
              <li
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300",
                  i < done ? "bg-go" : "bg-paper-deep",
                )}
              />
            ))}
          </ol>

          <ul className="mt-4 grid gap-2" aria-label="Fixes, most important first">
            {fixes.map((f) => (
              <FixCard
                key={f.rank}
                fix={f}
                open={f.rank === open}
                done={doneRanks.includes(f.rank)}
                onOpen={() => {
                  setOpen(f.rank);
                  setMode("fixes");
                }}
              />
            ))}
            {locked.map((f) => (
              <li
                key={f.rank}
                className="flex items-center gap-3 rounded-2xl border border-dashed border-rule-strong px-3 py-2.5 text-slate"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-paper font-mono text-[0.85rem]">
                  {f.rank}
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[0.88rem] font-medium">
                  <LockGlyph className="size-3.5 shrink-0" label="Locked" />
                  {f.category} fix
                </span>
                <span className="shrink-0 font-mono text-[0.78rem] font-semibold">+{f.gain}</span>
              </li>
            ))}
          </ul>

          {locked.length > 0 && (
            <div className="mt-4 rounded-2xl bg-navy p-4 text-white">
              <p className="text-[0.92rem] leading-snug font-medium">
                {locked.length} more fixes, worth +{lockedGain}
              </p>
              <p className="mt-1 text-[0.78rem] text-white/60">Every fix, marked on your resume, with Pro.</p>
              <Link
                href="/pricing"
                className="mt-3.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3.5 text-[0.78rem] font-medium text-ink hover:bg-[#eef1ff]"
              >
                Unlock with Pro
                <ArrowGlyph className="size-3.5" />
              </Link>
            </div>
          )}

          <p className="mt-4 text-[0.75rem] leading-snug text-slate">
            Done with a few? Upload the new version to get it scored again.
          </p>
        </div>
      </div>
    </section>
  );
}
