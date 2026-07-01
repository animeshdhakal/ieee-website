export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Plus,
  Pencil,
  FileText,
  Users,
  ExternalLink,
  CircleDot,
} from "lucide-react";
import { getAllFormsWithCounts } from "@/lib/forms";
import { DeleteFormButton } from "@/components/admin/DeleteFormButton";

export const metadata = {
  title: "Manage Forms | Admin",
};

export default async function ManageFormsPage() {
  const forms = await getAllFormsWithCounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Forms</h1>
          <p className="text-gray-500 mt-1">
            Build custom forms and collect submissions. {forms.length} total.
          </p>
        </div>
        <Link
          href="/admin/forms/new"
          className="inline-flex items-center justify-center gap-2 bg-ieee-blue text-white font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> New Form
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {forms.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-500">
            No forms yet.{" "}
            <Link href="/admin/forms/new" className="text-ieee-blue font-bold hover:underline">
              Create your first form
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {forms.map((form) => (
              <li
                key={form.slug}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-400 shrink-0" />
                    <h3 className="font-bold text-gray-900 truncate">{form.title}</h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${form.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      <CircleDot size={11} /> {form.isActive ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1 ml-6">
                    <span className="text-gray-400">/{form.slug}</span>
                    <span>{form.fields.length} custom fields</span>
                    <Link
                      href={`/admin/forms/${form.slug}/submissions`}
                      className="flex items-center gap-1 font-medium text-gray-600 hover:text-ieee-blue transition-colors"
                    >
                      <Users size={14} /> {form.submissionCount} submissions
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/forms/${form.slug}`}
                    target="_blank"
                    title="View public form"
                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                  </Link>
                  <Link
                    href={`/admin/forms/${form.slug}/edit`}
                    title="Edit form"
                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </Link>
                  <DeleteFormButton slug={form.slug} title={form.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
