"use client";

import React, { useTransition, useState } from "react";
import { Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { cleanupDanglingFiles } from "@/actions/cleanup";

export function CleanupButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string; count?: number } | null>(null);

  const handleCleanup = () => {
    if (confirm("Are you sure you want to scan for and delete all dangling files across the platform? This cannot be undone.")) {
      setResult(null);
      startTransition(async () => {
        const res = await cleanupDanglingFiles();
        if (res.error) {
          setResult({ error: res.error });
        } else {
          setResult({ success: true, count: res.deletedCount });
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between h-full">
      <div>
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 text-red-600 mb-4">
          <Trash2 size={22} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Dangling Files Cleanup
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          Scan all storage buckets (events, team, galleries, forms) and delete files that are no longer linked to any data in the database.
        </p>
        
        {result?.success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg flex items-center gap-2 border border-green-100">
            <CheckCircle size={16} />
            Cleaned up {result.count} dangling file(s).
          </div>
        )}
        
        {result?.error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-lg flex items-center gap-2 border border-red-100">
            <AlertTriangle size={16} />
            {result.error}
          </div>
        )}
      </div>

      <button
        onClick={handleCleanup}
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 hover:text-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Scanning...
          </>
        ) : (
          "Run Cleanup Tool"
        )}
      </button>
    </div>
  );
}
