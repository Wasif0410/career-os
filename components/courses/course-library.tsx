"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import { LockGlyph } from "@/components/app/lock-glyph";
import { buttonClass } from "@/components/ui/button";
import { courses, type Course, lessonKey, readingMinutes } from "@/lib/courses";
import { cn } from "@/lib/utils";
import { bookStyle, CourseBook, courseNumber } from "./course-book";
import { CourseContinue, CourseProgress, LearningProgress, useLessonsDone } from "./course-progress";
import { CourseSky } from "./course-sky";
import styles from "./course-shelf.module.css";

/*
 * The course library. Courses are books in a stack; scrolling moves the camera
 * along it, and choosing one swings the book upright beside its details. The
 * open course lives in the URL (?course=resume), so Back closes it and a link
 * can open it directly.
 */

type Phase = "idle" | "opening" | "open" | "closing";

/** Where the open book and its details sit, in viewport pixels. */
type Layout = {
  wide: boolean;
  close: { left: number; top: number };
  book: { x: number; y: number; height: number };
  panel: { left: number; top: number; width: number; height: number };
};

type Pose = { x: number; y: number; s: number; ry: number };

const SWING_MS = 1000;

/** The sticky app header's height: #main starts right below it. */
function headerHeight() {
  const main = document.getElementById("main");
  return main ? Math.max(0, Math.round(main.getBoundingClientRect().top + window.scrollY)) : 0;
}

function measureLayout(stage: HTMLElement, header: number): Layout {
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight;
  const rect = stage.getBoundingClientRect();
  const pad = viewportWidth >= 640 ? 32 : 16;
  const left = Math.max(rect.left, 0) + pad;
  const width = Math.min(rect.right, viewportWidth) - pad - left;
  const height = viewportHeight - header;

  if (width >= 820 && height >= 460) {
    const bookHeight = Math.min(height * 0.7, (width * 0.34) / 0.68, 580);
    return {
      wide: true,
      close: { left, top: header + 20 },
      book: { x: left + width * 0.27, y: header + height / 2, height: bookHeight },
      panel: { left: left + width * 0.52, top: header, width: Math.min(width * 0.44, 480), height },
    };
  }

  const bookHeight = Math.max(140, Math.min(height * 0.34, (width * 0.55) / 0.68, 320));
  const bookTop = header + 68;
  const panelTop = bookTop + bookHeight + 28;
  return {
    wide: false,
    close: { left, top: header + 14 },
    book: { x: left + width / 2, y: bookTop + bookHeight / 2, height: bookHeight },
    panel: { left, top: panelTop, width, height: viewportHeight - panelTop },
  };
}

function measurePose(layout: Layout, slot: HTMLElement): Pose {
  const rect = slot.getBoundingClientRect();
  return {
    x: Math.round(layout.book.x - (rect.left + rect.width / 2)),
    y: Math.round(layout.book.y - (rect.top + rect.height / 2)),
    s: Math.min(1, layout.book.height / rect.width),
    ry: layout.wide ? 34 : 24,
  };
}

function lockScroll() {
  const root = document.documentElement;
  if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = "stable";
  root.style.overflow = "hidden";
}

function unlockScroll() {
  const root = document.documentElement;
  root.style.overflow = "";
  root.style.scrollbarGutter = "";
}

const validSlug = (slug: string | null) => (slug && courses.some((course) => course.slug === slug) ? slug : null);

export function CourseLibrary({ allLessons, initialCourse }: { allLessons: boolean; initialCourse: string | null }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLOListElement>(null);
  const slots = useRef(new Map<string, HTMLLIElement>());
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const header = useRef(0);
  const pushed = useRef(false);
  const returnFocus = useRef<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const [headerH, setHeaderH] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // The course shown in the details panel. It outlives openSlug while the book swings back.
  const [shown, setShown] = useState<string | null>(validSlug(initialCourse));
  const [phase, setPhase] = useState<Phase>("idle");
  const [layout, setLayout] = useState<Layout | null>(null);
  const [pose, setPose] = useState<Pose | null>(null);
  const [instant, setInstant] = useState(false);

  const openRef = useRef(openSlug);
  useEffect(() => {
    openRef.current = openSlug;
  }, [openSlug]);

  const open = useCallback(
    (slug: string, { push = true, immediate = false }: { push?: boolean; immediate?: boolean } = {}) => {
      const stage = stageRef.current;
      const slot = slots.current.get(slug);
      if (!stage || !slot) return;
      const nextLayout = measureLayout(stage, header.current);
      const skip = immediate || !!reduce;
      window.clearTimeout(timer.current);
      lockScroll();
      setLayout(nextLayout);
      setPose(measurePose(nextLayout, slot));
      setOpenSlug(slug);
      setShown(slug);
      setInstant(immediate);
      setPhase(skip ? "open" : "opening");
      if (!skip) timer.current = window.setTimeout(() => setPhase("open"), SWING_MS);
      if (push) {
        window.history.pushState(null, "", `${window.location.pathname}?course=${slug}`);
        pushed.current = true;
      }
    },
    [reduce],
  );

  const finishClose = useCallback(() => {
    const slug = openRef.current;
    if (!slug) return;
    window.clearTimeout(timer.current);
    unlockScroll();
    returnFocus.current = slug;
    setOpenSlug(null);
    setPose(null);
    setInstant(false);
    setPhase(reduce ? "idle" : "closing");
    timer.current = window.setTimeout(
      () => {
        setPhase("idle");
        setShown(null);
        setLayout(null);
      },
      reduce ? 0 : SWING_MS,
    );
  }, [reduce]);

  const requestClose = useCallback(() => {
    if (pushed.current) {
      // Step back through the entry we added; the popstate handler closes the book.
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname);
      finishClose();
    }
  }, [finishClose]);

  // Measure the header, then open a course named in the URL without the swing.
  useLayoutEffect(() => {
    header.current = headerHeight();
    setHeaderH(header.current);
    const slug = validSlug(new URLSearchParams(window.location.search).get("course"));
    if (slug) open(slug, { push: false, immediate: true });
    else setShown(null);
    return () => {
      window.clearTimeout(timer.current);
      unlockScroll();
    };
    // Runs once on mount; `open` only changes with the motion preference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Let the transition styles apply again once the instantly opened book has painted.
  useEffect(() => {
    if (!instant) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    return () => cancelAnimationFrame(frame);
  }, [instant]);

  // The camera: keep the stack's vanishing point in the middle of the visible screen.
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = stack.getBoundingClientRect().top;
      const center = (header.current + window.innerHeight) / 2 - top;
      let nearest = 0;
      let distance = Infinity;
      courses.forEach((course, index) => {
        const slot = slots.current.get(course.slug);
        if (!slot) return;
        const gap = Math.abs(slot.offsetTop + slot.offsetHeight / 2 - center);
        if (gap < distance) {
          distance = gap;
          nearest = index;
        }
      });
      stack.style.setProperty("--cam-y", `${Math.round(center)}px`);
      setActive(nearest);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      header.current = headerHeight();
      setHeaderH(header.current);
      schedule();
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Back and Forward open and close courses.
  useEffect(() => {
    const onPopState = () => {
      const slug = validSlug(new URLSearchParams(window.location.search).get("course"));
      pushed.current = false;
      if (slug) open(slug, { push: false });
      else finishClose();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [open, finishClose]);

  // Keep the open book and its details in place when the window changes size.
  useEffect(() => {
    if (!openSlug) return;
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const stage = stageRef.current;
        const slot = slots.current.get(openSlug);
        if (!stage || !slot) return;
        const nextLayout = measureLayout(stage, header.current);
        setLayout(nextLayout);
        setPose(measurePose(nextLayout, slot));
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [openSlug]);

  // Focus moves into the details when a course opens and back to its book when it closes.
  useEffect(() => {
    if (openSlug) {
      titleRef.current?.focus({ preventScroll: true });
      return;
    }
    const slug = returnFocus.current;
    returnFocus.current = null;
    if (slug) links.current.get(slug)?.focus({ preventScroll: true });
  }, [openSlug]);

  useEffect(() => {
    if (!openSlug) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openSlug, requestClose]);

  function onBookClick(event: React.MouseEvent<HTMLAnchorElement>, slug: string) {
    // Let modified clicks open the course page itself, in a new tab or window.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    open(slug);
  }

  function scrollToCourse(slug: string) {
    const slot = slots.current.get(slug);
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    const center = (header.current + window.innerHeight) / 2;
    window.scrollTo({
      top: window.scrollY + rect.top + rect.height / 2 - center,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  // Keep Tab inside the open course's details.
  function onDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const shownCourse = courses.find((course) => course.slug === shown) ?? null;
  const shownIndex = shownCourse ? courses.indexOf(shownCourse) : -1;
  // A course named in the URL keeps the shelf hidden from the first paint until its book is placed.
  const isOpen = !!openSlug || (!!shown && !layout);

  return (
    <div
      ref={stageRef}
      className="relative z-[1] -mx-4 -mt-6 -mb-6 overflow-x-clip px-5 pt-10 pb-[max(4rem,calc(50svh-14rem))] sm:-mx-8 sm:-mt-9 sm:-mb-9 sm:px-10 sm:pt-14 lg:px-12 xl:-mx-10"
      style={headerH === null ? undefined : ({ "--header-h": `${headerH}px` } as React.CSSProperties)}
    >
      <div className={cn(styles.backdrop, "deep-blue")}>
        <CourseSky seed={83} count={110} />
      </div>

      <div
        inert={isOpen}
        className={cn(
          "grid items-end gap-8 transition-opacity duration-500 lg:grid-cols-[1fr_auto] lg:gap-14",
          isOpen && "opacity-0 motion-reduce:transition-none",
        )}
      >
        <div className="anim-fade-up max-w-xl">
          <h1 className="text-display-m text-white">Courses</h1>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Short courses to build your skills, tell your story, and find work that fits.{" "}
            {allLessons ? "Every lesson is included in your plan." : "First lessons are free."} Learn at your own pace.
          </p>
        </div>
        <div className="anim-fade-up [--d:0.1s]">
          <LearningProgress allLessons={allLessons} />
        </div>
      </div>

      <div className="relative mt-10 sm:mt-14">
        <nav
          aria-label="Course index"
          inert={isOpen}
          className={cn(
            "absolute inset-y-0 left-0 hidden transition-opacity duration-500 lg:block",
            isOpen && "opacity-0",
          )}
        >
          <ol className="sticky top-[calc(50svh-5rem)] flex flex-col gap-1.5">
            {courses.map((course, index) => (
              <li key={course.slug}>
                <button
                  type="button"
                  onClick={() => scrollToCourse(course.slug)}
                  aria-current={active === index ? "true" : undefined}
                  className="group flex h-6 items-center gap-3 font-mono text-[0.68rem] tracking-[0.12em] text-white/45 uppercase transition-colors hover:text-white aria-[current]:text-white"
                >
                  <span
                    className="h-px w-4 bg-current transition-[width] duration-300 group-aria-[current]:w-8 motion-reduce:transition-none"
                    aria-hidden
                  />
                  <span className="sr-only xl:not-sr-only">
                    {courseNumber(index)} {course.subject}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.shelf}>
          <ol
            ref={stackRef}
            className={styles.stack}
            inert={isOpen}
            data-open={isOpen ? "" : undefined}
            data-phase={phase}
            data-instant={instant ? "" : undefined}
            aria-label="Courses"
          >
            {courses.map((course, index) => (
              <ShelfBook
                key={course.slug}
                course={course}
                index={index}
                state={openSlug === course.slug ? "open" : undefined}
                pose={openSlug === course.slug ? pose : null}
                slotRef={(node) => {
                  if (node) slots.current.set(course.slug, node);
                  else slots.current.delete(course.slug);
                }}
                linkRef={(node) => {
                  if (node) links.current.set(course.slug, node);
                  else links.current.delete(course.slug);
                }}
                onClick={(event) => onBookClick(event, course.slug)}
              />
            ))}
          </ol>
        </div>

        <p
          className={cn(
            "mx-auto mt-16 max-w-sm text-center text-sm leading-relaxed text-white/50 transition-opacity duration-500",
            isOpen && "opacity-0",
          )}
        >
          Read a little, then put it to work. Every lesson includes an example and a practical exercise.
        </p>
      </div>

      {shownCourse && layout && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-detail-title"
          // While it fades out after closing, the panel is already gone for keyboards and screen readers.
          aria-hidden={phase === "closing" || undefined}
          inert={phase === "closing"}
          onKeyDown={onDialogKeyDown}
          className="pointer-events-none fixed inset-0"
        >
          <button
            type="button"
            onClick={requestClose}
            className={cn(
              buttonClass({ variant: "outline", size: "sm" }),
              "pointer-events-auto fixed backdrop-blur-sm transition-opacity duration-300",
              phase === "closing" ? "opacity-0" : "anim-fade-up",
            )}
            style={{ left: layout.close.left, top: layout.close.top }}
          >
            <ArrowGlyph className="size-4 rotate-180" />
            All courses
          </button>
          <div
            className={cn(
              "pointer-events-auto fixed [scrollbar-width:thin] [scrollbar-color:rgb(255_255_255/0.22)_transparent] overflow-y-auto overscroll-contain transition-opacity duration-300",
              phase === "closing" && "opacity-0",
            )}
            style={layout.panel}
          >
            <CourseDetail
              key={shownCourse.slug}
              course={shownCourse}
              index={shownIndex}
              allLessons={allLessons}
              wide={layout.wide}
              delayed={phase === "opening"}
              titleRef={titleRef}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ShelfBook({
  course,
  index,
  state,
  pose,
  slotRef,
  linkRef,
  onClick,
}: {
  course: Course;
  index: number;
  state: "open" | undefined;
  pose: Pose | null;
  slotRef: (node: HTMLLIElement | null) => void;
  linkRef: (node: HTMLAnchorElement | null) => void;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const done = useLessonsDone(course);
  const finished = done.filter(Boolean).length;
  const poseStyle = pose
    ? ({
        "--x": `${pose.x}px`,
        "--y": `${pose.y}px`,
        "--z": "0px",
        "--rz": "0deg",
        "--ry": `${pose.ry}deg`,
        "--rx": "8deg",
        "--s": pose.s,
      } as React.CSSProperties)
    : undefined;

  return (
    <li ref={slotRef} className={styles.slot} style={bookStyle(course.slug, index)} data-state={state}>
      <a ref={linkRef} href={`/courses/${course.slug}`} onClick={onClick} aria-haspopup="dialog" className={styles.hit}>
        <span className="sr-only">
          {course.title}. {course.lessons.length} lessons
          {finished ? `, ${finished} complete` : ""}.
        </span>
        <CourseBook course={course} index={index} completed={done} style={poseStyle} />
      </a>
    </li>
  );
}

function CourseDetail({
  course,
  index,
  allLessons,
  wide,
  delayed,
  titleRef,
}: {
  course: Course;
  index: number;
  allLessons: boolean;
  wide: boolean;
  delayed: boolean;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const done = useLessonsDone(course);
  // Each part rises in once the book has started to turn.
  const rise = (step: number) => ({ "--d": `${(delayed ? 0.35 : 0) + step * 0.06}s` }) as React.CSSProperties;

  return (
    <div className={cn("flex min-h-full flex-col justify-center", wide ? "py-12" : "pt-2 pb-10")}>
      <p className="anim-fade-up font-mono text-[0.7rem] tracking-[0.14em] text-sky uppercase" style={rise(0)}>
        No. {courseNumber(index)} · {course.subject}
      </p>
      <h2
        id="course-detail-title"
        ref={titleRef}
        tabIndex={-1}
        className={cn(
          styles.detailTitle,
          "anim-fade-up mt-4 font-display tracking-[-0.024em] text-balance text-white",
          wide ? "text-[clamp(2.2rem,3.2vw,2.9rem)] leading-[1.05]" : "text-[2rem] leading-[1.08]",
        )}
        style={rise(1)}
      >
        {course.title}
      </h2>
      <p className="anim-fade-up mt-4 text-base leading-relaxed text-white/70" style={rise(2)}>
        {course.description}
      </p>
      <div className="anim-fade-up mt-6" style={rise(3)}>
        <span aria-hidden className="block h-px w-14 bg-white/25" />
        <p className="mt-6 text-xs text-white/60">You&apos;ll leave with</p>
        <p className="mt-1 text-base text-white">{course.outcome}</p>
      </div>
      <ol aria-label="Lessons" className="anim-fade-up mt-7 border-t border-white/12" style={rise(4)}>
        {course.lessons.map((lesson, i) => {
          const locked = i > 0 && !allLessons;
          return (
            <li
              key={lesson.slug}
              className="flex items-baseline gap-4 border-b border-white/12 py-3 text-sm text-white/85"
            >
              <span className="font-mono text-[0.68rem] text-white/45">{courseNumber(i)}</span>
              <span className="flex-1">{lesson.title}</span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                {done[i] ? (
                  <>
                    <CheckGlyph className="size-3.5 text-sky" />
                    Done
                  </>
                ) : locked ? (
                  <>
                    <LockGlyph className="size-3" />
                    Pro
                  </>
                ) : (
                  `${lesson.readingMinutes} min`
                )}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="anim-fade-up" style={rise(5)}>
        <div className="mt-6">
          <CourseProgress
            lessonKeys={course.lessons.map((lesson) => lessonKey(course.slug, lesson.slug))}
            label={`${course.subject} progress`}
            tone="dark"
          />
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <CourseContinue course={course} allLessons={allLessons} />
          <Link href={`/courses/${course.slug}`} className={buttonClass({ variant: "outline" })}>
            Course overview
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/45">{readingMinutes(course)} min reading, plus time for the exercises.</p>
      </div>
    </div>
  );
}
