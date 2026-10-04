import { expect, test, type Page } from "@playwright/test";

async function openAs(page: Page, tier: "Free" | "Pro" | "Elite") {
  await page.goto("/coaching");
  if (tier === "Free") return;
  const button = page.getByRole("button", { name: tier, exact: true });
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
}

const booked = (page: Page) => page.getByRole("list", { name: "Your booked calls" });

test.describe("coaching (/coaching, demo mode)", () => {
  test("Free can look at the openings, and the last step points to Pro", async ({ page }) => {
    await openAs(page, "Free");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Coaching");
    await expect(page.getByText("Booking starts with Pro").first()).toBeVisible();
    await expect(booked(page)).toHaveCount(0);
    await page.getByRole("button", { name: "Saturday, October 3", exact: true }).click();
    await page.getByRole("button", { name: "11:00 AM with Wasif" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByRole("link", { name: "Book with Pro" })).toHaveAttribute("href", "/pricing");
  });

  test("Pro has used October's call, so booking opens on November", async ({ page }) => {
    await openAs(page, "Pro");
    await expect(booked(page)).toContainText("Strategy with Wasif");
    await expect(page.getByText("October's call is booked.")).toBeVisible();
    await expect(page.getByText("November 2026")).toBeVisible();
    await page.getByRole("button", { name: "Previous month" }).click();
    await expect(page.getByText("You've booked all of October's calls.")).toBeVisible();
  });

  test("Elite books a call in three steps, and it shows up above the card", async ({ page }) => {
    await openAs(page, "Elite");
    await expect(page.getByText("3 of 4")).toBeVisible();
    await page.getByRole("button", { name: /Mock interview/ }).click();
    await page.getByRole("button", { name: /Abishek/ }).click();
    await page.getByRole("button", { name: "Wednesday, October 14", exact: true }).click();
    await page.getByRole("button", { name: "6:30 PM with Abishek" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Mock interview" })).toBeVisible();
    await expect(page.getByText("6:30 PM to 7:30 PM ET, 60 minutes")).toBeVisible();
    await page.getByLabel("Anything Abishek should know?").fill("Bank interview on the 9th");
    await page.getByRole("button", { name: "Book call" }).click();

    await expect(page.getByRole("heading", { name: "You're booked" })).toBeVisible();
    await expect(booked(page)).toContainText("Mock interview with Abishek");
    await expect(page.getByText("2 of 4")).toBeVisible();
  });

  test("a new booking can be undone", async ({ page }) => {
    await openAs(page, "Elite");
    await page.getByRole("button", { name: "11:00 AM with Wasif" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Book call" }).click();
    await expect(booked(page).getByRole("listitem")).toHaveCount(2);
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(booked(page).getByRole("listitem")).toHaveCount(1);
    await expect(page.getByText("3 of 4")).toBeVisible();
  });

  test("Pro can move a booked call to another day", async ({ page }) => {
    await openAs(page, "Pro");
    await page.getByRole("button", { name: "Reschedule" }).click();
    await expect(page.getByText("Moving your Strategy call on Thursday, October 8.")).toBeVisible();
    await expect(page.getByText("October 2026")).toBeVisible();
    await page.getByRole("button", { name: "Thursday, October 15", exact: true }).click();
    await page.getByRole("button", { name: "5:00 PM with Wasif" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Move call" }).click();
    await expect(page.getByRole("heading", { name: "Your call is moved" })).toBeVisible();
    await expect(booked(page)).toContainText("5:00 PM to 5:45 PM ET");
  });

  test("cancelling a call asks first", async ({ page }) => {
    await openAs(page, "Elite");
    await booked(page).getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("button", { name: "Keep it" }).click();
    await expect(booked(page)).toBeVisible();
    await booked(page).getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("button", { name: "Yes, cancel" }).click();
    await expect(booked(page)).toHaveCount(0);
    await expect(page.getByText("4 of 4")).toBeVisible();
  });
});
