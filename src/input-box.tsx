import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { useField } from "./field.js";

export type LakoInputBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> & {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerClassName?: string;
};

export const LakoInputBox = forwardRef<HTMLInputElement, LakoInputBoxProps>(function LakoInputBox(
  { label, hint, error, prefix, suffix, containerClassName = "", id, className = "", ...props },
  ref,
) {
  const field = useField(id, hint, error, props["aria-describedby"]);
  const inputId = field.fieldId;
  return (
    <label className={`lako-ui-input-box ${containerClassName}`.trim()} htmlFor={inputId}>
      {label && <span className="lako-ui-input-label">{label}</span>}
      <span className={`lako-ui-input-control${field.invalid ? " invalid" : ""}`}>
        {prefix && <span className="lako-ui-input-affix">{prefix}</span>}
        <input
          {...props}
          className={className}
          id={inputId}
          ref={ref}
          aria-invalid={field.invalid || props["aria-invalid"]}
          aria-describedby={field.describedBy}
        />
        {suffix && <span className="lako-ui-input-affix">{suffix}</span>}
      </span>
      {field.hasMessage && <span className={`lako-ui-input-help${field.invalid ? " error" : ""}`} id={field.helpId}>{field.message}</span>}
    </label>
  );
});
