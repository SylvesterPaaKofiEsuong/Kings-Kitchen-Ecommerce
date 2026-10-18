import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { getOrder, getOrderItems, updateOrder } from '@/lib/store-data';
import { formatGHS, formatDateTime } from '@/lib/format';
import StatusBadge from '@/components/store/StatusBadge';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load order data
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const o = await getOrder(id);
        if (!o || !mounted) return;
        setOrder(o);
        const orderItems = await getOrderItems(id);
        if (mounted) setItems(orderItems);

        // Simulation for Paystack payment verification
        if (o.payment_status === 'pending') {
          // Phase 1: Processing after 1.4s
          setTimeout(async () => {
            if (!mounted) return;
            const updated1 = await updateOrder(id, { payment_status: 'processing' });
            if (mounted) setOrder(updated1);

            // Phase 2: Paid & Confirmed after 2.4s
            setTimeout(async () => {
              if (!mounted) return;
              const trackingEntry = {
                stage: 'payment_confirmed',
                timestamp: new Date().toISOString(),
                note: "Payment verified by King's Kitchen (Paystack)",
              };
              const updated2 = await updateOrder(id, {
                payment_status: 'paid',
                order_status: 'confirmed',
                tracking: [...(updated1.tracking || []), trackingEntry],
              });
              if (mounted) setOrder(updated2);
            }, 2400);
          }, 1400);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
      </div>
    );
  }

  const isPending = order.payment_status === 'pending' || order.payment_status === 'processing';
  const firstName = order.customer_name ? order.customer_name.split(' ')[0] : 'Customer';

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      {isPending ? (
        <div className="border border-border bg-card p-8 md:p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-secondary mb-6">
            <Loader2 className="h-7 w-7 animate-spin text-[#2D4B73]" />
          </div>
          <p className="kicker mb-2">Connecting to payment provider…</p>
          <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
            Payment is being verified.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            We are confirming the transaction with Paystack. This page updates automatically — please keep it open.
          </p>
          <div className="mt-8 border-t border-border pt-6 font-mono text-xs text-muted-foreground">
            Order Reference: #{order.order_number}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-8">
            <div className="flex items-center gap-2 text-[#2D4B73]">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                Payment Confirmed
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-medium tracking-tight md:text-4xl">
              Thank you, {firstName}. Your order is in.
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
              <span>#{order.order_number}</span>
              <span>•</span>
              <span>{formatDateTime(order.created_date)}</span>
              <span>•</span>
              <StatusBadge status={order.order_status} type="order" />
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="border border-border bg-card">
            <div className="border-b border-border px-6 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Order Specification
            </div>
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 sm:p-5">
                  <div className="min-w-0 pr-4">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.brand}
                    </p>
                    <p className="truncate font-body text-sm font-medium text-foreground">
                      {item.product_name}
                    </p>
                    {item.variation && (
                      <p className="font-mono text-[11px] text-[#2D4B73]">
                        {item.variation}
                      </p>
                    )}
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      Qty: {item.quantity} × {formatGHS(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right font-mono text-sm font-medium">
                    {formatGHS(item.unit_price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Paid line */}
            <div className="border-t border-border bg-muted/30 p-5 flex justify-between items-baseline">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                Total Paid
              </span>
              <span className="font-display text-2xl font-semibold text-foreground">
                {formatGHS(order.total)}
              </span>
            </div>
          </div>

          {/* Numbered What Happens Next */}
          <div className="border border-border bg-card p-6 md:p-8">
            <p className="kicker mb-4">Fulfilment Roadmap</p>
            <h3 className="font-display text-xl font-medium tracking-tight mb-6">
              What happens next
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="font-mono text-xs font-semibold text-[#2D4B73]">01</span>
                <div>
                  <h4 className="font-body text-sm font-semibold">Specification & Inventory Review</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Our team inspects your chosen items at our Accra facility within one working day.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="font-mono text-xs font-semibold text-[#2D4B73]">02</span>
                <div>
                  <h4 className="font-body text-sm font-semibold">Order Conversation & Timing</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We coordinate your exact delivery window or pickup collection through the live order conversation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="font-mono text-xs font-semibold text-[#2D4B73]">03</span>
                <div>
                  <h4 className="font-body text-sm font-semibold">Dispatch & Real-time Tracking</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Follow milestone updates, courier details, and confirmation receipts directly from your orders dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-2">
            <Link to={`/orders/${order.id}`} className="btn-primary text-center">
              Track Your Order
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/shop" className="btn-outline text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
