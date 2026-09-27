# Tokens

## Source of truth

`css/tokens.css` is the only place a Radixia colour, font, width, radius or
motion value is declared. Everything else — the generated JS/JSON exports,
every consuming stylesheet, this guide — reads from it or cites it. This
chapter documents the mechanism; [Foundations](02-foundations.md) documents
the values and the reasoning behind them.

## Format: hand-authored CSS, generated JS/JSON

This package considered the W3C Design Tokens Community Group format (DTCG)
plus Style Dictionary as the generator, during the 2026-09-27 survey. The
verdict was **not adopted** — recorded here because "we didn't pick this"
is exactly the kind of decision that gets silently re-litigated by whoever
next reads about DTCG somewhere else:

- The existing pipeline (`scripts/generate-tokens.mjs`,
  `scripts/validate-css.mjs`) is roughly 150 lines of dependency-free Node.
  `package.json` declares no `dependencies` and no `devDependencies` at all.
  Adding Style Dictionary would add the tool itself plus its own dependency
  tree, for a token count and consumer set (three, all CSS-only) that do not
  need it.
- No consumer reads a DTCG-shaped file today. Every consumer reads `.css`
  directly, or occasionally the generated `tokens/index.js` for a non-CSS
  context (an SVG badge, an OG image). Adopting DTCG would change the output
  shape without changing what anything downstream actually consumes.
- If a future need appears — a design tool that only speaks DTCG, a fourth
  consumer with a genuinely different pipeline — that is the point to revisit
  this, with a real requirement driving it instead of a format's popularity.

**`css/tokens.css` stays hand-authored CSS custom properties.** The generated
`tokens/tokens.json`, `tokens/index.js` and `tokens/index.d.ts` are
mechanically derived from it by `generate-tokens.mjs`, which:

1. Parses `--name: value;` pairs out of the `:root` block (light values), the
   `:root:not([data-theme="light"])` block inside the `prefers-color-scheme`
   media query (dark, system-driven), and the `:root[data-theme="dark"]`
   block (dark, manual override).
2. Asserts the two dark blocks agree, key for key. This is the one invariant
   the CSS itself cannot express — nothing in CSS stops the two blocks from
   drifting apart, and drift there is close to invisible by eye (forcing dark
   mode would render subtly different colours from inheriting it from the
   OS, and nobody clicks the toggle immediately after every edit to check).
3. Writes `tokens/tokens.json`, `tokens/index.js` (with a `cssVar(name,
   fallback?)` helper for building inline styles or SVG outside a
   stylesheet) and `tokens/index.d.ts`.

`npm run tokens` regenerates; `npm test` runs it with `--check` (fails if the
committed generated files are stale) plus `validate-css.mjs` (fails if any
`var(--token)` anywhere in `css/*.css` does not resolve to a token
`tokens.css` actually defines — the failure mode this catches: renaming a
token and missing a use of the old name, which CSS does not error on, it just
silently falls back to the property's initial value).

## Naming

- `--name` for a base token (`--accent`, `--paper`, `--radius`).
- `--name-modifier` for a state or role variant (`--accent-deep`,
  `--accent-btn-hover`, `--od-accent-2` for the on-dark palette).
- `--track-<register>` for the four tracking tokens, named after the
  typographic register they carry (`display`, `nav`, `label`, `meta`), not
  after a numeric guide value — the register is the invariant that has to
  survive a value change, the number is incidental.
- No unit or type prefix (no `--color-accent`, no `--font-sans` written as
  `--typeface-sans`) — the package is small enough that a flat namespace has
  not yet produced a collision, and adding structure ahead of a real need
  would be exactly the kind of premature abstraction the Foundations chapter
  warns against for weight/size/tracking combinations.

## Deprecation

One documented pattern exists today: `--violet` is a deprecated alias for
`--hero-mid`, kept because nothing outside the website's own repo reads it
(unlike the `--magenta*` rename, which could not use an alias — see below).
Its own comment in `tokens.css` states it will be removed in the next major.

**Aliases are not always safe**, and this package has hit the failure mode
once already. When `--magenta*` was renamed to `--accent*` (1.0.0) and later
`--font-display`/`--font-body` were renamed to `--font-sans` (2.0.0), an
alias of the form `--magenta: var(--accent)` was considered and rejected
both times: a downstream consumer's sync script copies token *values*
verbatim into its own generated theme, so the alias would be copied in as an
unresolvable circular reference (`--magenta: var(--accent)` pointing at
nothing once lifted out of this file's cascade), not a working style. The
rule this leaves behind: **before adding a deprecation alias, check whether
any consumer's tooling copies values rather than re-declaring the token
reference** — if it does, migrate every consumer in the same pass instead of
aliasing.

## Engine-only tokens

One carve-out to the semver rule below, added in 1.1.0: a token documented
as **engine-only** — read by a canvas or SVG engine to paint decoration,
never rendered as UI, never carrying text — may change value in a minor
release. `--hero-mid` is the only token with this status today. The rule
exists so consumers can skip screenshot review on a minor bump; a token no
consumer renders as UI cannot invalidate that review. The carve-out is
narrow on purpose: `--hero-mid`'s predecessor `--violet` had drifted into
being used as a badge background with white text on it at 3.91:1 (under AA)
— exactly the misuse this carve-out has to keep from recurring. If an
engine-only token turns up in a UI rule anywhere, that is a bug in the
consumer, not licence to treat the token as safe for text.

## Versioning

Semver on the *visual* contract, not just the API surface — this package's
own statement of it, unchanged from the README, restated here because this
chapter is where a token-level change actually gets classified:

- **patch** — comments, docs, a fix that changes no rendered pixel.
- **minor** — new tokens or components; existing ones unchanged; an
  engine-only token's value change (see above).
- **major** — an existing token changes value, or a component's markup
  contract changes. Consumers must be able to take a patch without
  reviewing screenshots; that guarantee is what the major/minor line exists
  to protect.

Before shipping a token change, ask: does this change a value a consumer's
screenshot test (if it had one) would catch? If yes, it is at minimum major
for that specific change, whatever else moved in the same release.
