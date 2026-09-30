/** A 0-100 score drawn as a ring, with the number in the middle. */
export function ScoreRing({ value, label, size = 112 }: { value: number; label: string; size?: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${clamped} out of 100`}
    >
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="8" className="stroke-paper-deep" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className="stroke-cobalt"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center" aria-hidden>
        <span className="text-center">
          <span className="block font-display text-[2.1rem] leading-none text-ink tabular-nums">{clamped}</span>
          <span className="text-xs text-slate">of 100</span>
        </span>
      </span>
    </div>
  );
}
