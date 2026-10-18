import React, { useState } from 'react';
import { Truck, MapPin } from 'lucide-react';
import { formatGHS } from '@/lib/format';
import { DELIVERY_FEE } from '@/lib/store-data';

const PICKUP_POINTS = [
  'Osu Pickup Point — Accra Central',
  'Tema Pickup Point — Community 1',
  'Kumasi Pickup Point — Adum',
  'Takoradi Pickup Point — Market Circle',
];

export default function StepFulfilment({
  fulfillmentType,
  deliveryAddress,
  pickupLocation,
  orderNote,
  onChange,
  onNext,
  onBack,
  savedAddresses = [],
}) {
  const [error, setError] = useState('');

  const isDelivery = fulfillmentType === 'accra_delivery';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isDelivery && !deliveryAddress?.trim()) {
      setError('Please provide a complete delivery address in Accra.');
      return;
    }
    if (!isDelivery && !pickupLocation) {
      setError('Please select a pickup point.');
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="kicker mb-2">Step 02 — Fulfilment Method</p>
        <h2 className="font-display text-2xl font-medium tracking-tight">How should this order reach you?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select between direct courier dispatch across Greater Accra or arranged nationwide pickup.
        </p>
      </div>

      {/* Method selector cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label
          className={`flex cursor-pointer flex-col justify-between border p-5 transition-colors ${
            isDelivery
              ? 'border-foreground bg-secondary/50'
              : 'border-border bg-card hover:border-foreground/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="fulfillment"
                checked={isDelivery}
                onChange={() => onChange({ fulfillmentType: 'accra_delivery' })}
                className="mt-0.5"
              />
              <div>
                <p className="font-mono text-sm font-medium uppercase tracking-wide">
                  Courier Delivery
                </p>
                <p className="text-xs text-muted-foreground">Within Greater Accra</p>
              </div>
            </div>
            <Truck className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <p className="font-mono text-xs font-semibold text-[#2D4B73]">
              {formatGHS(DELIVERY_FEE)}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Direct delivery to your doorstep · 1–3 business days
            </p>
          </div>
        </label>

        <label
          className={`flex cursor-pointer flex-col justify-between border p-5 transition-colors ${
            !isDelivery
              ? 'border-foreground bg-secondary/50'
              : 'border-border bg-card hover:border-foreground/40'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="fulfillment"
                checked={!isDelivery}
                onChange={() =>
                  onChange({
                    fulfillmentType: 'pickup',
                    pickupLocation: pickupLocation || PICKUP_POINTS[0],
                  })
                }
                className="mt-0.5"
              />
              <div>
                <p className="font-mono text-sm font-medium uppercase tracking-wide">
                  Arranged Pickup
                </p>
                <p className="text-xs text-muted-foreground">Across Ghana</p>
              </div>
            </div>
            <MapPin className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <p className="font-mono text-xs font-semibold text-[#2D4B73]">
              FREE
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Ready for collection after team confirmation
            </p>
          </div>
        </label>
      </div>

      {/* Details based on selection */}
      {isDelivery ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="delivery-address" className="field-label mb-0">
              Delivery Address (Accra) *
            </label>
            {savedAddresses.length > 0 && (
              <span className="font-mono text-[10px] text-muted-foreground">
                Saved addresses available
              </span>
            )}
          </div>

          {savedAddresses.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {savedAddresses.map((addr) => (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => onChange({ deliveryAddress: addr.address })}
                  className="border border-border bg-card px-2.5 py-1 text-left font-mono text-[10px] uppercase tracking-wide hover:border-foreground"
                >
                  Use: {addr.label}
                </button>
              ))}
            </div>
          )}

          <textarea
            id="delivery-address"
            rows={3}
            required
            value={deliveryAddress || ''}
            onChange={(e) => onChange({ deliveryAddress: e.target.value })}
            placeholder="House/Apartment number, street name, landmark, neighbourhood (e.g. Cantonments, East Legon, Airport Residential)"
            className="field-input resize-none"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <label htmlFor="pickup-point" className="field-label mb-0">
            Select Pickup Location *
          </label>
          <select
            id="pickup-point"
            value={pickupLocation || PICKUP_POINTS[0]}
            onChange={(e) => onChange({ pickupLocation: e.target.value })}
            className="field-input bg-card"
          >
            {PICKUP_POINTS.map((point) => (
              <option key={point} value={point}>
                {point}
              </option>
            ))}
          </select>
          <p className="font-mono text-[10px] text-muted-foreground">
            Our team will contact you directly to agree on pickup scheduling once ready.
          </p>
        </div>
      )}

      {/* Order note */}
      <div>
        <label htmlFor="order-note" className="field-label">
          Order Note (Optional)
        </label>
        <textarea
          id="order-note"
          rows={2}
          value={orderNote || ''}
          onChange={(e) => onChange({ orderNote: e.target.value })}
          placeholder="Any special handling instructions, culinary equipment requirements, or delivery notes"
          className="field-input resize-none"
        />
      </div>

      {error && (
        <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between pt-4">
        <button type="button" onClick={onBack} className="btn-outline">
          ← Back
        </button>
        <button type="submit" className="btn-primary">
          Review Order →
        </button>
      </div>
    </form>
  );
}
