import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="border border-border bg-card animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="border-t border-border p-4 space-y-2">
        <div className="h-2 w-16 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-2 w-20 rounded bg-muted" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, columns = 4 }) {
  return (
    <div className={`grid gap-px bg-border ${columns === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-48 rounded bg-muted mb-8" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
        <div className="md:col-span-5 space-y-4">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-8 w-full rounded bg-muted" />
          <div className="h-10 w-40 rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
