/** Shown while an app page loads its data. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="mb-8 h-10 w-72 max-w-full animate-pulse rounded-lg bg-paper-deep" />
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="h-64 animate-pulse rounded-2xl bg-surface ring-1 ring-rule lg:col-span-2" />
        <div className="h-64 animate-pulse rounded-2xl bg-surface ring-1 ring-rule" />
      </div>
    </div>
  );
}
