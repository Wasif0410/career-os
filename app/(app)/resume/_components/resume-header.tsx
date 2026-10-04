"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckGlyph } from "@/components/brand/glyphs";
import { cn } from "@/lib/utils";
import { checkResumeFile, formatSize } from "./check-file";

/*
 * The top of the page: the title, the file behind the score, and the way to
 * replace it (the button, or drop a PDF anywhere on this header). Until
 * accounts exist nothing is sent anywhere: the file is checked in the browser
 * and the page says plainly that it's a demo.
 */

type State =
  { step: "idle" } | { step: "error"; reason: string } | { step: "checking" | "ready"; name: string; size: number };

function PageIcon() {
  return (
    <span
      aria-hidden
      className="grid h-10 w-8 shrink-0 content-start gap-[3px] rounded-[4px] bg-surface p-1.5 shadow-[0_4px_10px_-6px_rgb(10_24_69/0.5)] ring-1 ring-rule"
    >
      <span className="h-1 w-3.5 rounded-full bg-ink/70" />
      {[1, 0.7, 0.85, 0.6].map((w, i) => (
        <span key={i} className="h-[2px] rounded-full bg-ink/15" style={{ width: `${w * 100}%` }} />
      ))}
    </span>
  );
}

export function ResumeHeader({
  target,
  file,
}: {
  /** "Software engineering internship · Summer 2027" pieces. */
  target: { role: string; season: string };
  file: { name: string; pages: number; sizeKb: number; version: number; scoredOn: string };
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({ step: "idle" });
  const [dragging, setDragging] = useState(false);

  // A short beat for the check, so the change doesn't flash past.
  useEffect(() => {
    if (state.step !== "checking") return;
    const t = window.setTimeout(() => setState({ ...state, step: "ready" }), 700);
    return () => window.clearTimeout(t);
  }, [state]);

  function take(picked: File | undefined) {
    if (!picked) return;
    const result = checkResumeFile(picked);
    setState(
      result.ok ? { step: "checking", name: picked.name, size: picked.size } : { step: "error", reason: result.reason },
    );
  }

  function reset() {
    setState({ step: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <header
      className={cn(
        "anim-fade-up rounded-[22px] transition-shadow",
        dragging && "ring-2 ring-cobalt ring-offset-8 ring-offset-paper",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        take(e.dataTransfer.files[0]);
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <h1 className="font-display text-[clamp(2.2rem,1.5rem+1.8vw,3rem)] leading-[1.02] tracking-[-0.024em]">
            Your <em className="tracking-[-0.01em] text-cobalt">resume</em>
          </h1>
          <p className="mt-2.5 text-[0.95rem] text-slate">
            {target.role}
            <span className="mx-2 text-rule-strong">·</span>
            {target.season}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-surface py-2 pr-4 pl-2.5 ring-1 ring-rule">
            <PageIcon />
            <span className="min-w-0">
              <span className="block max-w-[14rem] truncate text-[0.84rem] font-medium">{file.name}</span>
              <span className="block text-[0.72rem] text-slate">
                Version {file.version} · {file.pages} page · scored {file.scoredOn}
              </span>
            </span>
          </div>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="application/pdf,.pdf"
            className="peer sr-only"
            onChange={(e) => take(e.target.files?.[0])}
          />
          <label
            htmlFor={inputId}
            className="inline-flex h-11 cursor-pointer items-center rounded-full bg-navy px-5 text-[0.86rem] font-medium text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-cobalt hover:bg-ink"
          >
            Upload a new version
          </label>
        </div>
      </div>

      {(state.step === "checking" || state.step === "ready") && (
        <div
          className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-[#ebe8ff] px-4 py-3"
          aria-live="polite"
        >
          <p className="flex min-w-0 items-center gap-2 text-[0.86rem] font-medium">
            {state.step === "ready" ? (
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-go text-white">
                <CheckGlyph className="size-3" />
              </span>
            ) : (
              <span className="size-5 shrink-0 animate-spin rounded-full border-2 border-[#4b3fd1]/25 border-t-[#4b3fd1]" />
            )}
            <span className="truncate">{state.name}</span>
            <span className="shrink-0 font-normal text-slate">{formatSize(state.size)}</span>
          </p>
          {state.step === "ready" && (
            <>
              <p className="min-w-0 flex-1 text-[0.8rem] text-ink-soft">
                Looks good. This is a demo, so it isn&apos;t scored and nothing below changes. The file stayed in your
                browser.
              </p>
              <button
                type="button"
                onClick={reset}
                className="shrink-0 text-[0.8rem] font-medium text-cobalt hover:text-cobalt-deep"
              >
                Choose another
              </button>
            </>
          )}
        </div>
      )}
      {state.step === "error" && (
        <p role="alert" className="mt-5 rounded-2xl bg-[#fbeceb] px-4 py-3 text-[0.82rem] text-stop">
          {state.reason}
        </p>
      )}
    </header>
  );
}
