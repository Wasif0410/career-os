import Link from "next/link";
import { BookGlyph, ChatGlyph, CheckGlyph, DiagnoseGlyph, GoalGlyph } from "@/components/brand/glyphs";
import type { PlanItem } from "@/lib/mock/home";
import { cn } from "@/lib/utils";
import { Panel } from "./panel";

/*
 * This week as a list of rows: an icon for where the task comes from, the
 * task, and a pill on the right. The first open task is highlighted, the way
 * the reference dashboard marks the current patient.
 */

function kindOf(item: PlanItem) {
  if (item.from) return { Glyph: ChatGlyph, tint: "bg-ink text-white" };
  const href = item.action?.href ?? "";
  if (href.startsWith("/jobs")) return { Glyph: GoalGlyph, tint: "bg-[#dde4ff] text-cobalt-deep" };
  if (href.startsWith("/courses")) return { Glyph: BookGlyph, tint: "bg-cobalt text-white" };
  return { Glyph: DiagnoseGlyph, tint: "bg-[#ebe8ff] text-[#4b3fd1]" };
}

export function WeekList({
  items,
  coached,
  style,
}: {
  items: PlanItem[];
  /** Whether a coach writes this plan (from canAccess(user, "plan")). */
  coached: boolean;
  style?: React.CSSProperties;
}) {
  const done = items.filter((i) => i.done).length;
  const focus = items.find((i) => !i.done);
  return (
    <Panel style={style} className="rounded-[22px]">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[1.05rem] font-semibold tracking-[-0.015em]">This week</h2>
        <span className="rounded-full bg-ink px-3 py-1 font-mono text-[0.72rem] text-white">
          {done} of {items.length} done
        </span>
      </header>
      <ul className="grid gap-2">
        {items.map((item) => {
          const { Glyph, tint } = kindOf(item);
          const isFocus = item === focus;
          return (
            <li
              key={item.text}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5",
                isFocus ? "bg-cobalt-wash ring-1 ring-cobalt/15 ring-inset" : "bg-paper/70",
              )}
            >
              <span
                className={cn("grid size-9 shrink-0 place-items-center rounded-xl", tint, item.done && "opacity-50")}
              >
                <Glyph className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-[0.88rem] font-medium",
                    item.done && "text-slate line-through decoration-rule-strong",
                  )}
                >
                  <span className="sr-only">{item.done ? "Done: " : "To do: "}</span>
                  {item.text}
                </span>
                <span className="block truncate text-[0.75rem] text-slate">
                  {item.from ? `From ${item.from}` : (item.why ?? " ")}
                </span>
              </span>
              {item.done ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-go-wash px-2.5 py-1 text-[0.72rem] font-medium text-go">
                  <CheckGlyph className="size-3" /> Done
                </span>
              ) : item.action ? (
                <Link
                  href={item.action.href}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[0.75rem] font-medium",
                    isFocus
                      ? "bg-cobalt text-white hover:bg-cobalt-deep"
                      : "bg-surface text-ink ring-1 ring-rule hover:bg-paper",
                  )}
                >
                  {item.action.label}
                </Link>
              ) : null}
            </li>
          );
        })}
        {!coached && (
          <li className="flex items-center gap-3 rounded-2xl border border-dashed border-rule-strong px-3 py-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-paper text-slate">
              <ChatGlyph className="size-[18px]" />
            </span>
            <span className="min-w-0 flex-1 text-[0.82rem] text-slate">
              Your coach adds tasks here after each session
            </span>
            <span className="shrink-0 rounded-full bg-cobalt-wash px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.06em] text-cobalt-deep uppercase">
              Pro
            </span>
          </li>
        )}
      </ul>
    </Panel>
  );
}
