import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getProduct, createProduct, updateProduct, getCategories } from '@/lib/store-data';
import { useToast } from '@/lib/toast-context';
import ImageUpload from '@/components/admin/ImageUpload';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [slug, setSlug] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [specsText, setSpecsText] = useState('');
  const [variationsText, setVariationsText] = useState('');

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      if (isNew && cats.length > 0) {
        setCategorySlug(cats[0].slug);
      }
    });

    if (!isNew) {
      getProduct(id).then((p) => {
        if (!p) {
          setError('Product not found.');
          setLoading(false);
          return;
        }
        setName(p.name || '');
        setBrand(p.brand || '');
        setSlug(p.slug || '');
        setCategorySlug(p.category_slug || '');
        setPrice(p.price !== undefined ? String(p.price) : '');
        setCompareAtPrice(p.compare_at_price ? String(p.compare_at_price) : '');
        setStock(p.stock !== undefined ? String(p.stock) : '0');
        setFeatured(Boolean(p.featured));
        setImage(p.images?.[0] || '');
        setDescription(p.description || '');

        if (Array.isArray(p.specs)) {
          setSpecsText(p.specs.map((s) => `${s.label}: ${s.value}`).join('\n'));
        }
        if (Array.isArray(p.variations) && p.variations.length > 0) {
          setVariationsText(JSON.stringify(p.variations, null, 2));
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!price || isNaN(Number(price))) {
      setError('Valid price is required.');
      return;
    }

    // Parse specs
    const specs = specsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(':');
        return {
          label: parts[0]?.trim() || '',
          value: parts.slice(1).join(':')?.trim() || '',
        };
      })
      .filter((s) => s.label && s.value);

    // Parse variations JSON
    let variations = [];
    if (variationsText.trim()) {
      try {
        variations = JSON.parse(variationsText);
        if (!Array.isArray(variations)) throw new Error('Variations must be a JSON array.');
      } catch (err) {
        setError(`Variations JSON error: ${err.message}`);
        return;
      }
    }

    const finalSlug = slug.trim() || slugify(name);

    const payload = {
      name: name.trim(),
      brand: brand.trim(),
      slug: finalSlug,
      category_slug: categorySlug,
      price: Number(price),
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      stock: Number(stock) || 0,
      featured,
      description: description.trim(),
      images: image ? [image] : [],
      specs,
      variations,
    };

    setSaving(true);
    try {
      if (isNew) {
        await createProduct(payload);
        toast({ title: 'Product Created', description: `${payload.name} added to catalog.` });
      } else {
        await updateProduct(id, payload);
        toast({ title: 'Product Updated', description: `${payload.name} updated.` });
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="h-96 border border-border bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Bar */}
      <div>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to products
        </Link>
      </div>

      <div>
        <p className="kicker">{isNew ? 'Catalog Expansion' : 'Catalog Management'}</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          {isNew ? 'New Product' : `Edit: ${name}`}
        </h1>
      </div>

      {error && (
        <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="border border-border bg-card p-6 md:p-8 space-y-6">
        {/* Basic Info */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="prod-name" className="field-label">Product Name *</label>
            <input
              id="prod-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (isNew && !slug) setSlug(slugify(e.target.value));
              }}
              placeholder="Vitapro Vortex 1500W Blender"
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="prod-brand" className="field-label">Brand</label>
            <input
              id="prod-brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Vitapro"
              className="field-input"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="prod-slug" className="field-label">URL Slug</label>
            <input
              id="prod-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="vitapro-vortex-1500-blender"
              className="field-input font-mono text-xs"
            />
          </div>

          <div>
            <label htmlFor="prod-category" className="field-label">Department / Category *</label>
            <select
              id="prod-category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="field-input bg-card"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="prod-price" className="field-label">Price (GHS) *</label>
            <input
              id="prod-price"
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1850"
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="prod-compare" className="field-label">Compare-at Price (GHS)</label>
            <input
              id="prod-compare"
              type="number"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="2150"
              className="field-input"
            />
          </div>

          <div>
            <label htmlFor="prod-stock" className="field-label">Base Stock Quantity *</label>
            <input
              id="prod-stock"
              type="number"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="10"
              className="field-input"
            />
          </div>
        </div>

        {/* Featured checkbox */}
        <div className="flex items-center gap-2">
          <input
            id="prod-featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="prod-featured" className="text-sm font-medium text-foreground cursor-pointer">
            Feature this product on homepage and exhibition gallery
          </label>
        </div>

        {/* Image Uploader */}
        <ImageUpload value={image} onChange={setImage} />

        {/* Description */}
        <div>
          <label htmlFor="prod-desc" className="field-label">Description</label>
          <textarea
            id="prod-desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A 1,500-watt commercial-duty motor with a hardened steel blade system..."
            className="field-input resize-none"
          />
        </div>

        {/* Specifications textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="prod-specs" className="field-label mb-0">
              Technical Specifications (One per line: &ldquo;Label: Value&rdquo;)
            </label>
            <span className="font-mono text-[10px] text-muted-foreground">
              e.g. Motor: 1,500 W
            </span>
          </div>
          <textarea
            id="prod-specs"
            rows={5}
            value={specsText}
            onChange={(e) => setSpecsText(e.target.value)}
            placeholder="Motor: 1,500 W&#10;Jar: Borosilicate glass, 2.0 L&#10;Speeds: 10 + pulse&#10;Warranty: 2 years"
            className="field-input font-mono text-xs resize-none"
          />
        </div>

        {/* Variations textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="prod-vars" className="field-label mb-0">
              Variations (JSON Array)
            </label>
            <span className="font-mono text-[10px] text-muted-foreground">
              Optional variation groups
            </span>
          </div>
          <textarea
            id="prod-vars"
            rows={5}
            value={variationsText}
            onChange={(e) => setVariationsText(e.target.value)}
            placeholder={`[\n  {\n    "name": "Capacity",\n    "options": [\n      { "label": "1.5 L", "price_delta": 0, "stock": 9 },\n      { "label": "2.0 L", "price_delta": 250, "stock": 4 }\n    ]\n  }\n]`}
            className="field-input font-mono text-xs resize-none"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link to="/admin/products" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Product
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
