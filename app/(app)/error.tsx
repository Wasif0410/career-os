"use client";

import { useEffect } from "react";
import { Card } from "@/components/app/card";
import { buttonClass } from "@/components/ui/button";

/** Catches errors in any app page so the sidebar and header stay usable. */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Swap for an error tracker (e.g. Sentry) once there are real users.
    console.error(error);
  }, [error]);

  return (
    <Card className="py-14 text-center">
      <h1 className="font-display text-2xl text-ink">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-slate">
        This page didn&apos;t load. Try again, and if it keeps happening, let us know.
      </p>
      {error.digest && <p className="mt-2 font-mono text-xs text-slate">Reference: {error.digest}</p>}
      <button
        type="button"
        onClick={reset}
        className={buttonClass({ variant: "primary", size: "sm", className: "mt-6" })}
      >
        Try again
      </button>
    </Card>
  );
}
