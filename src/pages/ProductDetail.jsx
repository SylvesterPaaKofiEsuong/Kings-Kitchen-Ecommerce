import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProductBySlug } from '@/lib/store-data';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/lib/toast-context';
import { formatGHS } from '@/lib/format';
import PriceTag from '@/components/store/PriceTag';
import QuantitySelector from '@/components/store/QuantitySelector';
import EmptyState from '@/components/store/EmptyState';
import { DetailSkeleton } from '@/components/store/Skeletons';
import { PackageOpen } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    getProductBySlug(slug).then((p) => {
      setProduct(p);
      if (p?.variations) {
        const defaults = {};
        p.variations.forEach((v) => {
          const firstAvail = v.options?.find((o) => (o.stock ?? 0) > 0) || v.options?.[0];
          if (firstAvail) defaults[v.name] = firstAvail.label;
        });
        setSelected(defaults);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-6">
        <EmptyState
          icon={<PackageOpen />}
          kicker="404 — Not Found"
          title="Product not found."
          description="This product may have been removed or the URL is incorrect."
          action={<Link to="/shop" className="btn-primary">Browse Catalog</Link>}
        />
      </div>
    );
  }

  const { name, brand, price, compare_at_price, stock, images = [], specs = [], variations = [], description } = product;

  // Compute active price and stock from selected variations
  const activePrice = variations.reduce((sum, v) => {
    const opt = v.options?.find((o) => o.label === selected[v.name]);
    return sum + (opt?.price_delta || 0);
  }, price);

  const activeStock = variations.length
    ? Math.min(
        ...variations.map((v) => {
          const opt = v.options?.find((o) => o.label === selected[v.name]);
          return opt?.stock ?? 0;
        })
      )
    : stock ?? 0;

  const variationLabel = variations.map((v) => `${v.name}: ${selected[v.name]}`).join(' · ');

  const doAddToCart = () => {
    addItem({
      product_id: product.id,
      slug,
      name,
      brand,
      image: images[0] || '',
      variation: variationLabel,
      unit_price: activePrice,
      quantity: qty,
      stock: activeStock,
    });
    toast({ title: 'Added to your order', description: `${name}${variationLabel ? ` — ${variationLabel}` : ''}` });
  };

  const handleBuyNow = () => {
    doAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category_slug}`} className="hover:text-foreground capitalize">
          {product.category_slug.replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left — images + info */}
        <div className="md:col-span-7 space-y-6">
          {/* Main image */}
          <div className="border border-border bg-muted" style={{ aspectRatio: '4/3' }}>
            {images[mainImage] ? (
              <img
                src={images[mainImage]}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                <span className="font-mono text-xs uppercase tracking-widest">No image</span>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`h-16 w-16 border overflow-hidden ${i === mainImage ? 'border-foreground' : 'border-border'}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description + Specs */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {description && (
              <div>
                <p className="kicker mb-3">Overview</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            )}
            {specs.length > 0 && (
              <div>
                <p className="kicker mb-3">Specifications</p>
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((s) => (
                      <tr key={s.label} className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground w-1/3">{s.label}</td>
                        <td className="py-2 text-foreground">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right — sticky control panel */}
        <div className="md:col-span-5">
          <div className="sticky top-24 space-y-5">
            <div>
              <p className="kicker mb-2">{brand}</p>
              <h1 className="font-display text-3xl font-medium leading-tight tracking-tight">{name}</h1>
            </div>

            <PriceTag price={activePrice} compareAtPrice={compare_at_price} large />

            {/* Stock */}
            <p className={`font-mono text-[11px] uppercase tracking-[0.15em] ${
              activeStock > 5 ? 'text-[#2D4B73]' : activeStock > 0 ? 'text-amber-800 dark:text-amber-400' : 'text-muted-foreground'
            }`}>
              {activeStock > 5
                ? `In stock — ${activeStock} units`
                : activeStock > 0
                ? `Low stock — only ${activeStock} left`
                : 'Out of stock'}
            </p>

            {/* Variations */}
            {variations.map((v) => (
              <div key={v.name}>
                <p className="kicker mb-2">{v.name}</p>
                <div className="flex flex-wrap gap-2">
                  {v.options?.map((opt) => {
                    const isSelected = selected[v.name] === opt.label;
                    const isOOS = (opt.stock ?? 0) === 0;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        disabled={isOOS}
                        onClick={() => setSelected((s) => ({ ...s, [v.name]: opt.label }))}
                        className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                          isSelected
                            ? 'border-foreground bg-foreground text-background'
                            : isOOS
                            ? 'border-border text-muted-foreground opacity-30 cursor-not-allowed'
                            : 'border-border text-foreground hover:border-foreground'
                        }`}
                      >
                        {opt.label}
                        {opt.price_delta > 0 && ` +${formatGHS(opt.price_delta)}`}
                        {opt.price_delta < 0 && ` −${formatGHS(Math.abs(opt.price_delta))}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <p className="kicker mb-2">Quantity</p>
              <QuantitySelector
                value={qty}
                onChange={(v) => setQty(Math.min(Math.max(1, v), activeStock || 1))}
                min={1}
                max={activeStock || 1}
              />
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={activeStock === 0}
                onClick={doAddToCart}
                className="btn-primary w-full"
              >
                Add to Order — {formatGHS(activePrice * qty)}
              </button>
              <button
                type="button"
                disabled={activeStock === 0}
                onClick={handleBuyNow}
                className="btn-outline w-full"
              >
                Buy Now
              </button>
            </div>

            {/* Footnote */}
            <div className="border-t border-border pt-4 space-y-1">
              <p className="font-mono text-[10px] text-muted-foreground">
                🚚 Courier delivery within Accra — GHS 40.00 flat (1–3 working days)
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                📦 Arranged pickup available nationwide — free, we confirm the point
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
