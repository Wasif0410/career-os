import Link from "next/link";
import type { PlanItem } from "@/lib/mock/home";
import { cn } from "@/lib/utils";
import { CheckBox, Meter, Panel, PanelHead, ProTag } from "./panel";

/** This week's list: the coach's plan for paid students, suggested first steps for Free. */
export function PlanCard({
  items,
  coached,
  style,
}: {
  items: PlanItem[];
  /** Whether a coach writes this student's plan (from canAccess(user, "plan")). */
  coached: boolean;
  style?: React.CSSProperties;
}) {
  const done = items.filter((i) => i.done).length;
  return (
    <Panel style={style} className="pb-2 sm:pb-2">
      <PanelHead
        title="This week"
        action={
          <span className="flex items-center gap-2.5 text-[0.8rem] text-slate">
            <span className="font-mono">
              {done} of {items.length} done
            </span>
            <Meter value={done / items.length} className="w-20" />
          </span>
        }
      />
      <ul className="-mx-5 sm:-mx-6">
        {items.map((item) => (
          <li key={item.text} className="flex items-center gap-3.5 border-t border-rule px-5 py-3 sm:px-6">
            <CheckBox done={item.done} />
            <div className="min-w-0 flex-1">
              <p className={cn("text-[0.9rem]", item.done && "text-slate line-through decoration-rule-strong")}>
                <span className="sr-only">{item.done ? "Done: " : "To do: "}</span>
                {item.text}
              </p>
              {item.why && <p className="text-[0.78rem] text-slate">{item.why}</p>}
            </div>
            {item.from && (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-paper py-0.5 pr-2.5 pl-0.5 text-[0.75rem] text-ink-soft ring-1 ring-rule ring-inset">
                <span className="grid size-[18px] place-items-center rounded-full bg-ink text-[0.6rem] font-semibold text-white">
                  {item.from[0]}
                </span>
                From {item.from}
              </span>
            )}
            {item.action && (
              <Link
                href={item.action.href}
                className="shrink-0 text-[0.82rem] font-medium text-cobalt hover:text-cobalt-deep"
              >
                {item.action.label}
              </Link>
            )}
          </li>
        ))}
        {!coached && (
          <li className="flex items-center gap-3.5 border-t border-rule px-5 py-3 sm:px-6">
            <span aria-hidden className="size-[18px] shrink-0 rounded-[5px] ring-1 ring-rule ring-inset" />
            <p className="flex-1 text-[0.9rem] text-slate">Your coach adds tasks here after each session</p>
            <ProTag />
          </li>
        )}
      </ul>
    </Panel>
  );
}
