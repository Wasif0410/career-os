"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: React.ReactNode };

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <ul className="border-t border-rule">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <li key={item.q} className="border-b border-rule">
            <h3>
              <button
                type="button"
                id={`${id}-q-${i}`}
                aria-expanded={expanded}
                aria-controls={`${id}-a-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-semibold tracking-[-0.01em] transition-colors hover:text-cobalt-deep sm:text-xl"
              >
                {item.q}
                <span
                  aria-hidden
                  className={cn(
                    "relative grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-rule-strong transition-colors",
                    expanded && "bg-ink ring-ink",
                  )}
                >
                  <span className={cn("absolute h-[1.5px] w-3 bg-ink", expanded && "bg-white")} />
                  <span
                    className={cn(
                      "absolute h-3 w-[1.5px] bg-ink transition-transform duration-300",
                      expanded && "scale-y-0 bg-white",
                    )}
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
                  <div className="max-w-2xl pb-6 leading-relaxed text-ink-soft">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
