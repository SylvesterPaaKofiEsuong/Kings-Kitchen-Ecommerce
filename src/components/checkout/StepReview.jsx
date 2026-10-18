import React from 'react';
import { formatGHS } from '@/lib/format';
import { DELIVERY_FEE } from '@/lib/store-data';

export default function StepReview({
  items,
  customer,
  fulfillmentType,
  deliveryAddress,
  pickupLocation,
  orderNote,
  onBack,
  onNext,
  onEditStep,
}) {
  const isDelivery = fulfillmentType === 'accra_delivery';
  const shippingFee = isDelivery ? DELIVERY_FEE : 0;
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const total = subtotal + shippingFee;

  return (
    <div className="space-y-8">
      <div>
        <p className="kicker mb-2">Step 03 — Order Review</p>
        <h2 className="font-display text-2xl font-medium tracking-tight">Review order specifications</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Please verify your items, fulfilment preferences, and contact details before payment.
        </p>
      </div>

      {/* Items list */}
      <div className="border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <p className="kicker">Items ({items.length})</p>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.key || item.product_id} className="flex items-center gap-4 p-4 sm:p-5">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-border bg-muted">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.brand}
                </p>
                <h4 className="truncate font-body text-sm font-medium text-foreground">
                  {item.name}
                </h4>
                {item.variation && (
                  <p className="mt-0.5 font-mono text-[11px] text-[#2D4B73]">
                    {item.variation}
                  </p>
                )}
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  Qty: {item.quantity} × {formatGHS(item.unit_price)}
                </p>
              </div>

              <div className="text-right">
                <p className="font-mono text-sm font-medium">
                  {formatGHS(item.unit_price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recaps grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Recap */}
        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="kicker">Recipient</p>
            <button
              type="button"
              onClick={() => onEditStep(0)}
              className="font-mono text-[11px] text-[#2D4B73] hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="mt-4 space-y-1.5 text-sm">
            <p className="font-medium text-foreground">{customer.name}</p>
            <p className="font-mono text-xs text-muted-foreground">{customer.phone}</p>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        {/* Fulfilment Recap */}
        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="kicker">Fulfilment</p>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="font-mono text-[11px] text-[#2D4B73] hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="mt-4 space-y-1.5 text-sm">
            <p className="font-mono text-xs uppercase tracking-wider text-[#2D4B73]">
              {isDelivery ? 'Courier Delivery (Accra)' : 'Arranged Pickup'}
            </p>
            <p className="text-foreground">
              {isDelivery ? deliveryAddress : pickupLocation}
            </p>
          </div>
        </div>
      </div>

      {/* Note if present */}
      {orderNote && (
        <div className="border-l-2 border-foreground bg-muted/40 p-4">
          <p className="kicker mb-1">Customer Note</p>
          <p className="text-sm italic text-foreground">{orderNote}</p>
        </div>
      )}

      {/* Financial Summary */}
      <div className="border border-border bg-card p-5">
        <p className="kicker mb-4">Payment Summary</p>
        <dl className="space-y-3 font-mono text-xs">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal</dt>
            <dd className="text-foreground">{formatGHS(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Fulfilment ({isDelivery ? 'Courier' : 'Pickup'})</dt>
            <dd className="text-foreground">{isDelivery ? formatGHS(shippingFee) : 'Free'}</dd>
          </div>
          <div className="border-t border-border pt-3 flex items-baseline justify-between">
            <dt className="font-mono text-sm font-semibold uppercase text-foreground">Total</dt>
            <dd className="font-display text-2xl font-semibold text-foreground">{formatGHS(total)}</dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-outline">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary">
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}
