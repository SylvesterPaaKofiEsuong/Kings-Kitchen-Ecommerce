import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/store-data';
import SectionHeading from '@/components/store/SectionHeading';
import ProductCard from '@/components/store/ProductCard';
import { ProductGridSkeleton } from '@/components/store/Skeletons';

const PROMISES = [
  {
    title: 'Specified, not stocked.',
    body: 'Every line is chosen for duty cycles, build materials and serviceability — the things a serious kitchen actually runs on.',
  },
  {
    title: 'Two fulfilment models.',
    body: 'Courier delivery within Accra. Arranged pickup for the rest of Ghana. No ambiguity, no surprises.',
  },
  {
    title: 'A direct line.',
    body: 'Every order opens a conversation with our fulfilment team — delivery windows, special requests and live status in one place.',
  },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    getCategories().then(setCategories);
    getProducts({ featured: true }).then(setFeatured);
  }, []);

  return (
    <div>
      {/* 01 — Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-screen-xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-12">
            {/* Left */}
            <div className="flex flex-col justify-center py-16 md:col-span-7 md:py-24 md:pr-12">
              <p className="kicker mb-6">Professional kitchen equipment — Accra, Ghana</p>
              <h1 className="font-display text-5xl font-medium leading-[0.95] tracking-tight md:text-7xl" style={{ maxWidth: '15ch' }}>
                Everything you need to build a modern, capable kitchen.
              </h1>
              <p className="mt-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
                Commercial-grade appliances and tools, specified for the serious cook — available for courier delivery within Accra and arranged pickup across Ghana.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop" className="btn-primary">Shop Now</Link>
                <a href="#categories" className="btn-outline">Explore Categories</a>
              </div>

              {/* Stats row */}
              <div className="mt-12 border-t border-border pt-8 grid grid-cols-3 gap-4">
                {[
                  ['Commercial-grade', 'specification'],
                  ['Courier delivery', 'within Accra'],
                  ['Nationwide', 'pickup'],
                ].map(([top, bottom]) => (
                  <div key={top}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">{top}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{bottom}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero image */}
            <div className="hidden md:col-span-5 md:block">
              <div className="h-full min-h-[520px] bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80"
                  alt="Professional kitchen equipment"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Categories */}
      <section id="categories" className="mx-auto max-w-screen-xl px-4 py-0 md:px-6">
        <SectionHeading index="02" label="Departments" title="Six departments. One standard." />
        <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6 mt-0">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group block bg-background p-0 transition-colors hover:bg-muted"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="border-t border-border p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">{cat.name}</p>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 03 — Featured */}
      <section className="bg-muted">
        <div className="mx-auto max-w-screen-xl px-4 py-0 md:px-6">
          <SectionHeading
            index="03"
            label="Selection"
            title="The current shortlist."
            action={
              <Link to="/shop" className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors">
                View all <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            }
          />
          <div className="pb-12 pt-6">
            {featured === null ? (
              <ProductGridSkeleton count={4} columns={4} />
            ) : (
              <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 04 — Why King's Kitchen */}
      <section className="mx-auto max-w-screen-xl px-4 py-0 md:px-6">
        <SectionHeading index="04" label="Standards" title="Built like the tools we sell." />
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
          {PROMISES.map(({ title, body }) => (
            <div key={title} className="bg-background p-8">
              <p className="font-display text-xl font-medium">{title}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 05 — CTA band */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-screen-xl px-4 py-16 md:px-6 md:py-20">
          <p className="kicker mb-4 text-background/60">05 — Hospitality &amp; bulk orders</p>
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight md:text-6xl" style={{ maxWidth: '16ch' }}>
            Outfitting a professional kitchen? Let's talk specs.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-background/70">
            We work with hotels, restaurants, and catering operations across Ghana. Volume pricing, installation referrals, and a direct line to our sourcing team.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop?category=equipment"
              className="inline-flex items-center justify-center gap-2 border border-background px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background transition-colors duration-200 hover:bg-background hover:text-foreground"
            >
              Browse Equipment
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-background px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors duration-200 hover:bg-background/90"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
