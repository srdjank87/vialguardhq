"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Package,
  ClipboardList,
  AlertTriangle,
  FileText,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface SidebarProps {
  clinicName: string;
  userName: string;
}

const navItems = [
  {
    label: "Calm Center",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
  },
  {
    label: "Log Usage",
    href: "/dashboard/usage",
    icon: ClipboardList,
  },
  {
    label: "Alerts",
    href: "/dashboard/alerts",
    icon: AlertTriangle,
  },
  {
    label: "Audit Log",
    href: "/dashboard/audit",
    icon: FileText,
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar({ clinicName, userName }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-base-300">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-lg text-gray-900 block truncate">
                VialGuardHQ
              </span>
              <span className="text-xs text-gray-500 block truncate">
                {clinicName}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-base-200"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : "text-gray-500"}`} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-base-300">
        <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="avatar placeholder">
            <div className="bg-primary/10 text-primary rounded-full w-10">
              <span className="text-sm font-medium">
                {userName.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </span>
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName}
              </p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <LogOut className="h-3 w-3" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapse button - desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-base-300 rounded-full items-center justify-center shadow-sm hover:bg-base-100 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-500" />
        )}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-sm btn-ghost"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-300 transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full relative">
          <SidebarContent />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen bg-base-100 border-r border-base-300 sticky top-0 relative transition-all duration-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
