import { cookies } from "next/headers";
import { tierOrder, type TierId } from "@/lib/access";
import { vercelEnv } from "@/lib/site";
import { demoStudent } from "@/lib/mock/student";
import type { CurrentUser } from "./user";

/**
 * Auth is not built yet. Until it is, the app runs as a demo student so the
 * dashboard can be designed and tested without logging in.
 *
 * This is the only place that knows that. When Supabase Auth lands, replace the
 * body of `getCurrentUser` and nothing else in the app has to change.
 */

/**
 * The demo runs locally and on preview deployments. Production serves it only
 * when APP_PASSWORD is set, so proxy.ts asks for the password first.
 */
export const demoModeEnabled = vercelEnv !== "production" || Boolean(process.env.APP_PASSWORD);

/** Cookie set by the tier switcher so the Free, Pro and Elite views can be checked without real accounts. */
export const DEMO_TIER_COOKIE = "cos_demo_tier";

export function parseTier(value: string | undefined): TierId | undefined {
  return tierOrder.find((tier) => tier === value);
}

/** Returns the signed-in user, or null when nobody is signed in. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!demoModeEnabled) return null;
  const store = await cookies();
  const tier = parseTier(store.get(DEMO_TIER_COOKIE)?.value) ?? demoStudent.tier;
  return { ...demoStudent, tier };
}
