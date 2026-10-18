import React from 'react';
import { formatDateTime } from '@/lib/format';

const FLOWS = {
  accra_delivery: [
    ['order_placed', 'Order Placed'],
    ['payment_confirmed', 'Payment Confirmed'],
    ['delivery_arranging', 'Delivery Arranging'],
    ['delivery_confirmed', 'Delivery Confirmed'],
    ['dispatched', 'Dispatched'],
    ['out_for_delivery', 'Out for Delivery'],
    ['delivered', 'Delivered'],
  ],
  pickup: [
    ['order_placed', 'Order Placed'],
    ['payment_confirmed', 'Payment Confirmed'],
    ['pickup_arranging', 'Pickup Arranging'],
    ['ready_for_pickup', 'Ready for Pickup'],
    ['picked_up', 'Picked Up'],
  ],
};

export default function TrackingTimeline({ order }) {
  const flow = FLOWS[order.fulfillment_type] || FLOWS.accra_delivery;
  const trackingMap = {};
  (order.tracking || []).forEach((t) => { trackingMap[t.stage] = t; });

  // Find the last completed stage index
  let lastDoneIdx = -1;
  flow.forEach(([stage], idx) => {
    if (trackingMap[stage]) lastDoneIdx = idx;
  });

  return (
    <div className="space-y-0">
      <p className="kicker mb-4">Tracking</p>
      <ol className="space-y-4">
        {flow.map(([stage, label], idx) => {
          const entry = trackingMap[stage];
          const isDone = !!entry;
          const isCurrent = idx === lastDoneIdx;
          const isFuture = idx > lastDoneIdx;

          return (
            <li key={stage} className="flex gap-4">
              {/* Dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`h-3 w-3 rounded-full border-2 transition-colors ${
                    isDone
                      ? isCurrent
                        ? 'border-[#2D4B73] bg-[#2D4B73]'
                        : 'border-foreground bg-foreground'
                      : 'border-border bg-background'
                  }`}
                />
                {idx < flow.length - 1 && (
                  <div className={`mt-1 h-full w-px ${isDone && !isCurrent ? 'bg-foreground' : 'bg-border'}`} style={{ minHeight: '1.5rem' }} />
                )}
              </div>

              {/* Content */}
              <div className="pb-4">
                <p
                  className={`font-mono text-[11px] uppercase tracking-[0.15em] ${
                    isFuture ? 'text-muted-foreground' : isCurrent ? 'text-[#2D4B73]' : 'text-foreground'
                  }`}
                >
                  {label}
                </p>
                {entry && (
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {formatDateTime(entry.timestamp)}
                    {entry.note && ` — ${entry.note}`}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
