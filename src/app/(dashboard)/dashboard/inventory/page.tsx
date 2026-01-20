import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { VialStatus } from "@prisma/client";
import { PrintLabelButton } from "@/components/PrintLabelButton";

async function getInventoryData(accountId: string, status?: string, search?: string) {
  const where: {
    accountId: string;
    status?: VialStatus;
    OR?: Array<{ product: { name: { contains: string; mode: "insensitive" } } } | { lotNumber: { contains: string; mode: "insensitive" } }>;
  } = { accountId };

  if (status && status !== "all") {
    where.status = status as VialStatus;
  }

  if (search) {
    where.OR = [
      { product: { name: { contains: search, mode: "insensitive" } } },
      { lotNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  const vials = await prisma.vial.findMany({
    where,
    include: {
      product: true,
      location: true,
    },
    orderBy: [
      { status: "asc" },
      { expirationDate: "asc" },
    ],
  });

  // Get summary by product
  const products = await prisma.product.findMany({
    where: { accountId, active: true },
    include: {
      vials: {
        where: { status: "ACTIVE" },
      },
    },
  });

  return { vials, products };
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;

  const params = await searchParams;
  const { vials, products } = await getInventoryData(
    session.user.accountId,
    params.status,
    params.search
  );

  const statusCounts = {
    all: vials.length,
    ACTIVE: vials.filter((v) => v.status === "ACTIVE").length,
    DEPLETED: vials.filter((v) => v.status === "DEPLETED").length,
    EXPIRED: vials.filter((v) => v.status === "EXPIRED").length,
    DISPOSED: vials.filter((v) => v.status === "DISPOSED").length,
    QUARANTINED: vials.filter((v) => v.status === "QUARANTINED").length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">
            Track and manage all your injectable vials
          </p>
        </div>
        <Link href="/dashboard/inventory/intake" className="btn btn-primary">
          <Plus className="h-5 w-5" />
          Receive Inventory
        </Link>
      </div>

      {/* Product Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="card bg-white shadow-sm border border-gray-100">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{product.vials.length}</p>
                  <p className="text-xs text-gray-500">active vials</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card bg-white shadow-sm border border-gray-100">
        <div className="card-body p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <form className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search by product or lot number..."
                  defaultValue={params.search}
                  className="input input-bordered w-full pl-10"
                />
              </form>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { value: "all", label: "All", count: statusCounts.all },
                { value: "ACTIVE", label: "Active", count: statusCounts.ACTIVE },
                { value: "DEPLETED", label: "Depleted", count: statusCounts.DEPLETED },
                { value: "EXPIRED", label: "Expired", count: statusCounts.EXPIRED },
              ].map((filter) => (
                <Link
                  key={filter.value}
                  href={`/dashboard/inventory?status=${filter.value}${params.search ? `&search=${params.search}` : ""}`}
                  className={`btn btn-sm whitespace-nowrap ${
                    (params.status || "all") === filter.value
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  {filter.label}
                  <span className="badge badge-sm ml-1">{filter.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vials List */}
      <div className="card bg-white shadow-sm border border-gray-100">
        <div className="card-body p-0">
          {vials.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No inventory found
              </h3>
              <p className="text-gray-600 mb-4">
                {params.search
                  ? "No vials match your search criteria"
                  : "Start by receiving your first inventory"}
              </p>
              <Link href="/dashboard/inventory/intake" className="btn btn-primary">
                <Plus className="h-5 w-5" />
                Receive Inventory
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Lot Number</th>
                    <th>Location</th>
                    <th>Remaining</th>
                    <th>Expiration</th>
                    <th>Status</th>
                    <th>Label</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {vials.map((vial) => {
                    const daysUntilExpiry = differenceInDays(vial.expirationDate, new Date());
                    const isExpired = daysUntilExpiry < 0;
                    const isExpiringSoon = daysUntilExpiry <= 14 && daysUntilExpiry >= 0;

                    return (
                      <tr key={vial.id} className="hover">
                        <td>
                          <div>
                            <p className="font-medium text-gray-900">{vial.product.name}</p>
                            <p className="text-sm text-gray-500">{vial.product.brand}</p>
                          </div>
                        </td>
                        <td>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {vial.lotNumber}
                          </code>
                        </td>
                        <td>
                          <span className="text-gray-600">
                            {vial.location?.name || "—"}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {vial.remainingQuantity.toString()}
                            </span>
                            <span className="text-gray-500 text-sm">
                              / {vial.initialQuantity.toString()} {vial.product.unitType.toLowerCase()}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {isExpired ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : isExpiringSoon ? (
                              <Clock className="h-4 w-4 text-amber-500" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            )}
                            <div>
                              <p className={`text-sm ${
                                isExpired
                                  ? "text-red-600 font-medium"
                                  : isExpiringSoon
                                  ? "text-amber-600"
                                  : "text-gray-600"
                              }`}>
                                {format(vial.expirationDate, "MMM d, yyyy")}
                              </p>
                              {isExpired ? (
                                <p className="text-xs text-red-500">Expired</p>
                              ) : isExpiringSoon ? (
                                <p className="text-xs text-amber-500">{daysUntilExpiry} days left</p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            vial.status === "ACTIVE"
                              ? "badge-success"
                              : vial.status === "DEPLETED"
                              ? "badge-ghost"
                              : vial.status === "EXPIRED"
                              ? "badge-error"
                              : vial.status === "QUARANTINED"
                              ? "badge-warning"
                              : "badge-ghost"
                          }`}>
                            {vial.status}
                          </span>
                        </td>
                        <td>
                          <PrintLabelButton
                            vial={{
                              id: vial.id,
                              productName: vial.product.name,
                              productBrand: vial.product.brand,
                              lotNumber: vial.lotNumber,
                              expirationDate: vial.expirationDate,
                              openedDate: vial.openedDate,
                              beyondUseHours: vial.product.beyondUseHours,
                              remainingQuantity: vial.remainingQuantity.toString(),
                              initialQuantity: vial.initialQuantity.toString(),
                              unitType: vial.product.unitType,
                            }}
                          />
                        </td>
                        <td>
                          <Link
                            href={`/dashboard/inventory/${vial.id}`}
                            className="btn btn-ghost btn-sm"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
