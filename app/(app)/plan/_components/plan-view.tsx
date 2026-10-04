"use client";

import { useEffect, useState } from "react";
import type { Gap, MonthGoal, PlanTask, PlanWeek, SessionNote, TaskStatus } from "@/lib/mock/plan";
import { Board } from "./board";
import { CoachInvite, CoachNote, GapsBox, MonthBox } from "./boxes";
import { at, dayRange, duration, monthDay } from "./format";
import { moveTask, setTaskWhen, toggleStep, usePlanTasks } from "./plan-store";
import { Summary, type WeekDot } from "./summary";
import { TaskDialog } from "./task-dialog";
import type { LiveTask } from "./task-bits";

/*
 * The Plan page: a summary, this week's tasks as a board, then the coach's
 * note, the top three gaps and the month. The arrows (or the week bar, or the
 * left and right keys) step back through earlier weeks and ahead to the next.
 * Tier decisions arrive from lib/access.ts on the server as `coached`.
 */

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/** An earlier week's tasks, as they ended. */
const asEnded = (tasks: PlanTask[]): LiveTask[] =>
  tasks.map((t) => ({
    ...t,
    stepsDone: t.status === "done" ? t.steps.map((_, i) => i) : (t.stepsDone ?? []),
    picked: false,
  }));

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M10 3.5L5.5 8l4.5 4.5" : "M6 3.5L10.5 8 6 12.5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlanView({
  coached,
  coach,
  current,
  length,
  phase,
  weeks,
  nextWeek,
  nextSession,
  starter,
  notes,
  gaps,
  month,
  goals,
  coaches,
  goal,
}: {
  /** From canAccess(user, "plan"): a coach writes this plan. */
  coached: boolean;
  coach: string;
  current: number;
  length: number;
  /** "Phase 2 · Proof of work" */
  phase: string;
  /** Every week so far, this one last. Empty on Free. */
  weeks: PlanWeek[];
  nextWeek: { number: number; start: string; end: string };
  /** The next booked 1-1, when there is one. */
  nextSession?: { day: string; label: string };
  starter: PlanTask[];
  notes: SessionNote[];
  gaps: Gap[];
  /** "October" */
  month: string;
  goals: MonthGoal[];
  coaches: { name: string; focus: string }[];
  goal: { role: string; season: string };
}) {
  const thisWeek = weeks.find((w) => w.number === current);
  const live = usePlanTasks(coached && thisWeek ? thisWeek.tasks : starter);
  const [viewing, setViewing] = useState(current);
  const [openId, setOpenId] = useState<string>();

  const isNext = coached && viewing === nextWeek.number;
  const shownWeek = weeks.find((w) => w.number === viewing);
  const past = coached && viewing < current;
  const tasks = past && shownWeek ? asEnded(shownWeek.tasks) : isNext ? [] : live;
  const open = tasks.filter((t) => t.status !== "done");
  const done = tasks.length - open.length;
  const range = isNext ? dayRange(nextWeek.start, nextWeek.end) : shownWeek && dayRange(shownWeek.start, shownWeek.end);

  const go = (n: number) => {
    if (!coached || n < 1 || n > nextWeek.number || (n !== nextWeek.number && !weeks.some((w) => w.number === n)))
      return;
    setOpenId(undefined);
    setViewing(n);
  };

  // Left and right step through the weeks, unless a field or the details window has the keys.
  useEffect(() => {
    if (!coached) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (openId || e.altKey || e.ctrlKey || e.metaKey || /INPUT|SELECT|TEXTAREA/.test(el.tagName)) return;
      if (e.key === "ArrowLeft") go(viewing - 1);
      if (e.key === "ArrowRight") go(viewing + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const dots: WeekDot[] = Array.from({ length }, (_, i) => {
    const n = i + 1;
    const w = weeks.find((x) => x.number === n);
    if (w) {
      const state = n === current ? "now" : w.tasks.every((t) => t.status === "done") ? "full" : "part";
      return { number: n, dates: dayRange(w.start, w.end), state };
    }
    return n === nextWeek.number
      ? { number: n, dates: dayRange(nextWeek.start, nextWeek.end), state: "next" }
      : { number: n, dates: "", state: "none" };
  });

  const weekLabel = !coached || viewing === current ? "This week" : isNext ? "Next week" : `Week ${viewing}`;
  const session = (isNext ? thisWeek : shownWeek)?.session;
  const note = notes.find((n) => n.day === session) ?? notes[0];
  const openTask = tasks.find((t) => t.id === openId);

  const time = past
    ? {
        label: "Time spent",
        value: duration(tasks.filter((t) => t.status === "done").reduce((n, t) => n + t.minutes, 0)),
        sub: open.length ? `${open.length} not finished` : "Every task done",
      }
    : isNext
      ? { label: "Time left", value: "—", sub: "Planned after your next 1-1" }
      : {
          label: "Time left",
          value: open.length ? duration(open.reduce((n, t) => n + t.minutes, 0)) : "None",
          sub: open.length ? `${open.length} task${open.length > 1 ? "s" : ""} to go` : "Week done",
        };

  const move = (task: LiveTask, status: TaskStatus) => {
    if (past || isNext) return;
    moveTask(task, status);
  };

  return (
    <div className="@container mx-auto grid max-w-[1320px] gap-5">
      <header className="anim-fade-up mb-1 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <h1 className="font-display text-[clamp(2.2rem,1.5rem+1.8vw,3rem)] leading-[1.02] tracking-[-0.024em]">
            Plan
          </h1>
          <p className="mt-2.5 text-[0.95rem] text-slate">
            {coached ? (
              <>
                Written with <b className="font-medium text-ink">{coach}</b> after each 1-1
              </>
            ) : (
              "Starter steps from your resume score"
            )}
          </p>
        </div>
        {coached && (
          <nav
            aria-label="Choose a week"
            className="flex items-center gap-0.5 rounded-full bg-surface p-1 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] ring-1 ring-rule"
          >
            <button
              type="button"
              onClick={() => go(viewing - 1)}
              disabled={viewing <= 1}
              aria-label="Previous week"
              className="grid size-9 place-items-center rounded-full enabled:hover:bg-paper disabled:opacity-30"
            >
              <Arrow dir="left" />
            </button>
            <p aria-live="polite" className="min-w-[12.5rem] px-1.5 text-center leading-tight">
              <b className="block text-[0.88rem] font-semibold">{weekLabel}</b>
              <span className="block text-[0.75rem] text-slate">
                {weekLabel.startsWith("Week") ? range : `Week ${viewing} · ${range}`}
              </span>
            </p>
            <button
              type="button"
              onClick={() => go(viewing + 1)}
              disabled={viewing >= nextWeek.number}
              aria-label="Next week"
              className="grid size-9 place-items-center rounded-full enabled:hover:bg-paper disabled:opacity-30"
            >
              <Arrow dir="right" />
            </button>
          </nav>
        )}
      </header>

      <Summary
        coached={coached}
        current={current}
        length={length}
        phase={phase}
        dots={dots}
        viewing={viewing}
        onPickWeek={go}
        week={{
          label: weekLabel,
          dates: coached ? range : undefined,
          done,
          total: tasks.length,
          planned: !isNext,
        }}
        time={time}
        goal={goal}
        style={delay(0.05)}
      />

      <Board
        title={
          !coached || viewing === current ? "This week's tasks" : isNext ? "Next week's tasks" : `Week ${viewing} tasks`
        }
        sub={
          !coached
            ? "Suggested by Career OS from your score · open a card for its steps"
            : viewing === current
              ? `Assigned by ${coach} · open a card for its steps`
              : isNext
                ? `Planned after your 1-1${nextSession ? ` on ${nextSession.day}` : ""}`
                : `Assigned by ${coach} after your 1-1 on ${monthDay.format(at(shownWeek?.session ?? ""))}`
        }
        tasks={tasks}
        editable={!coached || viewing === current}
        past={past}
        notPlanned={
          isNext
            ? `${coach} writes next week's tasks after your 1-1${nextSession ? ` on ${nextSession.day}` : ""}.`
            : undefined
        }
        banner={
          coached && viewing !== current
            ? {
                text: `You're looking ${isNext ? "ahead" : "back"} at week ${viewing} · ${range}`,
                onBack: () => go(current),
              }
            : undefined
        }
        viewKey={String(viewing)}
        onOpen={(t) => setOpenId(t.id)}
        onMove={move}
        style={delay(0.1)}
      />

      <div className="grid gap-5 @3xl:grid-cols-2 @5xl:grid-cols-3">
        {coached ? (
          <CoachNote
            coach={note.coach}
            note={note.note}
            after={monthDay.format(at(note.day))}
            next={nextSession?.label}
            className="@3xl:col-span-2 @5xl:col-span-1"
            style={delay(0.15)}
          />
        ) : (
          <CoachInvite coaches={coaches} className="@3xl:col-span-2 @5xl:col-span-1" style={delay(0.15)} />
        )}
        <GapsBox gaps={gaps} style={delay(0.2)} />
        <MonthBox month={month} goals={goals} style={delay(0.25)} />
      </div>

      <TaskDialog
        task={openTask}
        week={viewing}
        readOnly={past}
        onClose={() => setOpenId(undefined)}
        onMove={move}
        onStep={(t, i) => !past && toggleStep(t, i)}
        onWhen={(t, w) => setTaskWhen(t, w)}
      />
    </div>
  );
}
