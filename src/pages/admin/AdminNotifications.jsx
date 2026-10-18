import React, { useEffect, useState } from 'react';
import { Send, Bell, Trash2, Loader2 } from 'lucide-react';
import { getNotifications, createNotification, deleteNotification } from '@/lib/store-data';
import { formatDateTime } from '@/lib/format';
import { useToast } from '@/lib/toast-context';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    const list = await getNotifications();
    setNotifications(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSending(true);
    try {
      const created = await createNotification({
        title: title.trim(),
        body: body.trim(),
        customer_email: customerEmail.trim() || undefined,
      });
      setNotifications((prev) => [created, ...prev]);
      setTitle('');
      setBody('');
      setCustomerEmail('');
      toast({
        title: 'Notification Dispatched',
        description: customerEmail.trim()
          ? `Sent to ${customerEmail}`
          : 'Broadcasted to all active store customers.',
      });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({ title: 'Alert Deleted' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="h-64 border border-border bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <p className="kicker">Alert Broadcast & Dispatch</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Notifications ({notifications.length})
        </h1>
      </div>

      {/* Dispatch Broadcast Form */}
      <form onSubmit={handleBroadcast} className="border border-border bg-card p-6 space-y-4">
        <div>
          <p className="kicker mb-1">Customer Messaging</p>
          <h2 className="font-display text-lg font-medium">Dispatch Notification</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Leave recipient email empty to broadcast to all storefront customers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Notification Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Accra Logistics Update / Scheduled Maintenance"
              className="field-input text-xs"
            />
          </div>
          <div>
            <label className="field-label">Target Customer Email (Optional)</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="customer@example.com (or empty for all)"
              className="field-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Notification Body</label>
          <textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Details regarding holiday delivery schedules, new arrivals, or order tracking guidance..."
            className="field-input text-xs resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={sending} className="btn-primary py-2 px-5 text-xs">
            {sending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Dispatching…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-3.5 w-3.5" />
                Send Alert
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Notifications Archive */}
      <div className="border border-border bg-card">
        <div className="border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          System Alerts History
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No notifications logged in system.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-start justify-between p-4 sm:p-5 transition-colors hover:bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {!n.read ? (
                      <span className="block h-2 w-2 rounded-full bg-[#2D4B73]" />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-border" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-body text-sm font-semibold text-foreground">{n.title}</h4>
                      {n.customer_email ? (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          to {n.customer_email}
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#2D4B73]">
                          [Broadcast]
                        </span>
                      )}
                    </div>
                    {n.body && (
                      <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                        {n.body}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-[10px] text-muted-foreground/70">
                      {formatDateTime(n.created_date)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(n.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
