"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { LayoutDashboard, Lock, Mail, LoaderCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-ieee-blue rounded-2xl flex items-center justify-center text-white mb-4">
            <LayoutDashboard size={28} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">IEEE Admin</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to manage registrations.</p>
        </div>

        <form
          action={formAction}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5"
        >
          {state?.error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-700">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@ieee.org"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30 focus:border-ieee-blue transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30 focus:border-ieee-blue transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-ieee-blue text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <>
                <LoaderCircle size={18} className="animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
