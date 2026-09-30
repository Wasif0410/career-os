import Link from "next/link";
import { Card } from "./card";

/** Placeholder body for app sections that have a route but no screen yet. */
export function ComingSoon({ phase, children }: { phase: string; children: React.ReactNode }) {
  return (
    <Card className="grid place-items-center py-16 text-center">
      <div className="max-w-md">
        <p className="mb-2 text-xs font-medium tracking-wide text-slate uppercase">Planned for {phase}</p>
        <p className="text-ink-soft">{children}</p>
        <Link href="/dashboard" className="mt-5 inline-block text-sm font-medium text-cobalt hover:text-cobalt-deep">
          Back to your dashboard
        </Link>
      </div>
    </Card>
  );
}
