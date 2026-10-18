import React from 'react';

export default function SectionHeading({ index, label, title, description, action }) {
  return (
    <div className="border-y border-border py-7 md:py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          {index && label && (
            <p className="kicker">
              {index} — {label}
            </p>
          )}
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium leading-[1] tracking-tight md:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
