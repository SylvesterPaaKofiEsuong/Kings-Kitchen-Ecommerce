import React from 'react';

export default function AuthLayout({ icon, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
            {icon && React.cloneElement(icon, { className: 'h-6 w-6 text-primary-foreground', strokeWidth: 1.5 })}
          </div>
          <h1 className="font-display text-2xl font-medium tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {children}
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        )}
      </div>
    </div>
  );
}
