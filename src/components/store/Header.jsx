import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBell from './NotificationBell';
import AccountMenu from './AccountMenu';

const NAV_LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/orders', label: 'Orders' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background">
      <div className="mx-auto flex h-full max-w-screen-xl items-center gap-6 px-4 md:px-6">
        {/* Brand */}
        <Link
          to="/"
          className="shrink-0 font-display text-[20px] md:text-[22px] font-semibold tracking-[0.06em] text-foreground hover:opacity-90 transition-opacity"
        >
          KING&apos;S KITCHEN
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:gap-8 md:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.15em] transition-colors py-1 ${
                  isActive ? 'text-[#2D4B73] font-medium' : 'text-muted-foreground hover:text-[#2D4B73]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 md:block">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
            <input
              id="header-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the catalog"
              className="h-9 w-full border border-input bg-background pl-9 pr-4 font-mono text-[11px] placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
              aria-label="Search the catalog"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2.5 sm:gap-4 md:gap-5">
          <ThemeToggle />
          <NotificationBell />
          <AccountMenu />

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground transition-colors hover:text-muted-foreground py-1.5 px-2 rounded-md hover:bg-muted/60"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {count > 0 && (
              <span className="bg-foreground px-1.5 py-0.5 font-mono text-[10px] text-background rounded-sm">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
