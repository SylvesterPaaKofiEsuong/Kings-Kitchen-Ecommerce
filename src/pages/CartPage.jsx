import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatGHS } from '@/lib/format';
import QuantitySelector from '@/components/store/QuantitySelector';
import EmptyState from '@/components/store/EmptyState';

export default function CartPage() {
  const { items, updateQuantity, removeItem, count, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:px-8">
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />}
          kicker="Cart — 0 Items"
          title="Your order list is empty."
          description="Browse our catalogue of professional culinary equipment, appliances, and kitchen wear."
          action={
            <Link to="/shop" className="btn-primary mt-6">
              Browse the Catalog
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 md:px-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <p className="kicker">Order Assembly</p>
        <div className="mt-2 flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Shopping Cart
          </h1>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {count} {count === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Line Items */}
        <div className="lg:col-span-8">
          <div className="border border-border bg-card">
            <div className="hidden border-b border-border px-6 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:grid md:grid-cols-12">
              <span className="col-span-6">Item Specification</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-3 text-right">Price</span>
            </div>

            <div className="divide-y divide-border">
              {items.map((item) => (
                <div
                  key={item.key || `${item.product_id}-${item.variation}`}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center md:grid md:grid-cols-12 md:gap-4 md:p-6"
                >
                  {/* Thumbnail + Details */}
                  <div className="flex items-center gap-4 sm:flex-1 md:col-span-6">
                    <Link
                      to={`/product/${item.slug || ''}`}
                      className="h-20 w-20 shrink-0 overflow-hidden border border-border bg-muted transition-opacity hover:opacity-80"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <p className="kicker text-[9px]">{item.brand}</p>
                      <Link
                        to={`/product/${item.slug || ''}`}
                        className="truncate font-body text-sm font-medium text-foreground hover:underline"
                      >
                        {item.name}
                      </Link>
                      {item.variation && (
                        <p className="mt-1 font-mono text-[11px] text-[#2D4B73]">
                          {item.variation}
                        </p>
                      )}
                      <p className="mt-1 font-mono text-xs text-muted-foreground md:hidden">
                        {formatGHS(item.unit_price)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper + Remove */}
                  <div className="flex items-center justify-between sm:justify-center md:col-span-3">
                    <div className="flex items-center gap-3">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.key, qty)}
                        min={1}
                        max={item.stock}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  {/* Total line price */}
                  <div className="text-right md:col-span-3">
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {formatGHS(item.unit_price * item.quantity)}
                    </p>
                    <p className="hidden font-mono text-[10px] text-muted-foreground md:block">
                      {formatGHS(item.unit_price)} ea
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 border border-border bg-card p-6">
            <p className="kicker mb-4">Summary</p>
            <h2 className="font-display text-xl font-medium tracking-tight">Order Details</h2>

            <dl className="mt-6 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal ({count} units)</dt>
                <dd className="font-medium text-foreground">{formatGHS(subtotal)}</dd>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <dt>Fulfilment</dt>
                <dd className="text-muted-foreground">Calculated at checkout</dd>
              </div>

              <div className="border-t border-border pt-4 flex items-baseline justify-between">
                <dt className="font-mono text-sm font-semibold uppercase text-foreground">Total</dt>
                <dd className="font-display text-2xl font-semibold text-foreground">
                  {formatGHS(subtotal)}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="btn-primary mt-8 w-full py-4 text-xs font-semibold"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-6 space-y-2 border-t border-border pt-4 font-mono text-[10px] text-muted-foreground">
              <p>• Delivery fee flat GHS 40 across Accra</p>
              <p>• Free arranged pickup nationwide</p>
              <p>• Secure payment via Paystack (Cards & MoMo)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
