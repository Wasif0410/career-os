import { expect, test } from "@playwright/test";

test("/applications has a page", async ({ page }) => {
  const response = await page.goto("/applications");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Applications");
});
