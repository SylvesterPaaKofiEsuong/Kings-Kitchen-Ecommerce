import React from 'react';

const PRICE_PRESETS = [
  { label: 'All', value: '' },
  { label: 'Under GHS 500', value: '500' },
  { label: 'Under GHS 1,500', value: '1500' },
  { label: 'Under GHS 5,000', value: '5000' },
];

export default function FilterPanel({
  categories = [],
  brands = [],
  selectedCategory,
  selectedBrands = [],
  selectedMaxPrice,
  inStock,
  onCategory,
  onBrand,
  onMaxPrice,
  onInStock,
  onDone,
}) {
  return (
    <aside aria-label="Product filters" className="space-y-8">
      {/* Category */}
      <div>
        <p className="kicker mb-3">Category</p>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onCategory('')}
              className={`w-full text-left py-1 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                !selectedCategory
                  ? 'border-l-2 border-foreground pl-3 font-medium text-foreground'
                  : 'pl-3 text-muted-foreground hover:text-foreground'
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => onCategory(c.slug)}
                className={`w-full text-left py-1 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  selectedCategory === c.slug
                    ? 'border-l-2 border-foreground pl-3 font-medium text-foreground'
                    : 'pl-3 text-muted-foreground hover:text-foreground'
                }`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <p className="kicker mb-3">Brand</p>
          <ul className="space-y-2">
            {brands.map((brand) => (
              <li key={brand} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrand(brand)}
                  className="h-3.5 w-3.5 accent-foreground"
                />
                <label htmlFor={`brand-${brand}`} className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground cursor-pointer">
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price */}
      <div>
        <p className="kicker mb-3">Price</p>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => onMaxPrice(value)}
              className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${
                selectedMaxPrice === value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="kicker mb-3">Availability</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStock(e.target.checked)}
            className="h-3.5 w-3.5 accent-foreground"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground">In stock only</span>
        </label>
      </div>

      {onDone && (
        <button type="button" onClick={onDone} className="btn-primary w-full">
          Show Results
        </button>
      )}
    </aside>
  );
}
