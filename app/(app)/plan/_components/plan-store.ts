"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { PlanTask, TaskStatus } from "@/lib/mock/plan";

/*
 * What the student has done with their plan, kept in this browser until the
 * plan lives in the database: which column each task is in, which steps are
 * ticked, and the time they picked. Only changes from the coach's plan are
 * stored.
 */

const STORAGE_KEY = "career-os.plan-progress.v2";
const CHANGE_EVENT = "career-os:plan-progress";
let memorySnapshot: string | null = null;

export type PlanProgress = {
  status: Record<string, TaskStatus>;
  steps: Record<string, number[]>;
  when: Record<string, string>;
};

const empty: PlanProgress = { status: {}, steps: {}, when: {} };
const statuses: readonly string[] = ["todo", "doing", "done"];

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      memorySnapshot = null;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot() {
  if (memorySnapshot !== null) return memorySnapshot;
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

const getServerSnapshot = () => "";

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

function pick<T>(v: unknown, keep: (x: unknown) => x is T): Record<string, T> {
  return isRecord(v) ? (Object.fromEntries(Object.entries(v).filter(([, x]) => keep(x))) as Record<string, T>) : {};
}

function parse(raw: string): PlanProgress {
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== 2) return empty;
    return {
      status: pick(value.status, (x): x is TaskStatus => typeof x === "string" && statuses.includes(x)),
      steps: pick(value.steps, (x): x is number[] => Array.isArray(x) && x.every((n) => Number.isInteger(n))),
      when: pick(value.when, (x): x is string => typeof x === "string"),
    };
  } catch {
    return empty;
  }
}

function save(change: (p: PlanProgress) => PlanProgress) {
  const next = JSON.stringify({ version: 2, ...change(parse(getSnapshot())) });
  memorySnapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
    memorySnapshot = null;
  } catch {
    // Still works for this visit when storage is off or full.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** The plan's tasks with the student's own changes applied. */
export function usePlanTasks(tasks: PlanTask[]) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    const p = parse(raw);
    return tasks.map((t) => {
      const status = p.status[t.id] ?? t.status;
      const stepsDone = status === "done" ? t.steps.map((_, i) => i) : (p.steps[t.id] ?? t.stepsDone ?? []);
      return { ...t, status, stepsDone, when: t.when ?? p.when[t.id], picked: !t.when && !!p.when[t.id] };
    });
  }, [raw, tasks]);
}

export function moveTask(task: PlanTask, status: TaskStatus) {
  save((p) => ({
    ...p,
    status: { ...p.status, [task.id]: status },
    // Finishing a task ticks its steps; sending it back keeps whatever was ticked before.
    steps: status === "done" ? { ...p.steps, [task.id]: task.steps.map((_, i) => i) } : p.steps,
  }));
}

/** Ticking a step on a task nobody has started yet starts it. */
export function toggleStep(task: PlanTask, step: number) {
  const done = task.stepsDone ?? [];
  const next = done.includes(step) ? done.filter((n) => n !== step) : [...done, step];
  save((p) => ({
    ...p,
    steps: { ...p.steps, [task.id]: next },
    status: task.status === "todo" ? { ...p.status, [task.id]: "doing" } : p.status,
  }));
}

export function setTaskWhen(task: PlanTask, when: string) {
  save((p) => ({ ...p, when: { ...p.when, [task.id]: when } }));
}
