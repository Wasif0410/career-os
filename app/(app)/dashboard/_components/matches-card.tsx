import Link from "next/link";
import { CheckGlyph } from "@/components/brand/glyphs";
import type { Match } from "@/lib/mock/home";
import { Panel, PanelHead, TextLink } from "./panel";

/** The top three matches with their fit score. Approving only shows for students with auto-apply. */
export function MatchesCard({
  matches,
  total,
  newThisWeek,
  autoApply,
  style,
}: {
  matches: Match[];
  total: number;
  newThisWeek: number;
  /** From canAccess(user, "applications.autoApply"). */
  autoApply: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <Panel style={style}>
      <PanelHead title="Top matches" action={<TextLink href="/jobs">All {total}</TextLink>} />
      <ul>
        {matches.map((m, i) => (
          <li
            key={`${m.role}-${m.org}`}
            className={`flex items-center gap-3 py-2.5 ${i > 0 ? "border-t border-rule" : ""}`}
          >
            <span
              className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-cobalt-wash font-mono text-[0.85rem] font-semibold text-cobalt-deep"
              aria-label={`Fit ${m.fit} out of 100`}
            >
              {m.fit}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.88rem] font-medium">{m.role}</span>
              <span className="block truncate text-[0.78rem] text-slate">
                {m.org} · {m.place}
              </span>
            </span>
            {autoApply && m.status === "applied" ? (
              <span className="inline-flex h-[26px] shrink-0 items-center gap-1 rounded-full bg-ink px-2.5 text-xs font-medium text-white">
                <CheckGlyph className="size-3" /> Applied
              </span>
            ) : (
              <Link
                href="/jobs"
                className={`inline-flex h-[26px] shrink-0 items-center rounded-full px-3 text-xs font-medium ring-1 ring-inset ${
                  autoApply
                    ? "text-cobalt-deep ring-cobalt/40 hover:bg-cobalt-wash"
                    : "text-ink ring-rule-strong hover:bg-paper"
                }`}
              >
                {autoApply ? "Approve" : "View"}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-2 flex items-center justify-between border-t border-rule pt-3 text-[0.78rem] text-slate">
        {autoApply ? (
          `${newThisWeek} new this week`
        ) : (
          <>
            {total - matches.length} more matches with Pro
            <Link href="/pricing" className="font-medium text-cobalt hover:text-cobalt-deep">
              See Pro
            </Link>
          </>
        )}
      </p>
    </Panel>
  );
}
