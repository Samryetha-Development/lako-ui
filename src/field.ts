import { useId, type ReactNode } from "react";

/** Keep caller-provided descriptions when adding field help or validation. */
export function useField(id: string | undefined, hint: ReactNode, error: ReactNode, describedBy?: string) {
  const generatedId = useId();
  const fieldId = id ?? `lako-field-${generatedId.replace(/:/g, "")}`;
  const message = error ?? hint;
  const hasMessage = message != null && message !== false && message !== "";
  const invalid = error != null && error !== false && error !== "";
  const helpId = `${fieldId}-help`;
  return {
    fieldId, helpId, message, hasMessage, invalid,
    describedBy: [describedBy, hasMessage ? helpId : undefined].filter(Boolean).join(" ") || undefined,
  };
}
