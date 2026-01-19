"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Mail,
  Lock,
  User,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clinicName: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          clinicName: formData.clinicName,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Account created but sign in failed, redirect to sign in
        router.push("/signin");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const trialBenefits = [
    "14-day free trial",
    "Full access to all features",
    "No credit card required",
    "Cancel anytime",
  ];

  return (
    <div className="w-full max-w-lg">
      <div className="card bg-white shadow-2xl border border-gray-200">
        <div className="card-body p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Start Your Free Trial
            </h1>
            <p className="text-gray-600 mt-1">
              Protect your injectable inventory in minutes
            </p>
          </div>

          {/* Trial Benefits */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-2">
              {trialBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-4">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Your Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Dr. Jane Smith"
                  className="input input-bordered w-full pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Clinic Name</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="clinicName"
                  placeholder="Radiance Aesthetics"
                  className="input input-bordered w-full pl-10"
                  value={formData.clinicName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@clinic.com"
                  className="input input-bordered w-full pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  className="input input-bordered w-full pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="input input-bordered w-full pl-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating your account...
                </>
              ) : (
                "Start Free Trial"
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="link link-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="link link-primary">
              Privacy Policy
            </Link>
          </p>

          {/* Footer */}
          <div className="divider my-4">or</div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="link link-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
