import type { CurrentUser } from "@/lib/auth/user";

/*
 * Example data for building the app before the database exists. Nothing here
 * is a real person. Each export is shaped like the table it stands in for, so
 * swapping it for a Supabase query later is a one-line change at the call site.
 */

export const demoStudent: CurrentUser = {
  id: "demo-student",
  firstName: "Maya",
  lastName: "Chen",
  email: "maya@example.com",
  role: "student",
  tier: "free",
  target: { role: "Software engineering internship", season: "Summer 2027" },
};
