"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Starfield } from "@/components/brand/starfield";

const TEXT =
  "Most students job-hunt alone, guessing what's wrong, sending hundreds of applications and hearing nothing back. Career OS gives you a coach who has done it, a plan for every week, and applications that go out for you.";

// The answer half of the statement is set in sky blue.
const ANSWER_FROM = TEXT.split(" ").indexOf("Career");

/** One manifesto line, straight out of the hero. Words brighten as it scrolls through the viewport. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = TEXT.split(" ");

  return (
    <section aria-label="Why Career OS" className="night relative isolate overflow-hidden">
      <Starfield seed={23} count={80} />
      <div className="mx-auto max-w-6xl px-5 pt-24 pb-32 sm:px-8 md:pt-36 md:pb-44">
        <p
          ref={ref}
          className="max-w-[30ch] font-display text-[clamp(2.1rem,4.4vw,3.75rem)] leading-[1.12] tracking-[-0.02em] text-white"
        >
          {words.map((word, i) =>
            reduce ? (
              <span key={i} className={i >= ANSWER_FROM ? "text-sky" : undefined}>
                {word}{" "}
              </span>
            ) : (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1) / words.length]}
                accent={i >= ANSWER_FROM}
              >
                {word}
              </Word>
            ),
          )}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={accent ? "text-sky" : undefined}>
        {children}
      </motion.span>{" "}
    </>
  );
}
