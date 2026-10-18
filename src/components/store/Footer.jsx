import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { slug: 'kitchen-electronics', name: 'Kitchen Electronics' },
  { slug: 'appliances', name: 'Appliances' },
  { slug: 'cookware', name: 'Cookware' },
  { slug: 'equipment', name: 'Equipment' },
  { slug: 'kitchen-wear', name: 'Kitchen Wear' },
  { slug: 'accessories', name: 'Accessories' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-xl font-semibold tracking-[0.06em]">
              KING&apos;S KITCHEN
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Professional kitchen equipment, specified for serious culinary work. Based in Accra, Ghana.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="kicker mb-4">Shop</p>
            <ul className="space-y-2.5">
              {CATEGORIES.map(({ slug, name }) => (
                <li key={slug}>
                  <Link
                    to={`/shop?category=${slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/gallery" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Orders */}
          <div>
            <p className="kicker mb-4">Orders</p>
            <ul className="space-y-2.5">
              {[
                ['/orders', 'Your Orders'],
                ['/profile', 'Your Profile'],
                ['/cart', 'Cart'],
                ['/shop', 'Full Catalog'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="kicker mb-4">Support</p>
            <ul className="space-y-2.5">
              {[
                ['/faq', 'FAQ'],
                ['/contact', 'Contact Us'],
                ['/about', "About King's Kitchen"],
                ['/terms', 'Terms of Service'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-muted-foreground/70 leading-relaxed">
              For live order updates, use the conversation on any order page.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            © 2026 King&apos;s Kitchen
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Designed for the technical kitchen
          </p>
        </div>
      </div>
    </footer>
  );
}
