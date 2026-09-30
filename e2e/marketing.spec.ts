import { expect, test } from "@playwright/test";

const pages = ["/", "/pricing", "/coaches", "/guides", "/privacy"];

for (const path of pages) {
  test(`${path} loads without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("the marketing site doesn't link to the student app yet", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href^="/dashboard"]')).toHaveCount(0);
});

test("unknown pages return 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
});
