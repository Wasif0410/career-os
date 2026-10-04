import { expect, test } from "@playwright/test";

test.describe("resume (/resume, demo mode)", () => {
  test("a Free student sees the score, the top fix on their resume and what Pro adds", async ({ page }) => {
    const response = await page.goto("/resume");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your resume");
    await expect(page.getByRole("img", { name: "Resume score: 64 out of 100" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Score" })).toContainText("Technical depth");
    await expect(page.getByRole("button", { name: /Show results, not tasks/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.getByRole("article", { name: "Your resume" })).toContainText("Resolved number tickets a week");
    await expect(page.getByText(/3 more fixes, worth \+12/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Unlock with Pro" })).toBeVisible();
    await expect(page.getByRole("link", { name: "See it with Pro" })).toBeVisible();
    await expect(page.getByRole("link", { name: "See Elite" })).toBeVisible();
  });

  test("on Free, the locked fixes' wording never reaches the page", async ({ page }) => {
    await page.goto("/resume");
    const html = await page.content();
    expect(html).not.toContain("Move Projects above Coursework");
    expect(html).not.toContain("Put Projects right after Education");
  });

  test("Pro sees every fix, and opening one marks its lines on the resume", async ({ page }) => {
    await page.goto("/resume");
    await page.getByRole("button", { name: "Pro", exact: true }).click();
    await expect(page.getByRole("button", { name: "Pro", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("0 of 4 done")).toBeVisible();

    const fix = page.getByRole("button", { name: /Name the stack in project titles/ });
    await fix.click();
    await expect(fix).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Course Planner · React, Flask, SQLite")).toBeVisible();
    await expect(page.getByRole("link", { name: /Tailor without fiction/ })).toHaveAttribute(
      "href",
      "/courses/resume/tailor-without-fiction",
    );
    await expect(page.getByText("Unit testing")).toBeVisible();
  });

  test("marking a fix done is remembered on this device", async ({ page }) => {
    await page.goto("/resume");
    await page.getByRole("button", { name: "Mark as done" }).click();
    await expect(page.getByText("1 of 4 done")).toBeVisible();
    await page.reload();
    await expect(page.getByText("1 of 4 done")).toBeVisible();
    await expect(page.getByRole("button", { name: "Done", exact: true })).toHaveAttribute("aria-pressed", "true");
  });

  test("the 7-second skim shows what a recruiter sees first", async ({ page }) => {
    await page.goto("/resume");
    await page.getByRole("button", { name: "7-second skim" }).click();
    await expect(page.getByText(/Recruiters spend about 7 seconds/)).toBeVisible();
    await expect(page.getByRole("article", { name: "Your resume" })).not.toContainText("Resolved number");

    await page.getByRole("button", { name: /Show results, not tasks/ }).click();
    await expect(page.getByRole("button", { name: "Fixes", exact: true })).toHaveAttribute("aria-pressed", "true");
  });

  test("Elite sees the coach's review", async ({ page }) => {
    await page.goto("/resume");
    await page.getByRole("button", { name: "Elite", exact: true }).click();
    await expect(page.getByRole("button", { name: "Elite", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/Course Planner is your best work/)).toBeVisible();
  });

  test("the upload checks the file in the browser before anything is sent", async ({ page }) => {
    await page.goto("/resume");
    const input = page.locator('input[type="file"]');

    await input.setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
    // Next.js keeps its own (empty) route announcer with role="alert", so find ours by its text.
    const error = page.getByRole("alert").filter({ hasText: "isn't a PDF" });
    await expect(error).toBeVisible();

    await input.setInputFiles({ name: "resume.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") });
    await expect(page.getByText(/Looks good/)).toBeVisible();
    await expect(error).toHaveCount(0);
  });
});
