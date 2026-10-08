"use client";

import { useMemo, useSyncExternalStore } from "react";

/*
 * Which fixes the student has ticked off, kept in this browser until the
 * database exists. Self-reported: the score only moves when a new version is
 * scored. Same pattern as the course progress store.
 */

const STORAGE_KEY = "career-os.resume-fixes-done.v1";
const CHANGE_EVENT = "career-os:resume-fixes-done";
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

const getServerSnapshot = () => "";

function parse(raw: string): number[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((n): n is number => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

/** Ranks of the fixes marked done. */
export function useDoneFixes() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parse(raw), [raw]);
}

export function setFixDone(rank: number, done: boolean) {
  const current = parse(getSnapshot()).filter((n) => n !== rank);
  const next = JSON.stringify(done ? [...current, rank].sort() : current);
  memorySnapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
    memorySnapshot = null;
  } catch {
    // Still works for this visit when storage is off or full.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
