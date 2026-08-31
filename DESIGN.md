---
name: Aaricca Finsales
description: Credit, simplified — a multi-bank loan comparison and advisory platform
colors:
  teal: "#1B7F7E"
  teal-dark: "#155F5E"
  teal-light: "#2E9C9A"
  gold: "#D4A574"
  gold-dark: "#B8865A"
  ink: "#424242"
  muted: "#9E9E9E"
  cream: "#F5F1E8"
  surface: "#F5F5F5"
  success: "#4CAF50"
  warn: "#F44336"
typography:
  display:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 700
    fontSize: "clamp(2rem, 4vw, 3rem)"
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 600
    fontSize: "2.125rem"
    lineHeight: 1.15
  title:
    fontFamily: "Poppins, sans-serif"
    fontWeight: 600
    fontSize: "1.625rem"
    lineHeight: 1.25
  body:
    fontFamily: "Inter, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.6
  label:
    fontFamily: "Inter, sans-serif"
    fontWeight: 600
    fontSize: "0.75rem"
    letterSpacing: "0.02em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.teal-dark}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 24px"
  card:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Aaricca Finsales

## Overview

**Creative North Star: "The Rate Board"**

Aaricca Finsales sells one idea — that 40+ banks compete for a borrower instead of a borrower begging one branch — and the system is built to prove that idea with real numbers rather than assert it with a slogan. The rendition is a hairline-bordered, institutional-but-warm interface: teal for trust and authority, gold for the moment of decision (a rate, a CTA, a highlighted tier), a warm cream ground instead of clinical white so the platform reads as an advisory relationship, not a banking terminal. Cards are used for genuinely comparable units (six loan products, six banks, a testimonial) — never as a default container for a section that could be a real table, chart, or gauge instead.

This system was built directly against a client-supplied wireframe deck (16 pages, real page-by-page composition and copy) and a client brand playbook (exact color/type spec) — both treated as pinned authority, not a starting mood. The one deliberate departure from the wireframe deck: every eyebrow/kicker label above a heading (e.g. "LENDING PORTFOLIO", "CREDIT HEALTH ASSESSMENT") was removed and folded into the heading itself. This is a craft-floor rule, not a preference — no brief earns the eyebrow back.

**Key Characteristics:**
- Real bank names and real rates wherever a claim can be shown instead of stated
- Teal carries authority (headings, primary actions); gold is reserved for the decisive moment (a CTA, a top-ranked lead, a live rate)
- No gradients, no glass, no gradient text, no decorative kickers
- Motion is a marquee ticker, section reveals, and functional feedback (slider thumbs, rate sync) — never decorative

## Colors

Warm-institutional: a cream ground (not white, not gray) with two saturated roles — teal for trust/authority and gold for CTAs and decision moments — plus a strict dark-gray/white neutral scale for text and surfaces.

### Primary
- **Aarica Teal** (#1B7F7E): logo, all headings (H1–H3), primary buttons, active nav states, borders on interactive elements. Never used as small body text on a light ground — verified at 2.10:1 against white, below the text floor; teal text is reserved for display-scale headings (20px+) where the large-text 3:1 floor applies.

### Secondary
- **Aarica Gold** (#D4A574): CTAs and accent moments — the "Zero Upfront Fees" badge, top-ranked lead cards, progress-timeline fill, secondary button borders. Never carries text at small sizes on its own (2.23:1 against white and against teal) — text-on-gold pairings use dark ink (#424242), which clears 4.51:1.

### Neutral
- **Ink** (#424242): all body copy, form labels, primary text. 10.05:1 against white and cream — far above the AA floor.
- **Muted** (#9E9E9E): captions, disabled states, placeholder text, secondary metadata.
- **Cream** (#F5F1E8): the page ground for marketing/content sections — warmer and more advisory than clinical white.
- **Surface** (#F5F5F5): alternating section backdrops and inset panels (rate rows, stat tiles) inside white cards.
- **White** (#FFFFFF): card containers throughout.

### Functional
- **Success** (#4CAF50) and **Warn** (#F44336): reserved for the internal Lead Queue's status pills (URGENT/NEW) and form validation — never used decoratively on the public site.

### Named Rules
**The Teal-Is-Never-Body-Text Rule.** Teal only appears as text at heading scale (20px/SemiBold or larger) or as a fill/border. Below that size it drops to Ink.
**The Gold-Needs-Dark-Ink Rule.** Any text sitting on a gold fill is Ink (#424242), never white — gold-on-white and white-on-gold both fail the text contrast floor.

## Typography

**Display/Heading Font:** Poppins (Bold 700 for H1, SemiBold 600 for H2/H3 and all button labels)
**Body Font:** Inter (Regular 400)

**Character:** Poppins supplies geometric, confident authority for anything the eye should trust immediately (headings, CTAs); Inter stays out of the way for anything the eye needs to read carefully (body copy, bank-rate tables, form labels) — the same institutional-clarity split named in the client's own brand playbook.

### Hierarchy
- **Display / H1** (Bold 700, 32–48px fluid, 1.08 line-height): page hero headlines only, one per page.
- **Headline / H2** (SemiBold 600, 34px, 1.15): major section headers.
- **Title / H3** (SemiBold 600, 26px, 1.25): subsection and card-group headers.
- **Body** (Regular 400, 16px, 1.6 line-height, max 70ch measure): paragraph copy, descriptions, FAQ answers.
- **Label** (SemiBold 600, 11–12px, slight tracking): stat captions, form field labels, status pills — never uppercase kicker text sitting alone above a heading.

### Named Rules
**The No-Eyebrow Rule.** No heading in this system is preceded by a small-caps label restating its section's category. If a label is needed for wayfinding (a step counter, a form's "Step 1 of 2"), it lives inline with functional content, never as decoration above a heading.

## Layout

Marketing and content pages: a single `max-w-7xl` (or narrower `max-w-4xl`/`max-w-5xl` for form-centric pages) centered container, `px-5 sm:px-8` gutters. Sections alternate cream / white / surface backgrounds to separate rhythm without hairline dividers between every block. Hero splits 7/5 (content/proof) on desktop, stacks on mobile. Card grids run 3-up desktop, 2-up tablet, 1-up mobile via `sm:grid-cols-2 lg:grid-cols-3`.

The internal Lead Queue (`/admin/queue`) is its own density register: tighter stat tiles, a 3-column top-leads strip, a 4-column queue/sidebar split — an Operate surface, not a Persuade one, and it never inherits the marketing pages' generous section padding.

## Elevation & Depth

Flat by default, with two soft, always-offset shadow tokens — no zero-offset "glow" shadows and no hard neobrutalist block shadows anywhere in this system. Depth communicates "this is a card floating on the page," never decoration.

### Shadow Vocabulary
- **card** (`0 1px 2px rgba(27,127,126,0.06), 0 8px 24px -12px rgba(27,127,126,0.18)`): default resting elevation for product cards, form panels.
- **raised** (`0 4px 8px rgba(27,127,126,0.08), 0 16px 40px -16px rgba(27,127,126,0.28)`): the rate-benchmark hero card, open dropdown menus, the callback form — anything that should read as "in front of" the page.

### Named Rules
**The Teal-Tinted Shadow Rule.** Every shadow in this system is tinted from teal, never neutral gray — shadows belong to the palette like any other surface.

## Shapes

Corner radius scales with a component's weight: `8px` for compact controls (stat tiles, badges), `12px` for standard cards and inputs, `16px` for hero-weight cards (the rate-benchmark panel, the callback form). Pills (`999px`) are reserved for status chips, filter toggles, and the nav CTA — never for a content card. Borders are 1px hairlines in `teal/10–20%` opacity, used for separation instead of shadow wherever a card sits directly on a matching-tint background.

## Components

### Buttons
- **Shape:** 12px radius, never pill-shaped except the header's "Get Instant Approval" CTA.
- **Primary:** Teal fill, white text, `14px/24px` padding, hover darkens to Teal-Dark, active scales to 0.98.
- **Secondary:** Transparent fill, 2px Gold border, Ink text, hover fills Gold at 10% opacity.
- **Tertiary (in-card):** Teal-tinted fill at 8% opacity for low-emphasis actions (e.g. "Calculate EMI" beside "Apply Now").

### Cards / Containers
- **Corner Style:** 16px (content cards), 12px (compact tiles).
- **Background:** White on cream/surface sections; Surface-tinted insets inside white cards for grouped data (rate rows, EMI breakdowns).
- **Shadow Strategy:** `card` at rest, `raised` for the highest-priority element per section.
- **Border:** 1px teal-tinted hairline, always present alongside shadow (never shadow alone).
- **Internal Padding:** 24px standard, 32px for hero-weight cards.

### Inputs / Fields
- **Style:** White fill, 1px teal/20% border, 12px radius, 14px label above in Teal-Dark SemiBold.
- **Focus:** Border shifts to full Teal plus a 2px Teal/15%-opacity ring — never a bare browser-default outline.
- **Required fields:** marked with a Warn-colored asterisk, not a separate color scheme.

### Navigation
- Sticky header (white/95% + blur) beneath a non-sticky scrolling ticker bar (Teal-Dark). Products and Credit Score are hover/tap dropdown menus; active route gets Teal text + semibold weight, not an underline. Mobile collapses to a full-width sheet with accordion sub-menus for the two dropdowns.

### Signature Component: the Bank-Rate Selector
The loan-product page's core interaction: a closed-state dropdown shows only the selected bank and its live rate; opening it reveals all ten partner banks in a scrollable list. Selecting a bank instantly re-centers the interest-rate slider on that bank's real rate and recalculates the EMI card — this is the one interaction in the system built to *prove* the "40+ banks compete for you" claim rather than assert it in copy.

### Signature Component: the Credit Score Gauge
A hand-built SVG half-circle gauge (300–900 scale, four colored bands: red/gold/light-teal/teal) with a needle and center readout — used identically on the homepage teaser and the full Check-Your-Score result, so a visitor's mental model of "where do I stand" carries across both.

## Do's and Don'ts

### Do:
- **Do** reuse the client's real content (bank names, real testimonials, real stat numbers like ₹500Cr+/40+/24hrs) verbatim rather than inventing new copy.
- **Do** keep every eligibility/application form explicit that it does not auto-score or auto-reject — this is a stated, non-negotiable product principle, not just copy flavor.
- **Do** drive the six loan-product pages from one shared template and a data file (`src/data.js`) — never hand-build a seventh near-duplicate page.
- **Do** tint shadows, focus rings, selection color, and the scrollbar from the palette — browser-default chrome is a visible tell this system avoids.

### Don't:
- **Don't** put an eyebrow/kicker label above any heading, on any page, regardless of what the wireframe deck shows — this was a deliberate, disclosed departure from the source material.
- **Don't** use teal as small body text on a light background — it fails contrast below display scale.
- **Don't** let gold carry its own text — pair it with Ink, never white.
- **Don't** add a zero-offset "glow" shadow or a hard neobrutalist block shadow — this system's only two shadow tokens are `card` and `raised`, both soft and offset.
