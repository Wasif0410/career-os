"use client";

import { useMemo, useSyncExternalStore } from "react";
import { courses, lessonKey } from "@/lib/courses";

const STORAGE_KEY = "career-os.course-progress.v1";
const CHANGE_EVENT = "career-os:course-progress";
const validKeys = new Set(courses.flatMap((course) => course.lessons.map((item) => lessonKey(course.slug, item.slug))));
let memorySnapshot: string | null = null;

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

function parseCompleted(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !value ||
      typeof value !== "object" ||
      !("version" in value) ||
      value.version !== 1 ||
      !("completed" in value) ||
      !Array.isArray(value.completed)
    )
      return [];
    return [...new Set(value.completed.filter((key): key is string => typeof key === "string" && validKeys.has(key)))];
  } catch {
    return [];
  }
}

const getServerSnapshot = () => "";

export function useCourseProgress() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseCompleted(raw), [raw]);
}

/** Self-reported demo progress only; never used to grant access to content. */
export function setLessonComplete(key: string, complete: boolean) {
  if (!validKeys.has(key)) return false;
  const current = parseCompleted(getSnapshot()).filter((item) => item !== key);
  const next = JSON.stringify({ version: 1, completed: complete ? [...current, key] : current });
  memorySnapshot = next;
  let saved = false;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
    memorySnapshot = null;
    saved = true;
  } catch {
    // The current visit still works when storage is disabled or full.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return saved;
}
