import React from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, ExternalLink } from "lucide-react";
import { logout } from "@/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-black text-ieee-blue flex items-center gap-2">
                  <div className="w-8 h-8 bg-ieee-blue rounded-lg flex items-center justify-center text-white">
                    <LayoutDashboard size={18} />
                  </div>
                  IEEE Admin
                </Link>
              </div>
              <nav className="hidden sm:flex items-center gap-1 ml-8">
                <Link
                  href="/admin/forms"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Forms
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm font-medium">
                <ExternalLink size={16} />
                Back to Site
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-gray-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
