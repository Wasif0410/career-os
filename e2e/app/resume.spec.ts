import { expect, test } from "@playwright/test";

test("/resume has a page", async ({ page }) => {
  const response = await page.goto("/resume");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Resume");
});
