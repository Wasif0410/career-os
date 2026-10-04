"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import { type TaskStatus, whenChoices } from "@/lib/mock/plan";
import { cn } from "@/lib/utils";
import { dayLabel, duration } from "./format";
import { laneTitle, type LiveTask, TaskTag } from "./task-bits";

/*
 * A card's details in a window over the board: why it matters, when to do
 * it, the steps to tick, and the move to make next. A native <dialog>, so
 * Escape closes it and focus goes back to the card.
 */

function ClockGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn("size-[18px]", className)} aria-hidden>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6v4.2l2.6 1.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const next: Record<TaskStatus, { to: TaskStatus; label: string }> = {
  todo: { to: "doing", label: "Start this task" },
  doing: { to: "done", label: "Mark done" },
  done: { to: "doing", label: "Not done yet" },
};

export function TaskDialog({
  task,
  week,
  readOnly,
  onClose,
  onMove,
  onStep,
  onWhen,
}: {
  task?: LiveTask;
  /** The week it belongs to, for earlier weeks. */
  week?: number;
  /** An earlier week's task: shown, not changed. */
  readOnly: boolean;
  onClose: () => void;
  onMove: (task: LiveTask, status: TaskStatus) => void;
  onStep: (task: LiveTask, step: number) => void;
  onWhen: (task: LiveTask, when: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (task && !dialog.open) dialog.showModal();
    if (!task && dialog.open) dialog.close();
  }, [task]);

  const status = task && readOnly && task.status !== "done" ? "Not finished" : task && laneTitle[task.status];
  const action = task && next[task.status];

  return (
    <dialog
      ref={ref}
      aria-labelledby="task-title"
      onClose={onClose}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog itself.
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[min(520px,calc(100vw-32px))] rounded-[22px] bg-surface p-0 text-ink shadow-[0_40px_100px_-30px_rgb(5_11_36/0.55)] backdrop:bg-midnight/45 backdrop:backdrop-blur-[2px]"
    >
      {task && (
        <div key={task.id} className="anim-fade-up p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <TaskTag task={task} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-8 place-items-center rounded-full text-slate hover:bg-paper hover:text-ink"
            >
              <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <h2
            id="task-title"
            className="mt-3.5 font-display text-[1.75rem] leading-[1.12] tracking-[-0.02em] text-balance"
          >
            {task.text}
          </h2>
          <p className="mt-2 text-[0.92rem] text-slate">{task.why}</p>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-rule rounded-2xl bg-paper">
            <div className="min-w-0 px-3.5 py-3">
              <dt className="text-[0.75rem] text-slate">Status</dt>
              <dd className="mt-0.5 truncate text-[0.88rem] font-medium">{status}</dd>
            </div>
            <div className="min-w-0 px-3.5 py-3">
              <dt className="text-[0.75rem] text-slate">{readOnly ? "Week" : task.due ? "Due" : "Takes"}</dt>
              <dd className="mt-0.5 truncate text-[0.88rem] font-medium">
                {readOnly ? `Week ${week}` : task.due ? dayLabel(task.due) : duration(task.minutes)}
              </dd>
            </div>
            <div className="min-w-0 px-3.5 py-3">
              <dt className="text-[0.75rem] text-slate">From</dt>
              <dd className="mt-0.5 truncate text-[0.88rem] font-medium">{task.from ?? "Career OS"}</dd>
            </div>
          </dl>

          {!readOnly && (
            <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[0.92rem]">
              <ClockGlyph className="shrink-0 text-cobalt" />
              {task.when ? (
                <p>
                  <span className="text-slate">{task.picked ? "You picked: " : "When: "}</span>
                  <span className="font-medium">{task.when}</span>
                </p>
              ) : (
                <label className="flex flex-wrap items-center gap-2.5">
                  <span className="text-slate">When will you do it?</span>
                  <select
                    defaultValue=""
                    onChange={(e) => e.target.value && onWhen(task, e.target.value)}
                    className="h-8 rounded-full bg-surface px-3 text-[0.82rem] ring-1 ring-rule-strong"
                  >
                    <option value="" disabled>
                      Pick a time
                    </option>
                    {whenChoices.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )}

          <p className="mt-5 mb-2 flex justify-between text-[0.8rem] font-semibold text-slate">
            Steps
            <span className="font-mono font-medium">
              {task.stepsDone.length} of {task.steps.length}
            </span>
          </p>
          <ul className="grid gap-1.5">
            {task.steps.map((step, i) => {
              const on = task.stepsDone.includes(i);
              return (
                <li key={step}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    disabled={readOnly || task.status === "done"}
                    onClick={() => onStep(task, i)}
                    className="flex w-full items-start gap-3 rounded-xl bg-paper px-3 py-2.5 text-left text-[0.9rem] transition-colors enabled:hover:bg-paper-deep"
                  >
                    <span
                      className={cn(
                        "mt-px grid size-[18px] shrink-0 place-items-center rounded-md",
                        on ? "bg-cobalt text-white" : "bg-surface ring-[1.5px] ring-rule-strong ring-inset",
                      )}
                    >
                      {on && <CheckGlyph className="size-3" />}
                    </span>
                    <span className={cn(on && "text-slate line-through decoration-rule-strong")}>{step}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {!readOnly && action && (
              <button
                type="button"
                onClick={() => onMove(task, action.to)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-[0.85rem] font-medium text-white hover:bg-ink-soft"
              >
                {task.status === "doing" && <CheckGlyph className="size-4" />}
                {action.label}
              </button>
            )}
            {task.link && (
              <Link
                href={task.link.href}
                className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-surface px-5 text-[0.85rem] font-medium text-ink ring-1 ring-rule-strong ring-inset hover:bg-paper"
              >
                {task.link.label}
                <ArrowGlyph className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
