"use client";

import { useState } from "react";
import { CheckGlyph } from "@/components/brand/glyphs";
import type { TaskStatus } from "@/lib/mock/plan";
import { cn } from "@/lib/utils";
import { at, duration, weekdayShort } from "./format";
import { Avatar, Bar, laneTitle, type LiveTask, TaskTag } from "./task-bits";

/*
 * The week as a board: to do, in progress, done. Cards drag between columns
 * on a mouse; everywhere else, opening a card gives the same moves as buttons.
 * Earlier weeks show how they ended and can't be changed.
 */

const lanes: TaskStatus[] = ["todo", "doing", "done"];
const laneDot: Record<TaskStatus, string> = { todo: "bg-slate", doing: "bg-cobalt", done: "bg-go" };

function Card({
  task,
  draggable,
  dragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: {
  task: LiveTask;
  draggable: boolean;
  dragging: boolean;
  onOpen: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const done = task.status === "done";
  return (
    <li>
      <button
        type="button"
        draggable={draggable}
        onClick={onOpen}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        aria-haspopup="dialog"
        aria-label={`${task.text}, ${laneTitle[task.status].toLowerCase()}`}
        className={cn(
          "relative block w-full rounded-xl bg-surface px-3.5 pt-3.5 pb-3 text-left shadow-[0_0_0_1px_var(--color-rule),0_1px_2px_rgb(11_18_32/0.05)] transition-[box-shadow,transform,opacity] duration-200 hover:-translate-y-px hover:shadow-[0_0_0_1px_var(--color-rule-strong),0_10px_24px_-14px_rgb(11_18_32/0.35)]",
          draggable && "cursor-grab active:cursor-grabbing",
          dragging && "opacity-40",
        )}
      >
        {done && (
          <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-go text-white">
            <CheckGlyph className="size-3" />
          </span>
        )}
        <TaskTag task={task} />
        <span
          className={cn(
            "mt-2 block pr-6 text-[0.92rem] leading-snug font-medium",
            done && "text-slate line-through decoration-rule-strong",
          )}
        >
          {task.text}
        </span>
        {task.status === "doing" && (
          <span className="mt-2.5 flex items-center gap-2 font-mono text-[0.72rem] text-slate">
            <Bar value={task.stepsDone.length / task.steps.length} className="h-1 flex-1" />
            {task.stepsDone.length}/{task.steps.length} steps
          </span>
        )}
        <span className="mt-3 flex items-center gap-2.5 text-[0.78rem] text-slate">
          {task.due && <span>{weekdayShort.format(at(task.due))}</span>}
          <span className="font-mono text-[0.74rem]">{duration(task.minutes)}</span>
          <span
            className="ml-auto"
            title={task.from ? `Assigned by ${task.from}` : "Suggested by Career OS"}
            aria-label={task.from ? `Assigned by ${task.from}` : "Suggested by Career OS"}
          >
            {task.from ? (
              <Avatar name={task.from} className="size-[22px] text-[0.65rem]" />
            ) : (
              <span className="grid size-[22px] place-items-center rounded-full bg-paper-deep text-[0.65rem] font-semibold text-slate">
                C
              </span>
            )}
          </span>
        </span>
      </button>
    </li>
  );
}

export function Board({
  title,
  sub,
  tasks,
  editable,
  past,
  notPlanned,
  banner,
  viewKey,
  onOpen,
  onMove,
  style,
}: {
  title: string;
  sub: string;
  tasks: LiveTask[];
  /** Cards can move: this week, or Free's starter steps. */
  editable: boolean;
  /** An earlier week: shows how it ended. */
  past: boolean;
  /** Set for a week the coach hasn't planned yet; replaces the columns. */
  notPlanned?: string;
  /** Shown when looking at a week other than this one. */
  banner?: { text: string; onBack: () => void };
  /** Changes with the week, so the columns fade in again. */
  viewKey: string;
  onOpen: (task: LiveTask) => void;
  onMove: (task: LiveTask, status: TaskStatus) => void;
  style?: React.CSSProperties;
}) {
  const [dragging, setDragging] = useState<string>();
  const [over, setOver] = useState<TaskStatus>();

  const drop = (status: TaskStatus) => {
    const task = tasks.find((t) => t.id === dragging);
    if (task && task.status !== status) onMove(task, status);
    setDragging(undefined);
    setOver(undefined);
  };

  return (
    <section
      aria-labelledby="board-title"
      style={style}
      className="anim-fade-up rounded-[20px] bg-surface p-4 shadow-[0_1px_2px_rgb(11_18_32/0.04),0_12px_32px_-18px_rgb(11_18_32/0.28)] ring-1 ring-rule sm:p-6"
    >
      <header className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 id="board-title" className="text-[1.08rem] font-semibold tracking-[-0.015em]">
            {title}
          </h2>
          <p className="mt-0.5 text-[0.82rem] text-slate">{sub}</p>
        </div>
        {editable && <p className="hidden text-[0.82rem] text-slate md:block">Drag cards between columns</p>}
      </header>

      {banner && (
        <div className="anim-fade-up mt-4 flex items-center justify-between gap-3 rounded-xl bg-cobalt-wash py-2 pr-2 pl-4 text-[0.85rem] text-cobalt-deep">
          <p>{banner.text}</p>
          <button
            type="button"
            onClick={banner.onBack}
            className="h-8 shrink-0 rounded-full bg-surface px-3.5 text-[0.8rem] font-medium text-ink ring-1 ring-cobalt/15 hover:bg-paper"
          >
            Back to this week
          </button>
        </div>
      )}

      {notPlanned ? (
        <div
          key={viewKey}
          className="anim-fade-up mt-5 grid place-items-center gap-1 rounded-2xl border-[1.5px] border-dashed border-rule-strong px-5 py-14 text-center"
        >
          <p className="text-[0.95rem] font-semibold">Not planned yet</p>
          <p className="text-[0.85rem] text-slate">{notPlanned}</p>
        </div>
      ) : (
        <div key={viewKey} className="anim-fade-up mt-5 grid gap-4 @3xl:grid-cols-3">
          {lanes.map((status) => {
            const mine = tasks.filter((t) => t.status === status);
            const name = past && status === "todo" ? "Not finished" : laneTitle[status];
            return (
              <section
                key={status}
                aria-label={name}
                onDragOver={(e) => {
                  if (!editable || !dragging) return;
                  e.preventDefault();
                  setOver(status);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(undefined);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  drop(status);
                }}
                className={cn(
                  "flex min-w-0 flex-col rounded-2xl bg-paper p-3 transition-[background-color,box-shadow] duration-150",
                  over === status && "bg-cobalt-wash shadow-[inset_0_0_0_1.5px_rgb(36_71_245/0.35)]",
                )}
              >
                <h3 className="flex items-center gap-2 px-1 pt-0.5 pb-3 text-[0.85rem] font-semibold">
                  <span aria-hidden className={cn("size-2 rounded-full", laneDot[status])} />
                  {name}
                  <span className="ml-auto min-w-[22px] rounded-full bg-surface px-1.5 py-px text-center font-mono text-[0.72rem] font-medium text-slate ring-1 ring-rule">
                    {mine.length}
                  </span>
                </h3>
                <ul className="grid flex-1 content-start gap-2.5 @3xl:min-h-[7.5rem]">
                  {mine.map((t) => (
                    <Card
                      key={t.id}
                      task={t}
                      draggable={editable}
                      dragging={dragging === t.id}
                      onOpen={() => onOpen(t)}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", t.id);
                        setDragging(t.id);
                      }}
                      onDragEnd={() => {
                        setDragging(undefined);
                        setOver(undefined);
                      }}
                    />
                  ))}
                  {mine.length === 0 && (
                    <li className="grid min-h-24 place-items-center rounded-xl border-[1.5px] border-dashed border-rule-strong p-3 text-center text-[0.82rem] text-slate">
                      {past
                        ? {
                            todo: "Everything got done",
                            doing: "Nothing was left in progress",
                            done: "Nothing finished",
                          }[status]
                        : {
                            todo: "Nothing left to start",
                            doing: "Drag a task here when you start it",
                            done: "Finished tasks land here",
                          }[status]}
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
