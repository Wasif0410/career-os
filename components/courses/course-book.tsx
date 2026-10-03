import { Mark } from "@/components/brand/logo";
import { type Course, readingMinutes } from "@/lib/courses";
import { cn } from "@/lib/utils";
import { CourseArt } from "./course-art";
import { courseIdentity } from "./course-identity";
import styles from "./course-shelf.module.css";

export const courseNumber = (index: number) => String(index + 1).padStart(2, "0");

/** The CSS variables that bind a book: cloth, ink and thickness. Set them on the book's slot. */
export function bookStyle(slug: string, index: number) {
  const { cloth, ink, thickness } = courseIdentity(slug);
  return { "--cloth": cloth, "--ink": ink, "--t": thickness, "--i": index } as React.CSSProperties;
}

/**
 * One course as a hardcover book: six faces of a CSS 3D box. Purely visual, so
 * it is hidden from assistive technology; the link around it carries the name.
 */
export function CourseBook({
  course,
  index,
  completed,
  style,
}: {
  course: Course;
  index: number;
  /** Which lessons are complete, shown as dots on the spine once the course is started. */
  completed: boolean[];
  style?: React.CSSProperties;
}) {
  const { accent } = courseIdentity(course.slug);
  const number = courseNumber(index);
  const lessons = course.lessons.length;

  return (
    <span className={styles.enter} aria-hidden>
      <span className={styles.book} style={style}>
        <span className={cn(styles.face, styles.cloth, styles.cover)}>
          <span className={styles.coverInner}>
            <span className={styles.coverTop}>
              <span className={styles.coverBrand}>
                <Mark className={styles.coverMark} />
                Career OS
              </span>
              <span>No. {number}</span>
            </span>
            <span className={styles.coverSubject}>{course.subject}</span>
            <span className={styles.coverTitle}>{course.title}</span>
            <CourseArt slug={course.slug} accent={accent} className={styles.coverArt} />
            <span className={styles.coverFoot}>
              <span>{lessons} lessons</span>
              <span>{readingMinutes(course)} min read</span>
            </span>
          </span>
        </span>

        <span className={cn(styles.face, styles.cloth, styles.back)}>
          <span className={styles.backInner}>
            <span className={styles.backText}>{course.description}</span>
            <Mark className={styles.coverMark} />
          </span>
        </span>

        <span className={cn(styles.face, styles.cloth, styles.spine)}>
          <span className={styles.spineText}>
            <span className={styles.spineSubject}>
              <span>{number}</span>
              <span>{course.subject}</span>
            </span>
            <span className={styles.spineTitle}>{course.title}</span>
            <span className={styles.spineEnd}>
              {completed.some(Boolean) && (
                <span className={styles.dots}>
                  {course.lessons.map((lesson, i) => (
                    <span key={lesson.slug} className={styles.dot} data-done={completed[i] ? "" : undefined} />
                  ))}
                </span>
              )}
              <Mark className={styles.spineMark} />
            </span>
          </span>
        </span>

        <span className={cn(styles.face, styles.pages, styles.fore)} />
        <span className={cn(styles.face, styles.pages, styles.head)} />
        <span className={cn(styles.face, styles.pages, styles.tail)} />
      </span>
    </span>
  );
}
