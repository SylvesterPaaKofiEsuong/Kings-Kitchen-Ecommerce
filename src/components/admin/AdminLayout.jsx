import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Bell,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

const NAV = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: Layers },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Notifications', to: '/admin/notifications', icon: Bell },
];

export default function AdminLayout() {
  const { user } = useAuth();

  if (user && user.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <p className="kicker mb-2">Restricted Access</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Store operations are admin-only
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your account does not have administrative privileges to manage orders, catalog, or customer records.
        </p>
        <Link to="/" className="btn-primary mt-6">
          ← Back to storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-full border-b border-border bg-card md:w-64 md:min-h-screen md:border-b-0 md:border-r flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <Link to="/" className="font-display text-lg font-semibold tracking-[0.06em]">
                KING&apos;S KITCHEN
              </Link>
              <p className="kicker mt-0.5">Store operations</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex overflow-x-auto p-3 md:flex-col md:overflow-visible md:space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-foreground text-background font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="hidden border-t border-border p-4 md:block">
          <div className="mb-3 px-2">
            <p className="truncate text-xs font-medium text-foreground">{user?.full_name || 'Admin'}</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">{user?.email}</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-2 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>View storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main admin view */}
      <main className="flex-1 overflow-x-hidden px-4 py-8 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
