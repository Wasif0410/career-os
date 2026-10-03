import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowGlyph } from "@/components/brand/glyphs";
import { LockGlyph } from "@/components/app/lock-glyph";
import { CourseSyllabus } from "@/components/courses/course-syllabus";
import { CourseSources } from "@/components/courses/course-sources";
import { LessonCompletion } from "@/components/courses/course-progress";
import { buttonClass } from "@/components/ui/button";
import { canAccess, requiredTier } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getCourse, lessonKey } from "@/lib/courses";
import { tiers } from "@/lib/site";
import { loadLesson } from "../../_content";

export async function generateMetadata({ params }: PageProps<"/courses/[course]/[lesson]">): Promise<Metadata> {
  const { course: slug, lesson: lessonSlug } = await params;
  const course = getCourse(slug);
  const lesson = course?.lessons.find((item) => item.slug === lessonSlug);
  return { title: lesson ? `${lesson.title} · ${course?.subject}` : "Lesson not found" };
}

export default async function LessonPage({ params }: PageProps<"/courses/[course]/[lesson]">) {
  const [{ course: slug, lesson: lessonSlug }, user] = await Promise.all([params, getCurrentUser()]);
  const course = getCourse(slug);
  const index = course?.lessons.findIndex((item) => item.slug === lessonSlug) ?? -1;
  if (!course || !user || index < 0) notFound();
  const lesson = course.lessons[index];
  const allLessons = canAccess(user, "courses.allLessons");
  const allowed = index === 0 || allLessons;
  // Locked prose is neither imported nor rendered into the HTML/RSC response.
  const Content = allowed ? (await loadLesson(lessonKey(course.slug, lesson.slug))).default : null;
  const next = course.lessons[index + 1];
  const previous = course.lessons[index - 1];
  const unlockTier = tiers.find((tier) => tier.id === requiredTier("courses.allLessons"))?.name ?? "Pro";

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate">
        <Link href="/courses" className="hover:text-cobalt">
          Courses
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/courses/${course.slug}`} className="hover:text-cobalt">
          {course.subject}
        </Link>
      </nav>
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
        <div className="min-w-0">
          <header className="mb-8 border-b border-rule pb-8">
            <p className="mb-4 font-mono text-xs text-slate">
              Lesson {index + 1} of {course.lessons.length} · {lesson.readingMinutes} min read
            </p>
            <h1 className="font-display text-[clamp(2.1rem,4vw,3rem)] leading-[1.08] tracking-tight text-ink">
              {lesson.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate">{lesson.description}</p>
          </header>

          <details className="mb-8 rounded-xl border border-rule bg-surface p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium text-ink">View course lessons</summary>
            <div className="mt-5">
              <CourseSyllabus course={course} allLessons={allLessons} current={lesson.slug} compact />
            </div>
          </details>

          {Content ? (
            <>
              <article
                aria-label="Lesson content"
                className="[&_blockquote]:bg-cobalt-wash [&_h2]:mt-10 [&_h2]:text-[1.7rem] [&_h2:first-child]:mt-0 [&_ol]:text-base [&_p]:text-base [&_p]:leading-[1.8] [&_ul]:text-base"
              >
                <Content />
              </article>
              <LessonCompletion lessonKey={lessonKey(course.slug, lesson.slug)} />
              <CourseSources sources={course.sources} />
            </>
          ) : (
            <section
              className="rounded-2xl border border-rule bg-surface px-6 py-10 sm:px-9"
              aria-labelledby="lesson-locked-title"
            >
              <LockGlyph className="mb-5 size-6 text-cobalt" />
              <h2 id="lesson-locked-title" className="font-display text-3xl tracking-tight">
                Keep learning with {unlockTier}.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate">
                The first lesson of every course is free. {unlockTier} includes the rest of this course and every other
                lesson in the library.
              </p>
              <Link href="/pricing" className={buttonClass({ variant: "primary", className: "mt-6" })}>
                Unlock with {unlockTier}
                <ArrowGlyph className="size-4" />
              </Link>
              <Link
                href={`/courses/${course.slug}/${course.lessons[0].slug}`}
                className="mt-5 block text-sm text-cobalt hover:underline"
              >
                Read the free lesson
              </Link>
            </section>
          )}

          <nav aria-label="Lesson navigation" className="mt-10 grid grid-cols-2 gap-5 border-t border-rule pt-6">
            <Link
              href={previous ? `/courses/${course.slug}/${previous.slug}` : `/courses/${course.slug}`}
              className="group text-sm text-slate hover:text-cobalt"
            >
              <span className="mb-2 flex items-center gap-2 text-xs">
                <ArrowGlyph className="size-3 rotate-180" />
                {previous ? "Previous lesson" : "Course overview"}
              </span>
              <span className="text-ink">{previous?.title ?? course.subject}</span>
            </Link>
            <Link
              href={next ? `/courses/${course.slug}/${next.slug}` : "/courses"}
              className="group text-right text-sm text-slate hover:text-cobalt"
            >
              <span className="mb-2 flex items-center justify-end gap-2 text-xs">
                {next ? "Next lesson" : "Explore another course"}
                <ArrowGlyph className="size-3" />
              </span>
              <span className="text-ink">{next?.title ?? "Back to courses"}</span>
            </Link>
          </nav>
        </div>

        <aside className="sticky top-24 hidden border-l border-rule pl-6 lg:block">
          <Link
            href={`/courses/${course.slug}`}
            className="mb-6 block font-display text-2xl leading-snug tracking-tight hover:text-cobalt"
          >
            {course.title}
          </Link>
          <CourseSyllabus course={course} allLessons={allLessons} current={lesson.slug} compact />
          {!allLessons && (
            <p className="mt-5 text-xs leading-relaxed text-slate">First lesson free. All lessons with Pro.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
