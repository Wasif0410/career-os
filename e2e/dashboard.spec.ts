import { expect, test } from "@playwright/test";

test.describe("student dashboard (demo mode)", () => {
  test("a Free student sees their score and locked paid features", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Good to see you");
    await expect(page.getByRole("img", { name: /resume score: \d+ out of 100/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /unlock with pro/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Upgrade" })).toBeVisible();
  });

  test("switching the demo to Pro unlocks the paid features", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Pro" }).click();
    await expect(page.getByRole("button", { name: "Pro" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("link", { name: /unlock with/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Upgrade" })).toHaveCount(0);
  });

  test("the app is kept out of search engines", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  for (const path of ["/resume", "/coaching", "/plan", "/courses", "/jobs", "/applications", "/profile", "/billing"]) {
    test(`${path} has a page`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
});
