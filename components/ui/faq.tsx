"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: React.ReactNode };

export function Faq({ items, tone = "light" }: { items: FaqItem[]; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  const dark = tone === "dark";

  return (
    <ul className={cn("border-t", dark ? "border-white/10" : "border-rule")}>
      {items.map((item, i) => {
        const expanded = open === i;
        // The plus/minus strokes invert with the filled circle.
        const bar = expanded ? (dark ? "bg-ink" : "bg-white") : dark ? "bg-white" : "bg-ink";
        return (
          <li key={item.q} className={cn("border-b", dark ? "border-white/10" : "border-rule")}>
            <h3>
              <button
                type="button"
                id={`${id}-q-${i}`}
                aria-expanded={expanded}
                aria-controls={`${id}-a-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className={cn(
                  "flex w-full items-center justify-between gap-6 py-6 text-left font-display text-[1.35rem] leading-snug tracking-[-0.01em] transition-colors sm:text-[1.6rem]",
                  dark ? "text-white hover:text-sky" : "hover:text-cobalt-deep",
                )}
              >
                {item.q}
                <span
                  aria-hidden
                  className={cn(
                    "relative grid size-8 shrink-0 place-items-center rounded-full ring-1 transition-colors",
                    dark ? "ring-white/20" : "ring-rule-strong",
                    expanded && (dark ? "bg-white ring-white" : "bg-cobalt ring-cobalt"),
                  )}
                >
                  <span className={cn("absolute h-[1.5px] w-3", bar)} />
                  <span
                    className={cn("absolute h-3 w-[1.5px] transition-transform duration-300", bar, expanded && "scale-y-0")}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={`${id}-a-${i}`}
                  role="region"
                  aria-labelledby={`${id}-q-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className={cn("max-w-2xl pb-7 text-[1.02rem] leading-relaxed", dark ? "text-white/65" : "text-ink-soft")}>
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
