import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getOrders } from '@/lib/store-data';
import { formatGHS, formatDate } from '@/lib/format';
import StatusBadge from '@/components/store/StatusBadge';
import EmptyState from '@/components/store/EmptyState';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((all) => {
      // Customer sees only their own orders (by ID or email match) unless admin
      if (user?.role === 'admin') {
        setOrders(all);
      } else if (user) {
        const mine = all.filter(
          (o) =>
            o.created_by_id === user.id ||
            (o.customer_email || '').toLowerCase() === (user.email || '').toLowerCase()
        );
        setOrders(mine);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 md:px-8">
        <div className="border-b border-border pb-6 animate-pulse">
          <div className="h-4 w-32 bg-muted mb-2" />
          <div className="h-8 w-48 bg-muted" />
        </div>
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 border border-border bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:px-8">
        <EmptyState
          icon={<PackageOpen className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />}
          kicker="Customer Dashboard"
          title="No orders placed yet."
          description="Your active orders, tracking milestones, and fulfilment conversations will appear here."
          action={
            <Link to="/shop" className="btn-primary mt-6">
              Start Shopping
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
        <p className="kicker">Customer Dashboard</p>
        <div className="mt-2 flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Your Orders
          </h1>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-8 divide-y divide-border border border-border bg-card">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:p-6"
          >
            {/* Left: ID + Date + Total */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-foreground">
                  #{order.order_number}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(order.created_date)}
                </span>
              </div>
              <p className="font-mono text-sm font-medium text-foreground">
                {formatGHS(order.total)}
              </p>
            </div>

            {/* Right: Badges + Chevron */}
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <StatusBadge status={order.order_status} type="order" />
              <StatusBadge status={order.payment_status} type="payment" />
              <StatusBadge status={order.delivery_status} type="delivery" />
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 hidden sm:block" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
