/*
 * Each course is bound like a book in a small series: its own cloth colour,
 * ink and thickness, so the library reads as a shelf of distinct objects
 * rather than a grid of identical tiles. Kept out of lib/courses.ts because it
 * is presentation only.
 */

export type CourseIdentity = {
  /** Cloth colour of the binding. */
  cloth: string;
  /** Type and line work printed on the cloth. */
  ink: string;
  /** One accent, used sparingly in the cover art. */
  accent: string;
  /** Spine thickness as a share of the book's height. */
  thickness: number;
};

const identities: Record<string, CourseIdentity> = {
  "career-direction": { cloth: "#ebe3cf", ink: "#17255e", accent: "#2447f5", thickness: 0.125 },
  resume: { cloth: "#1f4537", ink: "#efe5cf", accent: "#e3c169", thickness: 0.14 },
  linkedin: { cloth: "#a8b9ff", ink: "#0a1845", accent: "#2447f5", thickness: 0.115 },
  github: { cloth: "#23262d", ink: "#e9ecf2", accent: "#6fdc9a", thickness: 0.13 },
  projects: { cloth: "#a9482a", ink: "#f6e9d7", accent: "#ffd29a", thickness: 0.145 },
  "beyond-tech": { cloth: "#d6a640", ink: "#2b1c0a", accent: "#7a2f12", thickness: 0.12 },
};

const fallback: CourseIdentity = { cloth: "#0a1845", ink: "#ffffff", accent: "#a8b9ff", thickness: 0.13 };

export function courseIdentity(slug: string): CourseIdentity {
  return identities[slug] ?? fallback;
}
