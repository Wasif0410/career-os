export function PageHeader({
  title,
  children,
}: {
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
        <h1 className="text-display-l max-w-4xl">
          {title}
        </h1>
        {children && <div className="text-lead mt-6 max-w-2xl">{children}</div>}
      </div>
    </header>
  );
}
