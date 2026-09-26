import type { ComponentPropsWithRef, ReactNode } from "react";

export type LakoButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

/** Defaults to a non-submitting button. Set type="submit" for form actions. */
export function LakoButton({
  variant = "secondary", size = "md", loading = false, leadingIcon, trailingIcon,
  type = "button", disabled, className = "", children, ...props
}: LakoButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || loading}
      aria-busy={loading || props["aria-busy"]}
      className={`lako-ui-button ${variant} ${size} ${className}`.trim()}>
      {loading ? <span className="lako-ui-spinner" aria-hidden="true" /> : leadingIcon && <span className="lako-ui-button-icon" aria-hidden="true">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className="lako-ui-button-icon" aria-hidden="true">{trailingIcon}</span>}
    </button>
  );
}
