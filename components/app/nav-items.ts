import {
  ApplyGlyph,
  BookGlyph,
  ChatGlyph,
  DiagnoseGlyph,
  GoalGlyph,
  HomeGlyph,
  ImproveGlyph,
} from "@/components/brand/glyphs";
import type { Feature } from "@/lib/access";

export type AppNavItem = {
  label: string;
  href: string;
  Glyph: (props: { className?: string }) => React.ReactElement;
  /** When set, the item shows a lock for users whose tier doesn't include it. */
  feature?: Feature;
};

/** The student app's main sections, in sidebar order. Matches the route map in docs/frontend/PHASES.md. */
export const appNav: AppNavItem[] = [
  { label: "Home", href: "/dashboard", Glyph: HomeGlyph },
  { label: "Resume", href: "/resume", Glyph: DiagnoseGlyph },
  { label: "Coaching", href: "/coaching", Glyph: ChatGlyph, feature: "coaching.sessions" },
  { label: "Plan", href: "/plan", Glyph: ImproveGlyph, feature: "plan" },
  { label: "Courses", href: "/courses", Glyph: BookGlyph },
  { label: "Jobs", href: "/jobs", Glyph: GoalGlyph },
  { label: "Applications", href: "/applications", Glyph: ApplyGlyph, feature: "applications.tracker" },
];

export const accountNav = [
  { label: "Profile", href: "/profile" },
  { label: "Billing", href: "/billing" },
] as const;
