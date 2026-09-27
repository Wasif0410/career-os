"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/ui/reveal";

const tools = [
  { name: "Resume builder", blind: "doesn't know which jobs you want" },
  { name: "Job boards", blind: "don't know where your resume is weak" },
  { name: "Tracking spreadsheet", blind: "can't tell you why you were rejected" },
  { name: "Advice videos", blind: "were made for someone else" },
  { name: "Practice problems", blind: "don't know which companies you're targeting" },
  { name: "Auto-apply bot", blind: "doesn't know when to stop" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal>
          <p className="eyebrow">The problem</p>
          <h2
            id="problem-title"
            className="mt-4 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.02] font-bold tracking-[-0.03em]"
          >
            Six tools. None of them talk to each other.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            So when forty applications turn into zero online assessments, nothing in your setup can tell you why, or
            what to change first.
          </p>
        </Reveal>

        <ul className="divide-y divide-rule border-y border-rule">
          {tools.map((tool, i) => (
            <motion.li
              key={tool.name}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease }}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="relative w-fit font-display text-xl font-semibold text-ink/80">
                {tool.name}
                <motion.svg
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  aria-hidden
                  className="absolute top-1/2 -left-1 h-3 w-[calc(100%+0.5rem)] -translate-y-1/2 overflow-visible text-ink"
                >
                  <motion.path
                    d="M1 7 C 20 4, 45 9, 70 5 S 95 6, 99 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.45, delay: 0.35 + i * 0.12, ease: "easeOut" }}
                  />
                </motion.svg>
              </span>
              <span className="text-[0.95rem] text-slate sm:text-right">{tool.blind}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <Reveal className="mt-14 md:mt-20">
        <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.4rem,2.8vw,2rem)] leading-snug font-semibold tracking-[-0.02em]">
          Career OS puts your resume, your coaching and your applications on{" "}
          <span className="marker">one profile</span>, so the next step is always based on what actually happened.
        </p>
      </Reveal>
    </section>
  );
}
