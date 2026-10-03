import { expect, type Page, test } from "@playwright/test";
import { courses } from "../../lib/courses";

const books = (page: Page) => page.getByRole("list", { name: "Courses" }).getByRole("link");
const book = (page: Page, title: string) => books(page).filter({ hasText: title });

test("the library opens a course in place and on to its syllabus and free lesson", async ({ page }) => {
  const response = await page.goto("/courses");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Courses · Career OS");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Courses");
  await expect(books(page)).toHaveCount(6);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await book(page, "A resume that shows your work").click();
  const details = page.getByRole("dialog", { name: "A resume that shows your work" });
  await expect(details).toBeVisible();
  await expect(page).toHaveURL(/\/courses\?course=resume$/);
  await expect(details.getByRole("list", { name: "Lessons" }).getByRole("listitem")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "A resume that shows your work" })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

  await details.getByRole("link", { name: "Course overview" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A resume that shows your work");
  await expect(page.getByRole("navigation", { name: "Course lessons" }).getByRole("link")).toHaveCount(4);
  // Back returns to the open book.
  await page.goBack();
  await expect(page.getByRole("dialog", { name: "A resume that shows your work" })).toBeVisible();
  await page.goForward();
  await page.getByRole("link", { name: "Start the first lesson" }).click();
  await expect(page.getByRole("article", { name: "Lesson content" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Your turn/ })).toBeVisible();
});

test("an open course closes with its button, Escape and Back", async ({ page }) => {
  await page.goto("/courses");
  const github = book(page, "GitHub that speaks for itself");
  const details = page.getByRole("dialog", { name: "GitHub that speaks for itself" });

  await github.click();
  await expect(details).toBeVisible();
  await details.getByRole("button", { name: "All courses" }).click();
  await expect(details).toHaveCount(0);
  await expect(page).toHaveURL(/\/courses$/);
  await expect(github).toBeFocused();

  await github.press("Enter");
  await expect(details).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(details).toHaveCount(0);
  await expect(github).toBeFocused();

  await github.click();
  await expect(details).toBeVisible();
  await page.goBack();
  await expect(details).toHaveCount(0);
  await expect(page).toHaveURL(/\/courses$/);
  await expect(books(page)).toHaveCount(6);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});

test("a course link opens its book directly and modified clicks reach the course page", async ({ page }) => {
  await page.goto("/courses?course=beyond-tech");
  await expect(page.getByRole("dialog", { name: "Don't be square" })).toBeVisible();
  await page.getByRole("button", { name: "All courses" }).click();
  await expect(page).toHaveURL(/\/courses$/);
  await expect(book(page, "Don't be square")).toHaveAttribute("href", "/courses/beyond-tech");
  await page.goto("/courses?course=not-a-course");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(books(page)).toHaveCount(6);
});

test("every first lesson is free and later prose stays out of Free responses", async ({ page, request }) => {
  for (const course of courses) {
    await page.goto(`/courses/${course.slug}/${course.lessons[0].slug}`);
    await expect(page.getByRole("article", { name: "Lesson content" })).toBeVisible();
    for (const lesson of course.lessons.slice(1)) {
      const response = await request.get(`/courses/${course.slug}/${lesson.slug}`);
      const body = await response.text();
      expect(response.ok()).toBeTruthy();
      expect(body).toContain("Keep learning with");
      expect(body).not.toContain('aria-label="Lesson content"');
      expect(body).not.toContain("A worked example");
      expect(body).not.toContain("Mark lesson complete");
    }
  }
});

test("a direct paid-lesson link unlocks with the existing tier switcher", async ({ page }) => {
  await page.goto("/courses/resume/write-credible-bullets");
  await expect(page.getByRole("link", { name: "Unlock with Pro" })).toHaveAttribute("href", "/pricing");
  await expect(page.getByRole("article", { name: "Lesson content" })).toHaveCount(0);
  await page.getByRole("button", { name: "Pro", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pro", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("article", { name: "Lesson content" })).toContainText(
    "These numbers are fictional examples",
  );
  await page.getByRole("button", { name: "Elite", exact: true }).click();
  await expect(page.getByRole("button", { name: "Elite", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("article", { name: "Lesson content" })).toBeVisible();
  await page.getByRole("button", { name: "Free", exact: true }).click();
  await expect(page.getByRole("article", { name: "Lesson content" })).toHaveCount(0);
});

test("all authored lessons render for Pro without runtime errors", async ({ page, context }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.addCookies([{ name: "cos_demo_tier", value: "pro", url: test.info().project.use.baseURL! }]);
  for (const course of courses) {
    for (const lesson of course.lessons) {
      await page.goto(`/courses/${course.slug}/${lesson.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
      await expect(page.getByRole("article", { name: "Lesson content" })).toContainText("Leave with:");
      await expect(page.getByRole("button", { name: "Mark lesson complete", exact: true })).toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});

test("completion survives reload and can be undone from the lesson", async ({ page }) => {
  await page.goto("/courses");
  await page.getByRole("link", { name: "Start with the essentials" }).click();
  await page.getByRole("button", { name: "Mark lesson complete", exact: true }).click();
  await expect(page.getByRole("button", { name: "Completed · undo" })).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("button", { name: "Completed · undo" })).toBeVisible();
  await page.goto("/courses");
  await expect(book(page, "Your career, with direction")).toHaveAccessibleName(/1 complete/);
  await expect(page.getByRole("link", { name: "Start with the essentials" })).toHaveCount(0);
  // On Free the next lesson is the upgrade boundary.
  await expect(page.getByRole("link", { name: /Continue with Pro/ })).toHaveAttribute(
    "href",
    "/courses/career-direction/map-your-evidence",
  );
  await page.goto("/courses/career-direction/choose-a-direction");
  await page.getByRole("button", { name: "Completed · undo" }).click();
  await expect(page.getByRole("button", { name: "Mark lesson complete", exact: true })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("progress drives the library, syllabus and next lesson through course completion", async ({
  page,
  context,
  isMobile,
}) => {
  await context.addCookies([{ name: "cos_demo_tier", value: "pro", url: test.info().project.use.baseURL! }]);
  const course = courses[0];
  await page.goto(`/courses/${course.slug}`);
  await expect(page.getByRole("progressbar", { name: `${course.subject} progress` })).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
  await page.getByRole("link", { name: "Start the first lesson" }).click();
  for (let index = 0; index < course.lessons.length; index++) {
    await page.getByRole("button", { name: "Mark lesson complete", exact: true }).click();
    if (isMobile) await page.getByText("View course lessons", { exact: true }).click();
    const syllabus = page.getByRole("navigation", { name: "Course lessons" }).filter({ visible: true });
    await expect(syllabus.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(index + 1));
    await expect(syllabus.locator('a[aria-current="page"]')).toContainText("Completed");
    await page.goto("/courses");
    await expect(page.getByRole("progressbar", { name: "Overall learning progress" })).toHaveAttribute(
      "aria-valuenow",
      String(index + 1),
    );
    await book(page, course.title).click();
    await expect(
      page.getByRole("dialog", { name: course.title }).getByRole("progressbar", { name: `${course.subject} progress` }),
    ).toHaveAttribute("aria-valuenow", String(index + 1));
    await page.getByRole("button", { name: "All courses" }).click();
    if (index < course.lessons.length - 1) {
      await expect(page.getByRole("link", { name: /Continue learning/ })).toHaveAttribute(
        "href",
        `/courses/${course.slug}/${course.lessons[index + 1].slug}`,
      );
      await page.goto(`/courses/${course.slug}`);
      await page.getByRole("link", { name: "Continue learning", exact: true }).click();
    }
  }
  await page.reload();
  await expect(page.getByRole("region", { name: "Your learning progress" })).toContainText("1 of 6 courses complete");
  await page.goto(`/courses/${course.slug}`);
  await expect(page.getByRole("link", { name: "Review this course" })).toBeVisible();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "100% complete");
  await page.getByRole("link", { name: "Review this course" }).click();
  await expect(page.getByText("Course complete. Nice work.")).toBeVisible();
  await page.getByRole("button", { name: "Completed · undo" }).click();
  await expect(page.getByText("Course complete. Nice work.")).toHaveCount(0);
  await page.goto(`/courses/${course.slug}`);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "3");
  await expect(page.getByRole("link", { name: "Continue learning", exact: true })).toHaveAttribute(
    "href",
    `/courses/${course.slug}/${course.lessons[0].slug}`,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test("Free progress points to the upgrade boundary without unlocking content", async ({ page }) => {
  await page.goto("/courses/resume/start-with-evidence");
  await page.getByRole("button", { name: "Mark lesson complete", exact: true }).click();
  await page.goto("/courses/resume");
  await page.getByRole("link", { name: "Continue with Pro", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Keep learning with Pro." })).toBeVisible();
  await page.goto("/courses");
  await expect(page.getByRole("link", { name: /Continue with Pro/ })).toHaveAttribute(
    "href",
    "/courses/resume/write-credible-bullets",
  );
});

test("malformed progress and blocked storage do not break learning", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("career-os.course-progress.v1", "{bad data"));
  await page.goto("/courses");
  await expect(books(page)).toHaveCount(6);
  await page.goto("/courses/career-direction/choose-a-direction");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage unavailable");
    };
  });
  await page.getByRole("button", { name: "Mark lesson complete", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Updated for this visit. Browser storage is unavailable.");
  await expect(page.getByRole("button", { name: "Completed · undo" })).toBeVisible();
});

test("navigation, sources and responsive layout remain usable", async ({ page, isMobile }) => {
  await page.goto("/courses/github/curate-your-profile");
  if (isMobile) await page.getByText("View course lessons", { exact: true }).click();
  const syllabus = page.getByRole("navigation", { name: "Course lessons" }).filter({ visible: true });
  await expect(syllabus.locator('a[aria-current="page"]')).toContainText("Curate your profile");
  await page.getByText("Sources & further reading", { exact: true }).click();
  await expect(page.getByRole("link", { name: /GitHub · Profile READMEs/ })).toHaveAttribute("href", /docs.github.com/);
  await page
    .getByRole("navigation", { name: "Lesson navigation" })
    .getByRole("link", { name: /Next lesson/ })
    .click();
  await expect(page.getByRole("heading", { name: "Keep learning with Pro." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.goto("/courses/not-a-course/not-a-lesson");
  await expect(page.getByRole("heading", { name: "This page isn't on the plan." })).toBeVisible();
});

test("reduced motion keeps course pages readable without hydration errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/courses");
  await expect(page.getByRole("heading", { level: 1 }).locator("..")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".star-twinkle").first()).toHaveCSS("animation-name", "none");
  // The book's entrance wrapper.
  await expect(books(page).first().locator(":scope > span[aria-hidden]")).toHaveCSS("animation-name", "none");
  await book(page, "A resume that shows your work").click();
  await expect(page.getByRole("dialog", { name: "A resume that shows your work" })).toBeVisible();
  await page.goto("/courses/resume");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("animation-name", "none");
  await expect(page.locator("header .star-twinkle").first()).toHaveCSS("animation-name", "none");
  expect(errors).toEqual([]);
});
