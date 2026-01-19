"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Syringe,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Search,
  Clock,
  Package,
} from "lucide-react";
import { format } from "date-fns";

interface Product {
  id: string;
  name: string;
  brand: string;
  unitType: string;
  unitsPerVial: number;
}

interface Vial {
  id: string;
  lotNumber: string;
  expirationDate: string;
  unitsRemaining: number;
  product: Product;
  location?: { name: string } | null;
}

interface Provider {
  id: string;
  name: string;
  title: string;
}

export default function UsagePage() {
  const router = useRouter();
  const [vials, setVials] = useState<Vial[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedVial, setSelectedVial] = useState<Vial | null>(null);
  const [providerId, setProviderId] = useState("");
  const [quantityUsed, setQuantityUsed] = useState<number>(1);
  const [patientRef, setPatientRef] = useState("");
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [vialsRes, providersRes] = await Promise.all([
          fetch("/api/inventory?status=ACTIVE"),
          fetch("/api/providers"),
        ]);

        if (vialsRes.ok) {
          const data = await vialsRes.json();
          setVials(data.vials || []);
        }

        if (providersRes.ok) {
          const data = await providersRes.json();
          setProviders(data.providers || []);
          if (data.providers?.length > 0) {
            setProviderId(data.providers[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredVials = vials.filter((vial) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      vial.product.name.toLowerCase().includes(search) ||
      vial.product.brand.toLowerCase().includes(search) ||
      vial.lotNumber.toLowerCase().includes(search)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVial) {
      setError("Please select a vial");
      return;
    }

    if (quantityUsed > selectedVial.unitsRemaining) {
      setError(`Only ${selectedVial.unitsRemaining} ${selectedVial.product.unitType.toLowerCase()} remaining in this vial`);
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vialId: selectedVial.id,
          providerId: providerId || null,
          quantityUsed,
          patientRef: patientRef || null,
          notes: notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to log usage");
        setIsSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body text-center py-12">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Usage Logged Successfully!
            </h2>
            <p className="text-gray-600">
              {quantityUsed} {selectedVial?.product.unitType.toLowerCase()} of {selectedVial?.product.name} recorded
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="btn btn-ghost btn-sm">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Log Usage</h1>
          <p className="text-gray-600">
            Record product usage for a treatment
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* No Vials Warning */}
      {vials.length === 0 && (
        <div className="alert alert-warning">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">No active vials</p>
            <p className="text-sm">
              Please receive inventory before logging usage.
            </p>
          </div>
          <Link href="/dashboard/inventory/intake" className="btn btn-sm">
            Receive Inventory
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Vial */}
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Step 1: Select Vial
            </h3>

            {/* Search */}
            <div className="form-control mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by product, brand, or lot number..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Vial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {filteredVials.map((vial) => {
                const daysUntilExpiry = Math.ceil(
                  (new Date(vial.expirationDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const isExpiringSoon = daysUntilExpiry <= 14;
                const isSelected = selectedVial?.id === vial.id;

                return (
                  <button
                    key={vial.id}
                    type="button"
                    onClick={() => setSelectedVial(vial)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {vial.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {vial.product.brand} • Lot: {vial.lotNumber}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-primary font-medium">
                        {vial.unitsRemaining} {vial.product.unitType.toLowerCase()} left
                      </span>
                      <span
                        className={`flex items-center gap-1 ${
                          isExpiringSoon ? "text-amber-600" : "text-gray-500"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {daysUntilExpiry <= 0
                          ? "Expired"
                          : `${daysUntilExpiry}d left`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredVials.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No vials match your search
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Usage Details */}
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Syringe className="h-5 w-5 text-primary" />
              Step 2: Usage Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Provider */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Provider</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                >
                  <option value="">Select provider (optional)</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} - {provider.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Used */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Quantity Used {selectedVial && `(${selectedVial.product.unitType.toLowerCase()})`}
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedVial?.unitsRemaining || 100}
                  className="input input-bordered"
                  value={quantityUsed}
                  onChange={(e) => setQuantityUsed(parseInt(e.target.value) || 1)}
                  required
                />
                {selectedVial && (
                  <label className="label">
                    <span className="label-text-alt text-gray-500">
                      {selectedVial.unitsRemaining} {selectedVial.product.unitType.toLowerCase()} remaining
                    </span>
                  </label>
                )}
              </div>

              {/* Patient Reference */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Patient Reference</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., initials or ID"
                  className="input input-bordered"
                  value={patientRef}
                  onChange={(e) => setPatientRef(e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Optional - for your records only
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Notes</span>
                </label>
                <input
                  type="text"
                  placeholder="Treatment area, etc."
                  className="input input-bordered"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Vial Summary & Submit */}
        {selectedVial && (
          <div className="card bg-primary/5 border border-primary/20">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Recording usage for:</p>
                  <p className="font-semibold text-gray-900">
                    {selectedVial.product.name} - Lot {selectedVial.lotNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {quantityUsed} {selectedVial.product.unitType.toLowerCase()} →{" "}
                    {selectedVial.unitsRemaining - quantityUsed} {selectedVial.product.unitType.toLowerCase()} remaining after
                  </p>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving || !selectedVial}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Syringe className="h-5 w-5" />
                      Log Usage
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
