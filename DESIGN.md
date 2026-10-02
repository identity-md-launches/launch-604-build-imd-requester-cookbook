# DESIGN.md: IMD Requester Cookbook

Extracted from the final source on 2026-10-02. Source of truth: `web/src/styles.css` (tokens and every
component rule), `web/src/components/*.tsx` and `web/src/pages/*.tsx` (markup), `web/src/content/*.ts`
(copy). There is no framework theme, no CSS-in-JS and no font file; everything below is in plain CSS.

## Overview

A reference site for people and agents who pay the IMD swarm: one reading column, a side navigation, JSON
bodies you copy, and a catalog you filter. The character is plain and documentary: system fonts, a white
page, one blue accent reserved for links and the current page, an amber notice band for the experimental
warning, and dark code panels that make the request bodies the visual focus.

System-wide rules: content sits in a single column capped at a reading measure; controls are bordered or
filled shapes, never styled like body text; grouping is done with space and light surface tints, with rules
only inside tables and between page regions; one filled or tinted emphasis per view (the current nav item,
the note). Page-specific arrangements (the overview's card grid, the recipe stamp, the catalog's filter form)
are patterns to reuse, not rules every page must follow.

Light theme only, declared with `color-scheme: light`. No dark theme exists; do not add one by reversing the
ramp.

## Colors

Defined once in `:root` in `web/src/styles.css`, hex notation, two tiers. Components reference only the
semantic tier.

Primitives (hue-named, never used in components): `--gray-0` `#ffffff`, `--gray-50` `#f7f8fa`, `--gray-100`
`#eef0f3`, `--gray-200` `#dfe3e8`, `--gray-300` `#c6ccd4`, `--gray-400` `#7f8794`, `--gray-500` `#6b7280`,
`--gray-600` `#525a66`, `--gray-700` `#3b4250`, `--gray-900` `#15181e`; `--blue-50` `#eef4ff`, `--blue-100`
`#dbe6ff`, `--blue-600` `#1d4ed8`, `--blue-700` `#1a3fb0`, `--blue-800` `#172f80`; `--amber-50` `#fff7e6`,
`--amber-200` `#f4d9a0`, `--amber-900` `#5c3a00`.

| Role token | Value | Use |
| --- | --- | --- |
| `--color-bg-page` | gray-0 | page background, inputs, buttons |
| `--color-bg-surface` | gray-50 | side nav panel (narrow), cards, stamp, code header, filter form, table head |
| `--color-bg-subtle` | gray-100 | inline `code`, pills, button and nav hover |
| `--color-bg-code` / `--color-text-code` | gray-900 / gray-100 | code panels |
| `--color-text-primary` | gray-900 | body text, headings, nav links |
| `--color-text-secondary` | gray-600 | leads, captions, stamp labels, footer, placeholders |
| `--color-border` | gray-200 | table rules, header and footer rules, card and panel edges (via `--shadow-border`) |
| `--color-border-strong` | gray-400 | input and button borders (3.6:1 on white, 3.4:1 on surface) |
| `--color-accent-text` | blue-700 | links, current nav item text, disclosure summaries |
| `--color-accent-solid` | blue-600 | brand mark, current nav marker, note edge |
| `--color-accent-solid-hover` | blue-800 | link hover |
| `--color-accent-bg` / `--color-accent-border` | blue-50 / blue-100 | current nav item, note background, copied button |
| `--color-focus` | blue-600 | every `:focus-visible` ring |
| `--color-warning-bg` / `-border` / `-text` | amber-50 / amber-200 / amber-900 | the experimental banner only |

Measured contrast (WCAG 2 ratios computed from the declared pairs, `test/scratch/contrast.mjs`): primary text
on page 17.8:1, secondary text on page 7.0:1 and on surface 6.6:1, links on page 8.8:1, accent text on accent
background 8.0:1, banner text on banner background 9.6:1, code text on code background 15.6:1, focus ring on
page 6.7:1, on surface 6.3:1 and on banner 6.3:1, control borders 3.6:1. The focus ring is not used over the
code panel (code panels are not focusable). Rendered-pixel measurement was not performed; the pairs have no
alpha, gradient or image beneath them.

One color, one meaning: blue is interactive or current; amber is the warning band; gray carries everything
else. No status ramp beyond amber exists because nothing else renders a status.

## Typography

System stacks only, no web fonts:

- `--font-sans`: `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`
- `--font-mono`: `ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', 'DejaVu Sans Mono', monospace`

Scale (rem, semantic names in `styles.css`):

| Token | Size | Role |
| --- | --- | --- |
| `--text-2xl` | 28px | h1, weight 700, letter-spacing −0.01em |
| `--text-xl` | 22px | h2, weight 650 |
| `--text-lg` | 18px | h3, lead paragraph |
| `--text-base` | 16px | body, inputs, card titles |
| `--text-sm` | 14px | nav, tables, buttons, stamp, code, docs links, footer |
| `--text-xs` | 13px | pills, section labels, code headers, copy status |

Line heights: `--leading-tight` 1.15 on headings, `--leading-body` 1.55 on everything else, code 1.5.
Headings use `text-wrap: balance`; paragraphs and lists `text-wrap: pretty`. Reading measure
`--measure: 72ch` on `.layout-main`. Inline `code` is 0.925em of its parent with `overflow-wrap: anywhere`;
code panels wrap (`white-space: pre-wrap`) so a long JSON string never forces horizontal scroll. Uppercase
labels (`.sidenav-title`, `.stamp dt`, `.banner-tag`) get +0.03 to +0.04em tracking. Changing numbers and
dates use `.num` (`font-variant-numeric: tabular-nums`). Links underline with `from-font` thickness and
position. Inputs are 16px so iOS does not zoom. Font smoothing is set once on `html`.

## Layout

Spacing scale on a 4px base: `--space-1` 4, `-2` 8, `-3` 12, `-4` 16, `-6` 24, `-8` 32, `-12` 48 px.
Logical properties throughout (`padding-inline`, `margin-block`, `inset-inline-start`).

- `.wrap`: page container, `max-inline-size: 72rem`, inline padding 16px, 24px from 40rem.
- `.layout`: one column; from **56rem** a `15rem` side column plus a `minmax(0, 1fr)` main column with a
  48px gap. The side column is sticky (`inset-block-start: 16px`, scrolls internally if taller than the
  viewport).
- `.layout-main`: `max-inline-size: 72ch`, `min-inline-size: 0`.
- The nav lives in one `<details class="nav-disclosure">`. Below 56rem the summary renders as a button and
  the list opens beneath it on a surface panel; from 56rem the summary is hidden and the list is held open by
  `SideNav` (matchMedia on the same 56rem query). Choosing a page closes it on narrow viewports.
- Cards: `repeat(auto-fit, minmax(16rem, 1fr))`. Error cards' definition grid collapses to one column below
  30rem. Tables sit in `.table-wrap` with `overflow-x: auto`.
- The banner's tag and text wrap onto separate lines at narrow widths (`flex-wrap`).

Observed in the browser: 1280px (two columns, sticky nav) and 320px (one column, disclosure, no horizontal
overflow). Widths between were not screenshotted; the only breakpoint is at 56rem.

## Elevation & Depth

Flat. Structure comes from one hairline: `--shadow-border: 0 0 0 1px var(--color-border)` on cards, the
stamp, code figures, error cards, tables and the empty state. Surfaces are tinted (`--color-bg-surface`)
rather than lifted. Rules (`border-block-end`) separate the banner, header and footer from the page and rows
inside tables. The note and the current nav item use a 3px accent edge instead of a shadow. No drop shadows,
overlays or z-stacking beyond the skip link (`z-index: 10`).

## Shapes

`--radius-sm` 6px for buttons, inputs, inline code, nav items and the skip link; `--radius-md` 10px for
cards, the stamp, code figures, notes, tables and panels; `--radius-pill` for tags and pills. Nested radii are
avoided by design: code panels are not placed inside cards, and pills (fully round) are the only rounded
children inside a 10px container. The brand mark is a 14px square with 3px corners.

## Components

All in `web/src/components/` and `web/src/pages/`; CSS classes in `web/src/styles.css`.

- **Banner** (`Layout.tsx`, `.banner`): `role="note"`, aria-label "Experimental notice", the fixed
  experimental sentence from `content/site.ts`. Site-wide, first thing after the skip link.
- **Header** (`.header`): brand link to `#/` and one external link to the docs. 56px tall.
- **SideNav** (`.nav-disclosure`, `.sidenav`): grouped links from `content/index.ts` `nav`; the current route
  gets `aria-current="page"` and the tinted, edged style. Links are 38px tall at 14px text. Includes the
  `llms.txt` links.
- **Shell**: skip link (`.skip`, visible only on focus), banner, header, grid, `<main id="main" tabindex="-1">`,
  footer. `App.tsx` focuses `main` and scrolls to top on every route change after the first.
- **Buttons** (`.btn.btn-secondary`): 14px/600, 36px tall, bordered, hover tint under `(hover: hover)`,
  `scale: 0.96` on press (removed under reduced motion), transitions limited to `background-color, color,
  scale` at 120ms. There is no filled primary button; no view has a primary action.
- **CopyButton** (`CopyButton.tsx`): verb-first label ("Copy JSON" / "Copy"), optional `subject` so several
  on one page have distinct accessible names ("Copy JSON, check input"), a stable `role="status"` region that
  reads "Copied" or a failure hint for two seconds, and `data-state="copied"` styling.
- **CodeBlock** (`Blocks.tsx`, `.code`): `<figure>` with a `<figcaption>` header (title, copy button) and a
  wrapping `<pre>`. Used for JSON bodies and bash.
- **Blocks** (`BlockView`): paragraph, lists, code, table (`.table-wrap`, `<th scope>`), note (`.note`,
  `<aside>`). Inline Markdown subset: `` `code` ``, `**bold**`, `[text](url)` via `lib/inline.tsx`.
- **DocsLinks** (`.docs-links`): "In the docs:" followed by the page's docs anchors. Every page has one.
- **Recipe stamp** (`RecipeView.tsx`, `.stamp`): `<dl role="group" aria-label="Recipe stamp">` with action,
  version, price, checked date and control-plane commit. Reuse it on any page that states a checked fact.
- **Disclosure** (`.disclosure`): native `<details>` for the optional curl commands.
- **Cards** (`Home.tsx`, `.cards` / `.card`): title link plus one secondary sentence.
- **Filter form** (`ErrorsView.tsx`, `.filters`, `.field`): `role="search"` form with a labelled search
  input and a labelled select, a polite status line with the result count, and an empty state with a "Clear
  filters" button. Validation is not needed; nothing can be invalid.
- **Error card** (`.error`): `<article aria-labelledby>` with the code as h3, a place pill and status line, a
  cause/fix/observed definition list and a docs link whose text names the code.
- **Footer** (`.footer`): check date and commit, docs and research links, the commission line.

Loading and error states do not exist: the site has no network calls.

## Do's and Don'ts

- Start a new page by adding a `Page` to `web/src/content/`, registering it in `content/index.ts`
  (`nav`, `findPage`) and, if it should reach agents, in `lib/markdown.ts` `llmsFull`. `PageView` renders it;
  no new components are needed for prose, lists, tables, code or notes.
- Keep every page linking its docs section through `docs: [docsLink(anchor, label)]`; the site exists to
  complement the docs, not to copy them.
- Use role tokens only. Add a token for a new role rather than reusing `--color-border` as text or
  `--color-text-secondary` as a border.
- Blue means interactive or current. Do not color static text blue; do not add a second accent.
- Amber is the experimental notice. Do not reuse it for other callouts; use `.note` (blue edge) for
  information.
- Controls keep a border or fill. Do not style a button as a bare text link.
- Do not put a code panel inside a card, and do not add shadows for depth; this system is flat.
- Keep headings in order (one h1, h2 sections, h3 only inside error cards and overview cards) so the outline
  stays navigable.
- New copy stays in sentence case, verb-first on buttons, and says how to fix beside where it broke.
