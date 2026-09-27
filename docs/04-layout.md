# Layout

Layout is the clearest example of the [Principles](01-principles.md) line:
"if two Radixia surfaces would reasonably disagree about it, it does not
belong in this package." All three surfaces this guide covers use the same
handful of primitives (`.wrap`, the two-radius language, the hairline border
system) at three different widths and three different densities, because
they are three different kinds of page.

## The three shells

| Surface | Reading width | Density | Why |
|---|---|---|---|
| `radixia.ai` | `--w-max` (1240px), prose narrows to `--w-prose` (720px) | Generous — `padding-block: clamp(64px, 9vw, 120px)` between sections | A persuade/read surface: marketing and editorial content, meant to be read once and acted on. |
| Radixia ID | `min(100% - 2rem, 28rem)`, `72rem` for the admin console (`main.wide`) | Compact — a single card, form fields at 44px min-height | An auth flow and a small admin console: get in, do the one thing, leave. |
| Radar | `--radar-w` (940px), its own token, not `--w-max` | Dense — tables, stat rows, a nav nine sections wide | A working tool read many times a day. `radar.ts`'s own comment: "the brand's `--w-max` is the website's marketing width; a working tool reads better narrower." |

None of the three reads `--w-max` and overrides it with a literal — ID and
Radar each define their *own* width token (`main` width rules in `id.css`,
`--radar-w` in Radar's `STYLESHEET`) rather than a magic number, so a future
reader of either file can see at a glance that it is a deliberate,
named departure from the brand default rather than an arbitrary value that
drifted from it.

## `.wrap` and its absence

`.wrap` (`base.css`) is the website's own page-width primitive: `max-width:
var(--w-max)`, centred, with fluid inline padding
(`clamp(20px, 4vw, 40px)`). It is used by the website because the website's
pages are wide, marketing-shaped sections that all want the same gutter.

Neither ID nor Radar uses `.wrap` — both define their own container rule at
their own width, for the reason in the table above. This is not an
inconsistency to fix; a data-dense tool centring a 940px column with
`.wrap`'s 1240px max-width and marketing-scale gutters would simply be
wrong for what it is. `.wrap` is a website primitive that happens to live in
the shared file because nothing about its mechanics (centred, capped,
fluid-gutter) is website-specific — only its specific width is.

## Sections and density

The website alternates `.section--tint` (the `--paper-2` band) and
`.section--dark` (the `--dark-panel` / on-dark palette band) to segment a
long page — a marketing-page device, not a brand primitive. ID and Radar have
no equivalent: a sign-in card and an admin table do not have "sections" in
the same sense a landing page does. Where a data-dense surface needs to
separate regions, it uses a hairline border (`.panel` in Radar's stylesheet:
`border-top: 1px solid var(--line)`) rather than a colour band — a plainer
device that suits a page read for information rather than persuasion.

## Header and navigation shells

Both the website and Radar ship a sticky header with the logo, on-light/
on-dark logo swap, and navigation — but at different scales and with
different content, because a marketing nav (a handful of top-level sections,
a language switcher, a CTA button) and a working-tool nav (nine sections,
plus an identity/sign-out slot) are different problems:

- The website's header is 68px, translucent (`backdrop-filter: blur(10px)`
  over a `color-mix` paper background), with a circular theme toggle and an
  EN/IT language switcher.
- Radar's header is two rows: a `.bar` (brand mark + `IDENTITY_SLOT`, the
  signed-in user's name and a sign-out button) above a `nav` row of section
  links. `markCurrentSection()` marks the active link with
  `aria-current="page"`, styled with `box-shadow: inset 0 -2px 0
  var(--accent)` rather than a background change — the underline-draws-in
  motif from the website's own nav, reused because navigation-with-an-active-
  state is a genuinely shared pattern, not a coincidence of two people
  solving the same problem differently.

A future consumer building its own header should treat "active section gets
a purple underline, not a filled background" as the shared rule, and
everything else (row count, what sits in the header, mobile collapse
behaviour) as its own to decide.

## Data-dense patterns

Radar's stylesheet (`STYLESHEET` in `pages.ts`) is the working reference for
what a data-heavy Radixia surface looks like once it exists at scale: a
`.stats` row of pill-shaped counters, a `.docs` list (date + title + badge +
excerpt, one per row, hairline-separated), tables with `tabular-nums` and an
uppercase `--track-label` header row, and a `.panel` for grouping an SVG
chart with its own heading. None of this lives in `components.css` yet —
see [Components](05-components.md#promotion-candidates) for what "not yet
promoted" means and why that is a deliberate, not an oversight.

## Responsive behaviour

- The website collapses to a CSS-only checkbox menu at 880px, with the
  toggle visually hidden but focusable and its focus ring drawn on the
  hamburger — a JavaScript-free mobile nav pattern any consumer with a
  multi-item nav can reuse without needing this package to ship it as a
  component (it is markup + CSS, not a shared class).
- Radar's page shell has no equivalent breakpoint collapse for its nav (nine
  short text links wrap by default); its one documented breakpoint
  (`max-width: 34rem`) stacks `.docs` list items into a single column and
  hides the "who" identity label, which is a space-reclaiming decision for a
  narrow phone viewport rather than a structural layout change.
- ID's admin console (`main.wide`) uses a plain CSS grid
  (`repeat(auto-fit, minmax(12rem, 1fr))`) for its filter forms, which
  collapses to fewer columns automatically as the viewport narrows without a
  named breakpoint at all — the simplest of the three responsive strategies,
  appropriate for the simplest of the three surfaces.
