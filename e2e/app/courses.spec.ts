import { expect, test } from "@playwright/test";

test("/courses has a page", async ({ page }) => {
  const response = await page.goto("/courses");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Courses");
});
