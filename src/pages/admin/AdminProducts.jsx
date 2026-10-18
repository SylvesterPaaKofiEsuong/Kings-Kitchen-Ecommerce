import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, Check, Star } from 'lucide-react';
import { getProducts, deleteProduct, getCategories } from '@/lib/store-data';
import { formatGHS } from '@/lib/format';
import { useToast } from '@/lib/toast-context';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { toast } = useToast();

  const loadData = async () => {
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    toast({
      title: 'Product Deleted',
      description: `${name} has been removed from the catalog.`,
    });
  };

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category_slug?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const catMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.slug] = c.name;
    });
    return map;
  }, [categories]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="h-64 border border-border bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker">Catalog Inventory</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
            Products ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="field-input py-2 pl-9 text-xs w-48 sm:w-60"
            />
          </div>

          <Link to="/admin/products/new" className="btn-primary py-2 px-4 text-xs whitespace-nowrap">
            <Plus className="h-3.5 w-3.5" />
            New Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price (GHS)</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const isLowStock = (p.stock ?? 0) <= 3;

                return (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden border border-border bg-muted">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="kicker text-[9px]">{p.brand}</p>
                          <Link
                            to={`/admin/products/${p.id}`}
                            className="font-medium text-foreground hover:underline truncate block"
                          >
                            {p.name}
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {catMap[p.category_slug] || p.category_slug}
                    </td>

                    <td className="p-4 font-mono text-xs font-semibold text-foreground">
                      {formatGHS(p.price)}
                    </td>

                    <td className="p-4 font-mono text-xs">
                      <span className={isLowStock ? 'text-amber-800 dark:text-amber-400 font-semibold' : 'text-foreground'}>
                        {p.stock ?? 0} units
                      </span>
                    </td>

                    <td className="p-4">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#2D4B73]">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-muted-foreground/60">—</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="p-1.5 text-muted-foreground hover:text-foreground"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>

                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1 font-mono text-xs">
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id, p.name)}
                              className="text-destructive font-semibold hover:underline"
                            >
                              Confirm
                            </button>
                            <span className="text-muted-foreground">/</span>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-muted-foreground hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive"
                            aria-label={`Delete ${p.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
