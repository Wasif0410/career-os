"use client";

import Link from "next/link";
import { useState } from "react";
import type { Application, ApplicationStage } from "@/lib/mock/home";
import { cn } from "@/lib/utils";
import { Panel, PanelHead, ProTag, TextLink } from "./panel";

const stages: { id: ApplicationStage; label: string }[] = [
  { id: "applied", label: "Applied" },
  { id: "in_review", label: "Review" },
  { id: "oa", label: "OA" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
];

// Open on the stage that most likely needs attention.
const priority: ApplicationStage[] = ["oa", "interview", "offer", "in_review", "applied"];

function initialsOf(org: string) {
  const words = org.split(/\s+/);
  return (words.length > 1 ? words[0][0] + words[1][0] : org.slice(0, 2)).toUpperCase();
}

/** Applications this season by stage. `locked` comes from lib/access.ts on the server. */
export function ApplicationsCard({
  data,
  locked,
  style,
}: {
  data: Record<ApplicationStage, { count: number; recent: Application[] }>;
  locked: boolean;
  style?: React.CSSProperties;
}) {
  const [stage, setStage] = useState<ApplicationStage>(() => priority.find((s) => data[s].count > 0) ?? "applied");
  const current = data[stage];

  return (
    <Panel style={style} className="pb-2 sm:pb-2">
      <PanelHead
        title="Applications"
        action={locked ? <ProTag /> : <TextLink href="/applications">Tracker</TextLink>}
      />

      <div
        role={locked ? undefined : "tablist"}
        aria-label={locked ? undefined : "Application stages"}
        className="-mx-5 grid grid-cols-5 border-y border-rule sm:-mx-6"
      >
        {stages.map(({ id, label }, i) => {
          const selected = !locked && id === stage;
          const count = data[id].count;
          const content = (
            <>
              <b
                className={cn(
                  "block font-mono text-[1.2rem] leading-tight font-semibold tracking-[-0.03em]",
                  locked || count === 0 ? "text-rule-strong" : "text-ink",
                )}
              >
                {locked ? "–" : count}
              </b>
              <span className="mt-0.5 block text-[0.72rem]">{label}</span>
            </>
          );
          const cls = cn(
            "relative min-w-0 py-3 text-left text-slate",
            i === 0 ? "pr-2 pl-5 sm:pl-6" : "px-3 shadow-[inset_1px_0_0_var(--color-rule)]",
          );
          if (locked)
            return (
              <div key={id} className={cls}>
                {content}
              </div>
            );
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="application-list"
              onClick={() => setStage(id)}
              className={cn(
                cls,
                "transition-colors hover:bg-paper",
                selected &&
                  "text-ink after:absolute after:right-3 after:-bottom-px after:left-3 after:h-0.5 after:rounded-full after:bg-cobalt",
                selected && i === 0 && "after:left-5 sm:after:left-6",
              )}
            >
              {content}
            </button>
          );
        })}
      </div>

      {locked ? (
        <p className="flex items-center justify-between gap-3 py-4 text-[0.82rem] text-slate">
          We apply to roles you approve and track each one to an offer.
          <Link href="/pricing" className="shrink-0 font-medium text-cobalt hover:text-cobalt-deep">
            See Pro
          </Link>
        </p>
      ) : (
        <div id="application-list" role="tabpanel">
          {current.recent.length === 0 ? (
            <p className="py-5 text-[0.82rem] text-slate">No offers yet. They&apos;ll land here.</p>
          ) : (
            <ul className="-mx-5 sm:-mx-6">
              {current.recent.map((a, i) => (
                <li
                  key={`${a.role}-${a.org}`}
                  className={cn("flex items-center gap-3 px-5 py-3 sm:px-6", i > 0 && "border-t border-rule")}
                >
                  <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-paper font-mono text-[0.72rem] font-semibold text-ink-soft ring-1 ring-rule ring-inset">
                    {initialsOf(a.org)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.88rem] font-medium">{a.role}</span>
                    <span className="block truncate text-[0.78rem] text-slate">
                      {a.org} · {a.place}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-[0.75rem] text-slate">
                    {a.note}
                    <b className="block text-[0.8rem] font-medium text-ink">{a.date}</b>
                  </span>
                </li>
              ))}
              {current.count > current.recent.length && (
                <li className="border-t border-rule px-5 py-2.5 text-[0.78rem] text-slate sm:px-6">
                  {current.count - current.recent.length} more
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </Panel>
  );
}
