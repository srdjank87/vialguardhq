import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  FileText,
  Filter,
  Download,
  User,
  Package,
  Syringe,
  AlertTriangle,
  Settings,
  Clock,
  LogIn,
  LogOut,
  Key,
} from "lucide-react";
import { format } from "date-fns";
import { AuditAction } from "@prisma/client";

const actionLabels: Record<AuditAction, string> = {
  VIAL_RECEIVED: "Inventory Received",
  VIAL_OPENED: "Vial Opened",
  VIAL_DEPLETED: "Vial Depleted",
  VIAL_DISPOSED: "Vial Disposed",
  VIAL_QUARANTINED: "Vial Quarantined",
  USAGE_LOGGED: "Usage Logged",
  USAGE_EDITED: "Usage Edited",
  USAGE_DELETED: "Usage Deleted",
  ADJUSTMENT_MADE: "Adjustment Made",
  DISCREPANCY_CREATED: "Discrepancy Created",
  DISCREPANCY_RESOLVED: "Discrepancy Resolved",
  USER_CREATED: "User Created",
  USER_UPDATED: "User Updated",
  USER_DELETED: "User Deleted",
  SETTINGS_CHANGED: "Settings Changed",
  LOGIN: "Login",
  LOGOUT: "Logout",
  PASSWORD_RESET: "Password Reset",
};

const actionIcons: Record<AuditAction, typeof Package> = {
  VIAL_RECEIVED: Package,
  VIAL_OPENED: Package,
  VIAL_DEPLETED: Package,
  VIAL_DISPOSED: Package,
  VIAL_QUARANTINED: AlertTriangle,
  USAGE_LOGGED: Syringe,
  USAGE_EDITED: Syringe,
  USAGE_DELETED: Syringe,
  ADJUSTMENT_MADE: Package,
  DISCREPANCY_CREATED: AlertTriangle,
  DISCREPANCY_RESOLVED: AlertTriangle,
  USER_CREATED: User,
  USER_UPDATED: User,
  USER_DELETED: User,
  SETTINGS_CHANGED: Settings,
  LOGIN: LogIn,
  LOGOUT: LogOut,
  PASSWORD_RESET: Key,
};

const actionColors: Record<AuditAction, string> = {
  VIAL_RECEIVED: "bg-emerald-100 text-emerald-600",
  VIAL_OPENED: "bg-blue-100 text-blue-600",
  VIAL_DEPLETED: "bg-gray-100 text-gray-600",
  VIAL_DISPOSED: "bg-gray-100 text-gray-600",
  VIAL_QUARANTINED: "bg-amber-100 text-amber-600",
  USAGE_LOGGED: "bg-blue-100 text-blue-600",
  USAGE_EDITED: "bg-amber-100 text-amber-600",
  USAGE_DELETED: "bg-red-100 text-red-600",
  ADJUSTMENT_MADE: "bg-amber-100 text-amber-600",
  DISCREPANCY_CREATED: "bg-red-100 text-red-600",
  DISCREPANCY_RESOLVED: "bg-green-100 text-green-600",
  USER_CREATED: "bg-teal-100 text-teal-600",
  USER_UPDATED: "bg-teal-100 text-teal-600",
  USER_DELETED: "bg-red-100 text-red-600",
  SETTINGS_CHANGED: "bg-purple-100 text-purple-600",
  LOGIN: "bg-blue-100 text-blue-600",
  LOGOUT: "bg-gray-100 text-gray-600",
  PASSWORD_RESET: "bg-amber-100 text-amber-600",
};

async function getAuditLogs(accountId: string) {
  const logs = await prisma.auditLog.findMany({
    where: { accountId },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return logs;
}

export default async function AuditPage() {
  const session = await auth();
  if (!session?.user) return null;

  const logs = await getAuditLogs(session.user.accountId);

  // Group logs by date
  const groupedLogs = logs.reduce((acc, log) => {
    const dateKey = format(log.createdAt, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, typeof logs>);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-600">
            Complete history of all inventory actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="btn btn-outline btn-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            <p className="text-sm text-gray-500">Total Entries</p>
          </div>
        </div>
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <p className="text-2xl font-bold text-blue-600">
              {logs.filter((l) => l.action === AuditAction.USAGE_LOGGED).length}
            </p>
            <p className="text-sm text-gray-500">Usage Records</p>
          </div>
        </div>
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <p className="text-2xl font-bold text-emerald-600">
              {logs.filter((l) => l.action === AuditAction.VIAL_RECEIVED).length}
            </p>
            <p className="text-sm text-gray-500">Intakes</p>
          </div>
        </div>
        <div className="card bg-white shadow-sm border border-gray-100">
          <div className="card-body p-4">
            <p className="text-2xl font-bold text-amber-600">
              {logs.filter((l) => l.action === AuditAction.DISCREPANCY_CREATED || l.action === AuditAction.DISCREPANCY_RESOLVED).length}
            </p>
            <p className="text-sm text-gray-500">Discrepancies</p>
          </div>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="card bg-white shadow-sm border border-gray-100">
        <div className="card-body">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Activity Timeline
          </h3>

          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No audit entries yet</p>
              <p className="text-sm text-gray-500">
                Actions will be recorded here as you use the system
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedLogs).map(([dateKey, dayLogs]) => (
                <div key={dateKey}>
                  <div className="sticky top-0 bg-white py-2 z-10">
                    <h4 className="text-sm font-medium text-gray-500">
                      {format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
                    </h4>
                  </div>

                  <div className="space-y-3 ml-4 border-l-2 border-gray-100 pl-4">
                    {dayLogs.map((log) => {
                      const Icon = actionIcons[log.action] || FileText;
                      const colorClass = actionColors[log.action] || "bg-gray-100 text-gray-600";

                      return (
                        <div
                          key={log.id}
                          className="relative flex items-start gap-3 pb-3"
                        >
                          {/* Timeline dot */}
                          <div className="absolute -left-[1.4rem] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white" />

                          {/* Icon */}
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-gray-900">
                                {actionLabels[log.action] || log.action}
                              </p>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {format(log.createdAt, "h:mm a")}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {log.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              by {log.user?.name || "System"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compliance Note */}
      <div className="card bg-primary/5 border border-primary/20">
        <div className="card-body">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">
              Compliance Note:
            </span>{" "}
            This audit log is maintained for regulatory compliance and cannot be
            modified or deleted. All inventory movements, usage records, and
            adjustments are automatically tracked with timestamps and user
            attribution.
          </p>
        </div>
      </div>
    </div>
  );
}
