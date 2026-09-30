import { expect, test } from "@playwright/test";

test("/jobs has a page", async ({ page }) => {
  const response = await page.goto("/jobs");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jobs");
});
