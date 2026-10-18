import React from 'react';

export default function EmptyState({ icon, kicker, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="mb-6 text-muted-foreground/40">
          {React.cloneElement(icon, { className: 'h-12 w-12', strokeWidth: 1 })}
        </div>
      )}
      {kicker && <p className="kicker mb-3">{kicker}</p>}
      <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">{title}</h2>
      {description && (
        <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
