export type CourseLesson = {
  slug: string;
  title: string;
  description: string;
  readingMinutes: number;
};

export type Course = {
  slug: string;
  subject: string;
  title: string;
  description: string;
  outcome: string;
  preparation: string;
  outcomes: string[];
  lessons: CourseLesson[];
  sources: { title: string; href: string }[];
};

const lesson = (slug: string, title: string, description: string): CourseLesson => ({
  slug,
  title,
  description,
  readingMinutes: 2,
});

/** Public course metadata only. Lesson prose is loaded on the server after the access check. */
export const courses: Course[] = [
  {
    slug: "career-direction",
    subject: "Direction",
    title: "Your career, with direction",
    description: "Choose a target and build a plan you can actually follow.",
    outcome: "A two-week career plan",
    preparation: "An idea of work you might enjoy. No experience required.",
    outcomes: [
      "Choose a role to investigate",
      "Connect your experience to real requirements",
      "Plan and review a manageable two-week experiment",
    ],
    lessons: [
      lesson("choose-a-direction", "Choose a direction", "Turn three job postings into a useful career hypothesis."),
      lesson(
        "map-your-evidence",
        "Map your evidence",
        "Find the skills you can already demonstrate and the gaps worth exploring.",
      ),
      lesson(
        "plan-two-weeks",
        "Plan your next two weeks",
        "Make room for one concrete outcome in your actual schedule.",
      ),
      lesson("review-and-repeat", "Review, learn, repeat", "Use what happened to choose your next experiment."),
    ],
    sources: [
      {
        title: "NACE · Skills employers want students to demonstrate",
        href: "https://naceweb.org/about-us/press/2026/the-high-impact-skills-college-students-should-showcase-on-their-resumes",
      },
      { title: "Berkeley · Exploring career interests", href: "https://career.berkeley.edu/start-exploring/" },
    ],
  },
  {
    slug: "resume",
    subject: "Resume",
    title: "A resume that shows your work",
    description: "Turn classes, projects and experience into credible evidence.",
    outcome: "A tailored, checked resume",
    preparation: "A target role and a few experiences to draw from. A rough draft is optional.",
    outcomes: [
      "Choose relevant experience",
      "Write specific, truthful accomplishment bullets",
      "Tailor and check the file an employer will receive",
    ],
    lessons: [
      lesson(
        "start-with-evidence",
        "Start with evidence",
        "Choose your strongest material before worrying about templates.",
      ),
      lesson(
        "write-credible-bullets",
        "Write credible bullets",
        "Explain your action, context and result without inventing numbers.",
      ),
      lesson(
        "tailor-without-fiction",
        "Tailor without fiction",
        "Connect real experience to the requirements of a particular role.",
      ),
      lesson(
        "check-the-final-file",
        "Check the final file",
        "Review clarity, links and text after exporting your resume.",
      ),
    ],
    sources: [
      {
        title: "Harvard MCS · Creating a strong resume",
        href: "https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/",
      },
      {
        title: "NACE · Demonstrating skills on a resume",
        href: "https://naceweb.org/about-us/press/2026/the-high-impact-skills-college-students-should-showcase-on-their-resumes",
      },
    ],
  },
  {
    slug: "linkedin",
    subject: "LinkedIn",
    title: "LinkedIn, with a clear story",
    description: "Help people understand your work and where you want to go.",
    outcome: "A clear profile and an outreach draft",
    preparation: "A LinkedIn account if you want to publish. You can do every writing exercise offline.",
    outcomes: [
      "Write a clear headline and About section",
      "Support your story with accessible work samples",
      "Start respectful conversations and maintain your profile",
    ],
    lessons: [
      lesson("clarify-your-story", "Clarify your story", "Write a headline and introduction that sound like you."),
      lesson("show-the-work", "Show the work", "Connect experience entries to evidence someone can inspect."),
      lesson(
        "start-a-conversation",
        "Start a conversation",
        "Draft a personal request to learn from someone's experience.",
      ),
      lesson("keep-it-current", "Keep it current", "Review your links, learning updates and visibility choices."),
    ],
    sources: [
      { title: "LinkedIn · Creating a good profile", href: "https://www.linkedin.com/help/linkedin/answer/a554351" },
      {
        title: "LinkedIn · Featured section and visibility",
        href: "https://www.linkedin.com/help/linkedin/answer/a553419",
      },
      {
        title: "LinkedIn · Email visibility",
        href: "https://www.linkedin.com/help/linkedin/answer/a523134/visibility-of-your-email-address-on-linkedin",
      },
      {
        title: "Berkeley · Informational conversations",
        href: "https://www.career.berkeley.edu/start-exploring/informational-interviews/",
      },
    ],
  },
  {
    slug: "github",
    subject: "GitHub",
    title: "GitHub that speaks for itself",
    description: "Show your best work and make a useful first contribution.",
    outcome: "A portfolio and contribution plan",
    preparation: "A GitHub account and one project, including a clearly labeled class or learning project.",
    outcomes: [
      "Curate work you can explain",
      "Make a project reproducible from its README",
      "Prepare and follow through on a useful contribution",
    ],
    lessons: [
      lesson("curate-your-profile", "Curate your profile", "Help a visitor find and understand your strongest work."),
      lesson("make-it-runnable", "Make it runnable", "Document a project so someone else can try it."),
      lesson(
        "find-a-useful-contribution",
        "Find a useful contribution",
        "Investigate a small problem and learn the project's process.",
      ),
      lesson(
        "submit-and-follow-through",
        "Submit and follow through",
        "Prepare a focused change and respond thoughtfully to review.",
      ),
    ],
    sources: [
      {
        title: "GitHub · Profile READMEs",
        href: "https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme",
      },
      {
        title: "GitHub · Repository READMEs",
        href: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
      },
      {
        title: "GitHub · Contribution graph criteria",
        href: "https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference",
      },
      { title: "Open Source Guides · How to contribute", href: "https://opensource.guide/how-to-contribute/" },
    ],
  },
  {
    slug: "projects",
    subject: "Projects",
    title: "Build something that matters",
    description: "Go from a real problem to a project you can demo and explain.",
    outcome: "A tested project and case study",
    preparation:
      "Basic familiarity with one programming language. Choose a project small enough for your current skills.",
    outcomes: [
      "Write a brief around a real user problem",
      "Build and evaluate one complete workflow",
      "Explain your decisions, results and limitations",
    ],
    lessons: [
      lesson("find-a-real-problem", "Find a real problem", "Choose a user, a task and a question worth testing."),
      lesson(
        "build-a-small-version",
        "Build a small version",
        "Complete one workflow and record the decisions behind it.",
      ),
      lesson("test-and-learn", "Test and learn", "Check behavior and usefulness, then improve one thing."),
      lesson(
        "tell-the-project-story",
        "Tell the project story",
        "Turn your work into a clear demo and honest case study.",
      ),
    ],
    sources: [
      {
        title: "Stanford d.school · Design thinking methods",
        href: "https://dschool.stanford.edu/tools/design-thinking-bootleg",
      },
      {
        title: "GitHub · Documenting a project",
        href: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
      },
    ],
  },
  {
    slug: "beyond-tech",
    subject: "Beyond tech",
    title: "Don't be square",
    description: "Get outside your tech bubble. Build curiosity and domain knowledge.",
    outcome: "A domain field guide and a small experiment",
    preparation: "Curiosity about something beyond your usual technical routine. Free and remote options count.",
    outcomes: [
      "Learn from hobbies, communities and unfamiliar perspectives",
      "Understand the people and workflows in one domain",
      "Connect what you learn to a useful, small experiment",
    ],
    lessons: [
      lesson(
        "follow-your-curiosity",
        "Follow your curiosity",
        "Notice something new outside your usual technical feed.",
      ),
      lesson("learn-a-domain", "Learn a domain", "Map the people, language and constraints around a real workflow."),
      lesson("listen-to-people", "Listen to people", "Use a thoughtful conversation to question your assumptions."),
      lesson("connect-and-contribute", "Connect and contribute", "Turn understanding into a small idea you can test."),
    ],
    sources: [
      { title: "Berkeley · Exploring your interests", href: "https://career.berkeley.edu/start-exploring/" },
      {
        title: "Berkeley · Informational conversations",
        href: "https://www.career.berkeley.edu/start-exploring/informational-interviews/",
      },
      {
        title: "Stanford d.school · Learning through observation and testing",
        href: "https://dschool.stanford.edu/tools/design-thinking-bootleg",
      },
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function lessonKey(course: string, lesson: string) {
  return `${course}/${lesson}`;
}

export function readingMinutes(course: Course) {
  return course.lessons.reduce((total, item) => total + item.readingMinutes, 0);
}
