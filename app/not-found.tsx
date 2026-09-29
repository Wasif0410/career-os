import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8">
      <Link href="/" aria-label="Career OS home" className="w-fit">
        <Logo />
      </Link>
      <div className="flex flex-1 flex-col items-start justify-center py-24">
        <p className="font-mono text-sm text-slate">status: 404 · page not found</p>
        <h1 className="text-display-l mt-4">
          This page isn&apos;t on the plan.
        </h1>
        <p className="mt-5 max-w-md text-lg text-ink-soft">The link may be old, or the address has a typo.</p>
        <Link href="/" className={buttonClass({ variant: "primary", size: "lg", className: "mt-8" })}>
          Go to the homepage
        </Link>
      </div>
    </main>
  );
}
