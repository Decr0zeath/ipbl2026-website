# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static SPA-lite HTML manual for the iPBL 2026 quadruped robotics pre-training programme (hosted by University of San Jose – Recoletos, with STUST Taiwan and OIT Japan). Deployed via GitHub Pages from the repo root. No build step, no dependencies, no framework — plain HTML/CSS/JS. (Neither Node nor Ruby is installed on this machine; don't reach for either.)

## Development

- **Preview:** serve the folder over HTTP — the user uses VS Code's Live Server extension; `python -m http.server` also works. Opening `manual.html` from `file://` fails by design (the viewer `fetch`es fragments).
- No tests or linting.

## Architecture

**Shell + fragments (course-viewer pattern; original reference in `reference/course-viewer.js`).** `manual.html` is the single shell holding the chrome (topbar, sidebar skeleton, footer) and three empty mounts: `#pageHead`, `#sectionView`, `#pagination`. The viewer in `assets/js/main.js` fetches `sections/<slug>.html`, caches it, injects it, and routes via location hash (`manual.html#assembly`). Sidebar clicks are plain `#slug` anchors — a `hashchange` listener does the loading, so nothing ever full-page-reloads. `pretraining.html` is a standalone landing page for the manual (no sidebar; links into `manual.html#<slug>`).

**`index.html` is the site's root landing page** — the event page (programme, universities, venue map, sponsors), since GitHub Pages serves it at the domain root. It cross-links to `pretraining.html` (the manual's own landing page); `pretraining.html`'s header links back to `index.html`. Both are standalone, chrome-only pages outside the `MANUAL_MAP` viewer.

**`assets/js/manual-map.js` is the single source of truth for structure.** `MANUAL_MAP` (ordered Sections 01–08) + `MANUAL_REFERENCE` (credits) hold `slug`, `num`, `crumb`, `title`, `subtitle` per section. Sidebar, `.page-head`, `document.title`, and prev/next pagination all generate from it. Adding a section = one fragment file in `sections/` + one map entry (+ the static footer link lists in `pretraining.html` and `manual.html`, the only remaining duplication).

**Fragments in `sections/` are content-only** — no `<html>`, no chrome, no page-head (the viewer builds that from the map; don't repeat the h1/subtitle inside a fragment). They keep the 4-space indent of their original `main.content` context.

`main.js` also owns the mobile Contents toggle; it no-ops the viewer on pages without `MANUAL_MAP`. All links are bare relative paths — no absolute `/` paths, which is what keeps the site working under a `/<repo>/` project path on Pages.

`assets/css/style.css` is the single stylesheet — CSS custom properties in `:root` for the whole palette, then labelled sections (`/* ---------- Figures ---------- */` etc.). Never hardcode colours; use the tokens (`--green-800`, `--gold-500`, `--paper`, `--ink-soft`, `--rule`, …). A print stylesheet lives at the bottom.

## Content conventions

- **Figures:** `<figure><div class="frame">…</div><figcaption><span class="fig-label">Figure NN</span>…</figcaption></figure>`. The `.frame` supplies the gold corner brackets; replacing a placeholder means swapping only the inner `<div class="placeholder">` for an `<img>` (see README).
- **Diagrams are inline SVG** with `class="diagram"` (sizing/background come from CSS — no inline `style` attributes), drawn by hand against the palette hex values, with `IBM Plex Mono` labels and a `FIG. NN · …` caption drawn inside the SVG. There are no image files in `assets/images/` yet.
- **No inline styles.** One-off styling uses the helper classes near the bottom of the buttons section in `style.css` (`.section-intro`, `.em-accent`, `.aside-note`, `.fine-note`, `.signoff`, `.stack-top`, `.stack-bottom`, `.btn-sm`). Add a class rather than a `style` attribute.
- **Mono labels are rationed.** IBM Plex Mono uppercase is reserved for `.fig-label`, sidebar `NN` counters, and index-page kickers; wayfinding text (table headers, callout labels, crumbs, pagination, sidebar, footer headings) is Lexend (`--font-sans`) with gentle tracking, and headings/brand text use Plus Jakarta Sans (`--font-display`). Don't reintroduce tiny tracked mono for UI text. Text color on gold labels uses `--gold-700`, not `--gold-600` (the lighter gold fails AA contrast on paper backgrounds).
- **Callouts:** `<div class="callout note|tip|warning"><div class="callout-label">…</div>…</div>`.
- **Procedures:** `<ol class="steps">` — auto-numbers `01`, `02`, … via CSS counters; each `<li>` starts with an `<h4>`.
- **Tables** must be wrapped in `.table-wrap` for horizontal scroll; numeric cells get `class="num"`.
- **Code blocks:** `<pre data-lang="…">` renders the language tag in the corner; syntax colour is manual via `.code-comment` / `.code-key` / `.code-str` spans.

## Editorial voice

Deliberately scoped: pre-arrival mechanical build, PCB, wiring, firmware upload, and calibration only. Vision, autonomy, sensor fusion, and the collaborative brief are intentionally withheld until Day 01 in Cebu — don't add content covering them. Tone is a vintage academic field guide; sections are referenced as "Section 01"–"Section 08" (never with the § sign — the user does not want it in content).

## Conventions

- **Git:** do not add `Co-Authored-By` (or any AI attribution) to commit messages in this repo.
- **No em dashes in site content.** Rewrite with a comma, colon, semicolon, or parentheses as the sentence demands; figure labels and empty table cells use `·`. En dashes stay where correct (the "University of San Jose – Recoletos" name, numeric ranges like 544–2400 µs).
