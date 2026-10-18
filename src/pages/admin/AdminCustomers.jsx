import React, { useEffect, useState, useMemo } from 'react';
import { Search, Users, Phone, Mail } from 'lucide-react';
import { getOrders } from '@/lib/store-data';
import { formatGHS, formatDate } from '@/lib/format';

export default function AdminCustomers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getOrders().then((all) => {
      setOrders(all);
      setLoading(false);
    });
  }, []);

  // Aggregate customers from orders
  const customers = useMemo(() => {
    const map = new Map();

    orders.forEach((o) => {
      const key = (o.customer_phone || o.customer_email || o.customer_name || 'unknown').toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: o.customer_name || 'Anonymous Customer',
          phone: o.customer_phone || '',
          email: o.customer_email || '',
          orderCount: 0,
          totalSpend: 0,
          lastOrderDate: o.created_date,
        });
      }

      const rec = map.get(key);
      rec.orderCount += 1;
      rec.totalSpend += Number(o.total || 0);
      if (new Date(o.created_date) > new Date(rec.lastOrderDate)) {
        rec.lastOrderDate = o.created_date;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

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
          <p className="kicker">Client Accounts</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
            Customers ({customers.length})
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email..."
            className="field-input py-2 pl-9 text-xs w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4">Total Spend (GHS)</th>
              <th className="p-4">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c, idx) => (
                <tr key={c.phone || c.email || idx} className="transition-colors hover:bg-muted/30">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{c.name}</p>
                  </td>
                  <td className="p-4 font-mono text-xs text-muted-foreground space-y-0.5">
                    {c.phone && <p>{c.phone}</p>}
                    {c.email && <p>{c.email}</p>}
                  </td>
                  <td className="p-4 font-mono text-xs text-foreground">
                    {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="p-4 font-mono text-sm font-semibold text-[#2D4B73]">
                    {formatGHS(c.totalSpend)}
                  </td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    {formatDate(c.lastOrderDate)}
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
