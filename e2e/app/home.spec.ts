import { expect, test } from "@playwright/test";

test.describe("home (/dashboard, demo mode)", () => {
  test("a Free student sees their score, next step and locked paid features", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Good to see you");
    await expect(page.getByRole("link", { name: /read the guide/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your resume score" })).toBeVisible();
    await expect(page.getByRole("img", { name: /resume score: \d+ out of 100/i })).toBeVisible();
    // Resume breakdown, coaching, plan and applications.
    await expect(page.getByRole("link", { name: /unlock with pro/i })).toHaveCount(4);
    await expect(page.getByRole("link", { name: "Upgrade" })).toBeVisible();
  });

  test("switching the demo to Pro unlocks the paid features", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Pro" }).click();
    await expect(page.getByRole("button", { name: "Pro" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("link", { name: /unlock with/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Upgrade" })).toHaveCount(0);
    await expect(page.getByText("2 of 3 done")).toBeVisible();
    await expect(page.getByRole("link", { name: "Open tracker" })).toBeVisible();
  });

  test("the app is kept out of search engines", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
