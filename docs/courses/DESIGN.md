# Courses design and verification

## Source of truth: Career OS

Inspected the live local homepage, public Guides page, app dashboard and course placeholder, together with their source. The site's existing design takes precedence over external references or image concepts.

| Existing source | Design rule used |
| --- | --- |
| `app/layout.tsx` | Newsreader normal and italic display type; Inter body/UI; JetBrains Mono for restrained metadata. No new font. |
| `app/globals.css` | Exact paper `#f2f5fc`, surface `#ffffff`, ink `#0a1433`, cobalt `#2447f5`, sky `#a8b9ff`, midnight `#050b24`, navy `#0a1845`, rule `#e1e6f1`. Reuse `deep-blue`, grain and the existing type scale. |
| `components/landing/hero.tsx` | Light serif headline, sky-blue italic emphasis, split title/supporting copy, a single primary action and generous negative space. |
| `components/ui/section-heading.tsx` | Tight serif tracking, short supporting copy, clear title/body hierarchy. |
| `components/brand/starfield.tsx` | The actual sparse, seeded stars and restrained scroll drift. No galaxy photograph or planet background. |
| `components/ui/button.tsx` | Existing pill controls and arrow glyphs; no new button system. |
| `app/(marketing)/guides/page.tsx` | Content-focused navigation and readable lesson typography. |
| `components/motion-provider.tsx` and global motion rules | Honor reduced motion. Use existing entrance animations, brief stagger and restrained hover feedback. |
| `app/(app)/layout.tsx` | Preserve sidebar, header, demo tier switcher and content width. No shared shell edits. |

Wasif explicitly requested the homepage's cosmic treatment on Courses. This is a page-specific extension of the demo app's visual style; the marketing header/footer remain separate.

## External reference review

Opened [YC's directory](https://www.ycombinator.com/companies) and inspected [Resend's YC profile](https://www.ycombinator.com/companies/resend) and [Mintlify's YC profile](https://www.ycombinator.com/companies/mintlify). Captured the actual [Resend](https://resend.com) and [Mintlify](https://www.mintlify.com) homepages at 1536 × 1024.

- Resend: restrained composition, strong typography, limited competing actions.
- Mintlify: clear content navigation and compact topic entry points.
- Use these only for hierarchy and spacing. Career OS supplies the colors, type, motion and components.

## Implemented structure

Catalog → course overview → four short lessons. Six topics: career direction, resume, LinkedIn, GitHub/contributions, projects and broader domain knowledge.

The catalog has a single cosmic introduction and six compact course tiles. Each tile contains a simple constellation cover, title, one description, completion count, slim progress bar and one link. There are no filters, search, nested deliverable cards or category badges for a six-course library. Course details appear after opening a tile. Once a learner completes a lesson, a compact library row shows overall lesson progress, completed courses and a link to the next unfinished lesson.

The overview contains a four-lesson syllabus, outcomes, preparation and collapsible sources. Its primary action starts, continues or reviews the course based on saved completion. Syllabi show a progress bar and completed lesson checks. Completing every lesson displays a course-complete message and next-course link. Continue prioritizes an unfinished course with existing completions, then the first unstarted course; it does not mark lessons automatically or bypass server-side tier gating. The reader uses a focused article column, a compact syllabus on desktop and a native disclosure on phones. Examples and exercises are in the lesson; navigation and reversible completion follow it. Reading estimates exclude exercises.

## Visual reference

Selected wide concept: `C:/Users/wa/.codex/generated_images/01a0ff08-47fd-71e3-8b98-8571cdb23f74/exec-a2eb3372-ec23-4658-830b-89f9699a3e34.png`, generated with the built-in image tool and inspected with `view_image`. This is a working reference, not user-approved artwork. The first dense concept and the later plain-list concept were rejected and are not implementation specs.

Allowed opening copy: “Make your / next move.”, “Short courses to build your skills, tell your story, and find work that fits.”, “Start with the essentials”, “Courses”, “First lessons are free. Learn at your own pace.” Course copy comes from `lib/courses.ts`.

Intentional differences from the generated reference: use the actual logo, shell, Newsreader metrics, shared max-width and sparse starfield; omit its invented planet and photographic galaxy. Covers are scalable code-native motifs using the established palette. No external media is shipped.

## Verification record

Visual inspection uses Playwright with the installed Microsoft Edge browser. The Browser plugin/skill is not available, and the bundled Playwright Chromium executable is absent. Temporary scripts, screenshots and traces stay outside the repository.

Compared the selected concept with the rendered implementation through `view_image`. Inspected: desktop composition, serif/italic hierarchy, actual blue/paper colors, cover geometry, card spacing, CTA placement, body readability and phone wrapping. The implementation follows the revised concept with the intentional brand corrections above. The above-the-fold copy matches the allowed list. No material unintended visual mismatch remains in the inspected views; Wasif's design review is pending.

Desktop inspection: 1536 × 1024. Phone inspection: 375 × 812. Catalog has no horizontal document overflow. Inspected overview and lesson reader as well as the catalog. Screenshots: `C:/Users/wa/.codex/courses-catalog.png`, `courses-overview.png`, `courses-lesson.png`, `courses-mobile.png`.

Functional checks: catalog → overview → free lesson; direct paid links; Free/Pro/Elite switching; all 24 authored lessons; source disclosure; previous/next navigation; browser-local completion after reload and undo; malformed/blocked storage; unknown course/lesson handling. Paid prose is absent from Free HTML/RSC responses. A course-local client wrapper mounts the shared decorative starfield after hydration, fixing the reduced-motion hydration warning without changing the shared component. Reduced-motion browser checks now pass.

Final screenshots after that fix: `C:/Users/wa/.codex/courses-catalog-final.png` (1536 × 1024) and `C:/Users/wa/.codex/courses-mobile-final.png` (375 × 812). Both were inspected with view_image alongside the wide concept. Normal-motion and reduced-motion console checks report no application errors. Browser identity, meaningful content, absence of a framework error overlay, screenshots and interactive navigation all passed.

Automated checks and final status are recorded in `docs/agents/LOG.md`. Scope remains local demo UI, without account sync or payment integration.

Progress enhancement verified on desktop and phone: per-course and overall accessible progress bars, resume destinations, full course completion, review, undo and Free upgrade boundary. Existing v1 browser storage is preserved. Screenshots: C:/Users/wa/.codex/courses-progress-desktop.png and C:/Users/wa/.codex/courses-progress-phone.png, inspected after entrance animations settled.

## 3D library (Claude, 2026-10-02)

The course library is a 3D stack of books on the existing cosmic background. The catalog's tile grid was replaced; overviews and lessons are unchanged.

- **Books, not tiles.** Each course is a CSS 3D hardcover (`components/courses/course-book.tsx`, `course-shelf.module.css`): front and back cover, spine, and three page edges. Faces are laid out in upright-book space and the book is turned to lie flat (`rotateZ(-90deg) rotateY(90deg)`), spine towards the reader. All sizes derive from the shelf width (`--L` height, `--W` width, `--T` thickness).
- **One identity per course** (`course-identity.ts`): cloth, ink, accent and thickness. Covers carry a drawing of the course's idea (`course-art.tsx`): a route across a star chart, a ruled page, a network, a contribution graph, a drafted cube, orbits leaving a square. The Career OS mark is stamped in one colour, like a publisher's device.
- **Camera.** The stack's `perspective-origin` follows the middle of the visible screen as you scroll, so books above it show their undersides and books below show their covers. Hover and keyboard focus slide a book towards you; focus also outlines the spine.
- **Opening a course** swings the book upright to the left of its details (lessons, progress, start or continue, overview). The rest of the stack recedes. The course is in the URL (`?course=slug`) so Back closes it and direct links open it without the swing. Scroll is locked while open; focus moves to the course title and back to the book; Escape and "All courses" close; Tab stays inside.
- **Reduced motion:** no entrance, no camera, no swing. A still stack tilted just enough to show each cover's edge; courses open instantly.
- **Backdrop.** The deep blue sky is fixed beside the app sidebar (`w-60`, 15rem) and below the header, whose height is measured from `#main`. No shared layout changes.
- **Why CSS 3D, not WebGL:** real, crisp text on spines and covers; ordinary links and focus; no new dependency or canvas fallback.
