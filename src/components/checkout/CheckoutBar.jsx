import React from 'react';

const STEPS = ['Identity', 'Logistics', 'Review', 'Payment'];

export default function CheckoutBar({ currentStep }) {
  return (
    <ol className="flex divide-x divide-border border border-border bg-card" aria-label="Checkout progress">
      {STEPS.map((label, i) => {
        const isCurrent = i === currentStep;
        const isPast = i < currentStep;

        return (
          <li
            key={label}
            className={`flex flex-1 items-center justify-center gap-2 px-3 py-3 text-center transition-colors md:px-6 md:py-4 ${
              isCurrent
                ? 'bg-foreground text-background font-medium'
                : isPast
                ? 'text-[#2D4B73] bg-background'
                : 'text-muted-foreground bg-background'
            }`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className={`font-mono text-[10px] md:text-xs uppercase tracking-wider ${
              isCurrent ? 'text-background/80' : isPast ? 'text-[#2D4B73]' : 'text-muted-foreground/60'
            }`}>
              0{i + 1}
            </span>
            <span className="hidden font-mono text-xs uppercase tracking-wider sm:inline">
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
