# @radixia/brand

Radixia's design tokens, base layer and shared components. Framework-agnostic
CSS plus generated JS/JSON tokens, no build step, no dependencies.

This package exists so that **the definition of what Radixia looks like lives in
exactly one place.** Every surface — the website, MCP Census, whatever the labs
line ships next — reads from here instead of carrying its own copy.

## Why this exists

The [radixia.ai](https://www.radixia.ai) site has held a **full separation of
skin** since it was built: engine (logic and data), skin (markup and CSS) and
copy (text) are separate layers, so a long-lived redesign branch can keep
receiving engine changes by merge without fighting over presentation.

That principle worked inside one repo and then quietly failed across repos. When
MCP Census needed to look like Radixia, its stylesheet was written by reading the
live site and retyping the values. Within a day the copy had already decayed:

- Four tokens were missing entirely (`--violet`, `--dark-panel`, `--w-max`, `--w-prose`).
- Buttons inherited the card radius (10px) instead of the button radius (3px).
- `--ink-3` was the **pre-accessibility-fix** value, at 4.37:1 — under WCAG AA.
- Buttons used `var(--magenta)` with white text, which is 4.08:1 in dark mode —
  also under AA, and the very bug `--magenta-btn` was introduced to fix.
- The manual `[data-theme]` toggle was omitted, so forcing light mode on the main
  site and clicking through to the census left the census rendering dark.

None of that was carelessness about colour. It is what happens whenever a design
system is *transcribed* rather than *imported*. The tokens carry decisions —
measured contrast ratios, a deliberate two-radius scale, a theme-independent CTA
colour — and a copy carries only the values.

So: import this package. If you find yourself pasting a hex code out of it, that
is the bug.

## Install

```bash
npm i @radixia/brand
```

## Use

Most apps want everything, in order:

```css
@import "@radixia/brand/all.css";
```

Or pick layers:

```css
@import "@radixia/brand/tokens.css";      /* custom properties only */
@import "@radixia/brand/fonts.css";       /* @font-face, bundler-relative URLs */
@import "@radixia/brand/base.css";        /* reset, typography, .wrap, .skiplink */
@import "@radixia/brand/components.css";  /* .btn and variants */
@import "@radixia/brand/signature.css";   /* the root-node mark — Radixia only */
```

Outside a stylesheet — OG images, SVG badges, HTML email, a Worker rendering
inline SVG:

```js
import { light, dark, cssVar } from "@radixia/brand";

light["accent"];    // "#a8232a"
dark["paper"];      // "#191714"
cssVar("ink-2");    // "var(--ink-2)"
```

These are **generated** from `css/tokens.css`, never hand-maintained.

### Fonts

Two variants, and picking the wrong one fails quietly:

| | URLs | For |
|---|---|---|
| `fonts.css` | `../fonts/…` relative | Anything with a bundler. Vite/Astro/webpack resolve, fingerprint and rewrite them. |
| `fonts-absolute.css` | `/fonts/…` absolute | CSS served as plain text — a Worker, an email, a file on a CDN. **You must serve the three woff2 files at `/fonts/` yourself.** |

If the files are missing, the browser falls back to the token's fallback stack.
The page still looks deliberate, which is what makes this worth stating twice.

## Layers

```
css/tokens.css       colour, type, width, radius, motion — the source of truth
css/fonts.css        @font-face, bundler-relative
css/fonts-absolute.css   @font-face, /fonts/ absolute
css/base.css         reset, typography, links, .wrap, .skiplink, reduced-motion
css/components.css   .btn, .btn--ghost, .btn--onDark
css/signature.css    the root-node mark (identity, not craft — excluded from all.css)
css/all.css          tokens + fonts + base + components
fonts/               three latin-subset variable WOFF2, OFL-1.1 (see NOTICE)
tokens/              GENERATED — tokens.json, index.js, index.d.ts
```

**Not here, on purpose:** page chrome, section shells, scroll-library glue, and
which elements animate on reveal. Those are per-surface decisions and belong to
the consuming app's own skin layer. The line is: if two Radixia surfaces would
reasonably disagree about it, it does not belong in this package.

## Changing a token

```bash
# edit css/tokens.css, then
npm run tokens     # regenerate the JS/JSON exports
npm test           # verifies they are in sync
```

`npm test` also asserts an invariant the CSS itself cannot express. The dark
values appear **twice** in `tokens.css` — once under `prefers-color-scheme` and
once under the manual `[data-theme="dark"]` override — and the two blocks must
agree. If they drift, forcing dark mode renders different colours from
inheriting it from the OS, which is very hard to notice by eye and trivial to
catch here.

Contrast comments in `tokens.css` are load-bearing. Several values look arbitrary
and are not: they were measured against WCAG AA on the specific surfaces they
land on. Changing one means re-measuring it.

## Versioning

Semver on the *visual* contract, not just the API surface:

- **patch** — comments, docs, a fix that changes no rendered pixel.
- **minor** — new tokens or components; existing ones unchanged.
- **major** — an existing token changes value, or a component's markup contract
  changes. Consumers must be able to take patches without reviewing screenshots.

One carve-out, added in 1.1.0: a token documented as **engine-only** — read by a
canvas or SVG engine to paint decoration, never rendered as UI, never carrying
text — may change value in a minor. `--hero-mid` is the only one today. The rule
exists so consumers can skip screenshot review; a token no consumer renders as UI
cannot invalidate their review. Anything that carries text or defines a surface
stays under the major rule, which is exactly where `--hero-mid`'s predecessor
`--violet` had drifted: it was being used as a badge background with white text
on it, at 3.91:1. If an engine-only token turns up in a UI rule, that is the bug.

## Licence

Apache-2.0 for the code. The bundled fonts are OFL-1.1 and separately licensed.
The Radixia name and the root-node mark are not licensed for reuse as your own
identity — see [NOTICE](NOTICE).
