import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Save, X, Layers } from 'lucide-react';
import { getCategories, createCategory, updateCategory } from '@/lib/store-data';
import { useToast } from '@/lib/toast-context';
import ImageUpload from '@/components/admin/ImageUpload';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    sort_order: 1,
    description: '',
    image_url: '',
  });

  const loadData = async () => {
    const cats = await getCategories();
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const startCreate = () => {
    setEditingId('new');
    setForm({
      name: '',
      slug: '',
      sort_order: categories.length + 1,
      description: '',
      image_url: '',
    });
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      sort_order: cat.sort_order ?? 1,
      description: cat.description || '',
      image_url: cat.image_url || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    const finalSlug = form.slug.trim() || slugify(form.name);

    const payload = {
      name: form.name.trim(),
      slug: finalSlug,
      sort_order: Number(form.sort_order) || 1,
      description: form.description.trim(),
      image_url: form.image_url.trim(),
    };

    try {
      if (editingId === 'new') {
        const created = await createCategory(payload);
        setCategories((prev) => [...prev, created].sort((a, b) => a.sort_order - b.sort_order));
        toast({ title: 'Category Created', description: `${payload.name} added.` });
      } else {
        const updated = await updateCategory(editingId, payload);
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? updated : c)).sort((a, b) => a.sort_order - b.sort_order)
        );
        toast({ title: 'Category Updated', description: `${payload.name} updated.` });
      }
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="h-64 border border-border bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="kicker">Department Architecture</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
            Categories ({categories.length})
          </h1>
        </div>

        {!editingId && (
          <button type="button" onClick={startCreate} className="btn-primary py-2 px-4 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add Category
          </button>
        )}
      </div>

      {/* Editor Form */}
      {editingId && (
        <form onSubmit={handleSave} className="border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="kicker mb-0">
              {editingId === 'new' ? 'New Department' : 'Edit Category'}
            </p>
            <button
              type="button"
              onClick={handleCancel}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="field-label">Category Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => {
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: editingId === 'new' && !form.slug ? slugify(e.target.value) : form.slug,
                  });
                }}
                placeholder="Kitchen Electronics"
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div>
            <label className="field-label">URL Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="kitchen-electronics"
              className="field-input font-mono text-xs"
            />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Department brief for the category grid..."
              className="field-input resize-none"
            />
          </div>

          <ImageUpload
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <button type="button" onClick={handleCancel} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Saving…' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      <div className="border border-border bg-card divide-y divide-border">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden border border-border bg-muted">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                    <Layers className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#2D4B73]">
                    0{cat.sort_order}
                  </span>
                  <h3 className="font-medium text-foreground">{cat.name}</h3>
                </div>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  /{cat.slug}
                </p>
                {cat.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => startEdit(cat)}
              className="btn-outline py-1.5 px-3 text-xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
