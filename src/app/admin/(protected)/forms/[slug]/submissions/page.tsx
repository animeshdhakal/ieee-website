import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageIcon, Paperclip, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { getFormBySlug } from "@/lib/forms";
import { getFormSubmissions } from "@/actions/admin";
import { ExportSubmissionsButton } from "@/components/admin/ExportSubmissionsButton";
import type { FormField } from "@/lib/form-fields";

const FORM_UPLOAD_BUCKET = "form-uploads";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await getFormBySlug(slug);
  return { title: form ? `Submissions: ${form.title} | Admin` : "Submissions | Admin" };
}

export default async function FormSubmissionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await getFormBySlug(slug);
  if (!form) notFound();

  const fields = (form.fields ?? []) as FormField[];
  const submissions = await getFormSubmissions(slug);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucketUrl = supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/${FORM_UPLOAD_BUCKET}`
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/forms"
            className="text-sm font-medium text-gray-500 hover:text-ieee-blue flex items-center mb-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Forms
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{form.title} Submissions</h1>
          <p className="text-gray-500 mt-1">{submissions.length} total.</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportSubmissionsButton
            fileName={`${form.slug}-submissions`}
            fields={fields}
            rows={submissions}
            bucketUrl={bucketUrl}
          />
          <Link
            href={`/forms/${form.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-ieee-blue transition-colors shadow-sm"
          >
            <ExternalLink size={16} /> View public form
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Email</th>
                {fields.map((field) => (
                  <th key={field.id} scope="col" className="px-6 py-4">
                    {field.label}
                  </th>
                ))}
                <th scope="col" className="px-6 py-4 whitespace-nowrap">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 3} className="px-6 py-12 text-center text-gray-500">
                    No submissions found yet.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => {
                  const data = (sub.formData ?? {}) as Record<string, unknown>;
                  return (
                    <tr key={sub.id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{sub.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{sub.email}</td>
                      {fields.map((field) => (
                        <td key={field.id} className="px-6 py-4">
                          <CellValue
                            field={field}
                            value={data[field.name]}
                            bucketUrl={bucketUrl}
                          />
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(sub.createdAt), "MMM d, yyyy HH:mm")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CellValue({
  field,
  value,
  bucketUrl,
}: {
  field: FormField;
  value: unknown;
  bucketUrl: string | null;
}) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-gray-300">-</span>;
  }

  if (field.type === "file") {
    if (!bucketUrl) return <span className="text-gray-300">-</span>;
    const url = `${bucketUrl}/${value}`;
    const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(String(value));
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-colors"
        title="View file"
      >
        {isImage ? <ImageIcon size={18} /> : <Paperclip size={18} />}
      </a>
    );
  }

  if (field.type === "checkbox") {
    return value ? (
      <span className="px-2.5 py-1 bg-ieee-blue/10 text-ieee-blue font-bold rounded-full text-xs">Yes</span>
    ) : (
      <span className="text-gray-400 font-medium">No</span>
    );
  }

  return <span>{String(value)}</span>;
}
