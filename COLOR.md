# VialGuard Brand Color + Logo Integration Plan (Option A)
**Goal:** Make **blue** the primary authority color across the brand, while keeping **purple** as a modern accent.  
**Outcome:** VialGuard feels more *clinical, trustworthy, audit-safe*, without losing SaaS polish.

---

## 1) Brand Architecture Rules (Do Not Deviate)
- **Brand / company name (logo text):** `VialGuard`
- **Product name (in body copy):** `VialGuardHQ`
- **Primary brand color (authority):** **Deep Medical Blue**
- **Accent color (modern SaaS polish):** **Purple**
- Never switch between “VialGuard” and “VialGuardHQ” in the header logo.
- Keep “VialGuardHQ” as the platform name in descriptive copy (hero/body).

---

## 2) Color System (Option A)
### 2.1 Primary (Authority Blue)
Use this for anything that should feel:
- trusted
- compliant
- “audit-safe”
- healthcare-grade
- infrastructure

**Primary uses (must be blue):**
- Logo icon (shield)
- Trust strip icons + text highlights (compliance / audit claims)
- “Protection systems” section headers / badges (if colored)
- Pricing comparison card emphasis (the “investment” side or the header)
- Links that convey authority (e.g., “How it works”)
- Primary border outlines for security/compliance callouts

### 2.2 Accent (Purple)
Use this for anything that should feel:
- modern
- clickable
- product-led
- “SaaS polish”

**Accent uses (purple):**
- Primary CTA buttons (Start Free Trial)
- Hero headline emphasis word (currently “Injectable Inventory”) — keep purple initially
- Hover states + focus rings
- Secondary UI accents (chips, small badges, subtle highlights)

### 2.3 Neutrals
Keep background and typography calm and clinical:
- Off-white / light mint background can stay
- Use dark slate/near-black for headline text
- Avoid using too many saturated colors beyond blue + purple

---

## 3) Implementation Steps (Engineering + UI)
### Step 1 — Decide the Blue Token
1. Choose a single **Primary Blue** hex that harmonizes with existing purple.
2. Create a design token, e.g.:
   - `--brand-primary` = (primary blue)
   - `--brand-accent` = (existing purple)
3. Update Tailwind/theme config (or CSS variables) so the system is consistent.

**Deliverable:** single source of truth for colors (no hardcoded scattered hex codes).

---

### Step 2 — Replace Logo Icon Color to Blue
1. Export the finalized shield icon in:
   - Blue on transparent background
   - White on transparent background (for dark backgrounds)
   - Monochrome black/white fallback
2. Update header logo mark to use **blue icon**.
3. Keep logo word “VialGuard” in dark text (or blue if it looks best, but default to dark text).

**Goal:** brand authority starts immediately at the top-left.

---

### Step 3 — Re-anchor “Trust” Elements to Blue
Find all credibility/authority areas and ensure they use blue (not purple):
- Compliance strip (“DEA/state expectations”, “modeled after standards”)
- Shield/check icons
- Compliance-related badges

**Rule:** anything referencing audits/compliance should visually align with **blue**.

---

### Step 4 — Keep Purple for Conversion Elements
Purple stays as the “action” color:
- Primary CTA buttons
- Button hover states
- Active/focus rings
- Hero emphasis word (for now)

**Reason:** preserve your current conversion energy while shifting brand authority to blue.

---

### Step 5 — Update Pricing Comparison Card
In the “Real Cost Comparison” component:
- Use **blue** for the VialGuard monthly investment emphasis (authority)
- Use neutral/red tint for the loss side (pain)
- Avoid purple in this component (it’s not about “SaaS vibe”; it’s about trust/math)

---

### Step 6 — Audit the Entire Page for Color Drift
Perform a sweep:
1. Identify anywhere purple is used outside:
   - buttons
   - hero emphasis
   - minor UI accents
2. Reassign those usages:
   - **Blue** if it’s trust/compliance/authority
   - **Neutral** if it’s informational
3. Ensure no new “third color” is introduced (keep it to blue + purple + neutrals).

---

## 4) Acceptance Criteria (How We Know We Did It Right)
- Header logo icon is **blue**.
- Compliance/authority messaging feels **blue-led**.
- CTAs remain **purple-led**.
- Page still looks cohesive (no clashing).
- No sections feel like different brands.
- Color usage feels intentional:
  - Blue = trust/authority
  - Purple = action/product

---

## 5) Deliverables to Produce
- `brand-colors.md` (or `branding.md`) containing:
  - final hex values
  - token names
  - usage rules (where blue/purple should/shouldn’t appear)
- Updated logo assets:
  - `logo-icon-blue.svg` (preferred)
  - `logo-icon-blue.png`
  - `logo-icon-white.svg` / `.png`
- Code updates:
  - theme tokens applied
  - header logo updated
  - trust strip updated
  - pricing comparison updated

---

## 6) Notes / Guardrails
- Do NOT remove purple entirely.
- Do NOT introduce gradients unless already part of the existing visual system.
- Maintain the current calm, clinical layout and spacing.
- The goal is not “prettier”; the goal is **more trustworthy**.

---
