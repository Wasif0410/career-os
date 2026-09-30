"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { DEMO_TIER_COOKIE, demoModeEnabled, parseTier } from "@/lib/auth/current-user";

/** Switches the demo student between Free, Pro and Elite. Does nothing in production. */
export async function setDemoTier(formData: FormData) {
  if (!demoModeEnabled) return;
  const value = formData.get("tier");
  const tier = parseTier(typeof value === "string" ? value : undefined);
  if (!tier) return;

  const store = await cookies();
  store.set(DEMO_TIER_COOKIE, tier, { path: "/", sameSite: "lax", httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
  revalidatePath("/", "layout");
}
