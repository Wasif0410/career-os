import type { Course } from "@/lib/courses";

export function CourseSources({ sources }: { sources: Course["sources"] }) {
  return (
    <details className="mt-10 border-t border-rule pt-5 text-sm">
      <summary className="cursor-pointer font-medium text-ink">Sources & further reading</summary>
      <p className="mt-4 leading-relaxed text-slate">
        These resources informed the course. Exercises and worked examples are original and illustrative.
      </p>
      <ul className="mt-4 space-y-3">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="text-cobalt underline decoration-cobalt/25 underline-offset-4 hover:decoration-cobalt"
            >
              {source.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
