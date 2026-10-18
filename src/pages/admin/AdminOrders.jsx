import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { getOrders } from '@/lib/store-data';
import { formatGHS, formatDate } from '@/lib/format';
import StatusBadge from '@/components/store/StatusBadge';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getOrders().then((all) => {
      setOrders(all);
      setLoading(false);
    });
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_email?.toLowerCase().includes(q) ||
          o.customer_phone?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.order_status === statusFilter);
    }

    return result;
  }, [orders, search, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="h-64 border border-border bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker">Fulfilment Queue</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
            Orders ({orders.length})
          </h1>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search #order, name..."
              className="field-input py-2 pl-9 text-xs w-56 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="field-input py-2 text-xs bg-card w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Order Ref</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status Tracks</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                  No orders match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-muted/30 group"
                >
                  <td className="p-4 font-mono font-medium text-foreground">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="hover:underline text-[#2D4B73]"
                    >
                      #{order.order_number}
                    </Link>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{order.customer_name}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {order.customer_phone || order.customer_email}
                    </p>
                  </td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    {formatDate(order.created_date)}
                  </td>
                  <td className="p-4 font-mono font-semibold text-foreground">
                    {formatGHS(order.total)}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      <StatusBadge status={order.order_status} type="order" />
                      <StatusBadge status={order.payment_status} type="payment" />
                      <StatusBadge status={order.delivery_status} type="delivery" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-[#2D4B73] hover:underline"
                    >
                      Manage
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
