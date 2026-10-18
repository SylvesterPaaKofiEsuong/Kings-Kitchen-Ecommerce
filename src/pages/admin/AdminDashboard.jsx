import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Truck, AlertTriangle, Bell, ArrowRight } from 'lucide-react';
import { getOrders, getProducts, getNotifications } from '@/lib/store-data';
import { formatGHS, formatDate } from '@/lib/format';
import StatusBadge from '@/components/store/StatusBadge';

const ACTIVE_DELIVERY = [
  'arranging',
  'confirmed',
  'dispatched',
  'out_for_delivery',
  'ready_for_pickup',
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getProducts(), getNotifications()]).then(
      ([allOrders, allProds, allNotifs]) => {
        setOrders(allOrders);
        setProducts(allProds);
        setNotifications(allNotifs);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 border border-border bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const awaitingPayment = orders.filter((o) =>
    ['pending', 'processing'].includes(o.payment_status)
  ).length;

  const activeDeliveries = orders.filter((o) =>
    ACTIVE_DELIVERY.includes(o.delivery_status)
  ).length;

  const lowStock = products.filter((p) => (p.stock ?? 0) <= 3).length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <p className="kicker">Fulfilment & Commercial Operations</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* 5 Stat Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="kicker mb-0">Total Orders</span>
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold text-foreground">
            {orders.length}
          </p>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="kicker mb-0">Awaiting Payment</span>
            <CreditCard className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <p className={`mt-4 font-display text-3xl font-semibold ${
            awaitingPayment > 0 ? 'text-amber-800 dark:text-amber-400' : 'text-foreground'
          }`}>
            {awaitingPayment}
          </p>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="kicker mb-0">Active Deliveries</span>
            <Truck className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold text-[#2D4B73]">
            {activeDeliveries}
          </p>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="kicker mb-0">Low Stock</span>
            <AlertTriangle className="h-4 w-4 text-amber-800 dark:text-amber-400" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold text-foreground">
            {lowStock}
          </p>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="kicker mb-0">Unread Alerts</span>
            <Bell className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-display text-3xl font-semibold text-foreground">
            {unreadNotifs}
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <p className="kicker">Live Feed</p>
            <h2 className="font-display text-lg font-medium">Recent Orders</h2>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#2D4B73] hover:underline"
          >
            <span>View all orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No orders have been received yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${order.id}`}
                className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      #{order.order_number}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {order.customer_name}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {formatDate(order.created_date)} · {formatGHS(order.total)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={order.order_status} type="order" />
                  <StatusBadge status={order.payment_status} type="payment" />
                  <StatusBadge status={order.delivery_status} type="delivery" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
