"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";
import type { FormField } from "@/lib/form-fields";

export type ExportRow = {
  name: string;
  email: string;
  formData: unknown;
  createdAt: string | Date;
};

type Props = {
  fileName: string;
  fields: FormField[];
  rows: ExportRow[];
  bucketUrl: string | null;
};

/** Escapes a value for safe inclusion in a CSV cell. */
function toCsvCell(value: string): string {
  const needsQuoting = /[",\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

function cellValue(
  field: FormField,
  value: unknown,
  bucketUrl: string | null
): string {
  if (value === undefined || value === null || value === "") return "";
  if (field.type === "checkbox") return value ? "Yes" : "No";
  if (field.type === "file") {
    return bucketUrl ? `${bucketUrl}/${value}` : String(value);
  }
  return String(value);
}

export function ExportSubmissionsButton({
  fileName,
  fields,
  rows,
  bucketUrl,
}: Props) {
  function handleExport() {
    const header = ["Name", "Email", ...fields.map((f) => f.label), "Submitted At"];

    const body = rows.map((row) => {
      const data = (row.formData ?? {}) as Record<string, unknown>;
      return [
        row.name,
        row.email,
        ...fields.map((f) => cellValue(f, data[f.name], bucketUrl)),
        format(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
      ];
    });

    const csv = [header, ...body]
      .map((cols) => cols.map((c) => toCsvCell(String(c))).join(","))
      .join("\r\n");

    // Prepend a BOM so Excel reads UTF-8 correctly.
    const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={rows.length === 0}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-ieee-blue transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download size={16} /> Export CSV
    </button>
  );
}
