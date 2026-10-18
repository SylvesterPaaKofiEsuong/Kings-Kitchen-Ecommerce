import React from 'react';
import { Link } from 'react-router-dom';
import PriceTag from './PriceTag';

function availability(stock) {
  if (stock > 5) return ['In Stock', 'text-[#2D4B73]'];
  if (stock > 0) return ['Low Stock', 'text-amber-800 dark:text-amber-400'];
  return ['Out of Stock', 'text-muted-foreground'];
}

export default function ProductCard({ product }) {
  const { slug, name, brand, price, compare_at_price, stock, images, specs, variations, badge } = product;
  const image = images?.[0] || '';
  const [availLabel, availClass] = availability(stock ?? 0);
  const discounted = compare_at_price && compare_at_price > price;
  const discountPct = discounted ? Math.round((1 - price / compare_at_price) * 100) : 0;
  const variantCount = variations?.reduce((s, v) => s + (v.options?.length || 0), 0) || 0;

  return (
    <Link
      to={`/product/${slug}`}
      className="group block border border-border bg-card transition-colors hover:border-foreground/20"
      aria-label={`${name} — ${availLabel}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: '1 / 1' }}>
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
            <span className="font-mono text-xs uppercase tracking-widest">No image</span>
          </div>
        )}
        {discounted && (
          <span className="absolute left-0 top-0 bg-foreground px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-background">
            −{discountPct}%
          </span>
        )}
        {badge && !discounted && (
          <span className="absolute left-0 top-0 bg-foreground px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-background">
            {badge}
          </span>
        )}

        {/* Hover spec overlay — desktop only */}
        {specs && specs.length > 0 && (
          <div className="absolute inset-0 hidden translate-y-2 flex-col justify-end bg-background/95 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
            <ul className="space-y-1">
              {specs.slice(0, 3).map((s) => (
                <li key={s.label} className="flex items-baseline gap-2">
                  <span className="kicker shrink-0">{s.label}</span>
                  <span className="text-[11px] text-foreground">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="border-t border-border p-4">
        <p className="kicker mb-1">{brand}</p>
        <p className="min-h-[2.5rem] text-sm font-medium leading-snug">{name}</p>
        <div className="mt-2">
          <PriceTag price={price} compareAtPrice={compare_at_price} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${availClass}`}>
            {availLabel}
          </span>
          {variantCount > 0 && (
            <span className="font-mono text-[10px] text-muted-foreground">
              {variantCount} options
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
