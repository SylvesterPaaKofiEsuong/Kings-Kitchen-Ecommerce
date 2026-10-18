import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Package, Grid } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const TABS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shop', label: 'Shop', icon: Grid },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/orders', label: 'Orders', icon: Package },
];

export default function MobileNav() {
  const { count } = useCart();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid h-14 grid-cols-4">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] font-mono uppercase tracking-[0.1em] transition-colors ${
                isActive ? 'text-[#2D4B73]' : 'text-muted-foreground'
              }`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#2D4B73]' : ''}`} strokeWidth={1.5} />
                  {label === 'Cart' && count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center bg-foreground font-mono text-[9px] text-background">
                      {count}
                    </span>
                  )}
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
