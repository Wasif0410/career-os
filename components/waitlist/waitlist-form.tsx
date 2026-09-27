"use client";

import { useActionState, useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { buttonClass } from "@/components/ui/button";
import { CheckGlyph } from "@/components/brand/glyphs";
import { waitlistTargets } from "@/lib/site";
import { cn } from "@/lib/utils";

const initial: WaitlistState = { status: "idle" };

export function WaitlistForm({
  source,
  withTarget = false,
  tone = "light",
  className,
}: {
  source: string;
  withTarget?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [state, action, pending] = useActionState(joinWaitlist, initial);
  const id = useId();
  const emailError = state.status === "error" && state.field !== "target";
  const dark = tone === "dark";
  const kept = state.status === "error" ? state.values : undefined;

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {state.status === "success" ? (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "flex items-start gap-3 rounded-2xl p-4 text-[0.95rem]",
              dark ? "bg-white/10 text-white" : "bg-surface text-ink ring-1 ring-rule",
            )}
          >
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-marker text-ink">
              <CheckGlyph className="size-3.5" />
            </span>
            <p>{state.message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            action={action}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            noValidate
            className="flex flex-col gap-2.5"
          >
            <input type="hidden" name="source" value={source} />
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`${id}-website`}>Website</label>
              <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {withTarget && (
              <div>
                <label htmlFor={`${id}-target`} className={cn("sr-only")}>
                  What are you aiming for?
                </label>
                <div className="relative">
                  <select
                    id={`${id}-target`}
                    name="target"
                    defaultValue={kept?.target ?? ""}
                    className={cn(
                      "h-12 w-full appearance-none rounded-full pr-10 pl-5 text-[0.95rem] outline-none transition-shadow",
                      dark
                        ? "bg-white/10 text-white ring-1 ring-white/20 ring-inset focus:ring-2 focus:ring-marker [&>option]:text-ink"
                        : "bg-surface text-ink ring-1 ring-rule-strong ring-inset focus:ring-2 focus:ring-cobalt",
                    )}
                  >
                    <option value="">What are you aiming for? (optional)</option>
                    {waitlistTargets.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2",
                      dark ? "text-white/70" : "text-slate",
                    )}
                  >
                    <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <label htmlFor={`${id}-email`} className="sr-only">
                Email address
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@school.ca"
                defaultValue={kept?.email}
                aria-invalid={emailError || undefined}
                aria-describedby={state.status === "error" ? `${id}-error` : undefined}
                className={cn(
                  "h-12 w-full min-w-0 rounded-full px-5 sm:flex-1 text-[0.95rem] outline-none transition-shadow",
                  dark
                    ? "bg-white/10 text-white ring-1 ring-white/20 ring-inset placeholder:text-white/50 focus:ring-2 focus:ring-marker"
                    : "bg-surface text-ink ring-1 ring-rule-strong ring-inset placeholder:text-slate/70 focus:ring-2 focus:ring-cobalt",
                  emailError && (dark ? "ring-2 ring-marker" : "ring-2 ring-stop"),
                )}
              />
              <button
                type="submit"
                disabled={pending}
                className={buttonClass({
                  variant: "primary",
                  size: "lg",
                  className: cn("shrink-0", dark && "bg-marker text-ink shadow-none hover:bg-marker-soft"),
                })}
              >
                {pending ? "Joining…" : "Join the waitlist"}
              </button>
            </div>

            {state.status === "error" && (
              <p
                id={`${id}-error`}
                role="alert"
                className={cn("pl-5 text-sm", dark ? "text-marker" : "text-stop")}
              >
                {state.message}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
