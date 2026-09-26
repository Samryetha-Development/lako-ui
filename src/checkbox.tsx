import { useEffect, useRef, type ComponentPropsWithRef, type ReactNode } from "react";
import { useField } from "./field.js";

export type LakoCheckboxProps = Omit<ComponentPropsWithRef<"input">, "type" | "size"> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  indeterminate?: boolean;
  containerClassName?: string;
};

export function LakoCheckbox({ label, hint, error, indeterminate = false, containerClassName = "", className = "", id, ref, ...props }: LakoCheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const field = useField(id, hint, error, props["aria-describedby"]);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate, props.checked]);
  return (
    <label className={`lako-ui-choice${props.disabled ? " disabled" : ""} ${containerClassName}`.trim()} htmlFor={field.fieldId}>
      <span className="lako-ui-choice-control">
        <input {...props} type="checkbox" id={field.fieldId}
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") return ref(node);
            if (ref) ref.current = node;
          }}
          className={`lako-ui-choice-input ${className}`.trim()}
          aria-checked={indeterminate ? "mixed" : props["aria-checked"]}
          aria-invalid={field.invalid || props["aria-invalid"]} aria-describedby={field.describedBy} />
        <svg className="lako-ui-choice-mark" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path className="lako-ui-choice-check" d="m3.5 7 2.25 2.25 4.75-4.75" />
          <path className="lako-ui-choice-dash" d="M4 7h6" />
        </svg>
      </span>
      <span className="lako-ui-choice-copy">
        {label && <span>{label}</span>}
        {field.hasMessage && <span className={`lako-ui-input-help${field.invalid ? " error" : ""}`} id={field.helpId}>{field.message}</span>}
      </span>
    </label>
  );
}
