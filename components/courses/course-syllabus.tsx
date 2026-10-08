"use client";

import Link from "next/link";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import { LockGlyph } from "@/components/app/lock-glyph";
import { type Course, lessonKey } from "@/lib/courses";
import { cn } from "@/lib/utils";
import { CourseProgress } from "./course-progress";
import { useCourseProgress } from "./progress-store";

export function CourseSyllabus({
  course,
  allLessons,
  current,
  compact = false,
}: {
  course: Course;
  allLessons: boolean;
  current?: string;
  compact?: boolean;
}) {
  const completed = useCourseProgress();
  return (
    <nav aria-label="Course lessons">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className={compact ? "text-sm font-semibold text-ink" : "font-display text-3xl tracking-tight text-ink"}>
          Inside this course
        </h2>
      </div>
      <div className="mb-5">
        <CourseProgress
          lessonKeys={course.lessons.map((item) => lessonKey(course.slug, item.slug))}
          label={`${course.subject} progress`}
        />
      </div>
      <ol className={compact ? "space-y-1" : "divide-y divide-rule border-y border-rule"}>
        {course.lessons.map((item, index) => {
          const locked = index > 0 && !allLessons;
          const active = current === item.slug;
          const done = completed.includes(lessonKey(course.slug, item.slug));
          return (
            <li key={item.slug}>
              <Link
                href={`/courses/${course.slug}/${item.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-start gap-3 transition-colors",
                  compact ? "rounded-lg px-3 py-3 text-sm hover:bg-cobalt-wash" : "py-6 sm:gap-5",
                  active && "bg-cobalt-wash text-cobalt-deep",
                )}
              >
                <span className="mt-0.5 shrink-0 font-mono text-xs text-slate">
                  {done ? <CheckGlyph className="size-4 text-go" /> : String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block group-hover:text-cobalt-deep",
                      compact ? "leading-snug font-medium" : "font-display text-2xl tracking-tight",
                    )}
                  >
                    {item.title}
                  </span>
                  {!compact && (
                    <span className="mt-1 block text-sm leading-relaxed text-slate">{item.description}</span>
                  )}
                  <span
                    className={cn("mt-2 flex items-center gap-2 text-xs", active ? "text-cobalt-deep" : "text-slate")}
                  >
                    {item.readingMinutes} min read
                    {done && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="text-go">Completed</span>
                      </>
                    )}
                    {locked ? (
                      <>
                        <span aria-hidden>·</span>
                        <LockGlyph className="size-3" />
                        Pro lesson
                      </>
                    ) : index === 0 ? (
                      <>
                        <span aria-hidden>·</span>Free lesson
                      </>
                    ) : null}
                  </span>
                </div>
                {!compact && (
                  <ArrowGlyph className="mt-1 size-4 shrink-0 text-cobalt transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
