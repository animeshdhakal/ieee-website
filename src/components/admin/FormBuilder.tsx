"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import {
  LoaderCircle,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import type { FormBuilderState } from "@/actions/form-builder";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { FORM_UPLOAD_BUCKET } from "@/utils/uploadImage";
import {
  type FormField,
  type FieldType,
  type ConditionOperator,
  FIELD_TYPES,
  FIELD_TYPE_LABELS,
  CONDITION_OPERATORS,
  CONDITION_OPERATOR_LABELS,
  toFieldName,
  validateFields,
} from "@/lib/form-fields";

export type FormDefaults = {
  slug?: string;
  title?: string;
  description?: string | null;
  fields?: FormField[];
  isActive?: boolean;
};

type Props = {
  action: (
    prevState: FormBuilderState,
    formData: FormData
  ) => Promise<FormBuilderState>;
  mode: "create" | "edit";
  defaults?: FormDefaults;
};

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30 focus:border-ieee-blue transition-all";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

function newField(): FormField {
  return {
    id: crypto.randomUUID(),
    label: "",
    name: "",
    type: "text",
    required: false,
  };
}

/**
 * While editing, conditions reference the controlling field by its stable `id`
 * so renaming a field can't silently break the link. Stored forms reference by
 * `name`, so convert on load…
 */
function normalizeConditions(fields: FormField[]): FormField[] {
  const nameToId = new Map(fields.map((f) => [f.name, f.id]));
  return fields.map((f) =>
    f.condition
      ? {
          ...f,
          condition: {
            ...f.condition,
            field: nameToId.get(f.condition.field) ?? f.condition.field,
          },
        }
      : f
  );
}

/** …and back to names (derived from labels) when serializing for the server. */
function buildSchema(fields: FormField[]): FormField[] {
  const idToName = new Map(fields.map((f) => [f.id, toFieldName(f.label)]));
  return fields.map((f) => {
    const resolved: FormField = { ...f, name: idToName.get(f.id) ?? "" };
    if (f.condition) {
      resolved.condition = {
        ...f.condition,
        field: idToName.get(f.condition.field) ?? f.condition.field,
      };
    }
    return resolved;
  });
}

export function FormBuilder({ action, mode, defaults = {} }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [slug, setSlug] = useState(defaults.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [fields, setFields] = useState<FormField[]>(() =>
    normalizeConditions(defaults.fields ?? [])
  );
  const [clientError, setClientError] = useState<string | null>(null);

  // Field names are derived from labels so submissions stay stable & readable.
  const serializedFields = useMemo(
    () => JSON.stringify(buildSchema(fields)),
    [fields]
  );

  function handleTitleChange(value: string) {
    if (mode === "create" && !slugTouched) {
      setSlug(
        value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  }

  function updateField(id: string, patch: Partial<FormField>) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
    );
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  function moveField(index: number, direction: -1 | 1) {
    setFields((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleSubmit(formData: FormData) {
    const error = validateFields(buildSchema(fields));
    if (error) {
      setClientError(error);
      return;
    }
    setClientError(null);
    formAction(formData);
  }

  const errorMessage = clientError ?? state?.error;

  return (
    <form action={handleSubmit} className="space-y-6">
      {mode === "edit" && (
        <input type="hidden" name="originalSlug" value={defaults.slug} />
      )}
      <input type="hidden" name="fields" value={serializedFields} />

      {errorMessage && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Form details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={defaults.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Membership Application 2026"
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              readOnly={mode === "edit"}
              className={`${inputClass} ${mode === "edit" ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
              placeholder="membership-application-2026"
            />
            <p className="text-xs text-gray-400 mt-1">
              {mode === "edit"
                ? "Slug can't be changed — it links submissions and the public URL."
                : "Public URL: /forms/your-slug"}
            </p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              defaultValue={defaults.description ?? ""}
              className={inputClass}
              placeholder="Shown above the form to explain what it's for."
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={defaults.isActive ?? true}
            className="w-4 h-4 rounded border-gray-300 text-ieee-blue focus:ring-ieee-blue"
          />
          <span className="text-sm font-medium text-gray-700">
            Accepting responses
          </span>
        </label>
      </div>

      {/* System fields note */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl px-6 py-4 text-sm text-gray-600">
        Every form automatically collects a <strong>Name</strong> and{" "}
        <strong>Email</strong>. Add any extra fields you need below.
      </div>

      {/* Custom fields */}
      <div className="space-y-4">
        {fields.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center text-gray-500">
            No custom fields yet. Add one to start building your form.
          </div>
        )}

        {fields.map((field, index) => (
          <FieldEditor
            key={field.id}
            field={field}
            index={index}
            total={fields.length}
            precedingFields={fields.slice(0, index)}
            onChange={(patch) => updateField(field.id, patch)}
            onRemove={() => removeField(field.id)}
            onMove={(dir) => moveField(index, dir)}
          />
        ))}

        <button
          type="button"
          onClick={() => setFields((prev) => [...prev, newField()])}
          className="inline-flex items-center gap-2 text-sm font-bold text-ieee-blue hover:text-blue-700 transition-colors"
        >
          <Plus size={18} /> Add field
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-ieee-blue text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <>
              <LoaderCircle size={18} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={18} /> {mode === "create" ? "Create Form" : "Save Changes"}
            </>
          )}
        </button>
        <Link
          href="/admin/forms"
          className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

type FieldEditorProps = {
  field: FormField;
  index: number;
  total: number;
  precedingFields: FormField[];
  onChange: (patch: Partial<FormField>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
};

/**
 * Keeps the raw text (including blank lines being typed) in local state so the
 * caret can advance, while emitting a trimmed, empty-free list to the parent.
 */
function OptionsTextarea({
  value,
  onChange,
}: {
  value: string[];
  onChange: (options: string[]) => void;
}) {
  const [text, setText] = useState(() => value.join("\n"));

  return (
    <textarea
      rows={3}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split("\n")
            .map((o) => o.trim())
            .filter(Boolean)
        );
      }}
      className={inputClass}
      placeholder={"Option A\nOption B\nOption C"}
    />
  );
}

function FieldEditor({
  field,
  index,
  total,
  precedingFields,
  onChange,
  onRemove,
  onMove,
}: FieldEditorProps) {
  const supportsPlaceholder = !["select", "checkbox", "file"].includes(
    field.type
  );
  const controller = field.condition
    ? precedingFields.find((f) => f.id === field.condition!.field)
    : undefined;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center pt-2 text-gray-300">
          <GripVertical size={18} />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onChange({ label: e.target.value })}
              className={inputClass}
              placeholder="e.g. Phone number"
            />
          </div>

          <div>
            <label className={labelClass}>Type</label>
            <select
              value={field.type}
              onChange={(e) =>
                onChange({ type: e.target.value as FieldType })
              }
              className={inputClass}
            >
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {FIELD_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          {supportsPlaceholder && (
            <div className="md:col-span-2">
              <label className={labelClass}>Placeholder</label>
              <input
                type="text"
                value={field.placeholder ?? ""}
                onChange={(e) => onChange({ placeholder: e.target.value })}
                className={inputClass}
                placeholder="Optional hint text"
              />
            </div>
          )}

          {field.type === "select" && (
            <div className="md:col-span-2">
              <label className={labelClass}>Options (one per line)</label>
              <OptionsTextarea
                value={field.options ?? []}
                onChange={(options) => onChange({ options })}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <ImageUploadField
              label="Label image (optional)"
              bucket={FORM_UPLOAD_BUCKET}
              defaultValue={field.image}
              onChange={(image) => onChange({ image: image || undefined })}
            />
            <p className="text-xs text-gray-400 mt-1">
              Shown beneath the label on the form — e.g. a payment QR code.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onChange({ required: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-ieee-blue focus:ring-ieee-blue"
            />
            <span className="text-sm font-medium text-gray-700">Required</span>
          </label>

          {/* Conditional visibility */}
          <div className="md:col-span-2 border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={!!field.condition}
                disabled={precedingFields.length === 0}
                onChange={(e) =>
                  onChange({
                    condition: e.target.checked
                      ? {
                          field: precedingFields[0].id,
                          operator: "equals",
                          value: "",
                        }
                      : undefined,
                  })
                }
                className="w-4 h-4 rounded border-gray-300 text-ieee-blue focus:ring-ieee-blue disabled:opacity-40"
              />
              <span className="text-sm font-medium text-gray-700">
                Only show this field conditionally
              </span>
            </label>

            {precedingFields.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Add a field above this one to use as the condition.
              </p>
            )}

            {field.condition && (
              <div className="mt-3 bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span>Show when</span>
                <select
                  value={field.condition.field}
                  onChange={(e) =>
                    onChange({
                      condition: {
                        ...field.condition!,
                        field: e.target.value,
                        value: "",
                      },
                    })
                  }
                  className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30"
                >
                  {precedingFields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label || "(untitled field)"}
                    </option>
                  ))}
                </select>
                <select
                  value={field.condition.operator}
                  onChange={(e) =>
                    onChange({
                      condition: {
                        ...field.condition!,
                        operator: e.target.value as ConditionOperator,
                      },
                    })
                  }
                  className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30"
                >
                  {CONDITION_OPERATORS.map((op) => (
                    <option key={op} value={op}>
                      {CONDITION_OPERATOR_LABELS[op]}
                    </option>
                  ))}
                </select>
                <ConditionValueInput
                  controller={controller}
                  value={field.condition.value}
                  onChange={(value) =>
                    onChange({ condition: { ...field.condition!, value } })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Move up"
            className="p-1.5 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowUp size={16} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Move down"
            className="p-1.5 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ArrowDown size={16} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            title="Remove field"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const conditionValueClass =
  "px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-ieee-blue/30";

function ConditionValueInput({
  controller,
  value,
  onChange,
}: {
  controller: FormField | undefined;
  value: string;
  onChange: (value: string) => void;
}) {
  if (controller?.type === "select") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={conditionValueClass}
      >
        <option value="" disabled>
          Select value
        </option>
        {(controller.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (controller?.type === "checkbox") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={conditionValueClass}
      >
        <option value="" disabled>
          Select value
        </option>
        <option value="true">Checked</option>
        <option value="false">Unchecked</option>
      </select>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="value"
      className={conditionValueClass}
    />
  );
}
