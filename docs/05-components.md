# Components

Each entry below follows the same shape — when to use it, when not to,
anatomy, states, accessibility — because that shape (not the visual
language) is what this guide borrows from the GOV.UK Design System: a
component page answers "should I reach for this" before it answers "how is
it built."

One component ships in `css/components.css` today: the button. Everything
else in this chapter is documented from how it is already built, consistently,
across ID and Radar — real, working patterns that have not yet been promoted
into the shared package. See [Promotion candidates](#promotion-candidates)
for what that distinction means in practice.

## Buttons — shipped

**When to use:** any action the user takes that is not plain navigation
(submit a form, trigger a state change, confirm or cancel). **When not to
use:** a link to another page or section — use a plain `<a>` styled by the
navigation rules in [Layout](04-layout.md), not a button class.

**Anatomy:** `<button>` or `<a>` with class `.btn`, a leading 7px
current-colour dot (`.btn::before`), label text in the Label register
(SemiBold, `--track-label`, uppercase). `min-height: 44px` guarantees the
WCAG 2.5.5 touch target on every instance without a consumer having to
remember it.

**Variants:**
- `.btn` (primary) — `--accent-btn` background, white text. This token is
  deliberately not `--accent`: white on `--accent` drops to 4.08:1 in dark
  mode, under AA — `--accent-btn` exists specifically to stay theme-
  independent-safe. **Exactly one primary per view**, consistent with every
  design system consulted during the 2026-09-27 survey (GOV.UK, Carbon,
  Primer all converge on this).
- `.btn--ghost` — transparent, `inset` ink ring, fills with ink and flips
  text to paper on hover. Use for the secondary action next to a primary one
  (e.g. Radar's "Sign out").
- `.btn--onDark` — same fill as primary, tuned so it still separates from a
  dark-panel background.
- No `.btn--danger` exists yet. A destructive confirmation today (see
  [Patterns](06-patterns.md#confirming-a-destructive-action)) uses `.btn`
  plus copy that states the consequence, not a distinct colour — if a
  consumer needs a visually distinct destructive button, that is new scope
  for this package, not something to improvise per-consumer with a raw hex.

**States:** `:hover` deepens to `--accent-btn-hover`; `:active` nudges the
button down 1px (`translateY(1px)`), a purely visual affordance with no
accessibility role.

**Accessibility:** the leading dot is a `::before` pseudo-element with no
text content, so it is already excluded from the accessibility tree by
construction — no `aria-hidden` needed or possible on a pseudo-element.
Focus uses the browser's default outline today; a consumer wanting the
purple focus ring documented in the website's `DESIGN.md`
(`outline: 2px solid var(--accent); outline-offset: 2px`, as Radar's own
stylesheet already applies) should add that rule itself until it is decided
whether it belongs in `components.css` — not yet done in this pass.

## Forms and validation

**When to use:** any data entry — sign-in, search, filters, the admin
console's record forms. **Anatomy**, established consistently in `id.css`
and Radar's `STYLESHEET` even though neither imports the other's CSS: a
`<label>` in the Label register above each field; `<input>`/`<select>` at
`min-height: 44px`, `1px solid var(--line)` border, `--radius-btn` (not
`--radius` — inputs are function, not a card), background `var(--card)` (
Radar) or a dedicated off-white `#fdfbfd` (ID, inside its dark contact
panel — see the website's own input recipe in `DESIGN.md`, which uses the
same off-white).

**Focus:** `outline: 2px solid var(--accent); outline-offset: 1px` — a
solid outline, never a glow, on every field in both consumers.

**Errors:** a single, consistent recipe across ID and the website: a
`role="alert"` region, left border in `--accent`, `--paper-2` background,
ink text at full weight (`.error` / `.form-note`). This reads as the de
facto Radixia error-summary pattern; GOV.UK's own Error Summary component
(list every error, link each to its field, focus the summary on submit) is
the natural next step if a form gets more than one field wrong at once — not
yet needed by any current consumer, whose forms are short enough that a
single inline error line has sufficed.

**Accessibility:** ID's OTP input uses `inputmode="numeric"` and
`autocomplete="one-time-code"` — a detail easy to lose if this pattern is
ever rebuilt from a screenshot instead of from the working code.

## Notices, badges, empty states

**When to use a notice:** a page-level message that is not tied to a single
field — ID's `.notice`, styled identically to `.error` (left accent border,
tint background). **When to use a badge:** a short, inline status label next
to a title — Radar's `.badge` (uppercase, Label register, hairline border,
`--radius-btn`), with state variants `.badge-new` / `.badge-contradicts` (
accent border and text, tinted background via `color-mix(in srgb,
var(--accent) 12%, var(--paper))` — derived, not a second hard-coded tint)
and `.badge-update` / `.badge-supersedes` (plain ink, no accent). **When to
use an empty state:** any list or portfolio that can legitimately have
nothing in it yet — Radar's `.empty` class plus a specific sentence
explaining *why* it's empty and *what to do next* (`EMPTY_PORTFOLIO`: "you
are not following anything… choose what to track, then come back" — never a
bare "no results").

**Accessibility:** a badge that carries meaning through colour alone (new vs.
update) also carries it through the text inside it — never colour as the
only signal.

## Tables and lists

Two list shapes recur, both from Radar's `STYLESHEET`, neither yet promoted
into `components.css`:

- **`.docs`** — a vertical list of records (documents, statements, claims),
  each row: a `<time>` cell (fixed width, tabular numerals) beside a content
  block (title link, badge, source line, optional excerpt). This is
  Radixia's de facto **summary list** pattern (GOV.UK's term for
  label/value or date/content rows) — named here so a future consumer
  reaches for "build a `.docs`-shaped list" instead of inventing a table for
  the same data.
- **`<table>`** — plain `border-collapse`, hairline row dividers,
  `tabular-nums` on numeric columns, an uppercase Label-register header row.
  Used for the cost and quality tables in Radar's `/eval` page and the
  admin console's record tables in ID.

**Pagination** has no existing pattern in either consumer — both currently
render a full unpaginated list. Not documented here beyond naming the gap:
inventing a pagination component ahead of a consumer that needs one would be
exactly the kind of speculative component this package's own Principles
chapter warns against.

## Navigation with an active section

Covered in [Layout](04-layout.md#header-and-navigation-shells): the shared
rule is `aria-current="page"` plus a purple underline
(`box-shadow: inset 0 -2px 0 var(--accent)`), not a filled background.

## Inline SVG charts

Radar's `.panel` wraps an SVG chart with its own `<h2>` and an optional
`<figcaption>` (`color: var(--ink-3)`); the SVG itself is unstyled by this
package — chart drawing is data-shape-specific and stays in the consumer, as
[Principles](01-principles.md) would predict. The one shared rule: a chart
that needs a legend renders it as real text (labels, a `<figcaption>`),
never as colour-only meaning, for the same accessibility reason a badge's
colour is never its only signal.

## Shapes

Restated from [Foundations](02-foundations.md#space-radius-motion) because
it is the fastest thing to get wrong when building a new component: buttons
are near-sharp (`--radius-btn`, 3px), cards and panels are soft
(`--radius`, 10px), inputs sit between at 8px. Circles are reserved for
system controls — the theme toggle, the root-dot glyphs (see
[Signature](07-signature.md)). A new component that needs a corner radius
should pick one of these three, not a fourth value.

## Promotion candidates

"Not yet promoted" means: the pattern is proven (used consistently, more
than once, without contradiction between consumers) but has not been copied
into `css/components.css` as a shared class, because that copy is a real
piece of work — writing the class, versioning it, updating every consumer
to read it instead of its own copy — and doing it speculatively, before a
third consumer needs the exact same shape, would be scope this pass
explicitly declined to take on (see the PEG preflight this guide was
written under: docs-only, no `components.css` changes, no version bump).
Candidates, in the rough order a third consumer would likely need them:
badges, the `.docs` summary-list pattern, the notice/error recipe, form
field styling. Promoting one is a normal minor-version change once decided
— write the class, cite this guide's existing documentation of the pattern
instead of re-deriving it, migrate consumers deliberately rather than
leaving two copies to drift.
