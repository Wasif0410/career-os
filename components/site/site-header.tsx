"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { buttonClass } from "@/components/ui/button";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation (including back/forward) and on Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow] duration-300",
        scrolled || open
          ? "bg-paper/85 shadow-[0_1px_0_var(--color-rule)] backdrop-blur-md backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Career OS home" className="-ml-1 rounded-md p-1">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-[0.92rem] text-ink-soft transition-colors hover:text-ink",
                isActive(item.href) && "text-ink underline decoration-cobalt decoration-2 underline-offset-[6px]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="#waitlist" className={buttonClass({ variant: "ink", className: "hidden sm:inline-flex" })}>
            Join the waitlist
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative grid size-10 place-items-center rounded-full ring-1 ring-rule-strong ring-inset md:hidden"
          >
            <span
              className={cn(
                "absolute h-[1.6px] w-4 bg-ink transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-[3.5px]",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.6px] w-4 bg-ink transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-[3.5px]",
              )}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-rule md:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-rule py-3.5 font-display text-xl font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 pb-2">
                <Link
                  href="#waitlist"
                  onClick={() => setOpen(false)}
                  className={buttonClass({ variant: "primary", size: "lg", className: "w-full" })}
                >
                  Join the waitlist
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
