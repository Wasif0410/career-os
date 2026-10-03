import { expect, test } from "@playwright/test";

test.describe("home (/dashboard, demo mode)", () => {
  test("a Free student sees their plan, score, matches and upgrade prompts", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Good (morning|afternoon|evening), Maya/);
    await expect(page.getByRole("heading", { name: "This week" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Open guide" })).toBeVisible();
    await expect(page.getByRole("img", { name: /resume score: \d+ out of 100/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Courses" })).toBeVisible();
    await expect(page.getByText(/more with Pro/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Auto-apply with Pro" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Upgrade" })).toBeVisible();
  });

  test("switching the demo to Pro shows the coach's plan and the tracker", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Pro" }).click();
    await expect(page.getByRole("button", { name: "Pro" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("link", { name: "Upgrade" })).toHaveCount(0);
    await expect(page.getByText("2 of 4 done")).toBeVisible();
    await expect(page.getByRole("link", { name: "Tracker" })).toBeVisible();
  });

  test("picking a match shows why it fits and what's missing", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /Backend Intern/ }).click();
    await expect(page.getByRole("button", { name: /Backend Intern/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Docker")).toBeVisible();
  });

  test("the readiness tile shows the current level", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Readiness" })).toBeVisible();
    await expect(page.getByText("Contender", { exact: true }).first()).toBeVisible();
  });

  test("the app is kept out of search engines", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
