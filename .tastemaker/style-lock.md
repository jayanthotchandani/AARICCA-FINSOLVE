# Style lock — Aaricca Finsales

Established: 2026-09-01. Source: client brand playbook (`aarica_finsales_brand_playbook_v2.pdf`, spelling later corrected by user to "Aaricca") + client wireframe/layout deck (`AARICCA_Website_Wireframes_and_Layout_1.pdf`, 16 pages, Rev. 2, Aug 2026).

**Name correction:** the brand playbook PDF spells the name "Aarica" (single C). The user corrected this to **Aaricca** (double C) — A-A-R-I-C-C-A. The wireframe deck already uses this correct "AARICCA" spelling throughout. Use **Aaricca Finsales** in all copy/assets going forward.

## Palette
- Background: `#FFFFFF` (Pure White) — cards, clean negative space
- Warm hero/section tint: `#F5F0E8`-ish cream (visible throughout wireframes as alternating section backdrop) — not in the original playbook's stated hex list; sampled visually from wireframes. Re-extract exact hex before build if pixel-fidelity matters.
- Surface: `#F5F5F5` (Light Gray) — alternating section backdrops & dividers
- Primary: `#1B7F7E` (Aarica/Aaricca Teal) — logo, headings, primary buttons, UI borders
- Accent: `#D4A574` (Aarica/Aaricca Gold) — CTAs, accents, highlights, secondary buttons
- Text primary: `#424242` (Dark Gray) — contrast vs white bg: 10.05:1 (WCAG AAA pass)
- Text muted: `#9E9E9E` (Medium Gray) — captions, disabled states — contrast vs border use: 3.75:1 (UI-safe)
- Button label color: White on Teal for primary buttons (contrast 4.79:1, text-safe); Dark Gray on Gold for accent/secondary buttons (contrast 4.51:1, text-safe — right at the floor, do not darken gold further without re-checking)
- Functional: Success Green `#4CAF50` (approvals, positive metrics), Warning Red `#F44336` (errors, debt/urgent alerts) — used in wireframes for queue status pills ("URGENT", "NEW") and gauge zones (poor=red-ish, excellent=teal)
- Dark mode: not needed for this project — single mode only (no dark mode anywhere in playbook or wireframes)

## Color contract
Verified via `scripts/check_contrast.py --matrix text=#424242 bg=#FFFFFF surface=#F5F5F5 primary=#1B7F7E accent=#D4A574 border=#9E9E9E on-primary=#FFFFFF`:

- **Text-safe (>=4.5):** text/bg (10.05), text/on-primary (10.05), text/surface (9.22), bg/primary (4.79), primary/on-primary (4.79), text/accent (4.51)
- **UI-safe (>=3.0, <4.5):** surface/primary (4.39), text/border (3.75)
- **Decorative (<3.0):** bg/border, border/on-primary, surface/border, bg/accent (2.23), accent/on-primary (2.23) — **gold must never carry white/light text or be the only signal of state**, primary/accent, text/primary (2.10 — teal is NOT legible as body text on white; use only for headings at large sizes per the playbook's own H1–H3 spec, which is UI/display-text at a size where the 3:1 large-text floor would apply, not body copy), surface/accent, primary/border, accent/border, bg/surface, surface/on-primary, bg/on-primary

No adjustments needed — every pairing the playbook specifies for actual use (white-on-teal buttons, dark-gray-on-gold buttons, teal headings on white/cream) already clears its floor.

## Typography
- Display/heading font: **Poppins** — Bold (700) for H1, SemiBold (600) for H2/H3 and all button text. Geometric authority, matches "institutional trust + modern" positioning.
- Body font: **Inter** — Regular (400), 16px, 1.6 line-height. Clean grotesque for legibility in body copy and comparison tables.
- Scale (from playbook, desktop/mobile):
  - H1: 42–48px / 32px, Poppins Bold, Teal
  - H2: 32–36px / 24px, Poppins SemiBold, Teal
  - H3: 24–28px / 20px, Poppins SemiBold, Teal
  - Body: 16px, Inter Regular, Dark Gray
  - Caption/small: 13–14px, Inter Regular, Medium Gray
  - Button text: 15–16px, Poppins SemiBold

## Shape language
- Corner radius: moderate rounding on cards (~8–12px visually in wireframes), pill-shaped badges/tags (fully rounded), rounded buttons (~6–8px)
- Shadow depth: soft, subtle — cards read as bordered more than shadowed
- Border usage: thin hairline borders on cards and inputs (consistent with "UI borders" being a stated teal use-case)

## Density & spacing
- Overall density: generous on marketing sections (hero, proof band), moderate-dense on data-heavy screens (product page bank list, call-center queue)
- Section separation: alternating white / warm-cream / light-gray backdrops, full-bleed teal bands for high-priority CTA sections (callback form, footer)
- Content card internal padding: comfortable, ~24px+ visually across product cards, debt-list rows, queue cards

## Structure
This project's structure is **not derived from the diversification catalog** — it's dictated by the client's own wireframe deck, which is the authoritative sitemap and layout for this build. Do not rotate macrostructures/archetypes per Step 2.5; follow the deck.

**Sitemap (11 screens):**
1. **Homepage** (current, +2 additions) — sticky utility bar → nav → hero (eyebrow, H1, subhead, dual CTA, 3 stat tiles + floating rate-benchmark card) → NEW: half-circle credit score gauge section → 6-card loan product grid → 4-step process (Eligibility→Compare→Apply→Disbursement) → credit-score CTA band (teal) → callback form (teal full-bleed) → footer
2. **Homepage nav (redesigned):** Products dropdown (6 loan types) · Credit Score dropdown (Check Your Score / Improve Your Score) · standalone Debt Consolidation link · Calculators · Loan Process · Why AARICCA · FAQs · primary CTA button. Hover-open desktop, tap-open mobile.
3. **Product page ×6** (Personal/Home/Business/LAP/Education/MSME Loan) — one shared template: back-link → icon → product title/subhead → 4 stat tiles (amount/rate/tenure/approval time) → bank-picker dropdown (10 banks, collapsed shows selected bank+rate, expanded scrolls) → amount/rate/tenure sliders synced to selected bank's rate → EMI result card → 4-field eligibility form (name, mobile, income, employment, existing debts) that explicitly does NOT auto-score
4. **Debt Consolidation** (new, standalone nav link, not in Products dropdown) — per-debt list builder (type/outstanding/rate/monthly payment rows, "+ Add Another Debt") → "What Our Advisor Looks For" (Balance Transfer vs Loan Consolidation, human-judged not formula-driven) → 4-step "How It Works" → FAQ accordion → advisor-recommendation CTA
5. **Check Your Score** (current) — form-first (name, mobile+OTP, email, employment, salary) → soft-pull bureau result: gauge + tier guide (4 tiers: 750-900 Excellent/Prime, 700-749 Good, 650-699 Fair, 300-649 Needs Work) + matched pre-approved bank offers
6. **Improve Your Score** (new, second item in Credit Score dropdown, deliberately separate destination not a footnote) — Quick Wins (1-2wk) / Medium Term (1-3mo) two-column cards → Score Improvement Timeline (4-stage progress bars) → Common Mistakes to Avoid (2-column list) → "Recheck My Credit Score" CTA
7. **Application Form** (redesigned, cut 7→4 fields: name, mobile, loan type, amount) — 2-screen flow: form → success screen with Ref ID, live countdown timer to advisor callback, "what happens next" checklist, Track Application / Chat-Call Us buttons
8. **Call Center Lead Queue** (new, internal/password-protected, `/admin/queue`) — 4 stat tiles (leads today, in queue, potential value, conversion rate) → date-range CSV export toolbar → "Today's Top Leads" auto-ranked 3-card shortlist (by ticket value/CIBIL/urgency) → full active queue (status-pill cards: URGENT/NEW/QUALIFIED/ASSIGNED) → Smart Routing Rules sidebar
9. **Loan EMI Calculators** (current) — standalone generic multi-bank calculator (loan-type pill tabs, amount/rate/tenure sliders, EMI result card) — lighter companion to the per-product pages, not a replacement
10. **Loan Process** (current) — scroll-triggered 4-step visual walkthrough (same steps as homepage) + "Why AARICCA Outperforms Direct Bank Branch Visits" 3-pillar comparison (Automated Rate Bidding / Zero Hard Inquiry Risk / Doorstep & Digital Concierge) + stat band
11. **Why AARICCA** (current) — 6 value-pillar cards → interactive India map (click-to-flip state capitals, teal map on cream bg) → lending-partner logo grid (16 banks) → 3 testimonials → CTA
12. **FAQs** (current) — search bar + category pills (All/General/Loan Process/Eligibility/Rates & Charges) → accordion → "Still have questions?" teal callback band

**Core product philosophy (governs all copy/UX decisions):** funnel is browse-free → get-specific-with-real-numbers → minimum-info-handoff → human-advisor-callback-in-30-min. **No page in this product auto-scores or auto-rejects** — every eligibility/application form explicitly routes to a human advisor. State this explicitly in any new copy for forms.

**Shared chrome:** sticky 3-item utility bar (toll-free support · multi-bank partner count · pan-India coverage, teal band) above main nav on every page. Nav is identical across all pages except active-link underline. Footer is identical 4-column (brand blurb + contact / Navigation / Loan Products / Compliance) on every page, teal full-bleed.

## Build decision
An existing scaffold was found at `/Users/jayanthotchandani/Desktop/aaricca-finsales-v2` (React 19 + Vite, ~1790-line single-file App.jsx) covering 6 of the 11 wireframe-deck screens. It has real color drift from the official playbook hexes (two different teals and two different golds in use, text/surface off) and a fragile Tailwind setup (CDN script + dead `@tailwind` directives, no npm `tailwindcss` installed), plus the wrong logo (an old glossy gradient "M+arrow" icon, not the approved mountain-peak mark). **User decision (2026-09-01): do not reuse or fix that project — build everything from scratch.** Stack and starting screen not yet chosen; user said "wait" on build priority.

## Reference intelligence
- Reference board: not created — client-supplied source-of-truth documents used directly instead of competitor research
- Design read: financial services / loan-comparison marketing site + lead-gen funnel + one internal admin tool, for an Indian retail/SME borrower audience, mode = Persuade (public pages) + Operate (call-center queue), visual lane = institutional-trust fintech (not startup-flashy, not legacy-bank-rigid)
- Foundation: none yet — no repo/stack exists in this project directory as of lock creation. Stack must be chosen before Step 1.5/4.

## Taste memory
- Profile priors used: none (`~/.tastemaker/profile.md` not checked yet — no prior tastemaker history for this user)
- Decision log: `.tastemaker/decisions.log` (not yet created)
- Last resolved decisions: none yet
- Pending review: **open question — logo mark discrepancy.** Brand playbook states "no dedicated standalone symbol at this stage." Wireframe deck (title page + every page's nav) already shows a mountain-peak "AA" mark in teal/gold. Need user confirmation: is this mark an already-approved asset to preserve, or a wireframe-tool placeholder to ignore in favor of wordmark-only per the playbook? **Do not construct a new mark or discard the existing one until this is resolved.**

## Mood descriptors
Grounded, trustworthy, clear, quietly confident — "hidden champion," not flashy fintech, not rigid bank.

## Assets
- Anchor asset: none sourced yet
- Logo: **unresolved, see Pending review above.** Existing mountain-peak "AA" mark appears in wireframes at `design/assets/` — not yet extracted/vectorized.
- Illustration vs. photography split: not yet decided — no screens built

## Motion
Not yet specified — wireframe deck describes layout only, not motion/interaction detail beyond "hover/tap opens dropdown," "click pin to flip" (Why AARICCA map), and a live countdown timer (Application Form success screen). Default to Step 4's GSAP baseline when building; app-shell track for the Call Center Lead Queue, marketing/scroll track for public pages.

## Do not
- Do not auto-score, auto-approve, or auto-reject anywhere — every form is explicitly advisor-reviewed per the client's stated philosophy.
- Do not invent a new logo mark or drop the existing one without resolving the Pending review item above.
- Do not treat this project's macrostructure as something to diversify against — the wireframe deck is the fixed spec, reuse it exactly across all product-page instances (the 6 loan types share one template).
