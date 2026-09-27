import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/** Typography for guides. Every element is styled here so MDX files stay plain markdown. */
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 mb-4 font-display text-[1.9rem] leading-tight font-bold tracking-[-0.02em] text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-9 mb-3 font-display text-[1.35rem] leading-snug font-semibold tracking-[-0.01em]" {...props} />
  ),
  p: (props) => <p className="my-5 text-[1.075rem] leading-[1.75] text-ink-soft" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="font-medium text-cobalt underline decoration-cobalt/30 underline-offset-4 hover:decoration-cobalt"
        {...props}
      />
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-cobalt underline decoration-cobalt/30 underline-offset-4 hover:decoration-cobalt"
        {...props}
      />
    ),
  ul: (props) => (
    <ul
      className="my-5 space-y-2 pl-5 text-[1.075rem] leading-[1.7] text-ink-soft marker:text-cobalt [&>li]:list-disc [&>li]:pl-1.5"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="my-5 space-y-2.5 pl-5 text-[1.075rem] leading-[1.7] text-ink-soft marker:font-mono marker:text-sm marker:text-slate [&>li]:list-decimal [&>li]:pl-1.5"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-7 rounded-xl bg-surface px-6 py-1 font-mono text-[0.9rem] ring-1 ring-rule [&_p]:my-3 [&_p]:font-mono [&_p]:text-[0.9rem] [&_p]:leading-relaxed"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-rule" />,
  table: (props) => (
    <div className="my-7 overflow-x-auto rounded-xl bg-surface ring-1 ring-rule">
      <table className="w-full border-collapse text-left text-[0.95rem]" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-rule px-4 py-3 font-medium text-ink" {...props} />,
  td: (props) => <td className="h-11 border-b border-rule px-4 py-2.5 text-ink-soft" {...props} />,
  code: (props) => <code className="rounded bg-paper-deep px-1.5 py-0.5 font-mono text-[0.88em]" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
