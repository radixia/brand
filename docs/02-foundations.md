# Foundations

The primitives every other chapter builds on. Full values live in
[`css/tokens.css`](../css/tokens.css) — this chapter explains what they are
for and the invariants that hold across them, without repeating every number
(the source comments already carry the measurement history; this file would
drift from them if it restated the numbers instead of citing them).

## Colour

One saturated accent, **Radixia Purple** (`#660099`), over a violet-tinted
neutral field. This is not a palette this package invented: `#660099` is
frozen by the Radixia Brand Guidelines (master v1.3) as one of exactly two
colours the logo is allowed to use, and this package extends it to UI because
the guidelines' own rule for the mark is "no secondary palette." See
[Authority](#authority) below for how far that extension goes and where it
stops.

Two rules hold across every colour token:

- **The Brand-System Rule.** Every colour that ships is a token from this
  package, or derived from one with `color-mix()` — never a hex literal that
  happens to match, never a value read off a screenshot.
- **The Hue-Coherence Rule.** There is no pure black and no neutral on a
  foreign hue axis. Every neutral — paper, ink, line, the dark panel — sits on
  the accent's own hue, at a saturation low enough that the accent alone reads
  as the page's one saturated colour. When the accent's hue moved (magenta →
  oxide red → Radixia Purple, across `tokens.css`'s own version history), the
  neutrals moved with it. That pairing is the lesson the history left behind,
  not the specific hue itself.

**Contrast comments are load-bearing.** Every non-obvious value in
`tokens.css` carries the WCAG ratio it was measured against and the surface
it was measured on. Several look arbitrary and are not — `--ink-3` at
`#6b6170` is not a rounder or prettier number than a dozen nearby
alternatives; it is the tightest value that still clears AA on `--paper-2`,
which is the binding constraint, not `--paper`. Changing a colour token means
re-measuring every comment attached to it, not eyeballing whether it still
looks right.

**Dark mode is not the OS default.** `radixia.ai` sets `data-theme` explicitly
and defaults to light, because the system is built on paper and most visitors
following the OS default would see its inversion first. `tokens.css` still
carries a `prefers-color-scheme: dark` block for surfaces that do follow the
OS — and that block and the manual `[data-theme="dark"]` override must agree
value-for-value. `npm test` (`generate-tokens.mjs --check`) enforces this: it
is exactly the kind of drift that is invisible by eye and mechanical to catch.

### Open: the v1.7 support palette

Brand Guidelines v1.7 (p.20) adds a neutral ramp (Gray 50–900) and semantic
states (success/error/warning/info, light/dark variants) that this package
does not ship yet. `radixia.ai`'s `DESIGN.md` already flags this as an open
question — whether the ramp extends the existing neutrals or only serves
surfaces that do not exist yet (data tables, charts, status pills) — and
explicitly declines to answer it pre-emptively. This guide inherits that
question rather than resolving it: adopting the v1.7 support palette is future
work, not scoped into this pass.

### Authority

**Colour and logo are governed by the Radixia Brand Guidelines, not by this
package.** The guidelines freeze exactly two colours for the mark —
`#660099` and white — and forbid recolouring it. Everything this chapter
says extends that system into UI the guidelines leave undefined; nothing
here may contradict the guidelines themselves. If the two ever disagree, the
guidelines win and this file is wrong. (Verified against Brand Guidelines
v1.0, v1.4 and v1.7 while drafting this guide, 2026-09-27 — the guidelines
specify the mark, the two frozen colours, and the typography register table
below; they do not specify component shapes, radii or the root-dot. See
[Signature](07-signature.md) for what that means for the one component this
package ships that the guidelines do not mention.)

## Type

**Inter is the only corporate/UI typeface** (Brand Guidelines v1.7, p.26,
design frozen August 2026: *"Inter is the only typeface. Editorial and
product/UI content are distinguished by weight, size and tracking alone."*).
This retired a two-voice system (Fraunces for editorial, JetBrains Mono for
"the machine voice") that `--font-display`/`--font-body` used to carry;
`tokens.css`'s 2.0.0 entry has the full migration history. **JetBrains Mono
is reserved for code** — never a label, an eyebrow, or metadata, whatever
register that content is in.

With one family, **tracking is the only axis left carrying the register
distinction** a second font used to carry. Four tokens name it:
`--track-display` (headline, editorial, tight), `--track-nav` (navigation),
`--track-label` (label/status/button, uppercase) and `--track-meta`
(byline/metadata, uppercase, the widest tracking). Every UI label's
`letter-spacing` is one of these three positive values — never an arbitrary
number, because an arbitrary value undermines the exact distinction tracking
exists to signal. There is no `--track-body`: `normal` is the CSS default,
and a token for "nothing" documents no invariant.

Weight and size stay literals at the point of use (in `base.css`'s `h1`–`h4`
rule, in a consumer's own type rules) rather than being tokenized, because —
per the v2.0.0 tokens.css comment — four axes times six registers of tokens
would document an invariant that does not exist. The pairing of
weight/size/tracking per register is documented once, here and in the site's
own `DESIGN.md`, and should not drift between them; if it does, that is a
documentation bug to fix in both places, not a reason to add tokens.

| Register | Weight | Tracking | Case | Guide reference |
|---|---|---|---|---|
| Display (hero only) | Bold (deviation — see below) | `--track-display` | normal | p.26, Light 300 in the guide |
| Headline (`h1`–`h4`) | SemiBold 600 | `--track-display` | normal | — |
| Title (card/teaser) | Medium 500 | normal | normal | — |
| Body | Regular 400 | normal | normal | p.26 |
| Navigation | Medium 500 | `--track-nav` | normal | p.26 |
| Label / status / button | SemiBold 600 | `--track-label` | UPPERCASE | p.26 |
| Meta / byline | Medium 500 | `--track-meta` | UPPERCASE | p.26 (was mono; retired) |

Two deliberate deviations from the guide's own literal numbers, both
confirmed on a live page rather than assumed from a swatch:

- **`h1`–`h4` weight is 600, not the guide's Light (300).** `tokens.css`
  3.0.0: 400 was the literal midpoint of the two-voice retirement and read
  thin against the headings it replaced once compared side by side.
- **The website's hero Display is Bold, not the guide's Light 300 at
  40–44pt.** Confirmed against a live preview: Light and Medium both read as
  too thin at the hero's actual composition size. This is a per-surface
  deviation (the website's own `DESIGN.md`, not a package-wide token), noted
  here so nobody "fixes" it back to the guide's literal value without
  re-running the same comparison.

## Space, radius, motion

- **Width**: `--w-max` (1240px, the marketing/editorial reading width) and
  `--w-prose` (720px, ~65–75ch for running copy). A data-dense consumer is not
  bound to `--w-max` — Radar defines its own `--radar-w` (940px) precisely
  because a working tool reads better narrower than a persuade/read surface.
  See [Layout](04-layout.md).
- **Radius — deliberately two, not one.** `--radius` (10px) for cards and
  panels, `--radius-btn` (3px) for buttons, and 8px for inputs (a literal
  today, not yet tokenized). The contrast is intentional: reading only
  `--radius` and applying it to a button is the single fastest way to make a
  Radixia surface look off-brand. See [Shapes](05-components.md#shapes) for
  the full two-radius rule.
- **Motion — one shared vocabulary.** Two easings (`--ease-out` for soft
  deceleration, `--ease-in-out` for symmetric transitions) and three
  durations (`--dur-1` micro-feedback, `--dur-2` composite states,
  `--dur-3` scroll reveals). Consistency of movement — same curve, same
  timings, everywhere — is what reads as deliberate rather than assembled.
  `base.css` honours `prefers-reduced-motion` globally, killing animation
  and transition outright rather than shortening them: a user asking for
  less motion is not asking for faster motion.

## Fonts: the two variants

`fonts.css` uses bundler-relative URLs (`../fonts/…`) — for any consumer with
a bundler (Vite, Astro, webpack), which resolves and fingerprints them.
`fonts-absolute.css` uses absolute URLs (`/fonts/…`) — for CSS served as
plain text with no build step (a Worker, an email, a static CDN file), and it
requires the consumer to serve the four `.woff2` files at `/fonts/` itself.
Picking the wrong one fails quietly: the browser falls back to the token's
own fallback stack, so a missing font file never breaks a page, it only
degrades it. See each consumer's own `copy-brand.mjs` script (Radixia ID's
lives at `scripts/copy-brand.mjs`, Radar's at
`apps/worker/scripts/copy-brand.mjs` in their respective repositories) for
the two real answers to "which one do I need": ID serves `/fonts/` itself and uses
`fonts-absolute.css`; Radar's brand assets live under its own route
(`/radar/brand/…`) and must not depend on the website owning `/fonts/`, so it
uses `fonts.css` with `css/` and `fonts/` kept as siblings.
