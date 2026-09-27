# Signature — the root-dot

## What it is

A small filled circle recurs across the system: the 7px current-colour dot
that leads every `.btn` label (`components.css`), the seed-and-branches
glyph in `.node` (`css/signature.css`, the section-marker eyebrow), and the
seed point of the website's Canvas root-system hero. `radixia.ai`'s
`DESIGN.md` names this recurring silhouette the **root-dot** and describes
it as marking "a growth point" — the visual expression of the *radix* (root)
the company is named after.

## What it is not

**The root-dot has no basis in the Radixia Brand Guidelines.** This was
checked directly against the guidelines while drafting this chapter
(v1.0, v1.4 and v1.7, 2026-09-27): none of the three mentions a button
component, a leading dot, or `.node`'s sprout glyph. The guidelines' only
use of "dot" at all (v1.7, p.20, Semantic States) is unrelated — a coloured
dot paired with white text for success/error/warning/info states on dark
chart surfaces, not a signature mark on every button.

Compare this to how the rest of this package treats the guidelines: `#660099`
is documented everywhere in `tokens.css` as *"frozen by the brand
guidelines, not a shade picked for this file."* The root-dot carries no
equivalent citation anywhere in the codebase — it is a convention that
emerged in implementation, not a rule handed down from the brand's owner.

## Status: open

Whether the root-dot should be adopted as an intentional brand signature, or
was an unintended artifact of how the button and the `.node` glyph were
each built, is **not decided by this guide.** The owner's call, still
pending as this chapter is written:

- **If kept as signature:** it should be documented here as a deliberate
  brand decision (not implied to come from the guidelines), and the open
  sub-questions from its original review resolved explicitly — should
  `.btn--ghost` (and any future `.btn--danger`) carry it, or is it reserved
  for the primary action; should it be formally marked non-decorative to
  assistive technology (today it already is, incidentally: a CSS `::before`
  pseudo-element with no text content is excluded from the accessibility
  tree by construction, without an explicit `aria-hidden`).
- **If not kept:** removing it is a markup-contract change to `.btn` and a
  content change to `.node.` — major-version work under this package's own
  semver rule (see [Tokens](03-tokens.md#versioning)), reaching both
  current consumers, not a quick patch.

**Until decided, nothing changes.** `.btn::before` and `signature.css`
remain exactly as they are; this chapter documents the current, unchanged
behaviour rather than a target state, and exists mainly so the open
question is visible to the next person who reads this guide instead of
being silently assumed settled.

## Where it appears today

| Instance | File | Size | Scope |
|---|---|---|---|
| Button leading dot | `css/components.css`, `.btn::before` | 7px | Every `.btn`, including `--ghost` and `--onDark` — no variant currently excludes it |
| `.node` sprout glyph | `css/signature.css`, `.node::before` | 26×14px | Section-marker eyebrow; shipped but, per the website's own `DESIGN.md`, not wired into any current page — per-section eyebrows have taken its place there |
| Hero seed | `radixia.ai`'s `roots-engine.ts` (website repo, not this package) | — | The root of the Canvas root-system drawing |

`signature.css` is deliberately excluded from `all.css` and must be imported
on its own — the package's own way of marking it as identity rather than
craft (see its file header, and `NOTICE`: the licence covers the code, not
the marks). Neither ID nor Radar imports it today.
