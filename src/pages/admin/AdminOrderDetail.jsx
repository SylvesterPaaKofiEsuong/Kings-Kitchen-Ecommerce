import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FastForward, CheckCircle, Truck, MapPin } from 'lucide-react';
import { getOrder, getOrderItems, updateOrder, createNotification } from '@/lib/store-data';
import { formatGHS, formatDate, formatDateTime } from '@/lib/format';
import { useToast } from '@/lib/toast-context';
import StatusBadge from '@/components/store/StatusBadge';
import TrackingTimeline from '@/components/store/TrackingTimeline';
import OrderConversation from '@/components/store/OrderConversation';

const DELIVERY_FLOW = {
  accra_delivery: [
    ['arranging', 'delivery_arranging', 'Delivery Arranging'],
    ['confirmed', 'delivery_confirmed', 'Delivery Confirmed'],
    ['dispatched', 'dispatched', 'Dispatched'],
    ['out_for_delivery', 'out_for_delivery', 'Out for Delivery'],
    ['delivered', 'delivered', 'Delivered'],
  ],
  pickup: [
    ['arranging', 'pickup_arranging', 'Pickup Arranging'],
    ['ready_for_pickup', 'ready_for_pickup', 'Ready for Pickup'],
    ['picked_up', 'picked_up', 'Picked Up'],
  ],
};

const ORDER_STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'unable_to_fulfill', label: 'Unable to Fulfil' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'expired', label: 'Expired' },
  { value: 'refunded', label: 'Refunded' },
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stageNote, setStageNote] = useState('');
  const [advancing, setAdvancing] = useState(false);

  const loadData = async () => {
    const o = await getOrder(id);
    if (o) {
      setOrder(o);
      const oItems = await getOrderItems(id);
      setItems(oItems);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="h-96 border border-border bg-card animate-pulse lg:col-span-7" />
          <div className="h-96 border border-border bg-card animate-pulse lg:col-span-5" />
        </div>
      </div>
    );
  }

  // Flow computation
  const flowKey = order.fulfillment_type === 'pickup' ? 'pickup' : 'accra_delivery';
  const flow = DELIVERY_FLOW[flowKey];
  const currentIdx = flow.findIndex(([status]) => status === order.delivery_status);
  const nextStage = currentIdx >= 0 ? flow[currentIdx + 1] : flow[0];

  // Status updates
  const handleOrderStatusChange = async (newStatus) => {
    const prev = order.order_status;
    const label = ORDER_STATUS_OPTIONS.find((o) => o.value === newStatus)?.label || newStatus;

    const updated = await updateOrder(order.id, { order_status: newStatus });
    setOrder(updated);

    await createNotification({
      title: `Order #${order.order_number} — ${label}`,
      body: `Your order status has been updated to "${label}".`,
      order_id: order.id,
      customer_email: order.customer_email,
    });

    toast({
      title: 'Order Status Updated',
      description: `Marked as ${label}`,
    });
  };

  const handlePaymentStatusChange = async (newStatus) => {
    const label = PAYMENT_STATUS_OPTIONS.find((o) => o.value === newStatus)?.label || newStatus;

    const patchData = { payment_status: newStatus };
    if (newStatus === 'paid' && order.order_status === 'pending_payment') {
      patchData.order_status = 'confirmed';
    }

    const updated = await updateOrder(order.id, patchData);
    setOrder(updated);

    await createNotification({
      title: `Order #${order.order_number} — Payment ${label}`,
      body: `Your payment for order #${order.order_number} is now marked as "${label}".`,
      order_id: order.id,
      customer_email: order.customer_email,
    });

    toast({
      title: 'Payment Status Updated',
      description: `Marked as ${label}`,
    });
  };

  // Advance delivery stage
  const handleAdvanceStage = async () => {
    if (!nextStage) return;
    setAdvancing(true);

    try {
      const [statusKey, stageKey, stageLabel] = nextStage;
      const trackingEntry = {
        stage: stageKey,
        timestamp: new Date().toISOString(),
        note: stageNote.trim() || undefined,
      };

      const patchData = {
        delivery_status: statusKey,
        tracking: [...(order.tracking || []), trackingEntry],
      };

      // Auto-complete order when final stage reached
      if (statusKey === 'delivered' || statusKey === 'picked_up') {
        patchData.order_status = 'completed';
      }

      const updated = await updateOrder(order.id, patchData);
      setOrder(updated);
      setStageNote('');

      await createNotification({
        title: `Order #${order.order_number} — ${stageLabel}`,
        body: stageNote.trim() || `Your order status is now "${stageLabel}".`,
        order_id: order.id,
        customer_email: order.customer_email,
      });

      toast({
        title: 'Stage Advanced',
        description: `#${order.order_number} is now ${stageLabel}`,
      });
    } finally {
      setAdvancing(false);
    }
  };

  const isDelivery = order.fulfillment_type === 'accra_delivery';

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all orders
        </Link>

        <Link
          to={`/orders/${order.id}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#2D4B73] hover:underline"
        >
          <span>Customer view</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border pb-6">
        <div>
          <p className="kicker">Fulfilment Cockpit</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
            #{order.order_number}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Received {formatDateTime(order.created_date)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.order_status} type="order" />
          <StatusBadge status={order.payment_status} type="payment" />
          <StatusBadge status={order.delivery_status} type="delivery" />
        </div>
      </div>

      {/* Main Grid: Left 7 cols, Right 5 cols */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Items, Customer, Logistics, Financials */}
        <div className="space-y-6 lg:col-span-7">
          {/* Items */}
          <div className="border border-border bg-card">
            <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Order Specification ({items.length} items)
            </div>
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden border border-border bg-muted">
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
                      <p className="font-mono text-[11px] text-[#2D4B73]">{item.variation}</p>
                    )}
                    <p className="font-mono text-xs text-muted-foreground">
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

          {/* Customer Note */}
          {order.order_note && (
            <div className="border-l-2 border-foreground bg-muted/40 p-4">
              <p className="kicker mb-1">Customer Note</p>
              <p className="text-sm italic text-foreground">{order.order_note}</p>
            </div>
          )}

          {/* Customer & Fulfilment details */}
          <div className="border border-border bg-card p-5 space-y-4">
            <div>
              <p className="kicker mb-1">Customer Contact</p>
              <p className="font-medium text-foreground">{order.customer_name}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 font-mono text-xs text-muted-foreground">
                <span>Phone: {order.customer_phone}</span>
                <span>Email: {order.customer_email}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-1">
                {isDelivery ? <Truck className="h-4 w-4 text-[#2D4B73]" /> : <MapPin className="h-4 w-4 text-[#2D4B73]" />}
                <p className="kicker mb-0">
                  {isDelivery ? 'Courier Address' : 'Pickup Station'}
                </p>
              </div>
              <p className="text-sm font-medium text-foreground">
                {isDelivery ? order.delivery_address : order.pickup_location}
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="border border-border bg-card p-5">
            <p className="kicker mb-3">Order Financials</p>
            <dl className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-muted-foreground">
                <dt>Subtotal</dt>
                <dd className="text-foreground">{formatGHS(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Shipping</dt>
                <dd className="text-foreground">{formatGHS(order.shipping_fee)}</dd>
              </div>
              <div className="border-t border-border pt-2 flex items-baseline justify-between">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-display text-xl font-semibold text-foreground">
                  {formatGHS(order.total)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right Column: Controls, Stage Advancer, Timeline, Messages */}
        <div className="space-y-6 lg:col-span-5">
          {/* Fulfilment Controls Panel */}
          <div className="border border-border bg-card p-5 space-y-4">
            <p className="kicker">Fulfilment Controls</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Order Status</label>
                <select
                  value={order.order_status}
                  onChange={(e) => handleOrderStatusChange(e.target.value)}
                  className="field-input py-2 text-xs bg-card"
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Payment Status</label>
                <select
                  value={order.payment_status}
                  onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  className="field-input py-2 text-xs bg-card"
                >
                  {PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stage Advancer */}
            <div className="border-t border-border pt-4">
              <p className="kicker mb-2">Stage Advancer</p>
              {nextStage ? (
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={stageNote}
                      onChange={(e) => setStageNote(e.target.value)}
                      placeholder="Optional stage note (e.g. Courier Yaw, arriving 3:30pm)"
                      className="field-input py-2 text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAdvanceStage}
                    disabled={advancing}
                    className="btn-primary w-full py-2.5 text-xs font-semibold"
                  >
                    <FastForward className="h-4 w-4" />
                    <span>Advance → {nextStage[2]}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-[#2D4B73] font-mono">
                  <CheckCircle className="h-4 w-4" />
                  <span>All fulfilment milestones completed.</span>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Timeline */}
          <TrackingTimeline
            fulfillmentType={order.fulfillment_type}
            tracking={order.tracking || []}
            deliveryStatus={order.delivery_status}
          />

          {/* Admin Order Conversation */}
          <OrderConversation
            orderId={order.id}
            isAdminSide={true}
            customerName={order.customer_name}
          />
        </div>
      </div>
    </div>
  );
}
