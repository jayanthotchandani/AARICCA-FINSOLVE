# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite + Tailwind CSS (installed properly via PostCSS — no CDN script). User's explicit choice.

## Users

Primary: Indian retail and SME borrowers shopping for a loan (personal, business, home, loan-against-property, education, MSME) or trying to consolidate existing debt. Most arrive cold, from a social media ad, wanting to compare real bank rates without visiting a branch or filling out a long form before seeing any value.

Secondary: Aaricca Finsales' own call-center advisors, who work an internal, password-protected lead queue to call qualified leads within a 30-minute SLA.

## Product Purpose

Aaricca Finsales ("Credit Simplified") is a multi-bank loan distribution and comparison platform. It lets a visitor compare live rates across 40+ partner banks/NBFCs for six loan types plus a debt-consolidation service, check or improve their credit score with zero impact to their bureau file, and get a callback from a human advisor — never an automated approval or rejection — within 30 minutes.

## Positioning

"Hidden champion": not a rigid traditional bank (slow, single-lender, branch-bound) and not an untested fintech startup (impersonal, algorithm-only). Aaricca is a grounded, human-advised partner that runs automated rate-bidding across 40+ institutional lenders behind the scenes, but never lets an algorithm say no to a customer — every lead reaches a real advisor.

## Operating Context

The funnel is the same end to end across the whole site: **browse with zero pressure → get specific with real bank numbers → hand over the minimum information needed → get a callback from a prioritized queue within 30 minutes.**

- A cold visitor lands on the homepage (self-serve trust-builders: live rate ticker, the credit-score gauge) before any contact info is requested.
- Once they pick a specific loan type and bank, a short eligibility/application form (4 fields, not 7) hands off to a human advisor — the form deliberately does not auto-score or auto-reject.
- Internally, submitted leads land in a password-protected Call Center Lead Queue (`/admin/queue` in the wireframe deck) with an auto-ranked "today's top leads" shortlist, a full working queue, smart routing rules (e.g. CIBIL 750+ → fast track), and CSV export by date range.
- The wireframe deck (client-authored, 16 pages, Rev. 2, Aug 2026) is the authoritative source for site structure, page-by-page copy, and interaction detail — see Evidence on Hand.

## Capabilities and Constraints

- Six loan products share one page template: Personal, Business, Home, Loan Against Property, Education, MSME. Each template has a bank-picker dropdown (10 partner banks) that live-updates a rate slider and EMI calculation, plus the 4-field eligibility form.
- Debt Consolidation is a separate, advisor-judged product (not an auto-calculator): visitor lists every debt they're carrying; a human advisor decides whether a Balance Transfer, a Loan Consolidation, or both apply. Gets its own top-level nav link, not nested under the loan-products dropdown, per the client's explicit call-out that it's a differentiator.
- Credit Score splits into two destinations: "Check Your Score" (real bureau soft-pull, returns score + tier + matched pre-approved offers) and "Improve Your Score" (evergreen blog-style action plan — quick wins, medium-term actions, an improvement timeline, common mistakes) — kept as two separate pages, not one page with a footnote.
- **Hard constraint, stated explicitly by the client and non-negotiable: no page anywhere in the product may auto-score or auto-reject an applicant.** Every form exists to route a lead to a human advisor.
- Application form is deliberately minimal: name, mobile, loan type, amount — everything else (income, employment, existing debts) is gathered personally by the advisor on the call.
- Call Center Lead Queue is internal-only, password-protected, not part of public navigation. Reachable only at `/internal-leads-portal` (not linked from any public page); backed by a real Express + SQLite server (`server/`) with JWT httpOnly-cookie auth, live SSE push of new submissions, and CSV export by date range. All three lead-generating forms (Apply, per-product eligibility form, Debt Consolidation, Check Score) post to this backend — the homepage callback form intentionally does not. Run with `npm run dev` (starts client + server together via `concurrently`). Admin credentials live in `.env` (gitignored; see `.env.example` for the shape).
- Loan EMI Calculators (generic, multi-bank) stays as a lighter-weight standalone tool alongside the per-product bank-selector template, not a replacement for it.
- Known future/deferred items per the client's own wireframe deck (not in this build's scope unless requested): connecting the leads DB to a real CIBIL API, analytics instrumentation, a dedicated mobile-first pass, RBI fair-practice legal review of credit-score/rate language, and a decision on Debt Consolidation's release timing/workflow.

## Brand Commitments

- Name: **Aaricca Finsales** (double-C spelling — confirmed final by the user; supersedes the single-C spelling in the original brand-playbook PDF text). Tagline: "Credit Simplified."
- Logo: official final wordmark + mountain-peak mark, teal (`#1B7F7E`) and gold (`#D4A574`), provided as `logo.png` in the project root (572×363, transparent background, "AARICCA" wordmark + "CREDIT SIMPLIFIED" subtext). This supersedes the old glossy "M+arrow" gradient icon found in the abandoned `aaricca-finsales-v2` scaffold — do not reuse that asset.
- Palette (verified contrast-safe — see `.tastemaker/style-lock.md` for the full contract): Teal `#1B7F7E` (headings, primary buttons, borders), Gold `#D4A574` (CTAs/accents, paired with dark-gray text only), Dark Gray `#424242` (body text), Pure White `#FFFFFF`, Light Gray `#F5F5F5`, Medium Gray `#9E9E9E`, Success Green `#4CAF50`, Warning Red `#F44336`.
- Typography: Poppins (Bold/SemiBold — headings, buttons) paired with Inter (Regular — body, tables).
- Brand personality: Trustworthy ("Your back has my back"), Clear (zero jargon), Empowering ("I've got this now").
- Full sitemap, structure, and per-page copy: locked in `.tastemaker/style-lock.md`'s Structure section, sourced directly from the client's wireframe deck.

## Evidence on Hand

- `aarica_finsales_brand_playbook_v2.pdf` — official brand identity, color, and type spec (client-provided).
- `AARICCA_Website_Wireframes_and_Layout_1.pdf` — 16-page, client-authored page-by-page wireframe deck with real copy, real stat numbers (₹500Cr+ disbursed, 40+ lending partners, 24hr express sanctions, 94.8% sanction success), a full 16-bank partner list, 3 real testimonials (Rajesh Kulkarni, Dr. Priyamvada Sharma, Arjun Mathur), and a full FAQ set. **This copy is real client content, not placeholder — reuse it verbatim where the deck provides it rather than inventing new copy.**
- `logo.png` (project root) — official final logo asset.
- An earlier build attempt exists at `/Users/jayanthotchandani/Desktop/aaricca-finsales-v2/` (React 19 + Vite). The user explicitly decided **not** to reuse or fix it — noted here only so it is not mistaken for a live reference; do not port code or assets from it (its colors and logo are off-brand).

## Product Principles

1. Never auto-score, auto-approve, or auto-reject anywhere in the product — every form's job is to route a qualified lead to a human advisor, and copy/UX must reinforce this (e.g. "soft inquiry," "won't impact your score," "our advisor reviews personally").
2. Progressive disclosure of commitment: let a visitor get real value (rates, a score read) before asking for anything, and ask for the least information possible at each step.
3. One template, six products: the loan-product page must stay a single reusable component driven by data (bank list, rate range, specs per loan type), not six hand-built pages.
4. The 30-minute human-callback SLA is the core trust mechanism of the whole brand — surface it consistently (homepage, forms, success states, footer) rather than treating it as one-page copy.
5. Debt Consolidation and the two-page Credit Score split are explicit, hard-won structural decisions from client feedback rounds — do not collapse them back into simpler-looking structures for the sake of tidiness.

## Accessibility & Inclusion

Not explicitly specified by the client in either source document. No specific standard (e.g. WCAG level) was named — apply Impeccable's standard craft floor by default.
