import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Truck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getOrder, getOrderItems } from '@/lib/store-data';
import { formatGHS, formatDate, formatDateTime } from '@/lib/format';
import StatusBadge from '@/components/store/StatusBadge';
import TrackingTimeline from '@/components/store/TrackingTimeline';
import OrderConversation from '@/components/store/OrderConversation';
import EmptyState from '@/components/store/EmptyState';

export default function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const o = await getOrder(id);
        if (!o || !mounted) {
          setOrder(null);
          return;
        }

        // Ownership gate: viewer must be admin, or creator, or matching email
        const isOwner =
          user?.role === 'admin' ||
          o.created_by_id === user?.id ||
          (o.customer_email || '').toLowerCase() === (user?.email || '').toLowerCase();

        if (isOwner) {
          setOrder(o);
          const oItems = await getOrderItems(id);
          if (mounted) setItems(oItems);
        } else {
          setOrder(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-8">
        <div className="h-8 w-48 bg-muted animate-pulse mb-8" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="h-96 bg-card border border-border animate-pulse lg:col-span-7" />
          <div className="h-96 bg-card border border-border animate-pulse lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 md:px-8">
        <EmptyState
          icon={<Package className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />}
          kicker="Error 404"
          title="Order not found"
          description="We could not find an order matching this identifier associated with your account."
          action={
            <Link to="/orders" className="btn-primary mt-6">
              ← Back to Your Orders
            </Link>
          }
        />
      </div>
    );
  }

  const isDelivery = order.fulfillment_type === 'accra_delivery';

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all orders
        </Link>
      </div>

      {/* Header with 3 badges */}
      <div className="border-y border-border py-6 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker">Order Specification</p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">
              #{order.order_number}
            </h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Placed on {formatDateTime(order.created_date)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge status={order.order_status} type="order" />
            <StatusBadge status={order.payment_status} type="payment" />
            <StatusBadge status={order.delivery_status} type="delivery" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left 7 cols, Right 5 cols */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Items, Summary, Logistics */}
        <div className="space-y-6 lg:col-span-7">
          {/* Items Table */}
          <div className="border border-border bg-card">
            <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Ordered Items ({items.length})
            </div>
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="h-16 w-16 shrink-0 overflow-hidden border border-border bg-muted">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="kicker text-[9px]">{item.brand}</p>
                    <p className="truncate font-body text-sm font-medium text-foreground">
                      {item.product_name}
                    </p>
                    {item.variation && (
                      <p className="mt-0.5 font-mono text-[11px] text-[#2D4B73]">
                        {item.variation}
                      </p>
                    )}
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {item.quantity} × {formatGHS(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right font-mono text-sm font-medium">
                    {formatGHS(item.unit_price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Note if present */}
          {order.order_note && (
            <div className="border-l-2 border-foreground bg-muted/30 p-4">
              <p className="kicker mb-1">Culinary / Fulfilment Note</p>
              <p className="text-sm italic text-foreground">{order.order_note}</p>
            </div>
          )}

          {/* Delivery & Recipient Details */}
          <div className="border border-border bg-card p-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              {isDelivery ? (
                <Truck className="h-4 w-4 text-[#2D4B73]" />
              ) : (
                <MapPin className="h-4 w-4 text-[#2D4B73]" />
              )}
              <p className="kicker mb-0">
                {isDelivery ? 'Courier Destination' : 'Pickup Station'}
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium text-foreground">
                {isDelivery ? order.delivery_address : order.pickup_location}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                <span>Contact: {order.customer_name}</span>
                <span>Phone: {order.customer_phone}</span>
                <span>Email: {order.customer_email}</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="border border-border bg-card p-5">
            <p className="kicker mb-4">Financial Summary</p>
            <dl className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd className="text-foreground">{formatGHS(order.subtotal)}</dd>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-[#2D4B73]">
                  <dt>Discount Applied</dt>
                  <dd>−{formatGHS(order.discount)}</dd>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <dt>Fulfilment ({isDelivery ? 'Courier Delivery' : 'Nationwide Pickup'})</dt>
                <dd className="text-foreground">
                  {order.shipping_fee > 0 ? formatGHS(order.shipping_fee) : 'Free'}
                </dd>
              </div>

              {order.processing_fee > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <dt>Processing Fee</dt>
                  <dd className="text-foreground">{formatGHS(order.processing_fee)}</dd>
                </div>
              )}

              <div className="border-t border-border pt-3 flex items-baseline justify-between">
                <dt className="font-mono text-sm font-semibold uppercase text-foreground">Total</dt>
                <dd className="font-display text-2xl font-semibold text-foreground">
                  {formatGHS(order.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column: Tracking Timeline & Order Conversation */}
        <div className="space-y-6 lg:col-span-5">
          <TrackingTimeline
            fulfillmentType={order.fulfillment_type}
            tracking={order.tracking || []}
            deliveryStatus={order.delivery_status}
          />

          <OrderConversation
            orderId={order.id}
            isAdminSide={false}
            customerName={order.customer_name}
          />
        </div>
      </div>
    </div>
  );
}
