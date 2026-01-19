# VialGuardHQ Implementation Plan

## Executive Summary

VialGuardHQ is a specialized injectable inventory guardian for medical spas and aesthetic clinics. It protects expensive injectable investments (Botox, fillers, controlled substances) by providing vial-level tracking, discrepancy detection, expiry alerts, and audit-ready compliance documentation.

**Core Value Proposition:** "The quiet guardian that makes sure nothing expensive goes missing."

---

## Tech Stack

Based on the patterns established in OrderShifter and GroomRoute:

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Database | PostgreSQL | via Neon Serverless |
| ORM | Prisma | 7.x |
| Authentication | NextAuth.js | 5.x (credentials + JWT) |
| Payments | Stripe | 20.x |
| Email | Resend | 6.x |
| Styling | Tailwind CSS + DaisyUI | 3.x / 5.x |
| Icons | Lucide React | Latest |
| Validation | Zod | 3.x |
| Analytics | PostHog | Latest |

---

## Brand & Design Direction

### Color Palette Adaptation

The design guide uses warm brown (#A5744A) as primary. For VialGuardHQ, we'll adapt to a **calm, medical-professional palette**:

```javascript
// tailwind.config.ts - DaisyUI theme
daisyui: {
  themes: [{
    light: {
      primary: "#0F766E",           // Teal - calm, clinical, trustworthy
      "primary-focus": "#0D9488",   // Lighter teal - hover states
      "primary-content": "#ffffff",
      secondary: "#6366F1",         // Indigo - professional accent
      accent: "#14B8A6",            // Light teal accent
      neutral: "#1E293B",           // Slate dark
      "base-100": "#ffffff",
      info: "#3B82F6",              // Blue
      success: "#22C55E",           // Green for positive
      warning: "#F59E0B",           // Amber for alerts
      error: "#EF4444",             // Red for errors/problems
    },
  }],
}
```

### Section Backgrounds
```css
/* Hero - calm, clinical */
bg-gradient-to-br from-teal-50 via-cyan-50 to-white

/* How it works - trust, confidence */
bg-gradient-to-br from-slate-50 to-gray-50

/* Feature highlight - professional */
bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50

/* Final CTA - branded */
bg-gradient-to-br from-teal-50 to-cyan-50

/* Problem cards - risk/anxiety */
bg-amber-50 border border-amber-200

/* Solution cards - calm/protected */
bg-teal-50 border border-teal-200
```

---

## Project Structure

```
/vialguardhq
├── app/
│   ├── (marketing)/              # Marketing pages (landing, pricing)
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/                   # Auth pages
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (dashboard)/              # Protected app pages
│   │   ├── layout.tsx            # Dashboard shell with sidebar
│   │   ├── page.tsx              # Dashboard home / Calm Center
│   │   ├── inventory/
│   │   │   ├── page.tsx          # Inventory overview
│   │   │   ├── [id]/page.tsx     # Single vial detail
│   │   │   └── intake/page.tsx   # Add new inventory
│   │   ├── usage/
│   │   │   ├── page.tsx          # Usage log list
│   │   │   └── log/page.tsx      # Log usage (one-tap flow)
│   │   ├── alerts/page.tsx       # Expiry & discrepancy alerts
│   │   ├── audit/page.tsx        # Audit trail / history
│   │   ├── reports/page.tsx      # Reports & insights
│   │   ├── team/page.tsx         # Team management
│   │   └── settings/page.tsx     # Account settings
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── auth/signup/route.ts
│   │   ├── inventory/
│   │   │   ├── route.ts          # GET list, POST create
│   │   │   ├── [id]/route.ts     # GET, PUT, DELETE single
│   │   │   └── intake/route.ts   # Batch intake
│   │   ├── usage/
│   │   │   ├── route.ts          # GET list, POST log
│   │   │   └── [id]/route.ts     # Single usage record
│   │   ├── alerts/route.ts       # GET alerts
│   │   ├── discrepancies/
│   │   │   ├── route.ts          # GET, POST
│   │   │   └── [id]/route.ts     # Resolve discrepancy
│   │   ├── audit/route.ts        # GET audit log
│   │   ├── reports/route.ts      # GET reports
│   │   ├── team/route.ts         # Team management
│   │   ├── subscription/route.ts # Billing
│   │   └── webhooks/stripe/route.ts
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # Primitives (button, input, card)
│   ├── layout/                   # Header, sidebar, navigation
│   ├── inventory/                # Inventory-specific components
│   ├── usage/                    # Usage logging components
│   ├── alerts/                   # Alert cards, notifications
│   └── calm-center/              # Calm Center components
├── lib/
│   ├── prisma/client.ts          # Prisma initialization
│   ├── auth.ts                   # NextAuth config
│   ├── stripe.ts                 # Stripe config & pricing
│   ├── resend.ts                 # Email utilities
│   ├── features.ts               # Feature gating
│   ├── calculations.ts           # Inventory calculations
│   └── utils.ts                  # General utilities
├── prisma/
│   └── schema.prisma             # Database schema
├── public/
│   └── images/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== ACCOUNTS & AUTH ====================

model Account {
  id                String   @id @default(cuid())
  clinicName        String

  // Subscription
  plan              Plan     @default(TRIAL)
  subscriptionStatus SubscriptionStatus @default(TRIAL)
  stripeCustomerId  String?  @unique
  stripeSubscriptionId String?
  currentPeriodEnd  DateTime?
  billingCycle      BillingCycle @default(MONTHLY)
  trialEndsAt       DateTime?

  // Settings
  timezone          String   @default("America/New_York")

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  users             User[]
  products          Product[]
  vials             Vial[]
  usageLogs         UsageLog[]
  discrepancies     Discrepancy[]
  auditLogs         AuditLog[]
  providers         Provider[]
  locations         Location[]

  @@index([stripeCustomerId])
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  passwordHash      String
  name              String
  role              UserRole @default(STAFF)

  emailVerified     Boolean  @default(false)
  verificationToken String?
  resetToken        String?
  resetTokenExpiry  DateTime?

  accountId         String
  account           Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  usageLogs         UsageLog[]
  adjustments       InventoryAdjustment[]
  auditLogs         AuditLog[]

  @@index([accountId])
  @@index([email])
}

enum UserRole {
  OWNER
  ADMIN
  PROVIDER    // Injector/practitioner
  STAFF       // Front desk, etc.
}

enum Plan {
  TRIAL
  STARTER
  GROWTH
  PRO
}

enum SubscriptionStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELED
  INCOMPLETE
  EXPIRED
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

// ==================== CLINIC STRUCTURE ====================

model Provider {
  id                String   @id @default(cuid())
  name              String
  initials          String   // For quick display
  email             String?
  active            Boolean  @default(true)

  accountId         String
  account           Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  usageLogs         UsageLog[]

  @@index([accountId])
}

model Location {
  id                String   @id @default(cuid())
  name              String   // e.g., "Main Clinic", "Room 2 Fridge"
  type              LocationType @default(STORAGE)

  accountId         String
  account           Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  vials             Vial[]

  @@index([accountId])
}

enum LocationType {
  STORAGE           // Fridge, cabinet
  TREATMENT_ROOM    // Where procedures happen
}

// ==================== PRODUCTS & INVENTORY ====================

model Product {
  id                String   @id @default(cuid())
  name              String   // e.g., "Botox", "Juvederm Ultra Plus"
  brand             String   // e.g., "Allergan", "Galderma"
  category          ProductCategory
  unitType          UnitType // UNITS, ML, SYRINGE
  unitsPerVial      Decimal  // e.g., 100 units for Botox, 1 for syringe
  costPerVial       Decimal? // Purchase cost (optional)

  active            Boolean  @default(true)

  accountId         String
  account           Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  vials             Vial[]

  @@unique([accountId, name])
  @@index([accountId])
}

enum ProductCategory {
  NEUROTOXIN        // Botox, Dysport, Xeomin
  FILLER            // Juvederm, Restylane, etc.
  BIOSTIMULATOR     // Sculptra, Radiesse
  OTHER
}

enum UnitType {
  UNITS             // For neurotoxins (Botox units)
  ML                // For fillers
  SYRINGE           // Pre-filled syringes
  VIAL              // Whole vial tracking
}

model Vial {
  id                String   @id @default(cuid())

  productId         String
  product           Product  @relation(fields: [productId], references: [id])

  // Tracking
  lotNumber         String
  expirationDate    DateTime

  // Quantities
  initialQuantity   Decimal  // Starting units
  remainingQuantity Decimal  // Current units remaining

  // Status
  status            VialStatus @default(ACTIVE)

  // Location
  locationId        String?
  location          Location? @relation(fields: [locationId], references: [id])

  // Metadata
  receivedDate      DateTime @default(now())
  openedDate        DateTime?
  depletedDate      DateTime?
  notes             String?

  accountId         String
  account           Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  usageLogs         UsageLog[]
  adjustments       InventoryAdjustment[]

  @@index([accountId])
  @@index([productId])
  @@index([lotNumber])
  @@index([expirationDate])
  @@index([status])
}

enum VialStatus {
  ACTIVE            // In use
  DEPLETED          // Fully used
  EXPIRED           // Past expiration
  DISPOSED          // Manually disposed/written off
  QUARANTINED       // Under investigation
}

// ==================== USAGE LOGGING ====================

model UsageLog {
  id                String   @id @default(cuid())

  vialId            String
  vial              Vial     @relation(fields: [vialId], references: [id])

  providerId        String?
  provider          Provider? @relation(fields: [providerId], references: [id])

  // Usage details
  quantityUsed      Decimal

  // Optional patient reference (not full patient records - just for linking)
  patientReference  String?  // e.g., initials or chart number
  treatmentArea     String?  // e.g., "Forehead", "Lips"

  // Timestamps
  usedAt            DateTime @default(now())
  loggedAt          DateTime @default(now())

  // Who logged it
  loggedById        String
  loggedBy          User     @relation(fields: [loggedById], references: [id])

  notes             String?

  accountId         String
  account           Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())

  @@index([accountId])
  @@index([vialId])
  @@index([providerId])
  @@index([usedAt])
}

// ==================== ADJUSTMENTS & DISCREPANCIES ====================

model InventoryAdjustment {
  id                String   @id @default(cuid())

  vialId            String
  vial              Vial     @relation(fields: [vialId], references: [id])

  // Adjustment details
  previousQuantity  Decimal
  newQuantity       Decimal
  reason            AdjustmentReason
  notes             String?

  // Who made adjustment
  adjustedById      String
  adjustedBy        User     @relation(fields: [adjustedById], references: [id])

  createdAt         DateTime @default(now())

  @@index([vialId])
}

enum AdjustmentReason {
  PHYSICAL_COUNT    // Reconciliation from physical count
  SPILLAGE          // Accidental waste
  EXPIRED_DISPOSAL  // Disposed due to expiration
  BREAKAGE          // Broken/damaged
  THEFT_SUSPECTED   // Suspected theft/diversion
  DATA_CORRECTION   // Correcting logging error
  OTHER
}

model Discrepancy {
  id                String   @id @default(cuid())

  // What was found
  type              DiscrepancyType
  severity          DiscrepancySeverity

  // Details
  description       String
  expectedValue     String?
  actualValue       String?

  // Affected vial (if applicable)
  vialId            String?
  productId         String?

  // Resolution
  status            DiscrepancyStatus @default(OPEN)
  resolvedAt        DateTime?
  resolution        String?

  accountId         String
  account           Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([accountId])
  @@index([status])
}

enum DiscrepancyType {
  QUANTITY_MISMATCH   // Expected vs actual doesn't match
  MISSING_VIAL        // Vial can't be located
  UNEXPECTED_DEPLETION // Vial emptied faster than expected
  EXPIRY_VIOLATION    // Expired product found in circulation
  LOT_MISMATCH        // Lot number doesn't match records
  UNDOCUMENTED_USAGE  // Usage found but not logged
}

enum DiscrepancySeverity {
  LOW               // Minor, informational
  MEDIUM            // Should investigate
  HIGH              // Requires immediate attention
  CRITICAL          // Compliance risk
}

enum DiscrepancyStatus {
  OPEN
  INVESTIGATING
  RESOLVED
  DISMISSED
}

// ==================== AUDIT TRAIL ====================

model AuditLog {
  id                String   @id @default(cuid())

  action            AuditAction
  entityType        String   // "Vial", "UsageLog", etc.
  entityId          String?

  // Actor
  actorType         ActorType
  userId            String?
  user              User?    @relation(fields: [userId], references: [id])

  // Details
  description       String
  metadata          Json?    // Additional context

  // IP/device for security audits
  ipAddress         String?
  userAgent         String?

  accountId         String
  account           Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)

  createdAt         DateTime @default(now())

  @@index([accountId])
  @@index([entityType, entityId])
  @@index([action])
  @@index([createdAt])
}

enum AuditAction {
  // Inventory
  VIAL_RECEIVED
  VIAL_OPENED
  VIAL_DEPLETED
  VIAL_DISPOSED
  VIAL_QUARANTINED

  // Usage
  USAGE_LOGGED
  USAGE_EDITED
  USAGE_DELETED

  // Adjustments
  ADJUSTMENT_MADE

  // Discrepancies
  DISCREPANCY_CREATED
  DISCREPANCY_RESOLVED

  // Account
  USER_CREATED
  USER_UPDATED
  USER_DELETED
  SETTINGS_CHANGED

  // Auth
  LOGIN
  LOGOUT
  PASSWORD_RESET
}

enum ActorType {
  USER
  SYSTEM
  WEBHOOK
}
```

---

## Phase 1: MVP Features (4-6 weeks)

### Week 1-2: Foundation
- [ ] Project setup (Next.js, Prisma, Tailwind, DaisyUI)
- [ ] Database schema and migrations
- [ ] Authentication (NextAuth with credentials)
- [ ] Basic account/user management
- [ ] Landing page with waitlist signup

### Week 3-4: Core Inventory
- [ ] Product catalog management
- [ ] Vial intake flow (receive new inventory)
- [ ] Vial list view with filters
- [ ] Single vial detail view
- [ ] Location management

### Week 5-6: Usage & Alerts
- [ ] Usage logging (one-tap flow)
- [ ] Remaining quantity calculations
- [ ] Expiry alert system (14 days, 7 days, expired)
- [ ] Basic discrepancy detection
- [ ] Audit log recording

---

## Phase 2: Polish & Launch (2-3 weeks)

- [ ] Calm Center dashboard
- [ ] Discrepancy investigation workflow
- [ ] Basic reporting (usage by provider, expiry summary)
- [ ] Stripe integration (subscription billing)
- [ ] Email notifications (expiry alerts, discrepancy alerts)
- [ ] Onboarding flow
- [ ] Help documentation

---

## Phase 3: Growth Features (Post-Launch)

- [ ] Provider usage patterns
- [ ] Cost tracking and profitability reports
- [ ] Multi-location support
- [ ] Team roles and permissions
- [ ] EMR export capabilities
- [ ] API for integrations
- [ ] Mobile-optimized logging

---

## Landing Page Structure

Following the DESIGN-GUIDE.md section flow:

1. **Header** - VialGuardHQ logo, "Sign In", "Start Free Trial" CTA
2. **Hero** - "Stop Losing Money on Injectable Inventory"
   - Subhead: The specialized guardian for medical spas and aesthetic clinics
   - Value props: Real-time tracking, Expiry protection, Audit-ready logs
   - CTAs: "Start 14-Day Free Trial" / "See Demo"
3. **Problem Section** - "The Hidden Tax on Your Practice"
   - Missing vials, expired stock, compliance anxiety, spreadsheet chaos
4. **How It Works** - 3-step calm flow
   - Receive inventory → Log usage → Stay protected
5. **Features Grid** - Core capabilities with icons
6. **Before/After** - Spreadsheet chaos vs. VialGuardHQ confidence
7. **Testimonials** - Social proof (use placeholders initially)
8. **Pricing** - 3 tiers with "Most Popular" highlighted
9. **Guarantee** - "14-Day Risk-Free Trial"
10. **Final CTA** - Repeat hero CTA
11. **Footer** - Links, copyright

---

## Pricing Structure

Based on market analysis and VIALGUARDHQ.md guidance:

| Tier | Price | Features |
|------|-------|----------|
| **Starter** | $149/mo | Single location, 5 products, Core tracking, Expiry alerts, Basic discrepancy flags |
| **Growth** | $199/mo | Everything in Starter + Advanced discrepancy detection, Full audit logs, Usage by provider, Email alerts |
| **Pro** | $299/mo | Everything in Growth + Multi-location, Advanced reporting, Priority support, API access |

**Trial:** 14 days free, credit card required

---

## Key Copy Directions

Based on market analysis, emphasize:

1. **Calm, not surveillance** - "Your quiet guardian, not an auditor"
2. **Specialized for injectables** - "Built for Botox and fillers, not office supplies"
3. **Risk reduction** - "Catch issues before they become problems"
4. **Time savings** - "Faster than spreadsheets, more reliable than memory"
5. **Compliance confidence** - "Audit-ready documentation, always"

Avoid: Fear-mongering, overly technical language, EMR replacement claims

---

## Success Metrics (First 60 Days)

- 5+ paying customers
- At least 1 customer reports catching a real discrepancy
- Demo → close rate >20%
- Customers say "This makes me feel safer"

---

## Next Steps

1. Initialize Next.js project with configured stack
2. Set up Prisma schema and run migrations
3. Implement authentication
4. Build landing page
5. Create core inventory management flows
6. Add usage logging
7. Implement alerts and discrepancies
8. Integrate Stripe billing
9. Deploy to Vercel

---

*This plan uses inspiration from the VIALGUARDHQ.md brief but adapts based on market analysis findings, particularly around the "calm guardian" positioning and EMR-agnostic approach.*
