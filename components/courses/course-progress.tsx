"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import { buttonClass } from "@/components/ui/button";
import { courses, type Course, lessonKey as keyForLesson } from "@/lib/courses";
import { cn } from "@/lib/utils";
import { setLessonComplete, useCourseProgress } from "./progress-store";

export function CourseProgress({
  lessonKeys,
  label = "Course progress",
  tone = "light",
}: {
  lessonKeys: string[];
  label?: string;
  /** "dark" on deep blue surfaces. */
  tone?: "light" | "dark";
}) {
  const completed = useCourseProgress();
  const count = lessonKeys.filter((key) => completed.includes(key)).length;
  const percent = Math.round((count / lessonKeys.length) * 100);
  const dark = tone === "dark";
  return (
    <div className={cn("w-full text-xs", dark ? "text-white/60" : "text-slate")}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span>
          {count ? `${count} of ${lessonKeys.length} complete` : `${lessonKeys.length} lessons · Not started`}
        </span>
        <span className="font-mono text-[0.68rem]">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={lessonKeys.length}
        aria-valuenow={count}
        aria-valuetext={`${percent}% complete`}
        className={cn("h-1 overflow-hidden rounded-full", dark ? "bg-white/12" : "bg-rule")}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
            dark ? "bg-sky" : "bg-cobalt",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/** Completion of each lesson in a course, in order. */
export function useLessonsDone(course: Course) {
  const completed = useCourseProgress();
  return course.lessons.map((lesson) => completed.includes(keyForLesson(course.slug, lesson.slug)));
}

export function CourseContinue({ course, allLessons }: { course: Course; allLessons: boolean }) {
  const completed = useCourseProgress();
  const next = course.lessons.find((lesson) => !completed.includes(keyForLesson(course.slug, lesson.slug)));
  const started = course.lessons.some((lesson) => completed.includes(keyForLesson(course.slug, lesson.slug)));
  const locked = next && next !== course.lessons[0] && !allLessons;
  return (
    <Link
      href={`/courses/${course.slug}/${(next ?? course.lessons[0]).slug}`}
      className={buttonClass({ variant: "light" })}
    >
      {!next
        ? "Review this course"
        : locked
          ? "Continue with Pro"
          : started
            ? "Continue learning"
            : "Start the first lesson"}
      <ArrowGlyph className="size-4" />
    </Link>
  );
}

/** The library's summary on deep blue: where to start, or where to pick up again. */
export function LearningProgress({ allLessons }: { allLessons: boolean }) {
  const completed = useCourseProgress();
  if (!completed.length)
    return (
      <Link
        href={`/courses/${courses[0].slug}/${courses[0].lessons[0].slug}`}
        className={buttonClass({ variant: "light" })}
      >
        Start with the essentials
        <ArrowGlyph className="size-4" />
      </Link>
    );
  const unfinished = courses.filter((course) =>
    course.lessons.some((lesson) => !completed.includes(keyForLesson(course.slug, lesson.slug))),
  );
  const nextCourse =
    unfinished.find((course) =>
      course.lessons.some((lesson) => completed.includes(keyForLesson(course.slug, lesson.slug))),
    ) ?? unfinished[0];
  const nextLesson = nextCourse?.lessons.find(
    (lesson) => !completed.includes(keyForLesson(nextCourse.slug, lesson.slug)),
  );
  const finishedCourses = courses.length - unfinished.length;
  const locked = nextCourse && nextLesson !== nextCourse.lessons[0] && !allLessons;
  return (
    <section aria-label="Your learning progress" className="w-full max-w-sm">
      <p className="mb-3 text-sm font-medium text-white">
        {nextCourse ? "Keep going" : "All courses complete"}
        <span className="ml-3 text-xs font-normal text-white/60">
          {finishedCourses} of {courses.length} courses complete
        </span>
      </p>
      <CourseProgress
        lessonKeys={courses.flatMap((course) => course.lessons.map((lesson) => keyForLesson(course.slug, lesson.slug)))}
        label="Overall learning progress"
        tone="dark"
      />
      {nextCourse && nextLesson ? (
        <Link
          href={`/courses/${nextCourse.slug}/${nextLesson.slug}`}
          className="group mt-5 inline-block text-sm text-sky hover:text-white"
        >
          <span className="flex items-center gap-2 font-medium">
            {locked ? "Continue with Pro" : "Continue learning"}
            <ArrowGlyph className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </span>
          <span className="mt-1 block text-xs text-white/60">
            {nextCourse.subject} · {nextLesson.title}
          </span>
        </Link>
      ) : (
        <p className="mt-5 text-sm text-white/60">You can revisit any lesson on the shelf.</p>
      )}
    </section>
  );
}

export function LessonCompletion({ lessonKey }: { lessonKey: string }) {
  const completed = useCourseProgress();
  const done = completed.includes(lessonKey);
  const course = courses.find((item) => item.slug === lessonKey.split("/")[0]);
  const courseDone = course?.lessons.every((item) => completed.includes(keyForLesson(course.slug, item.slug)));
  const [message, setMessage] = useState("");

  function toggle() {
    const saved = setLessonComplete(lessonKey, !done);
    setMessage(
      saved
        ? done
          ? "Marked incomplete. Saved in this browser."
          : "Lesson complete. Saved in this browser."
        : "Updated for this visit. Browser storage is unavailable.",
    );
  }

  return (
    <div className="mt-12 border-t border-rule pt-8">
      <p className="mb-4 text-sm leading-relaxed text-slate">
        Tried the exercise? Mark this lesson complete when you&apos;re ready.
      </p>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={done}
        className={buttonClass({ variant: done ? "ghost" : "primary" })}
      >
        {done && <CheckGlyph className="size-4" />}
        {done ? "Completed · undo" : "Mark lesson complete"}
      </button>
      <p className="mt-3 min-h-5 text-xs text-slate" role="status">
        {message || "Progress stays in this browser. You can undo it anytime."}
      </p>
      {courseDone && (
        <div className="mt-5 rounded-xl bg-go-wash p-5 text-sm text-go">
          <p className="font-medium">Course complete. Nice work.</p>
          <Link href="/courses" className="mt-2 inline-flex items-center gap-2 underline underline-offset-4">
            Choose your next course
            <ArrowGlyph className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
