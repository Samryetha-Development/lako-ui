import type { ComponentPropsWithRef, ReactNode } from "react";

export type LakoStatusTone = "neutral" | "info" | "success" | "warning" | "danger";
export type LakoBadgeProps = ComponentPropsWithRef<"span"> & { tone?: LakoStatusTone };

export function LakoBadge({ tone = "neutral", className = "", ...props }: LakoBadgeProps) {
  return <span {...props} className={`lako-ui-badge ${tone} ${className}`.trim()} />;
}

export type LakoAlertProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  title?: ReactNode;
  tone?: LakoStatusTone;
  icon?: ReactNode;
  actions?: ReactNode;
};

/** Static guidance is not a live region. Pass role="alert" for urgent updates. */
export function LakoAlert({ title, tone = "info", icon, actions, children, className = "", ...props }: LakoAlertProps) {
  return (
    <div {...props} className={`lako-ui-alert ${tone} ${className}`.trim()}>
      {icon && <span className="lako-ui-alert-icon" aria-hidden="true">{icon}</span>}
      <div className="lako-ui-alert-copy">
        {title && <strong>{title}</strong>}
        {children && <div>{children}</div>}
        {actions && <div className="lako-ui-alert-actions">{actions}</div>}
      </div>
    </div>
  );
}

export type LakoSpinnerProps = ComponentPropsWithRef<"span"> & { label?: string };

export function LakoSpinner({ label = "Loading", className = "", ...props }: LakoSpinnerProps) {
  return <span role="status" {...props} className={`lako-ui-loading ${className}`.trim()}>
    <span className="lako-ui-spinner" aria-hidden="true" />
    <span className="lako-ui-visually-hidden">{label}</span>
  </span>;
}

export type LakoSkeletonProps = ComponentPropsWithRef<"div">;

/** Decorative placeholder; expose aria-busy on the region being loaded. */
export function LakoSkeleton({ className = "", ...props }: LakoSkeletonProps) {
  return <div {...props} aria-hidden="true" className={`lako-ui-skeleton ${className}`.trim()} />;
}

export type LakoEmptyStateProps = Omit<ComponentPropsWithRef<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
};

export function LakoEmptyState({ title, description, icon, actions, className = "", ...props }: LakoEmptyStateProps) {
  return <div {...props} className={`lako-ui-empty-state ${className}`.trim()}>
    {icon && <span className="lako-ui-empty-icon" aria-hidden="true">{icon}</span>}
    <strong>{title}</strong>
    {description && <p>{description}</p>}
    {actions && <div className="lako-ui-empty-actions">{actions}</div>}
  </div>;
}
