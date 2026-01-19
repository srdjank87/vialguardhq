"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { format, addMonths } from "date-fns";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  unitType: string;
  unitsPerVial: number;
}

interface Location {
  id: string;
  name: string;
  type: string;
}

interface VialEntry {
  id: string;
  productId: string;
  lotNumber: string;
  expirationDate: string;
  quantity: number;
  locationId: string;
}

export default function IntakePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [vials, setVials] = useState<VialEntry[]>([
    {
      id: crypto.randomUUID(),
      productId: "",
      lotNumber: "",
      expirationDate: format(addMonths(new Date(), 6), "yyyy-MM-dd"),
      quantity: 1,
      locationId: "",
    },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, locationsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/locations"),
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.products || []);
        }

        if (locationsRes.ok) {
          const data = await locationsRes.json();
          setLocations(data.locations || []);
          // Set default location if available
          if (data.locations?.length > 0) {
            setVials((prev) =>
              prev.map((v) => ({ ...v, locationId: data.locations[0].id }))
            );
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

  const addVial = () => {
    setVials((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        productId: prev[prev.length - 1]?.productId || "",
        lotNumber: "",
        expirationDate: format(addMonths(new Date(), 6), "yyyy-MM-dd"),
        quantity: 1,
        locationId: prev[prev.length - 1]?.locationId || locations[0]?.id || "",
      },
    ]);
  };

  const removeVial = (id: string) => {
    if (vials.length > 1) {
      setVials((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const updateVial = (id: string, field: keyof VialEntry, value: string | number) => {
    setVials((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    // Validate
    const invalidVials = vials.filter(
      (v) => !v.productId || !v.lotNumber || !v.expirationDate
    );

    if (invalidVials.length > 0) {
      setError("Please fill in all required fields for each vial");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/inventory/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vials }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save inventory");
        setIsSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/inventory");
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
              Inventory Received Successfully!
            </h2>
            <p className="text-gray-600">
              {vials.length} vial{vials.length > 1 ? "s" : ""} added to your inventory
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
        <Link href="/dashboard/inventory" className="btn btn-ghost btn-sm">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receive Inventory</h1>
          <p className="text-gray-600">
            Add new vials to your inventory
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

      {/* No Products Warning */}
      {products.length === 0 && (
        <div className="alert alert-warning">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">No products configured</p>
            <p className="text-sm">
              Please add products in Settings before receiving inventory.
            </p>
          </div>
          <Link href="/dashboard/settings" className="btn btn-sm">
            Go to Settings
          </Link>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {vials.map((vial, index) => (
            <div
              key={vial.id}
              className="card bg-white shadow-sm border border-gray-100"
            >
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">
                    Vial {index + 1}
                  </h3>
                  {vials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVial(vial.id)}
                      className="btn btn-ghost btn-sm text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product */}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Product *</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={vial.productId}
                      onChange={(e) => updateVial(vial.id, "productId", e.target.value)}
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.brand}) - {product.unitsPerVial} {product.unitType.toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lot Number */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Lot Number *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., C4567AB"
                      className="input input-bordered"
                      value={vial.lotNumber}
                      onChange={(e) => updateVial(vial.id, "lotNumber", e.target.value)}
                      required
                    />
                  </div>

                  {/* Expiration Date */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Expiration Date *</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={vial.expirationDate}
                      onChange={(e) => updateVial(vial.id, "expirationDate", e.target.value)}
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Number of Vials</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="input input-bordered"
                      value={vial.quantity}
                      onChange={(e) => updateVial(vial.id, "quantity", parseInt(e.target.value) || 1)}
                    />
                    <label className="label">
                      <span className="label-text-alt text-gray-500">
                        Add multiple vials with the same lot
                      </span>
                    </label>
                  </div>

                  {/* Location */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Storage Location</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={vial.locationId}
                      onChange={(e) => updateVial(vial.id, "locationId", e.target.value)}
                    >
                      <option value="">No location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Another Button */}
        <button
          type="button"
          onClick={addVial}
          className="btn btn-ghost btn-sm w-full mt-4 border-2 border-dashed border-gray-300"
        >
          <Plus className="h-4 w-4" />
          Add Another Vial
        </button>

        {/* Summary & Submit */}
        <div className="card bg-primary/5 border border-primary/20 mt-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total vials to add:</p>
                <p className="text-2xl font-bold text-primary">
                  {vials.reduce((sum, v) => sum + (v.quantity || 1), 0)}
                </p>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving || products.length === 0}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5" />
                    Receive Inventory
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
