import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { FormBuilder } from "@/components/admin/FormBuilder";
import { updateForm } from "@/actions/form-builder";
import { getFormBySlug } from "@/lib/forms";
import type { FormField } from "@/lib/form-fields";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await getFormBySlug(slug);
  return { title: form ? `Edit ${form.title} | Admin` : "Edit Form | Admin" };
}

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await getFormBySlug(slug);

  if (!form) notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/forms"
          className="text-sm font-medium text-gray-500 hover:text-ieee-blue flex items-center mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Forms
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Form</h1>
      </div>

      <FormBuilder
        action={updateForm}
        mode="edit"
        defaults={{
          slug: form.slug,
          title: form.title,
          description: form.description,
          fields: (form.fields ?? []) as FormField[],
          isActive: form.isActive,
        }}
      />
    </div>
  );
}
