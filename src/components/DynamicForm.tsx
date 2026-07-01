"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useForm, type UseFormRegister, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown } from "lucide-react";
import { submitDynamicForm } from "@/actions/forms";
import { type FormField, isFieldVisible } from "@/lib/form-fields";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const baseInput =
  "w-full px-5 py-3.5 bg-white border rounded-xl text-gray-900 placeholder:text-gray-400 transition-all outline-none";
const labelClass = "block text-sm font-bold text-gray-800 mb-2";

function inputCls(hasError?: boolean): string {
  return `${baseInput} ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      : "border-gray-200 hover:border-gray-300 focus:border-ieee-blue focus:ring-4 focus:ring-ieee-blue/10"
  }`;
}

/**
 * Builds a Zod schema for the built-in fields plus the dynamic ones. Required
 * and type checks for dynamic fields run in a superRefine so they respect each
 * field's conditional visibility — hidden fields are never validated.
 */
function buildSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodTypeAny> = {
    name: z.string().trim().min(1, "Name is required."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .regex(EMAIL_RE, "Enter a valid email address."),
  };

  for (const field of fields) {
    if (field.type === "checkbox") shape[field.name] = z.boolean().optional();
    else if (field.type === "file") shape[field.name] = z.any().optional();
    else shape[field.name] = z.string().optional();
  }

  return z.object(shape).superRefine((data, ctx) => {
    const values = data as Record<string, unknown>;
    for (const field of fields) {
      if (!isFieldVisible(field, values)) continue;

      const value = values[field.name];
      const filled =
        field.type === "checkbox"
          ? value === true
          : field.type === "file"
          ? Boolean(value && (value as FileList).length > 0)
          : typeof value === "string" && value.trim() !== "";

      if (field.required && !filled) {
        ctx.addIssue({
          code: "custom",
          path: [field.name],
          message: `${field.label} is required.`,
        });
        continue;
      }

      if (filled && field.type === "email" && typeof value === "string" && !EMAIL_RE.test(value)) {
        ctx.addIssue({
          code: "custom",
          path: [field.name],
          message: "Enter a valid email address.",
        });
      }
      if (filled && field.type === "number" && typeof value === "string" && Number.isNaN(Number(value))) {
        ctx.addIssue({
          code: "custom",
          path: [field.name],
          message: `${field.label} must be a number.`,
        });
      }
    }
  });
}

type Props = {
  slug: string;
  fields: FormField[];
};

type Result = { error: string } | { success: true; message: string } | null;

export function DynamicForm({ slug, fields }: Props) {
  const schema = useMemo(() => buildSchema(fields), [fields]);

  const defaultValues = useMemo(() => {
    const dv: Record<string, unknown> = { name: "", email: "" };
    for (const field of fields) dv[field.name] = field.type === "checkbox" ? false : "";
    return dv;
  }, [fields]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues, mode: "onBlur" });

  const [result, setResult] = useState<Result>(null);
  const [isPending, startTransition] = useTransition();

  // Resolve visibility in field order so a hidden controller cascades to the
  // fields that depend on it — the server applies the exact same logic.
  const values = watch();
  const visibleFields = useMemo(() => {
    const effective: Record<string, unknown> = { ...values };
    return fields.filter((field) => {
      const visible = isFieldVisible(field, effective);
      if (!visible) delete effective[field.name];
      return visible;
    });
  }, [fields, values]);

  function onValid(_data: FieldValues, event?: React.BaseSyntheticEvent) {
    const formEl = event?.target as HTMLFormElement;
    const formData = new FormData(formEl);
    startTransition(async () => {
      const res = await submitDynamicForm(null, formData);
      setResult(res);
      if (res && "success" in res && res.success) reset();
    });
  }

  if (result && "success" in result && result.success) {
    return (
      <div className="p-8 bg-green-50 text-green-700 rounded-2xl border border-green-100 mt-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">Submission Received!</h3>
        <p className="text-green-600">{result.message}</p>
      </div>
    );
  }

  const serverError = result && "error" in result ? result.error : null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-ieee-blue via-blue-500 to-cyan-400" />
      <div className="p-6 md:p-10">
        {serverError && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onValid)} className="space-y-8" noValidate>
          <input type="hidden" name="formId" value={slug} />

          {/* Built-in system fields */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={inputCls(Boolean(errors.name))}
              placeholder="Your full name"
            />
            <FieldError message={errors.name?.message as string | undefined} />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className={inputCls(Boolean(errors.email))}
              placeholder="you@example.com"
            />
            <FieldError message={errors.email?.message as string | undefined} />
          </div>

          {visibleFields.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              register={register}
              error={errors[field.name]?.message as string | undefined}
              currentValue={values[field.name]}
            />
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-6 bg-ieee-blue hover:bg-ieee-dark disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex justify-center items-center"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm font-medium text-red-600">{message}</p>;
}

function FieldInput({
  field,
  register,
  error,
  currentValue,
}: {
  field: FormField;
  register: UseFormRegister<FieldValues>;
  error?: string;
  currentValue: unknown;
}) {
  const requiredMark = field.required ? <span className="text-red-500">*</span> : null;
  const reg = register(field.name);

  if (field.type === "checkbox") {
    return (
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...reg}
            className="w-5 h-5 rounded border-gray-300 text-ieee-blue focus:ring-ieee-blue"
          />
          <span className="text-sm font-bold text-gray-700">
            {field.label} {requiredMark}
          </span>
        </label>
        <FieldError message={error} />
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={field.name} className={labelClass}>
        {field.label} {requiredMark}
      </label>

      {field.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={field.image}
          alt={field.label}
          className="mb-3 max-h-64 w-auto rounded-lg border border-gray-200"
        />
      )}

      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          {...reg}
          rows={4}
          placeholder={field.placeholder}
          className={inputCls(Boolean(error))}
        />
      ) : field.type === "select" ? (
        <div className="relative">
          <select
            id={field.name}
            {...reg}
            className={`${inputCls(Boolean(error))} appearance-none cursor-pointer pr-12 ${
              currentValue ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <option value="" disabled>
              {field.placeholder || "Select an option"}
            </option>
            {(field.options ?? []).map((option) => (
              <option key={option} value={option} className="text-gray-900">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      ) : field.type === "file" ? (
        <input
          type="file"
          id={field.name}
          {...reg}
          className="block w-full text-sm text-gray-500 cursor-pointer file:mr-4 file:cursor-pointer file:rounded-lg file:border file:border-gray-200 file:bg-white file:px-5 file:py-2.5 file:text-sm file:font-bold file:text-ieee-blue hover:file:bg-gray-50 file:transition-colors"
        />
      ) : (
        <input
          type={field.type}
          id={field.name}
          {...reg}
          placeholder={field.placeholder}
          className={inputCls(Boolean(error))}
        />
      )}

      <FieldError message={error} />
    </div>
  );
}
