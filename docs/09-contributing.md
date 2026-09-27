# Contributing

## Before adding anything

Read [Principles](01-principles.md) first: the recurring question for any
proposed addition is whether it is brand (shared, belongs here) or skin
(per-surface, belongs in the consumer). When genuinely unsure, default to
the consumer — promoting a proven pattern later
([Components](05-components.md#promotion-candidates)) is cheap; walking
back a shared class three consumers have already taken a dependency on is
not.

## Changing a token

```bash
# edit css/tokens.css, then
npm run tokens     # regenerate the JS/JSON exports
npm test           # verifies they are in sync, and that every var() resolves
```

Re-measure and update the contrast comment for anything the change affects
— see [Foundations](02-foundations.md#colour). If the change touches a
value that ships to both the `prefers-color-scheme` block and the manual
`[data-theme="dark"]` override, update both; `npm test` will refuse to let
them disagree.

## Adding or promoting a component

1. Confirm it is actually shared: used the same way in at least two
   consumers today, per [Components](05-components.md#promotion-candidates).
   A component invented for this pass, with no existing consumer usage to
   generalize from, is scope this guide's own drafting process explicitly
   declined to take on — raise it as a proposal, not a pull request, until a
   real second use exists.
2. Write it into `css/components.css` (or a new file, if it does not
   belong alongside buttons — `signature.css` is the precedent for "identity,
   not craft, gets its own file, excluded from `all.css`").
3. Document it here in the same shape every other entry in
   [Components](05-components.md) uses: when to use it, when not to, anatomy,
   states, accessibility.
4. Classify the version bump honestly against
   [Tokens § Versioning](03-tokens.md#versioning) — a new component with no
   existing markup contract to break is minor; changing an existing one's
   markup or default appearance is major.

## Semver

Restated from the [README](../README.md#versioning) and
[Tokens](03-tokens.md#versioning) because it is the thing most likely to be
gotten wrong under time pressure: semver here tracks the *visual* contract,
not just the API surface. A change that touches no rendered pixel is patch.
A new token or component that changes nothing existing is minor. A value or
markup-contract change to something a consumer already renders is major —
full stop, no matter how small the pixel difference looks in a diff.

## Consumer updates

This package has no consumer with a build step that auto-updates on
release. Every consumer pins an exact version and updates deliberately:

- **Radixia ID** and **Radar** each run their own `copy-brand.mjs` script
  (`scripts/copy-brand.mjs` in ID, `apps/worker/scripts/copy-brand.mjs` in
  Radar) that copies specific CSS layers and the woff2 fonts out of
  `node_modules/@radixia/brand` into their own `public/` tree at build time.
  Bumping the pinned version and re-running that script (or its consumer's
  own build) is the update path — there is no live/floating dependency to
  accidentally pick up an unreviewed change.
- **radixia.ai** imports the package's CSS directly in its own build
  (Astro), pinned the same way through its own `package.json`.

A release of this package changes nothing for any consumer until that
consumer's own PR bumps its pin — consistent with this package's Purpose:
consumers update with their own PR, outside this repository, after a
release exists to update to.

## Release process

A version bump and tag happen only with the package owner's explicit
authorization — never as a side effect of a documentation or component PR
being merged. This guide's own drafting (see the PEG preflight it was
written under) is scoped as documentation-only: no `components.css` change,
no version bump, no tag, as part of this pass.

## Static gallery

Not built in this pass. A static HTML page exercising every shipped
component, referenced by design systems like GOV.UK's own component
previews, is the natural next step once a second or third component is
promoted (see [Components](05-components.md#promotion-candidates)) — with
one component shipped today, a gallery would mostly demonstrate `.btn`,
which the code sample in this guide's own Components chapter already does.
Revisit once there is enough shipped surface for a gallery to earn its
maintenance cost.
