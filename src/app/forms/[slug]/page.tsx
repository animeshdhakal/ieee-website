import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormBySlug } from "@/lib/forms";
import { DynamicForm } from "@/components/DynamicForm";
import type { FormField } from "@/lib/form-fields";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const form = await getFormBySlug(slug);
  return { title: form ? `${form.title}` : "Form" };
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const form = await getFormBySlug(slug);

  if (!form) notFound();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-ieee-blue/10 text-ieee-blue text-xs font-bold uppercase tracking-widest">
            Registration
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-gray-500 mt-3 text-lg leading-relaxed">
              {form.description}
            </p>
          )}
        </div>

        {form.isActive ? (
          <DynamicForm slug={form.slug} fields={(form.fields ?? []) as FormField[]} />
        ) : (
          <div className="w-full max-w-2xl mx-auto p-10 bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              This form is closed
            </h3>
            <p className="text-gray-500">
              It is no longer accepting responses.{" "}
              <Link href="/" className="text-ieee-blue hover:underline">
                Return home
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
