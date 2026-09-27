# Patterns

A pattern is a sequence of pages and states solving one task, built from the
components in the previous chapter. Each one below is a real, shipped flow
in ID or Radar — this chapter names the sequence so a future consumer with
the same task starts from a working answer instead of a blank page.

## Sign-in (email + one-time code)

**Sequence:** an email step (`emailPage`) → a code step (`codePage`) → a
continuation page that hands control back to the requesting app
(`continuePage`). Three separate server-rendered pages, no client
JavaScript beyond the Turnstile widget the first step loads.

**What each step does and does not do:**

- The email step never confirms whether an address exists in the system —
  the code step's copy is deliberately conditional ("If `<email>` has
  access, a six-digit code is on its way") so the flow does not leak account
  existence to an attacker probing addresses.
- Every hidden field a later step needs (`oauth_query`, `return_to`) is
  carried forward as a hidden input, not in session state — the flow is
  fully stateless across steps except for the emailed code itself.
- Errors render with the shared `.error` recipe (see
  [Components](05-components.md#forms-and-validation)), never by re-showing
  a generic message — `errorLine()` is a single shared helper both steps
  call, so the two steps cannot drift into two different error styles.
- The `continuePage` step exists as a real page with `<meta
  http-equiv="refresh">`, not a server redirect, because a redirect
  answering a form POST would count against a strict `form-action` CSP
  directive that only allows the app's own origin — the same CSP-first
  constraint from [Principles](01-principles.md) shaping a decision that has
  nothing to do with colour or type.

## Admin CRUD (grant / remove / revoke)

**Sequence:** a single console page (`consolePage`) with one form per
action (grant access, register an app, remove access, revoke sessions),
each posting back to its own route, the whole page re-rendered with a
one-line notice afterward.

**What makes this pattern hold together, not just look similar:**

- **Notices are a fixed, closed vocabulary** (`NOTICES` in
  `admin-pages.ts`), keyed by outcome (`person`, `removed`, `revoked`,
  `invalid`, `unknown`, `client_refused`) — never text echoed from the
  request. This is a security property as much as a UX one: a notice that
  echoed request data would be a reflected-content surface on an admin page.
- **Every grid form uses the shared `form.grid` layout** (a CSS grid,
  `repeat(auto-fit, minmax(12rem, 1fr))`, documented in
  [Layout](04-layout.md#responsive-behaviour)) so a new admin form
  automatically gets the same field wrapping behaviour as the existing ones,
  without a new breakpoint to write.
- **Per-row actions are `.link`-styled buttons inside inline forms**
  (`form.inline`, one field, one button, submitted independently of the
  page's other forms) — a plain-text button rather than `.btn` for an action
  embedded inside a table row, where a full brand button per row would be
  visually loud for what is a routine, low-stakes, reversible action. See
  the next pattern for when that judgement flips.

## Filter + list

**Two working examples, same underlying idea — narrow a list without a full
page reload, with a plain-HTML fallback that still works if the enhancement
fails:**

- **Radar's search-as-you-type** (`SCRIPT` in `pages.ts`): a 250ms debounce,
  a monotonically increasing request stamp so a slow response never
  overwrites a newer one, and a `DOMParser` swap of only the `.docs`/`.empty`
  result region — not the whole page — so focus and caret position survive.
  If the fetch throws, nothing happens except the plain form still working
  exactly as it did with JavaScript disabled; the search page's `<form>`
  action is real and unconditional.
- **Radar's follow/unfollow** (same `SCRIPT`): intercepts a `form.inline`
  submit, does the POST via `fetch`, and flips the button's own label and
  the hidden `action` field in place — again with an explicit fallback
  (`form.submit()`) on any failure, so a network error degrades to a normal
  page reload rather than a stuck button.

**The shared rule this leaves:** progressive enhancement in this system
always means *intercept a plain form that already works, keep its markup as
the fallback path, and design the failure branch before the success branch*
— not a client-rendered list that has no server-rendered equivalent to fall
back to.

## Confirming a destructive action

The most instructive material for this pattern is not the pattern as it
exists today, but a bug found while building it (`DECISIONS.md`,
2026-09-27: *"Sign-out asked for a confirmation the hint should have made
unnecessary"*). Better Auth's stock RP-Initiated Logout flow showed a
generic "Confirm logout" page and then, due to a bug where the JWKS
verification request never reached its own Worker, asked for a **second**
confirmation even when the request already carried everything needed to
verify and act on it safely. The fix removed the redundant prompt entirely
for that case: a valid `id_token_hint` for the current session now ends it
at once, no page shown.

That produces the rule this pattern actually follows, stated as a question
rather than a rule of thumb — **does the system already have enough
information to act safely and reversibly?**

- **If yes, don't ask.** ID's admin console removes access or ends a
  person's sessions from a single inline button with no confirmation step
  at all — because both actions are scoped to an audited admin console,
  logged (`sessions_revoked` in the append-only audit table), and
  reversible in practice (access can be re-granted; sessions can be
  re-established by signing in again). A confirmation dialog here would add
  a click without adding safety.
- **If the system is genuinely uncertain, ask — with fixed copy, no
  echoed data.** `signOutConfirmPage` is shown only for the cases where
  Better Auth cannot verify the request came from the current session
  unambiguously (no hint, or a hint for a different session) — real
  uncertainty the confirmation step resolves, not a reflexive step inserted
  because the action sounds serious. Its copy is fixed
  ("You will be signed out of every Radixia app on this browser.") and never
  interpolates anything from the request, for the same reason the admin
  console's notices don't.

A future consumer adding a delete/revoke/reset action should ask the same
question before reaching for a confirmation dialog by default: is the
uncertainty real, or is the click theatre? If real, use a full page (not a
modal — nothing in this system has a modal component, and CSP-safe modals
that trap focus correctly are non-trivial to build without a JS framework)
with fixed, non-echoing copy stating the actual consequence. If not, a
one-click action with a clear, honest post-action notice and an audit trail
is the more honest pattern, not a shortcut.
