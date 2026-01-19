"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Package,
  MapPin,
  User,
  Plus,
  Loader2,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  unitType: string;
  unitsPerVial: number;
  reorderThreshold: number;
  active: boolean;
}

interface Location {
  id: string;
  name: string;
  type: string;
  description: string | null;
  active: boolean;
}

interface Provider {
  id: string;
  name: string;
  title: string;
  licenseNumber: string | null;
  npiNumber: string | null;
  active: boolean;
}

type ActiveTab = "products" | "locations" | "providers";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showProviderForm, setShowProviderForm] = useState(false);

  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    category: "NEUROMODULATOR",
    unitType: "UNITS",
    unitsPerVial: 100,
    reorderThreshold: 2,
  });

  const [locationForm, setLocationForm] = useState({
    name: "",
    type: "FRIDGE",
    description: "",
  });

  const [providerForm, setProviderForm] = useState({
    name: "",
    title: "",
    licenseNumber: "",
    npiNumber: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [productsRes, locationsRes, providersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/locations"),
        fetch("/api/providers"),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }

      if (locationsRes.ok) {
        const data = await locationsRes.json();
        setLocations(data.locations || []);
      }

      if (providersRes.ok) {
        const data = await providersRes.json();
        setProviders(data.providers || []);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add product");
        return;
      }

      setProducts((prev) => [...prev, data.product]);
      setShowProductForm(false);
      setProductForm({
        name: "",
        brand: "",
        category: "NEUROMODULATOR",
        unitType: "UNITS",
        unitsPerVial: 100,
        reorderThreshold: 2,
      });
      setSuccess("Product added successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddLocation(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add location");
        return;
      }

      setLocations((prev) => [...prev, data.location]);
      setShowLocationForm(false);
      setLocationForm({ name: "", type: "FRIDGE", description: "" });
      setSuccess("Location added successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddProvider(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(providerForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add provider");
        return;
      }

      setProviders((prev) => [...prev, data.provider]);
      setShowProviderForm(false);
      setProviderForm({ name: "", title: "", licenseNumber: "", npiNumber: "" });
      setSuccess("Provider added successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your products, locations, and providers
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-gray-100 p-1">
        <button
          className={`tab gap-2 ${activeTab === "products" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <Package className="h-4 w-4" />
          Products
        </button>
        <button
          className={`tab gap-2 ${activeTab === "locations" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("locations")}
        >
          <MapPin className="h-4 w-4" />
          Locations
        </button>
        <button
          className={`tab gap-2 ${activeTab === "providers" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("providers")}
        >
          <User className="h-4 w-4" />
          Providers
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Products</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowProductForm(!showProductForm)}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>

            {/* Add Product Form */}
            {showProductForm && (
              <form
                onSubmit={handleAddProduct}
                className="mb-6 p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="font-medium text-gray-900 mb-4">New Product</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name *</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="e.g., Botox"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Brand *</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="e.g., Allergan"
                      value={productForm.brand}
                      onChange={(e) =>
                        setProductForm({ ...productForm, brand: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Category</span>
                    </label>
                    <select
                      className="select select-bordered select-sm"
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({ ...productForm, category: e.target.value })
                      }
                    >
                      <option value="NEUROMODULATOR">Neuromodulator</option>
                      <option value="FILLER">Filler</option>
                      <option value="BIOSTIMULATOR">Biostimulator</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Unit Type</span>
                    </label>
                    <select
                      className="select select-bordered select-sm"
                      value={productForm.unitType}
                      onChange={(e) =>
                        setProductForm({ ...productForm, unitType: e.target.value })
                      }
                    >
                      <option value="UNITS">Units</option>
                      <option value="ML">mL</option>
                      <option value="MG">mg</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Units Per Vial</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered input-sm"
                      min="1"
                      value={productForm.unitsPerVial}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          unitsPerVial: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Reorder Threshold</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered input-sm"
                      min="0"
                      value={productForm.reorderThreshold}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          reorderThreshold: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowProductForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Product"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Products List */}
            {products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No products configured yet</p>
                <p className="text-sm text-gray-500">
                  Add your first product to start tracking inventory
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Units/Vial</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="font-medium">{product.name}</td>
                        <td>{product.brand}</td>
                        <td>
                          <span className="badge badge-ghost badge-sm">
                            {product.category}
                          </span>
                        </td>
                        <td>
                          {product.unitsPerVial} {product.unitType.toLowerCase()}
                        </td>
                        <td>
                          <button className="btn btn-ghost btn-xs">
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === "locations" && (
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Storage Locations</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowLocationForm(!showLocationForm)}
              >
                <Plus className="h-4 w-4" />
                Add Location
              </button>
            </div>

            {/* Add Location Form */}
            {showLocationForm && (
              <form
                onSubmit={handleAddLocation}
                className="mb-6 p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="font-medium text-gray-900 mb-4">New Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name *</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="e.g., Treatment Room 1 Fridge"
                      value={locationForm.name}
                      onChange={(e) =>
                        setLocationForm({ ...locationForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Type</span>
                    </label>
                    <select
                      className="select select-bordered select-sm"
                      value={locationForm.type}
                      onChange={(e) =>
                        setLocationForm({ ...locationForm, type: e.target.value })
                      }
                    >
                      <option value="FRIDGE">Fridge</option>
                      <option value="CABINET">Cabinet</option>
                      <option value="DRAWER">Drawer</option>
                      <option value="ROOM">Room</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="Optional description"
                      value={locationForm.description}
                      onChange={(e) =>
                        setLocationForm({
                          ...locationForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowLocationForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Location"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Locations List */}
            {locations.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No locations configured yet</p>
                <p className="text-sm text-gray-500">
                  Add storage locations to track where vials are kept
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-sm text-gray-500">
                        {location.type}
                        {location.description && ` • ${location.description}`}
                      </p>
                    </div>
                    <button className="btn btn-ghost btn-xs">
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === "providers" && (
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Providers</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowProviderForm(!showProviderForm)}
              >
                <Plus className="h-4 w-4" />
                Add Provider
              </button>
            </div>

            {/* Add Provider Form */}
            {showProviderForm && (
              <form
                onSubmit={handleAddProvider}
                className="mb-6 p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="font-medium text-gray-900 mb-4">New Provider</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name *</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="e.g., Dr. Jane Smith"
                      value={providerForm.name}
                      onChange={(e) =>
                        setProviderForm({ ...providerForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Title *</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="e.g., MD, NP, PA"
                      value={providerForm.title}
                      onChange={(e) =>
                        setProviderForm({ ...providerForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">License Number</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="Optional"
                      value={providerForm.licenseNumber}
                      onChange={(e) =>
                        setProviderForm({
                          ...providerForm,
                          licenseNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">NPI Number</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-sm"
                      placeholder="Optional"
                      value={providerForm.npiNumber}
                      onChange={(e) =>
                        setProviderForm({
                          ...providerForm,
                          npiNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowProviderForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Provider"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Providers List */}
            {providers.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No providers configured yet</p>
                <p className="text-sm text-gray-500">
                  Add providers to track who uses inventory
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{provider.name}</p>
                      <p className="text-sm text-gray-500">
                        {provider.title}
                        {provider.licenseNumber && ` • ${provider.licenseNumber}`}
                      </p>
                    </div>
                    <button className="btn btn-ghost btn-xs">
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
