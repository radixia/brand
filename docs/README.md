# Radixia design guide

This is the design guide for `@radixia/brand`: not just what the tokens and
components are, but when to reach for them, why they are shaped the way
they are, and where the line sits between what this package owns and what
each consuming surface decides for itself.

Scope: Radixia ID, Radar, and radixia.ai — the three surfaces this guide's
research covered as of 2026-09-27.

1. [Principles](01-principles.md) — skin/engine/copy, imported not
   transcribed, CSP first, works without JavaScript.
2. [Foundations](02-foundations.md) — colour, type, spacing, radii, motion,
   dark theme.
3. [Tokens](03-tokens.md) — the generation pipeline, naming, deprecation,
   versioning.
4. [Layout](04-layout.md) — the three page shells and their widths and
   densities.
5. [Components](05-components.md) — buttons (shipped), and the patterns
   proven across consumers but not yet promoted into the package.
6. [Patterns](06-patterns.md) — sign-in, admin CRUD, filter+list, confirming
   a destructive action.
7. [Signature](07-signature.md) — the root-dot: what it is, and the open
   question of whether it is an intentional brand mark.
8. [Accessibility](08-accessibility.md) — WCAG 2.2 AA, best-effort, and the
   gaps named rather than silently accepted.
9. [Contributing](09-contributing.md) — how to change a token, add or
   promote a component, and how consumers actually update.

Start at 1 if you are new to the package; jump straight to 5 or 6 if you
are building a specific piece of UI and know roughly what you need.
