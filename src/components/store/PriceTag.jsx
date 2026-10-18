import React from 'react';
import { formatGHS } from '@/lib/format';

export default function PriceTag({ price, compareAtPrice, large = false }) {
  const discounted = compareAtPrice && compareAtPrice > price;
  const pct = discounted ? Math.round((1 - price / compareAtPrice) * 100) : 0;

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span
        className={
          large
            ? 'font-display text-3xl font-semibold'
            : 'font-mono text-base font-medium'
        }
      >
        {formatGHS(price)}
      </span>
      {discounted && (
        <>
          <span className="font-mono text-sm text-muted-foreground line-through">
            {formatGHS(compareAtPrice)}
          </span>
          <span className="font-mono text-xs text-[#2D4B73]">−{pct}%</span>
        </>
      )}
    </div>
  );
}
