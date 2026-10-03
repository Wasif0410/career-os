import { canAccess } from "@/lib/access";
import type { CurrentUser } from "@/lib/auth/user";
import type { ResumeScore } from "@/lib/mock/student";
import styles from "./home.module.css";
import { Meter, Panel, PanelHead, ProTag, TextLink } from "./panel";

/** Draws the score history as a small line, newest on the right. */
function Trend({ history }: { history: number[] }) {
  const w = 150;
  const h = 52;
  const min = Math.min(...history) - 4;
  const max = Math.max(...history) + 2;
  const points = history.map((v, i) => {
    const x = 2 + (i / (history.length - 1)) * (w - 6);
    const y = h - 4 - ((v - min) / (max - min)) * (h - 10);
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const [lastX, lastY] = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-[clamp(96px,34%,150px)] shrink" fill="none" aria-hidden>
      <defs>
        <linearGradient id="resume-trend" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-cobalt)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--color-cobalt)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${points[0][0]} ${h} L${line.replaceAll(" ", " L")} L${lastX} ${h} Z`} fill="url(#resume-trend)" />
      <polyline
        points={line}
        stroke="var(--color-cobalt)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.draw}
      />
      <circle cx={lastX} cy={lastY} r="3.5" fill="var(--color-cobalt)" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function ResumeCard({
  user,
  score,
  history,
  style,
}: {
  user: Pick<CurrentUser, "tier">;
  score: ResumeScore;
  history: number[];
  style?: React.CSSProperties;
}) {
  const change = history.length > 1 ? history[history.length - 1] - history[history.length - 2] : 0;
  return (
    <Panel style={style}>
      <PanelHead title="Resume" action={<TextLink href="/resume">Full report</TextLink>} />
      <div className="flex items-end justify-between gap-4">
        <div>
          <p
            className="font-mono text-[2.75rem] leading-none font-semibold tracking-[-0.04em]"
            role="img"
            aria-label={`Resume score: ${score.overall} out of 100`}
          >
            {score.overall}
            <small className="ml-0.5 text-base font-medium tracking-normal text-slate">/100</small>
          </p>
          {change !== 0 && (
            <p className="mt-2 flex items-center gap-1.5 text-[0.8rem] text-slate">
              <b className="rounded-full bg-go-wash px-1.5 py-px font-mono text-[0.72rem] font-semibold text-go">
                {change > 0 ? "+" : ""}
                {change}
              </b>
              since last upload
            </p>
          )}
        </div>
        <Trend history={history} />
      </div>

      {canAccess(user, "resume.fullReport") ? (
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 border-t border-rule pt-5">
          {score.categories.map((c, i) => (
            <div key={c.label}>
              <dt className="mb-1.5 flex justify-between text-[0.82rem] text-ink-soft">
                {c.label}
                <b className="font-mono text-[0.8rem] font-semibold text-ink">{c.score}</b>
              </dt>
              <dd>
                <Meter value={c.score / 100} delay={0.4 + i * 0.05} />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="mt-5 border-t border-rule pt-5">
          <p className="eyebrow">Start here</p>
          <p className="mt-1.5 text-[0.9rem] leading-relaxed">{score.fixes[0]}</p>
          <p className="mt-3 flex items-center justify-between text-[0.8rem] text-slate">
            Category breakdown and every fix
            <ProTag />
          </p>
        </div>
      )}
    </Panel>
  );
}
