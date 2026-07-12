/**
 * Shared, dependency-free definitions for the dynamic form builder.
 * Safe to import from both client components and server actions.
 */

export const FIELD_TYPES = [
  "text",
  "email",
  "tel",
  "number",
  "textarea",
  "select",
  "checkbox",
  "file",
  "section",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const CONDITION_OPERATORS = ["equals", "not_equals"] as const;
export type ConditionOperator = (typeof CONDITION_OPERATORS)[number];

export const CONDITION_OPERATOR_LABELS: Record<ConditionOperator, string> = {
  equals: "is",
  not_equals: "is not",
};

export interface FieldCondition {
  /** Name of the controlling field this field's visibility depends on. */
  field: string;
  operator: ConditionOperator;
  value: string;
}

export interface FormField {
  /** Stable identifier used as a React key while editing. */
  id: string;
  /** Key the value is stored under in the submission's formData. */
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  /** Only meaningful for `select` fields. */
  options?: string[];
  /** Optional image shown beneath the label (e.g. a payment QR code). */
  image?: string;
  /** Optional subtext/description to show under the field label. */
  subtext?: string;
  /** Allow users to select "Other" and input custom text (for select fields). */
  allowOther?: boolean;
  /** When set, the field is only shown/collected if the condition is met. */
  condition?: FieldCondition;
}

/**
 * Evaluates a field's visibility against a set of submitted values. Shared by
 * the builder preview, the public renderer, and the server so all three agree.
 */
export function isFieldVisible(
  field: FormField,
  values: Record<string, unknown>
): boolean {
  const condition = field.condition;
  if (!condition) return true;

  const raw = values[condition.field];
  const actual = typeof raw === "boolean" ? String(raw) : String(raw ?? "");

  return condition.operator === "equals"
    ? actual === condition.value
    : actual !== condition.value;
}

/** Field names reserved for the built-in system columns. */
export const RESERVED_FIELD_NAMES = ["name", "email", "formid"] as const;

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Short text",
  email: "Email",
  tel: "Phone",
  number: "Number",
  textarea: "Long text",
  select: "Dropdown",
  checkbox: "Checkbox",
  file: "File upload",
  section: "Section Header",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Turns a human label into a safe, snake_case-ish field name. */
export function toFieldName(label: string): string {
  return slugify(label).replace(/-/g, "_");
}

/**
 * Validates a set of fields coming from the builder. Returns an error string,
 * or null when the fields are well-formed. Shared by client and server so the
 * two never drift.
 */
export function validateFields(fields: FormField[]): string | null {
  const seen = new Set<string>();

  for (const field of fields) {
    if (!field.label?.trim()) {
      return "Every field needs a label.";
    }
    if (!field.name?.trim()) {
      return `The field "${field.label}" needs a valid name.`;
    }
    if (RESERVED_FIELD_NAMES.includes(field.name as (typeof RESERVED_FIELD_NAMES)[number])) {
      return `"${field.name}" is a reserved field name.`;
    }
    if (seen.has(field.name)) {
      return `Duplicate field name "${field.name}". Field names must be unique.`;
    }

    if (!FIELD_TYPES.includes(field.type)) {
      return `"${field.label}" has an unknown field type.`;
    }
    if (field.type === "select" && (!field.options || field.options.length === 0)) {
      return `The dropdown "${field.label}" needs at least one option.`;
    }

    // A condition may only reference a field that appears before this one.
    if (field.condition) {
      const { field: controller, value } = field.condition;
      if (!controller || !seen.has(controller)) {
        return `"${field.label}" is conditioned on a field that doesn't come before it.`;
      }
      if (!value?.trim()) {
        return `The condition on "${field.label}" needs a value to compare against.`;
      }
    }

    seen.add(field.name);
  }

  return null;
}
