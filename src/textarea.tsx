import type { ComponentPropsWithRef, ReactNode } from "react";
import { useField } from "./field.js";

export type LakoTextareaProps = ComponentPropsWithRef<"textarea"> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
};

export function LakoTextarea({ label, hint, error, id, rows = 4, className = "", containerClassName = "", ...props }: LakoTextareaProps) {
  const field = useField(id, hint, error, props["aria-describedby"]);
  return (
    <label className={`lako-ui-input-box ${containerClassName}`.trim()} htmlFor={field.fieldId}>
      {label && <span className="lako-ui-input-label">{label}</span>}
      <textarea {...props} id={field.fieldId} rows={rows}
        className={`lako-ui-textarea${field.invalid ? " invalid" : ""} ${className}`.trim()}
        aria-invalid={field.invalid || props["aria-invalid"]} aria-describedby={field.describedBy} />
      {field.hasMessage && <span className={`lako-ui-input-help${field.invalid ? " error" : ""}`} id={field.helpId}>{field.message}</span>}
    </label>
  );
}
