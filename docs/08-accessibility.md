# Accessibility

## Target and posture

**WCAG 2.2 AA, best-effort — not a formally gated requirement.** This
package measures contrast at the point a colour token is authored and
documents the ratio in the comment above it (see
[Foundations](02-foundations.md#colour)); it does not run an automated
per-component accessibility check in CI, and this guide does not carry a
formal checklist a new component must pass before shipping. That is a
deliberate scope decision, not an oversight: the package is small (one
shipped component, plus documented-but-unpromoted patterns), the people
building on it are the same people who wrote this guide, and a full audit
harness for a system this size would be process built ahead of the risk it
guards against. If the package or its consumer base grows to the point
where that stops being true, this is the chapter to revisit — not by adding
a rule retroactively to something already shipped, but by deciding, at that
point, what level of gating the new scale actually warrants.

## What already holds, and why it is reliable without a test suite

- **Contrast is measured, not assumed**, at every colour token — the
  comments in `tokens.css` are the record, and `git blame` on a comment that
  changes without the number next to it changing is itself a review signal
  even without automated tooling.
  Two invariants the CSS itself cannot express are still mechanically
  checked (see [Tokens](03-tokens.md#format-hand-authored-css-generated-jsjson)):
  `generate-tokens.mjs` asserts the two dark-mode blocks agree, and
  `validate-css.mjs` asserts every `var(--token)` resolves — both catch
  drift a human reviewer is genuinely unlikely to spot by eye.
- **Touch targets** are enforced structurally: `.btn`'s `min-height: 44px`
  (WCAG 2.5.5) and every form field across ID and Radar at the same
  `min-height`, so a new field built by copying an existing one inherits the
  target size rather than needing it re-added.
- **Reduced motion** is honoured globally, once, in `base.css` — `animation:
  none !important; transition: none !important` under
  `prefers-reduced-motion: reduce` — rather than left to each consumer to
  remember per-animation.
- **The skip link** (`.skiplink`, WCAG 2.4.1) ships in the base layer for
  the same reason: it is the kind of thing a redesign silently drops if it
  is not structurally present from the start.
- **Colour is never the only signal.** Stated as a rule in
  [Components](05-components.md#notices-badges-empty-states): a badge
  carrying meaning through colour also carries it through its text; a chart
  legend is real text, never colour-only (
  [Components](05-components.md#inline-svg-charts)).
- **Focus is visible** everywhere checked: a solid 2px accent outline on
  form fields (never a glow), `aria-current="page"` plus a visible underline
  on the active nav item rather than colour alone.

## Known gaps, named rather than silently accepted

- **No formal focus-ring rule ships in `components.css`.** The purple
  focus outline documented in the website's `DESIGN.md` and applied in
  Radar's own stylesheet is not yet promoted to the shared package — a
  consumer building a new interactive element should add it explicitly
  (`outline: 2px solid var(--accent); outline-offset: 2px` or `1px` for
  dense form fields) rather than relying on the browser default, which is
  what currently happens for `.btn` itself.
- **No `.btn--danger` variant** — see
  [Components](05-components.md#buttons--shipped). A destructive action
  today is distinguished by its copy, not its colour; that is a valid
  choice per [Patterns](06-patterns.md#confirming-a-destructive-action) but
  it means colour alone will never be how a user recognises a destructive
  button in this system, which is worth stating explicitly rather than
  leaving as an unexamined absence.
- **The root-dot's accessibility status is settled by construction, not by
  design intent** — see [Signature](07-signature.md#status-open). It happens
  to be excluded from the accessibility tree because it is a `::before`
  pseudo-element, not because anyone decided it should be `aria-hidden`.
