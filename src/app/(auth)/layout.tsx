import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">VialGuardHQ</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} VialGuardHQ. All rights reserved.
      </footer>
    </div>
  );
}
