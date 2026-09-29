import { Starfield } from "@/components/brand/starfield";

/** The deep blue top of every inner page. It runs up under the fixed header. */
export function PageHeader({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="deep-blue relative isolate -mt-16 overflow-hidden">
      <Starfield seed={37} count={60} />
      <div className="anim-fade-up mx-auto max-w-6xl px-5 pt-40 pb-16 sm:px-8 md:pt-48 md:pb-24">
        <h1 className="text-display-l max-w-4xl text-white">{title}</h1>
        {children && <div className="text-lead mt-6 max-w-2xl !text-white/70">{children}</div>}
      </div>
    </header>
  );
}
