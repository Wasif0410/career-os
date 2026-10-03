import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowGlyph, CheckGlyph } from "@/components/brand/glyphs";
import { CourseSky } from "@/components/courses/course-sky";
import { CourseSyllabus } from "@/components/courses/course-syllabus";
import { CourseSources } from "@/components/courses/course-sources";
import { CourseContinue } from "@/components/courses/course-progress";
import { canAccess } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getCourse, readingMinutes } from "@/lib/courses";

export async function generateMetadata({ params }: PageProps<"/courses/[course]">): Promise<Metadata> {
  const { course: slug } = await params;
  const course = getCourse(slug);
  return { title: course?.title ?? "Course not found" };
}

export default async function CoursePage({ params }: PageProps<"/courses/[course]">) {
  const [{ course: slug }, user] = await Promise.all([params, getCurrentUser()]);
  const course = getCourse(slug);
  if (!course || !user) notFound();
  const allLessons = canAccess(user, "courses.allLessons");

  return (
    <>
      <header className="deep-blue relative isolate -mx-4 -mt-6 overflow-hidden px-6 py-9 sm:-mx-6 sm:-mt-10 sm:px-10 sm:py-12">
        <CourseSky seed={101} count={35} />
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <ArrowGlyph className="size-4 rotate-180" />
          All courses
        </Link>
        <h1 className="text-display-l anim-fade-up mt-7 max-w-[23ch] text-white">{course.title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">{course.description}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
          <CourseContinue course={course} allLessons={allLessons} />
          <p className="text-xs leading-relaxed text-white/70">
            {course.lessons.length} lessons · {readingMinutes(course)} min reading
            <br />
            Plus time for exercises
          </p>
        </div>
      </header>

      <div className="grid gap-12 pt-10 pb-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          <CourseSyllabus course={course} allLessons={allLessons} />
          {!allLessons && (
            <p className="mt-5 text-sm leading-relaxed text-slate">
              The first lesson is free. All lessons are included with{" "}
              <Link href="/pricing" className="text-cobalt underline decoration-cobalt/25 underline-offset-4">
                Pro
              </Link>
              .
            </p>
          )}
        </div>
        <aside>
          <h2 className="font-display text-3xl tracking-tight text-ink">What you&apos;ll take away</h2>
          <p className="mt-4 leading-relaxed font-medium text-ink">{course.outcome}</p>
          <ul className="mt-5 space-y-4">
            {course.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-3 text-sm leading-relaxed text-slate">
                <CheckGlyph className="mt-1 size-4 shrink-0 text-cobalt" />
                {outcome}
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-sm font-semibold text-ink">Before you begin</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate">{course.preparation}</p>
          <CourseSources sources={course.sources} />
        </aside>
      </div>
    </>
  );
}
