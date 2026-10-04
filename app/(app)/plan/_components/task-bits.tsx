import type { GapId, PlanTask, TaskStatus } from "@/lib/mock/plan";
import { cn } from "@/lib/utils";

/** A task as the page shows it: the plan's version with the student's own changes applied. */
export type LiveTask = PlanTask & { stepsDone: number[]; picked: boolean };

export const laneTitle: Record<TaskStatus, string> = { todo: "To do", doing: "In progress", done: "Done" };

/** One colour per gap, used for its tag, its dot and its bar. */
export const gapStyle: Record<GapId, { tag: string; dot: string; label: string }> = {
  impact: { tag: "bg-[#ebe8ff] text-[#4b3fd1]", dot: "bg-[#4b3fd1]", label: "Impact" },
  projects: { tag: "bg-cobalt-wash text-cobalt-deep", dot: "bg-cobalt", label: "Projects" },
  oas: { tag: "bg-[#dde4ff] text-cobalt-deep", dot: "bg-sky", label: "OA speed" },
};

/** The small pill on a card: the gap the task closes, or what kind of task it is. */
export function TaskTag({ task, className }: { task: PlanTask; className?: string }) {
  const gap = task.gap ? gapStyle[task.gap] : undefined;
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-full px-2 text-[0.72rem] font-medium",
        gap ? gap.tag : "bg-paper-deep text-slate",
        className,
      )}
    >
      {gap ? gap.label : (task.tag ?? "Task")}
    </span>
  );
}

/** A thin bar. Decorative: the numbers beside it say the same thing. */
export function Bar({ value, className, fill = "bg-cobalt" }: { value: number; className?: string; fill?: string }) {
  return (
    <span aria-hidden className={cn("block h-1.5 overflow-hidden rounded-full bg-paper-deep", className)}>
      <span
        className={cn("block h-full rounded-full transition-[width] duration-500", fill)}
        style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }}
      />
    </span>
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-cobalt font-semibold text-white",
        className ?? "size-10 text-[0.9rem]",
      )}
    >
      {name[0]}
    </span>
  );
}
