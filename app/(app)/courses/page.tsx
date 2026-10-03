import type { Metadata } from "next";
import { CourseLibrary } from "@/components/courses/course-library";
import { canAccess } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = { title: "Courses" };

export default async function CoursesPage({ searchParams }: PageProps<"/courses">) {
  const [user, { course }] = await Promise.all([getCurrentUser(), searchParams]);
  const allLessons = !!user && canAccess(user, "courses.allLessons");
  return <CourseLibrary allLessons={allLessons} initialCourse={typeof course === "string" ? course : null} />;
}
