import Link from "next/link";
import { ArrowGlyph } from "@/components/brand/glyphs";
import { canAccess } from "@/lib/access";
import type { CurrentUser } from "@/lib/auth/user";
import type { Course } from "@/lib/mock/home";
import { cn } from "@/lib/utils";
import styles from "./home.module.css";

/*
 * Courses on the deep blue surface, over a slowly drifting star field. Paid
 * students pick up where they left off; Free students start lesson 1, which
 * is free in every course.
 */

type Star = { x: number; y: number; size: number; opacity: number; duration: number; delay: number };

// Seeded, so the server always draws the same sky.
function sky(seed: number, count: number, near: boolean): Star[] {
  let a = seed;
  const rand = () => (a = (a * 16807) % 2147483647) / 2147483647;
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return Array.from({ length: count }, () => ({
    x: r2(rand() * 100),
    y: r2(rand() * 100),
    size: r2(near ? 1.4 + rand() * 1.4 : 0.6 + rand()),
    opacity: r2(near ? 0.55 + rand() * 0.4 : 0.2 + rand() * 0.45),
    duration: r2(3 + rand() * 4),
    delay: r2(rand() * 5),
  }));
}

const farStars = sky(7, 30, false);
const nearStars = sky(19, 12, true);

/** Two copies of each layer stacked, so the upward drift loops without a seam. */
function StarLayer({ stars, speed }: { stars: Star[]; speed: number }) {
  return (
    <div
      className={cn("absolute inset-x-0 top-0 h-[200%]", styles.drift)}
      style={{ "--speed": `${speed}s` } as React.CSSProperties}
    >
      {[0, 50].map((offset) =>
        stars.map((s, i) => (
          <span
            key={`${offset}-${i}`}
            className="star-twinkle absolute rounded-full bg-white"
            style={
              {
                left: `${s.x}%`,
                top: `${offset + s.y / 2}%`,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                boxShadow: s.size > 2.2 ? "0 0 6px rgb(168 185 255 / 0.8)" : undefined,
                "--o": s.opacity,
                "--dur": `${s.duration}s`,
                "--delay": `${s.delay}s`,
              } as React.CSSProperties
            }
          />
        )),
      )}
    </div>
  );
}

function Cosmos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className={cn(
          "absolute top-[18%] left-[15%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(93_123_255/0.22),transparent)] blur-[10px]",
          styles.nebula,
        )}
      />
      <StarLayer stars={farStars} speed={90} />
      <StarLayer stars={nearStars} speed={50} />
    </div>
  );
}

function SkyMeter({ value }: { value: number }) {
  return (
    <span aria-hidden className="block h-1.5 overflow-hidden rounded-full bg-white/10">
      <span
        className={cn("block h-full rounded-full bg-sky", styles.grow)}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </span>
  );
}

export function CoursesCard({
  user,
  courses,
  style,
}: {
  user: Pick<CurrentUser, "tier">;
  courses: Course[];
  style?: React.CSSProperties;
}) {
  const allLessons = canAccess(user, "courses.allLessons");
  // Paid: the course in progress. Free: the first course whose free lesson is still ahead.
  const current = allLessons
    ? (courses.find((c) => c.next && c.done > 0) ?? courses[0])
    : (courses.find((c) => c.done === 0) ?? courses[0]);
  const lesson = allLessons
    ? current.next
    : { number: 1, title: current.next?.title ?? current.title, minutes: current.next?.minutes ?? 10 };
  const others = courses.filter((c) => c !== current);

  return (
    <section
      style={style}
      className="deep-blue anim-fade-up relative isolate min-w-0 overflow-hidden rounded-[18px] p-5 shadow-[0_30px_70px_-40px_rgb(36_71_245/0.7)] ring-1 ring-white/[0.06] sm:p-6"
    >
      <Cosmos />
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-white">Courses</h2>
        <Link
          href="/courses"
          className="group inline-flex items-center gap-1 text-[0.82rem] font-medium text-sky hover:text-white"
        >
          All courses
          <ArrowGlyph className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </header>

      {lesson && (
        <div className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 ring-inset">
          <p className="text-[0.75rem] text-sky">
            {allLessons ? "Continue" : "Free lesson"} · Lesson {lesson.number} of {current.lessons} · {lesson.minutes}{" "}
            min
          </p>
          <p className="mt-1 text-[1.05rem] leading-snug font-medium text-white">{lesson.title}</p>
          <p className="mt-0.5 text-[0.8rem] text-white/60">{current.title}</p>
          {allLessons && (
            <div className="mt-3.5 flex items-center gap-3">
              <span className="flex-1">
                <SkyMeter value={current.done / current.lessons} />
              </span>
              <span className="font-mono text-[0.72rem] text-white/60">
                {current.done}/{current.lessons}
              </span>
            </div>
          )}
          <Link
            href="/courses"
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-[0.82rem] font-medium text-ink shadow-[0_10px_30px_-12px_rgb(168_185_255/0.55)] hover:bg-[#eef1ff]"
          >
            {allLessons ? "Resume lesson" : "Start lesson"}
            <ArrowGlyph className="size-3.5" />
          </Link>
        </div>
      )}

      <ul className="mt-3 grid gap-0.5">
        {others.map((c) => (
          <li key={c.slug}>
            <Link
              href="/courses"
              className="group -mx-2 flex items-center gap-4 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.06]"
            >
              <span className="min-w-0 flex-1 truncate text-[0.85rem] text-white/85 group-hover:text-white">
                {c.title}
              </span>
              {allLessons ? (
                <span className="flex w-28 items-center gap-2">
                  <span className="flex-1">
                    <SkyMeter value={c.done / c.lessons} />
                  </span>
                  <span className="font-mono text-[0.7rem] text-white/55">
                    {c.done}/{c.lessons}
                  </span>
                </span>
              ) : (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.7rem] text-white/75">Lesson 1 free</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
