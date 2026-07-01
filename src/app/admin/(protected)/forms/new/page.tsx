import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormBuilder } from "@/components/admin/FormBuilder";
import { createForm } from "@/actions/form-builder";

export const metadata = {
  title: "New Form | Admin",
};

export default function NewFormPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/forms"
          className="text-sm font-medium text-gray-500 hover:text-ieee-blue flex items-center mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Forms
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Form</h1>
      </div>

      <FormBuilder action={createForm} mode="create" />
    </div>
  );
}
