import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getCategories, getProducts, filterProducts } from '@/lib/store-data';
import ProductCard from '@/components/store/ProductCard';
import FilterPanel from '@/components/store/FilterPanel';
import { ProductGridSkeleton } from '@/components/store/Skeletons';
import EmptyState from '@/components/store/EmptyState';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [localQ, setLocalQ] = useState(searchParams.get('q') || '');

  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'featured';
  const maxPrice = searchParams.get('max') || '';
  const inStock = searchParams.get('stock') === '1';
  const brands = (searchParams.get('brands') || '').split(',').filter(Boolean);

  useEffect(() => {
    getCategories().then(setCategories);
    getProducts().then(setAllProducts);
  }, []);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  const products = useMemo(() => {
    if (!allProducts) return null;
    return filterProducts(allProducts, { q, category, brands, maxPrice, inStock, sort });
  }, [allProducts, q, category, brands, maxPrice, inStock, sort]);

  const allBrands = useMemo(() => {
    if (!allProducts) return [];
    return [...new Set(allProducts.map((p) => p.brand))].sort();
  }, [allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParam('q', localQ);
  };

  const clearAll = () => {
    setSearchParams(new URLSearchParams());
    setLocalQ('');
  };

  const activeFilters = [
    q && { label: `"${q}"`, onRemove: () => { setParam('q', ''); setLocalQ(''); } },
    category && { label: categories.find((c) => c.slug === category)?.name || category, onRemove: () => setParam('category', '') },
    ...brands.map((b) => ({ label: b, onRemove: () => { const nb = brands.filter((x) => x !== b); setParam('brands', nb.join(',')); } })),
    maxPrice && { label: `Under GHS ${Number(maxPrice).toLocaleString()}`, onRemove: () => setParam('max', '') },
    inStock && { label: 'In Stock', onRemove: () => setParam('stock', '') },
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-6">
      {/* Header row */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="kicker">
            Catalog — {products ? `${products.length} product${products.length !== 1 ? 's' : ''}` : '…'}
          </p>
        </div>
        <form onSubmit={handleSearchSubmit} className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input
            id="shop-search"
            type="search"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Search products"
            className="h-10 w-full border border-input bg-background pl-9 pr-10 font-mono text-[11px] focus:border-foreground focus:outline-none"
            aria-label="Search products"
          />
          {localQ && (
            <button
              type="button"
              onClick={() => { setLocalQ(''); setParam('q', ''); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          )}
        </form>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
          className="h-10 border border-input bg-background px-3 font-mono text-[11px] focus:border-foreground focus:outline-none"
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price · Low to High</option>
          <option value="price_desc">Price · High to Low</option>
        </select>

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 border border-input h-10 px-4 font-mono text-[11px] uppercase tracking-[0.1em] md:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
          Filters
          {activeFilters.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center bg-foreground text-[9px] text-background">{activeFilters.length}</span>
          )}
        </button>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={f.onRemove}
              className="flex items-center gap-1.5 border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] hover:border-foreground"
            >
              {f.label}
              <X className="h-3 w-3" strokeWidth={1.5} />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop filter sidebar */}
        <div className="hidden w-56 shrink-0 md:block">
          <FilterPanel
            categories={categories}
            brands={allBrands}
            selectedCategory={category}
            selectedBrands={brands}
            selectedMaxPrice={maxPrice}
            inStock={inStock}
            onCategory={(v) => setParam('category', v)}
            onBrand={(b) => {
              const nb = brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b];
              setParam('brands', nb.join(','));
            }}
            onMaxPrice={(v) => setParam('max', v)}
            onInStock={(v) => setParam('stock', v ? '1' : '')}
          />
        </div>

        {/* Products grid */}
        <div className="flex-1">
          {products === null ? (
            <ProductGridSkeleton count={9} columns={3} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found."
              description="We couldn't find products matching your search or filters."
              action={
                <button type="button" onClick={clearAll} className="btn-primary">
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-background/80" onClick={() => setShowFilters(false)} />
          <div className="relative ml-0 h-full w-72 overflow-y-auto border-r border-border bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em]">Filters</p>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <FilterPanel
              categories={categories}
              brands={allBrands}
              selectedCategory={category}
              selectedBrands={brands}
              selectedMaxPrice={maxPrice}
              inStock={inStock}
              onCategory={(v) => setParam('category', v)}
              onBrand={(b) => {
                const nb = brands.includes(b) ? brands.filter((x) => x !== b) : [...brands, b];
                setParam('brands', nb.join(','));
              }}
              onMaxPrice={(v) => setParam('max', v)}
              onInStock={(v) => setParam('stock', v ? '1' : '')}
              onDone={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
