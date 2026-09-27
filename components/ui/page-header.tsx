export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="paper-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_80%_at_20%_0%,black,transparent)]"
      />
      <div className="anim-fade-up mx-auto max-w-6xl px-5 pt-14 pb-14 sm:px-8 md:pt-20 md:pb-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6.4vw,4.6rem)] leading-[0.98] font-bold tracking-[-0.035em]">
          {title}
        </h1>
        {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{children}</div>}
      </div>
    </header>
  );
}
