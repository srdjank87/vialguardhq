import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Shield,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { differenceInDays, format } from "date-fns";

async function getDashboardData(accountId: string) {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    activeVials,
    expiringIn7Days,
    expiringIn14Days,
    expiringIn30Days,
    expiredVials,
    openDiscrepancies,
    recentUsage,
    lowStockProducts,
  ] = await Promise.all([
    // Active vials count
    prisma.vial.count({
      where: { accountId, status: "ACTIVE" },
    }),
    // Expiring in 7 days
    prisma.vial.count({
      where: {
        accountId,
        status: "ACTIVE",
        expirationDate: { lte: in7Days, gt: now },
      },
    }),
    // Expiring in 14 days
    prisma.vial.count({
      where: {
        accountId,
        status: "ACTIVE",
        expirationDate: { lte: in14Days, gt: in7Days },
      },
    }),
    // Expiring in 30 days
    prisma.vial.count({
      where: {
        accountId,
        status: "ACTIVE",
        expirationDate: { lte: in30Days, gt: in14Days },
      },
    }),
    // Expired vials still marked active (should be flagged)
    prisma.vial.count({
      where: {
        accountId,
        status: "ACTIVE",
        expirationDate: { lt: now },
      },
    }),
    // Open discrepancies
    prisma.discrepancy.count({
      where: { accountId, status: { in: ["OPEN", "INVESTIGATING"] } },
    }),
    // Recent usage (last 7 days)
    prisma.usageLog.findMany({
      where: {
        accountId,
        usedAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: {
        vial: { include: { product: true } },
        provider: true,
      },
      orderBy: { usedAt: "desc" },
      take: 5,
    }),
    // Products with low stock (less than 2 active vials)
    prisma.product.findMany({
      where: { accountId, active: true },
      include: {
        vials: {
          where: { status: "ACTIVE" },
        },
      },
    }),
  ]);

  // Calculate products with low stock
  const lowStock = lowStockProducts.filter((p) => p.vials.length < 2);

  // Get vials expiring soon for the alert list
  const expiringVials = await prisma.vial.findMany({
    where: {
      accountId,
      status: "ACTIVE",
      expirationDate: { lte: in30Days },
    },
    include: { product: true, location: true },
    orderBy: { expirationDate: "asc" },
    take: 5,
  });

  return {
    activeVials,
    expiringIn7Days,
    expiringIn14Days,
    expiringIn30Days,
    expiredVials,
    openDiscrepancies,
    recentUsage,
    lowStock,
    expiringVials,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const data = await getDashboardData(session.user.accountId);

  // Calculate protection status
  const hasUrgentIssues = data.expiredVials > 0 || data.expiringIn7Days > 0 || data.openDiscrepancies > 0;
  const hasWarnings = data.expiringIn14Days > 0 || data.lowStock.length > 0;

  let statusColor = "text-emerald-600";
  let statusBg = "bg-emerald-50";
  let statusBorder = "border-emerald-200";
  let statusIcon = CheckCircle2;
  let statusText = "All Protected";
  let statusDescription = "Your inventory is in good standing. No urgent issues detected.";

  if (hasUrgentIssues) {
    statusColor = "text-red-600";
    statusBg = "bg-red-50";
    statusBorder = "border-red-200";
    statusIcon = AlertTriangle;
    statusText = "Attention Needed";
    statusDescription = "There are urgent issues that require your attention.";
  } else if (hasWarnings) {
    statusColor = "text-amber-600";
    statusBg = "bg-amber-50";
    statusBorder = "border-amber-200";
    statusIcon = Bell;
    statusText = "Review Recommended";
    statusDescription = "Some items need your attention in the coming weeks.";
  }

  const StatusIcon = statusIcon;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calm Center</h1>
        <p className="text-gray-600">
          Welcome back, {session.user.name.split(" ")[0]}. Here&apos;s your inventory status.
        </p>
      </div>

      {/* Protection Status Card */}
      <div className={`card ${statusBg} border-2 ${statusBorder}`}>
        <div className="card-body">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${statusBg} flex items-center justify-center`}>
              <StatusIcon className={`h-8 w-8 ${statusColor}`} />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${statusColor}`}>{statusText}</h2>
              <p className="text-gray-600">{statusDescription}</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.activeVials}</p>
                <p className="text-sm text-gray-500">Active Vials</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                data.expiringIn7Days > 0 ? "bg-red-100" : "bg-gray-100"
              }`}>
                <Clock className={`h-5 w-5 ${
                  data.expiringIn7Days > 0 ? "text-red-600" : "text-gray-500"
                }`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${
                  data.expiringIn7Days > 0 ? "text-red-600" : "text-gray-900"
                }`}>
                  {data.expiringIn7Days}
                </p>
                <p className="text-sm text-gray-500">Expiring &lt;7 Days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                data.openDiscrepancies > 0 ? "bg-amber-100" : "bg-gray-100"
              }`}>
                <AlertTriangle className={`h-5 w-5 ${
                  data.openDiscrepancies > 0 ? "text-amber-600" : "text-gray-500"
                }`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${
                  data.openDiscrepancies > 0 ? "text-amber-600" : "text-gray-900"
                }`}>
                  {data.openDiscrepancies}
                </p>
                <p className="text-sm text-gray-500">Open Issues</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.recentUsage.length}</p>
                <p className="text-sm text-gray-500">Uses This Week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expiry Alerts */}
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Expiry Alerts</h3>
              <Link
                href="/dashboard/alerts"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {data.expiringVials.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-gray-600">No expiring vials in the next 30 days</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.expiringVials.map((vial) => {
                  const daysUntilExpiry = differenceInDays(vial.expirationDate, new Date());
                  const isUrgent = daysUntilExpiry <= 7;
                  const isExpired = daysUntilExpiry < 0;

                  return (
                    <div
                      key={vial.id}
                      className={`p-3 rounded-lg border ${
                        isExpired
                          ? "bg-red-50 border-red-200"
                          : isUrgent
                          ? "bg-amber-50 border-amber-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {vial.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Lot: {vial.lotNumber} • {vial.location?.name || "No location"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            isExpired
                              ? "text-red-600"
                              : isUrgent
                              ? "text-amber-600"
                              : "text-gray-600"
                          }`}>
                            {isExpired
                              ? "Expired"
                              : daysUntilExpiry === 0
                              ? "Expires today"
                              : `${daysUntilExpiry} days left`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(vial.expirationDate, "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Usage</h3>
              <Link
                href="/dashboard/usage"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Log usage <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {data.recentUsage.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No usage logged this week</p>
                <Link href="/dashboard/usage" className="btn btn-primary btn-sm mt-3">
                  Log First Usage
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentUsage.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {log.vial.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {log.provider?.name || "Unknown provider"} •{" "}
                        {log.quantityUsed.toString()} {log.vial.product.unitType.toLowerCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {format(log.usedAt, "MMM d")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(log.usedAt, "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
        <div className="card-body">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/usage" className="btn btn-primary btn-sm">
              Log Usage
            </Link>
            <Link href="/dashboard/inventory/intake" className="btn btn-outline btn-sm">
              Receive Inventory
            </Link>
            <Link href="/dashboard/inventory" className="btn btn-outline btn-sm">
              View All Inventory
            </Link>
            <Link href="/dashboard/audit" className="btn btn-outline btn-sm">
              Audit Log
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
