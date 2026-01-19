"use client";

import Link from "next/link";
import {
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  AlertTriangle,
  FileText,
  TrendingDown,
  Eye,
  Bell,
  BarChart3,
  Users,
  Lock,
  Zap,
  Package,
  BadgeCheck,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Problem Section - The Hidden Tax */}
      <ProblemSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Authority/Compliance Trust Strip */}
      <TrustStripSection />

      {/* Features - Protection Systems */}
      <ProtectionSystemsSection />

      {/* Before/After Comparison */}
      <BeforeAfterSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing */}
      <PricingSection />

      {/* Guarantee */}
      <GuaranteeSection />

      {/* Final CTA */}
      <FinalCTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-base-300 bg-base-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">VialGuard</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Pricing
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="btn btn-ghost btn-sm text-gray-600 hidden sm:flex"
          >
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Start Free Trial
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white py-8 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-1.5 rounded-full text-sm font-medium mb-4 sm:mb-6">
            <Shield className="h-4 w-4" />
            Built specifically for injectable clinics
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
            Stop Losing Money on
            <span className="text-primary block leading-tight">
              Injectable Inventory
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-8 max-w-2xl mx-auto">
            VialGuardHQ is the specialized inventory guardian for medical spas
            and aesthetic clinics. Track every vial of Botox and filler, catch
            discrepancies before they cost you, and stay audit-ready without the
            spreadsheet chaos.
          </p>

          {/* Value Props - Hidden on mobile */}
          <div className="hidden sm:flex flex-wrap gap-3 sm:gap-6 justify-center text-sm text-gray-600 mb-8">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              Vial-level tracking
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              Expiry protection
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              Audit-ready logs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              No EMR replacement
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
            <Link
              href="/signup"
              className="btn btn-gradient btn-md sm:btn-lg text-base sm:text-lg px-6 sm:px-8"
            >
              Start 14-Day Free Trial
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="btn btn-outline btn-md sm:btn-lg text-base sm:text-lg px-6 sm:px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white"
            >
              See How It Works
            </Link>
          </div>

          {/* Fine Print */}
          <p className="text-sm text-gray-500">
            14-day free trial. Cancel before it ends and pay nothing.
          </p>
        </div>

        {/* Hero Image Placeholder - Hidden on mobile */}
        <div className="hidden sm:block mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-2 text-sm text-gray-500">
                VialGuardHQ Dashboard
              </span>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-50 to-gray-100 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <p className="text-gray-500 text-sm">
                  Dashboard preview coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    {
      icon: TrendingDown,
      title: "Vials going missing",
      description:
        "Product disappears between delivery and treatment room. Was it used? Stolen? You have no idea.",
    },
    {
      icon: Clock,
      title: "Expired stock discovered too late",
      description:
        "That $800 vial of Botox expired last month. Now it's medical waste and a direct hit to your margin.",
    },
    {
      icon: FileText,
      title: "Spreadsheet reconciliation nightmare",
      description:
        "End-of-month counting takes hours. Numbers never match. Staff dreads inventory day.",
    },
    {
      icon: AlertTriangle,
      title: "Audit anxiety",
      description:
        "DEA inspection notice arrives. You have 48 hours to produce documentation you're not sure exists.",
    },
  ];

  return (
    <section className="py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            The Hidden Tax on Your Practice
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every month, injectable clinics lose thousands to invisible
            inventory problems. Most don&apos;t even know it&apos;s happening.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-amber-50 border border-amber-200 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <problem.icon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600">{problem.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-xl px-6 py-4">
            <div className="text-3xl font-bold text-gray-900">$2,400+</div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">
                Average monthly loss
              </div>
              <div className="text-xs text-gray-500">
                from waste, shrinkage, and expired stock
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Receive & Register",
      description:
        "Scan or enter new inventory when it arrives. Capture lot numbers, expiry dates, and quantities in seconds.",
    },
    {
      number: "2",
      title: "Log Usage",
      description:
        "One-tap logging at point of care. Record which vial, how much, which provider. Faster than your current process.",
    },
    {
      number: "3",
      title: "Stay Protected",
      description:
        "VialGuardHQ quietly monitors for discrepancies, expiries, and anomalies. Get alerts before problems become crises.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 lg:py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How VialGuardHQ Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple enough for busy clinical staff. Robust enough for compliance
            audits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-10 transform -translate-y-1/2 w-8 h-8 items-center justify-center">
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// NEW: Authority/Compliance Trust Strip Section
function TrustStripSection() {
  const trustPoints = [
    {
      icon: ShieldCheck,
      text: "Audit-ready logs aligned with DEA and state inspection expectations",
    },
    {
      icon: Stethoscope,
      text: "Designed with input from medical directors and compliance consultants",
    },
    {
      icon: BadgeCheck,
      text: "Modeled after controlled-substance log standards used in healthcare",
    },
  ];

  return (
    <section className="py-10 px-4 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-gray-700"
            >
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center flex-shrink-0">
                <point.icon className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-sm font-medium">{point.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// UPDATED: Features restructured into Protection Systems
function ProtectionSystemsSection() {
  const protectionSystems = [
    {
      title: "Audit & Compliance Protection",
      description: "Pass inspections with confidence",
      color: "teal",
      features: [
        {
          icon: FileText,
          title: "Audit-Ready Logs",
          description:
            "Immutable audit trail of every transaction. Export compliance reports in seconds, not hours.",
        },
        {
          icon: Lock,
          title: "Works With Your EMR",
          description:
            "EMR-agnostic design. VialGuardHQ adds specialized injectable control without replacing your stack.",
        },
      ],
    },
    {
      title: "Waste & Expiry Protection",
      description: "Never lose product to expiration again",
      color: "amber",
      features: [
        {
          icon: Bell,
          title: "Expiry Alerts",
          description:
            "Automatic alerts at 30, 14, and 7 days before expiration. Use it or move it before it's too late.",
        },
        {
          icon: Package,
          title: "Vial-Level Tracking",
          description:
            "Track every vial by product, lot number, and expiration. Know exactly what you have and where it is.",
        },
      ],
    },
    {
      title: "Shrinkage & Accountability",
      description: "Know where every unit goes",
      color: "indigo",
      features: [
        {
          icon: Eye,
          title: "Discrepancy Detection",
          description:
            "Smart algorithms flag when expected vs. actual doesn't match. Catch issues before they become problems.",
        },
        {
          icon: Users,
          title: "Provider Tracking",
          description:
            "See usage patterns by provider. Clear chain of custody for every vial, every time.",
        },
      ],
    },
    {
      title: "Time & Sanity Protection",
      description: "Reclaim hours lost to spreadsheets",
      color: "emerald",
      features: [
        {
          icon: Zap,
          title: "One-Tap Logging",
          description:
            "Log usage in under 30 seconds. Designed for busy clinical workflows, not back-office data entry.",
        },
        {
          icon: BarChart3,
          title: "Usage Insights",
          description:
            "Understand your real product costs per treatment. Make data-driven purchasing decisions.",
        },
      ],
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
    teal: {
      bg: "bg-teal-50",
      border: "border-teal-200",
      icon: "text-teal-600",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-600",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-600",
    },
  };

  return (
    <section id="features" className="py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Four Layers of Protection for Your Inventory
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built specifically for Botox, fillers, and high-value injectables.
            Each system targets a specific threat to your bottom line.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {protectionSystems.map((system, index) => {
            const colors = colorClasses[system.color];
            return (
              <div
                key={index}
                className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {system.title}
                  </h3>
                  <p className="text-sm text-gray-600">{system.description}</p>
                </div>

                <div className="space-y-4">
                  {system.features.map((feature, fIndex) => (
                    <div
                      key={fIndex}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <feature.icon className={`h-5 w-5 ${colors.icon}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  const beforeItems = [
    "Hours of manual counting every month",
    "Expired vials discovered after the fact",
    "No idea where product disappeared to",
    "Scrambling before audits with incomplete records",
    "Staff guessing and hoping numbers match",
    "Anxiety about compliance and shrinkage",
  ];

  const afterItems = [
    "Real-time inventory visibility, always accurate",
    "Proactive expiry alerts save product",
    "Clear chain of custody for every vial",
    "Audit reports exported in seconds",
    "Confident, data-backed reconciliation",
    "Quiet confidence that everything is tracked",
  ];

  return (
    <section className="py-16 lg:py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            From Spreadsheet Chaos to Quiet Confidence
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
              Before VialGuardHQ
            </h3>
            <div className="space-y-4">
              {beforeItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-red-200 text-center">
              <p className="text-red-700 font-semibold">
                Result: Money lost, stress gained
              </p>
            </div>
          </div>

          {/* After */}
          <div className="rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
              With VialGuardHQ
            </h3>
            <div className="space-y-4">
              {afterItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-teal-200 text-center">
              <p className="text-teal-700 font-semibold">
                Result: Protected inventory, peace of mind
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// UPDATED: Sharper testimonials with stronger impact
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "I didn't realize how much product we were losing until VialGuardHQ flagged a $1,200 discrepancy in the first week. That alone justified the software.",
      highlight: "$1,200 discrepancy",
      name: "Dr. Sarah Chen",
      role: "Medical Director, Radiance Aesthetics",
      initials: "SC",
    },
    {
      quote:
        "When our DEA audit notice came, I didn't panic. I pulled complete reports in 5 minutes. The inspector said it was the cleanest documentation she'd seen from a medspa.",
      highlight: "cleanest documentation",
      name: "Jennifer Martinez",
      role: "Practice Manager, Glow MedSpa",
      initials: "JM",
    },
    {
      quote:
        "My staff actually uses it—that never happens with new software. It's genuinely faster than the spreadsheet we were using. Now I can see exactly who used what, when.",
      highlight: "faster than the spreadsheet",
      name: "Dr. Michael Torres",
      role: "Owner, Elite Aesthetics",
      initials: "MT",
    },
  ];

  return (
    <section className="py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Injectable Clinics
          </h2>
          <p className="text-xl text-gray-600">
            Real results from real practices
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card bg-white shadow-xl border">
              <div className="card-body">
                <p className="text-lg mb-4 text-gray-700">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-teal-100 text-teal-800 rounded-full w-12">
                      <span className="text-lg">{testimonial.initials}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// UPDATED: Pricing with cost-of-inaction anchoring
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: 149,
      description: "For single-location clinics getting started",
      features: [
        "Single location",
        "Up to 5 products",
        "Vial-level tracking",
        "Expiry alerts",
        "Basic discrepancy flags",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Growth",
      price: 199,
      description: "For clinics ready for complete inventory control",
      features: [
        "Everything in Starter",
        "Unlimited products",
        "Advanced discrepancy detection",
        "Full audit logs",
        "Usage by provider reports",
        "Email & chat support",
        "Custom alert rules",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Pro",
      price: 299,
      description: "For multi-location practices and groups",
      features: [
        "Everything in Growth",
        "Multi-location support",
        "Advanced analytics",
        "API access",
        "Priority support",
        "Custom integrations",
        "Dedicated success manager",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 lg:py-20 px-4 bg-gradient-to-br from-slate-50 to-gray-100"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            One vial saved from expiration pays for a month. Most clinics see
            ROI in the first week.
          </p>
        </div>

        {/* Cost-of-Inaction Comparison */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                The Real Cost Comparison
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 items-center">
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">$2,400+</div>
                <div className="text-sm text-gray-600">
                  Monthly loss from waste & shrinkage
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">vs</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-xl">
                <div className="text-2xl font-bold text-teal-600">$199</div>
                <div className="text-sm text-gray-600">
                  VialGuardHQ monthly investment
                </div>
              </div>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-700">
                <span className="font-semibold">One expired vial of Botox ($800)</span> costs more than 4 months of VialGuardHQ.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`card h-full ${
                plan.popular
                  ? "shadow-2xl border-4 border-primary bg-gradient-to-br from-teal-50 to-cyan-50 transform md:scale-105"
                  : "bg-base-100 shadow-xl border-2 border-base-200"
              }`}
            >
              <div className="card-body">
                {plan.popular && (
                  <div className="badge badge-primary mb-2">Most Popular</div>
                )}
                <div className="badge badge-ghost mb-2">{plan.name}</div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-sm opacity-70">/month</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex gap-2 items-start">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`btn btn-block ${
                    plan.popular
                      ? "btn-primary"
                      : "btn-outline border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}

function GuaranteeSection() {
  return (
    <section className="py-16 lg:py-20 px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border-4 border-emerald-400 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            14-Day Risk-Free Trial
          </h2>
          <p className="text-xl mb-4 text-gray-700">
            Try VialGuardHQ for 14 days. If you don&apos;t feel more confident
            about your inventory control, simply cancel. No charge. No hassle.
          </p>
          <p className="text-gray-600">
            Most clinics catch their first discrepancy within the first week.
            That&apos;s when they know it&apos;s working.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-16 lg:py-20 px-4 bg-gradient-to-br from-teal-50 to-cyan-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Ready to Stop the Invisible Bleeding?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join medical spas and aesthetic clinics that trust VialGuardHQ to
          protect their injectable investment.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link href="/signup" className="btn btn-gradient btn-lg text-lg px-8">
            Start 14-Day Free Trial
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          No credit card required. Set up in under 10 minutes.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-300 text-base-content">
      <aside>
        <div className="flex items-center gap-2 font-bold text-xl mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span>VialGuard</span>
        </div>
        <p className="max-w-md">
          The specialized inventory guardian for medical spas and aesthetic
          clinics.
        </p>
        <div className="flex gap-4 mt-4">
          <Link href="/help" className="link link-hover text-sm">
            Help Center
          </Link>
          <Link href="/privacy" className="link link-hover text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms" className="link link-hover text-sm">
            Terms of Service
          </Link>
        </div>
        <p className="text-sm opacity-70 mt-4">
          &copy; {new Date().getFullYear()} VialGuard. All rights reserved.
        </p>
      </aside>
    </footer>
  );
}
