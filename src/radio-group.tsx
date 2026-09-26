import { useId, type ComponentPropsWithRef, type ReactNode } from "react";

export type LakoRadioOption<T extends string> = { value: T; label: ReactNode; disabled?: boolean };
export type LakoRadioGroupProps<T extends string> = Omit<ComponentPropsWithRef<"fieldset">, "onChange"> & {
  label: ReactNode;
  options: readonly LakoRadioOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  name?: string;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  /** Compact text choices with an active underline; retains radio semantics. */
  variant?: "list" | "segmented";
};

/** Native radios provide arrow-key navigation, form submission and reset. */
export function LakoRadioGroup<T extends string>({ label, options, value, defaultValue, onChange, name, required, orientation = "vertical", variant = "list", className = "", ...props }: LakoRadioGroupProps<T>) {
  const generatedName = useId();
  return (
    <fieldset {...props} className={`lako-ui-radio-group ${orientation} ${variant} ${className}`.trim()}>
      <legend>{label}</legend>
      <div className="lako-ui-radio-options">
        {options.map((option) => (
          <label className={`lako-ui-choice${props.disabled || option.disabled ? " disabled" : ""}`} key={option.value}>
            <span className="lako-ui-choice-control">
              <input className="lako-ui-choice-input" type="radio" name={name ?? generatedName}
                value={option.value} disabled={option.disabled} required={required}
                checked={value === undefined ? undefined : value === option.value}
                defaultChecked={value === undefined ? defaultValue === option.value : undefined}
                onChange={() => onChange?.(option.value)} />
              {variant === "list" && <svg className="lako-ui-choice-mark" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
                <circle className="lako-ui-choice-dot" cx="7" cy="7" r="2" />
              </svg>}
            </span>
            <span className="lako-ui-choice-label">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
