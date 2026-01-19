import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  AlertTriangle,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { differenceInDays, format } from "date-fns";
import { VialStatus, DiscrepancyStatus } from "@prisma/client";

async function getAlertsData(accountId: string) {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [expiringVials, expiredVials, openDiscrepancies, lowStockProducts] =
    await Promise.all([
      // Vials expiring in next 30 days
      prisma.vial.findMany({
        where: {
          accountId,
          status: VialStatus.ACTIVE,
          expirationDate: { lte: in30Days, gt: now },
        },
        include: { product: true, location: true },
        orderBy: { expirationDate: "asc" },
      }),
      // Already expired vials still marked active
      prisma.vial.findMany({
        where: {
          accountId,
          status: VialStatus.ACTIVE,
          expirationDate: { lt: now },
        },
        include: { product: true, location: true },
        orderBy: { expirationDate: "asc" },
      }),
      // Open discrepancies
      prisma.discrepancy.findMany({
        where: {
          accountId,
          status: { in: [DiscrepancyStatus.OPEN, DiscrepancyStatus.INVESTIGATING] },
        },
        orderBy: { createdAt: "desc" },
      }),
      // Products with low stock
      prisma.product.findMany({
        where: { accountId, active: true },
        include: {
          vials: {
            where: { status: VialStatus.ACTIVE },
          },
        },
      }),
    ]);

  // Calculate low stock - default threshold of 2
  const lowStock = lowStockProducts.filter(
    (p) => p.vials.length < 2
  );

  return {
    expiringVials,
    expiredVials,
    openDiscrepancies,
    lowStock,
    in7Days,
    in14Days,
  };
}

export default async function AlertsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const data = await getAlertsData(session.user.accountId);

  const hasNoAlerts =
    data.expiringVials.length === 0 &&
    data.expiredVials.length === 0 &&
    data.openDiscrepancies.length === 0 &&
    data.lowStock.length === 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alerts & Issues</h1>
        <p className="text-gray-600">
          Review items that need your attention
        </p>
      </div>

      {/* No Alerts State */}
      {hasNoAlerts && (
        <div className="card bg-emerald-50 border-2 border-emerald-200">
          <div className="card-body text-center py-12">
            <Shield className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-emerald-700 mb-2">
              All Clear!
            </h2>
            <p className="text-emerald-600">
              No alerts or issues require your attention right now.
            </p>
          </div>
        </div>
      )}

      {/* Expired Vials - Critical */}
      {data.expiredVials.length > 0 && (
        <div className="card bg-red-50 border-2 border-red-200">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="font-bold text-red-700">
                  Expired Vials ({data.expiredVials.length})
                </h2>
                <p className="text-sm text-red-600">
                  These vials have passed their expiration date
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {data.expiredVials.map((vial) => (
                <div
                  key={vial.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {vial.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Lot: {vial.lotNumber} • {vial.location?.name || "No location"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      Expired {Math.abs(differenceInDays(vial.expirationDate, new Date()))} days ago
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(vial.expirationDate, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/dashboard/inventory?status=EXPIRED"
                className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Manage Expired Inventory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Open Discrepancies - Critical */}
      {data.openDiscrepancies.length > 0 && (
        <div className="card bg-amber-50 border-2 border-amber-200">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-amber-700">
                  Open Discrepancies ({data.openDiscrepancies.length})
                </h2>
                <p className="text-sm text-amber-600">
                  Inventory issues that need investigation
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {data.openDiscrepancies.map((discrepancy) => (
                <div
                  key={discrepancy.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {discrepancy.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {discrepancy.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`badge ${
                        discrepancy.status === DiscrepancyStatus.INVESTIGATING
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {discrepancy.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(discrepancy.createdAt, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/dashboard/discrepancies"
                className="btn btn-sm bg-amber-600 hover:bg-amber-700 text-white border-0"
              >
                Review Discrepancies
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Expiring Soon */}
      {data.expiringVials.length > 0 && (
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Expiring Soon ({data.expiringVials.length})
                </h2>
                <p className="text-sm text-gray-600">
                  Vials expiring in the next 30 days
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Lot Number</th>
                    <th>Location</th>
                    <th>Units Left</th>
                    <th>Expires</th>
                    <th>Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expiringVials.map((vial) => {
                    const daysLeft = differenceInDays(
                      vial.expirationDate,
                      new Date()
                    );
                    const isUrgent = daysLeft <= 7;
                    const isWarning = daysLeft <= 14;

                    return (
                      <tr key={vial.id}>
                        <td className="font-medium">{vial.product.name}</td>
                        <td>{vial.lotNumber}</td>
                        <td>{vial.location?.name || "-"}</td>
                        <td>
                          {vial.remainingQuantity.toString()}{" "}
                          {vial.product.unitType.toLowerCase()}
                        </td>
                        <td>{format(vial.expirationDate, "MMM d, yyyy")}</td>
                        <td>
                          <span
                            className={`badge ${
                              isUrgent
                                ? "badge-error"
                                : isWarning
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {daysLeft} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock */}
      {data.lowStock.length > 0 && (
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Low Stock ({data.lowStock.length})
                </h2>
                <p className="text-sm text-gray-600">
                  Products below reorder threshold
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.lowStock.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {product.vials.length}
                    </p>
                    <p className="text-xs text-gray-500">active vials</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/dashboard/inventory/intake"
                className="btn btn-sm btn-outline"
              >
                Receive Inventory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
