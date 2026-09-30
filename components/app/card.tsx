import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-2xl bg-surface p-5 ring-1 ring-rule sm:p-6", className)}>{children}</section>;
}

export function CardTitle({
  children,
  eyebrow,
  action,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-medium tracking-wide text-slate uppercase">{eyebrow}</p>}
        <h2 className="text-[1.05rem] font-semibold text-ink">{children}</h2>
      </div>
      {action}
    </header>
  );
}
