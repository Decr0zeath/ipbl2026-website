# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Delegates (STEM undergraduates from Engineering, Computer Science, Robotics, Information Science, and Electrical Engineering programmes) at three partner universities — University of San Jose–Recoletos (host, Cebu), Southern Taiwan University of Science and Technology, and Osaka Institute of Technology — preparing individually before traveling to the on-site International Project-Based Learning (iPBL) 2026 programme. They have some technical/STEM background but not necessarily prior experience with this specific robot platform.

## Product Purpose

A pre-training field manual that walks each delegate through building and calibrating an identical quadruped robot (four legs, twelve SG90 servos, Arduino Nano, custom PCB) on their own, before arriving in Cebu — so the on-ground programme can start from a working, standing robot rather than from assembly.

## Positioning

Not a general robotics tutorial: a narrow, sequenced manual scoped to exactly what's needed to reach "stands, walks forward, responds reliably" — deliberately excluding vision, autonomy, sensor fusion, and the collaborative challenge, which are reserved for reveal on Day 01 on-site.

## Operating Context

- **Dual-mode use (confirmed with user):** read standalone as self-serve pre-training before any instructor contact, *and* used as a companion/reference during in-person iPBL sessions. Both must work — don't assume clarification is always available in person.
- Delegates work independently, likely at home or in a dorm/lab, following the section order (Overview → BOM → Printing → Assembly → Electronics → PCB → Firmware → Ready for Cebu).
- Physical, hands-on workflow alongside the screen: soldering, 3D printing, servo wiring — the manual is consulted step-by-step while hands are on hardware.
- Delegates are expected to arrive with a build journal, spare parts, and a laptop with Arduino IDE pre-configured.
- Static site deployed via GitHub Pages, no server-side logic.

## Capabilities and Constraints

- **Shell + fragments architecture (SPA-lite):** `pretraining.html` is a standalone landing page for the manual; `index.html` is the site's root landing page (the event page — programme, universities, venue, sponsors), since GitHub Pages serves it at the domain root. The two cross-link. `manual.html` is a single shell (chrome + empty mounts) that fetches `sections/<slug>.html` fragments via `assets/js/main.js`, injects them, and routes via location hash (`manual.html#assembly`). `assets/js/manual-map.js` is the single source of truth for section order/titles; `sections/*.html` are content-only fragments (no `<html>`/chrome). `reference/course-viewer.js` is an inert reference pattern, not loaded by any page.
- Must be served over HTTP (Live Server, `python -m http.server`, etc.) — opening `manual.html` from `file://` fails because the viewer uses `fetch()`.
- All figures currently use styled placeholder frames (`<div class="placeholder">`) instead of real photos/diagrams — real photography is expected to replace these later.
- No backend, no forms, no build tooling — plain HTML/CSS/JS only.
- Mechanical platform adapted from Mert Kilic's open-source quadruped (PCBWay); PCB is a custom redesign by the USJ-R host team.
- No em dashes in site content (house style — see CLAUDE.md); figure labels and empty table cells use `·` instead.

## Brand Commitments

- Name: "Quadruped Pre-Training Manual," iPBL 2026, USJ-R host mark ("iP" brand mark).
- Aesthetic: academic field-guide / vintage technical manual — figure frames with corner brackets, section markers, mono-spaced labels.
- Palette: USJ-R green `#0D3E20` (deep) with gold `#FEB104` accent, on warm parchment `#F4ECD8` paper. Gold text on paper/paper-2 backgrounds uses the darker `--gold-700` token for AA contrast; `--gold-500/600` stay for borders, backgrounds, and gold-on-dark contexts.
- Type: Plus Jakarta Sans (display/headings), Lexend (body/UI text), Crimson Pro italic (accents), IBM Plex Mono (code/technical labels — rationed, not used for general wayfinding text).
- Voice: warm but precise field-manual tone; opens with a Cebuano greeting ("maayong adlaw"); treats the withheld Day-01 content as a deliberate, motivating mystery rather than a limitation.

## Evidence on Hand

- No real photography or assembly diagrams yet — every figure is a placeholder (`FIG. NN · description`) per the README's stated replacement workflow. Do not fabricate photos or claim specific visuals exist.
- Real BOM, pinout tables, wiring/schematic content, and firmware walkthrough exist as structured text/diagrams (SVG) already in the section fragments.

## Product Principles

1. Sequence discipline: each section assumes the prior one is complete; never let a page imply out-of-order shortcuts.
2. Protect the Day-01 surprise: never hint at or leak the reserved higher-level content (autonomy, vision, the challenge brief).
3. Design for two reading modes at once: skimmable while hands are on hardware, and complete enough to work with zero live support.
4. Precision over decoration: this is a build reference — accuracy of pinouts, part numbers, and steps outranks visual flourish.
5. Preserve the field-guide identity (frames, brackets, mono labels, green/gold-on-cream) — it's a deliberate, confirmed aesthetic, not a placeholder to redesign away.

## Accessibility & Inclusion

Delegates travel internationally (Philippines, Taiwan, Japan) — English is a shared but non-native language for most readers; avoid idiom-heavy phrasing outside the intentional, isolated Cebuano greetings. Gold-on-paper text must clear WCAG AA (use `--gold-700`, not `--gold-600`, for text). No other accessibility requirement has been established yet.
