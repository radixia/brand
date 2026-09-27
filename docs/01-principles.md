# Principles

This is the reasoning the package is built on. Read this before Foundations —
every later chapter assumes these hold.

## Skin / engine / copy

The website has kept a full separation of these three layers since it was
first built: **engine** (logic and data), **skin** (markup and CSS) and
**copy** (text). That is not a website-specific convention — it is why this
package can exist at all. A design system is a *skin* contract shared across
otherwise unrelated engines: a Cloudflare Worker with no framework, an Astro
site with a build step, whatever the labs line ships next. None of them share
a runtime, a router or a data layer. They share exactly one thing: what
Radixia looks like.

If a change to this package requires touching a consumer's engine (its
routing, its data model, its business logic) to keep working, that change has
crossed a boundary it should not cross. A version bump that only replaces CSS
custom property values, or adds a class, should never require a consumer to
change anything but which tag it is pinned to.

## Imported, never transcribed

The single failure this package exists to prevent, documented in full in the
[README](../README.md#why-this-exists): a consumer that reads the live output
of another surface and retypes the values it sees loses the reasoning behind
every one of them within a day. A hex code copied out of a rendered page
carries no information about which WCAG ratio it was measured against, or
which surface that ratio was measured on. The token that produced it carries
exactly that, in the comment above it.

**The rule this produces:** if a number, a hex code, a font stack or a
duration used anywhere in a consuming app matches a value in this package,
that value must be a `var(--token)` reference, not a literal. A literal that
happens to match today is a literal that silently stops matching the day this
package's tokens move and nothing re-runs the comparison. This is why
`radixia.ai`'s own build (`npm run audit`, referenced in its `DESIGN.md`)
fails on a hard-coded colour literal, and why the same check belongs in any
consumer that can run it.

## CSP first

Every decision in this package assumes the strictest Content-Security-Policy a
consumer might run: `default-src 'none'; style-src 'self'; script-src 'self'`.
No inline `<style>`, no `style="…"` attribute, no inline `<script>`, no
`unsafe-inline` anywhere. This is not a target to work toward — it is already
true of every file in `css/`, and it is why several tempting shortcuts are
permanently out of scope:

- No CSS-in-JS output, ever — it either requires a runtime that injects style
  tags, or it requires relaxing `style-src`.
- No component that requires an inline `<script type="application/json">` or
  similar payload embedding.
- No dependency on a UI kit whose components assume they may inject styles at
  runtime (this ruled out several candidates during the 2026-09-27 survey —
  see [Contributing](09-contributing.md) for the list and why each failed).

A component that cannot be built without relaxing this policy is a component
that does not belong in this package. It may still belong in a single
consumer that has a looser policy of its own — but then it is that consumer's
decision to make, not this package's to impose on everyone downstream of it.

## Works without JavaScript

Every consumer of this package renders HTML on the server and ships little or
no client-side JavaScript. Radixia ID and Radar are Cloudflare Workers with no
framework; forms post back to the server and the response is the next full
page. The one script Radar does ship (`SCRIPT` in `pages.ts`) is explicitly
progressive enhancement: every interaction it intercepts still has a working
plain-HTML fallback, commented at the point where the fallback path is
invoked.

This package's own components follow the same rule: `.btn`, the reset, the
skip link and every layout primitive in `base.css` and `components.css` work
with zero JavaScript. Nothing in this package requires a script tag to
render or to function. Where a consumer chooses to *enhance* an interaction —
Radar's search-as-you-type, a future consumer's own additions — that
enhancement is the consumer's skin decision, built on top of markup that
already worked before the enhancement existed.

## What is brand, and what is not

A recurring judgement call, restated because every chapter after this one
depends on drawing the line correctly:

> If two Radixia surfaces would reasonably disagree about it, it does not
> belong in this package.

Colour, type, spacing, radii, motion vocabulary, and the handful of
components genuinely shared across surfaces (today: buttons) are brand.
Page chrome, section shells, which elements animate on reveal, how dense a
particular screen should be, and any decision that depends on what a specific
page is *for* rather than what Radixia *looks like* — those are per-surface
skin decisions and stay in the consuming app.

This is why `id.css` and Radar's `STYLESHEET` both exist as substantial files
of their own, entirely built from this package's tokens, and neither is
wrong to exist. The question this chapter's rule answers is not "should this
CSS live somewhere" but "does this specific rule belong in the shared file or
the per-surface one."
