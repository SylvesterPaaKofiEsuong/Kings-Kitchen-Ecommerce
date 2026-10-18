import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { getNotifications, markAllRead, subscribe } from '@/lib/store-data';
import { formatDateTime } from '@/lib/format';
import { useAuth } from '@/lib/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getNotifications().then(setNotifications);
    const unsub = subscribe('Notification', (ev) => {
      if (ev.type === 'create' && ev.data) {
        setNotifications((prev) => [ev.data, ...prev]);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const userEmail = (user?.email || '').toLowerCase();
  const visible = notifications.filter(
    (n) => !n.customer_email || (userEmail && (n.customer_email || '').toLowerCase() === userEmail)
  );
  const unread = visible.filter((n) => !n.read);

  const handleMarkAll = async () => {
    await markAllRead(unread.map((n) => n.id));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread.length ? `, ${unread.length} unread` : ''}`}
        className="relative flex items-center p-2 rounded-md hover:bg-muted/70 text-foreground transition-colors"
      >
        <Bell strokeWidth={1.5} className="h-[18px] w-[18px]" />
        {unread.length > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#2D4B73]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 border border-border bg-popover shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em]">Notifications</p>
            {unread.length > 0 && (
              <button
                onClick={handleMarkAll}
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {visible.length === 0 ? (
              <p className="px-4 py-6 text-center font-mono text-[11px] text-muted-foreground">
                No notifications
              </p>
            ) : (
              visible.map((n) => (
                <div
                  key={n.id}
                  className={`border-b border-border px-4 py-3 last:border-0 ${n.read ? '' : 'bg-muted/50'}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2D4B73]" />
                    )}
                    <div className={!n.read ? '' : 'pl-3.5'}>
                      <p className="text-[12px] font-medium">{n.title}</p>
                      {n.body && <p className="mt-0.5 text-[11px] text-muted-foreground">{n.body}</p>}
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">
                        {formatDateTime(n.created_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
