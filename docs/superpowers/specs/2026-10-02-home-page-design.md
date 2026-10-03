# Home page redesign (`/dashboard`)

**Date:** 2026-10-02 · **Branch:** `page/home` → `dashboard` · **Approved by:** Wasif in chat

## Goal

Make the Home page calm, organized and pleasant to look at, with the marketing site's deep-blue feel. Keep the original card format and content. Use fewer words.

Wasif's direction: "I really like the original format … I just didn't like how many words it had." It should be human readable, look professional and feel good to see. Not cluttered.

## What stays the same

- The content: resume score and top fix, the next step, job matches, coaching, plan and the application tracker.
- The card format: a wide resume card beside a narrow card, then a row of three.
- Tier rules: every lock goes through `Locked` / `lib/access.ts`.
- The app shell (sidebar, header) and all shared components.

## Layout

1. **Hero (deep blue).** The marketing `deep-blue` surface with a static starfield, inside a rounded panel.
   - Eyebrow: the target season and role.
   - Serif `h1`: "Good to see you, *Maya*" (the name in italics, like the marketing headline).
   - One line: the next step's title.
   - One button: the next step's call to action. The separate "Next step" card is folded into the hero.
2. **Where you stand**
   - Resume card (wide): score ring, "Fix this first" and the top fix, then the category bars (locked on Free). "Full report" link.
   - Jobs card (narrow): the match count as a large serif number, a short line, "View matches".
3. **Coaching and applications:** three equal cards. (Shown to Wasif as "With your coach"; renamed because the tracker isn't coaching.)
   - Coaching: next session date, time and coach. "View coaching".
   - Plan: this week's three items as a checklist and "2 of 3 done".
   - Applications: "4 of 10 used this month" with a bar. "Open tracker".
   - On Free, each blurs a short, realistic preview behind "Unlock with Pro".

Phones: everything stacks in the order above.

## Look and feel

- More space: larger gaps between cards and groups, roomier padding.
- Fewer words: no paragraph explanations, one short line per card at most.
- Marketing type: mono eyebrows (`.eyebrow`), serif numbers and greeting, Inter for everything else.
- Soft depth: cards keep the white surface and hairline ring and gain the subtle shadow used in the marketing product UI.
- One accent: cobalt for links, bars and the score ring. Nothing red on Home; the tone stays encouraging.
- Stars are static (no scroll parallax) and twinkle only when reduced motion is off.

## Decision recorded

The current guide says the app has no starfield or scroll effects. Wasif asked for the deep-blue feel, so the Home hero is the one exception: static stars inside the hero only. Still no scroll effects.

## Files

| Path | Change |
|---|---|
| `app/(app)/dashboard/page.tsx` | Rewritten to the layout above |
| `app/(app)/dashboard/_components/` | New: `home-hero.tsx`, `hero-sky.tsx`, `home-cards.tsx` |
| `lib/mock/home.ts` | New demo data: next session, week plan, applications used |
| `e2e/app/home.spec.ts` | Updated for the new structure, Free and Pro |

No edits to shared components, the shell, `lib/access.ts` or `lib/mock/student.ts`.

## Checks

`npm run check`, `npm run test:e2e`, and screenshots of Free, Pro and Elite at desktop and phone width.
