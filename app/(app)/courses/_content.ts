/** Fixed imports keep arbitrary route segments out of the module loader. Server use only. */
const lessons = {
  "career-direction/choose-a-direction": () => import("@/content/courses/career-direction/choose-a-direction.mdx"),
  "career-direction/map-your-evidence": () => import("@/content/courses/career-direction/map-your-evidence.mdx"),
  "career-direction/plan-two-weeks": () => import("@/content/courses/career-direction/plan-two-weeks.mdx"),
  "career-direction/review-and-repeat": () => import("@/content/courses/career-direction/review-and-repeat.mdx"),
  "resume/start-with-evidence": () => import("@/content/courses/resume/start-with-evidence.mdx"),
  "resume/write-credible-bullets": () => import("@/content/courses/resume/write-credible-bullets.mdx"),
  "resume/tailor-without-fiction": () => import("@/content/courses/resume/tailor-without-fiction.mdx"),
  "resume/check-the-final-file": () => import("@/content/courses/resume/check-the-final-file.mdx"),
  "linkedin/clarify-your-story": () => import("@/content/courses/linkedin/clarify-your-story.mdx"),
  "linkedin/show-the-work": () => import("@/content/courses/linkedin/show-the-work.mdx"),
  "linkedin/start-a-conversation": () => import("@/content/courses/linkedin/start-a-conversation.mdx"),
  "linkedin/keep-it-current": () => import("@/content/courses/linkedin/keep-it-current.mdx"),
  "github/curate-your-profile": () => import("@/content/courses/github/curate-your-profile.mdx"),
  "github/make-it-runnable": () => import("@/content/courses/github/make-it-runnable.mdx"),
  "github/find-a-useful-contribution": () => import("@/content/courses/github/find-a-useful-contribution.mdx"),
  "github/submit-and-follow-through": () => import("@/content/courses/github/submit-and-follow-through.mdx"),
  "projects/find-a-real-problem": () => import("@/content/courses/projects/find-a-real-problem.mdx"),
  "projects/build-a-small-version": () => import("@/content/courses/projects/build-a-small-version.mdx"),
  "projects/test-and-learn": () => import("@/content/courses/projects/test-and-learn.mdx"),
  "projects/tell-the-project-story": () => import("@/content/courses/projects/tell-the-project-story.mdx"),
  "beyond-tech/follow-your-curiosity": () => import("@/content/courses/beyond-tech/follow-your-curiosity.mdx"),
  "beyond-tech/learn-a-domain": () => import("@/content/courses/beyond-tech/learn-a-domain.mdx"),
  "beyond-tech/listen-to-people": () => import("@/content/courses/beyond-tech/listen-to-people.mdx"),
  "beyond-tech/connect-and-contribute": () => import("@/content/courses/beyond-tech/connect-and-contribute.mdx"),
};

export function loadLesson(key: string) {
  if (!Object.hasOwn(lessons, key)) throw new Error("Unknown course lesson");
  return lessons[key as keyof typeof lessons]();
}
