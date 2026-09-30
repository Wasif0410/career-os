"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { ArrowGlyph } from "@/components/brand/glyphs";
import { buttonClass } from "@/components/ui/button";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;
// Pages that open on deep blue: the bar stays clear over them until you scroll.
const deepTopPaths = ["/", "/coaches", "/pricing", "/guides"];

/**
 * A full-width bar, the way most product sites do it: logo left, a few quiet
 * links in the middle, one clear button on the right. Clear over the deep
 * blue top of the page; frosted midnight with a hairline once you scroll.
 * Every page starts under it (main pads by 4rem; deep blue tops pull back up).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
  const solid = scrolled || open || !deepTopPaths.includes(pathname);

  // The menu is a sibling of the header, not a child: the header's backdrop blur would
  // otherwise become the containing block for the menu's fixed positioning.
  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
          solid
            ? "border-white/[0.08] bg-midnight/90 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Career OS home" className="-ml-1 rounded-md p-1">
            <Logo tone="dark" />
          </Link>

          <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "text-[0.9rem] transition-colors duration-200 hover:text-white",
                        active ? "text-white" : "text-white/60",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="#waitlist"
              className={buttonClass({
                variant: "light",
                size: "sm",
                className: "hidden sm:inline-flex",
              })}
            >
              Join the waitlist
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative -mr-2 grid size-10 place-items-center md:hidden"
            >
              <span
                className={cn(
                  "absolute h-[1.5px] w-5 bg-white transition-transform duration-300",
                  open ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-[1.5px] w-5 bg-white transition-transform duration-300",
                  open ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="night fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-white/[0.08] md:hidden"
          >
            <ul className="flex flex-col px-5 pt-4 pb-10">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.04 + i * 0.05, ease }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex items-center justify-between border-b border-white/[0.08] py-5 font-display text-[2rem] leading-none tracking-[-0.02em] text-white"
                  >
                    {item.label}
                    <ArrowGlyph className="size-5 text-white/35" />
                  </Link>
                </motion.li>
              ))}
              <motion.li
                className="pt-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25, ease }}
              >
                <Link
                  href="#waitlist"
                  onClick={() => setOpen(false)}
                  className={buttonClass({
                    variant: "light",
                    size: "lg",
                    className: "w-full",
                  })}
                >
                  Join the waitlist
                </Link>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
