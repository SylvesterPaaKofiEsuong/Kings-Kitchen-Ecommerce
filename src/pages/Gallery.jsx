import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/store-data';
import SectionHeading from '@/components/store/SectionHeading';
import { formatGHS } from '@/lib/format';

export default function Gallery() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts({ featured: true }).then((prods) => setFeatured(prods.slice(0, 8)));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      {/* Hero */}
      <div className="border-b border-border pb-8">
        <p className="kicker">Visual Archive</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium tracking-tight md:text-5xl">
          The kitchen, in detail.
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          An editorial look at materials, machining, and daily service inside high-output kitchens across Accra.
        </p>
      </div>

      {/* Hero Exhibition Image */}
      <div className="my-10 aspect-[16/9] overflow-hidden border border-border bg-muted">
        <img
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80"
          alt="Stainless steel culinary workstation"
          className="h-full w-full object-cover"
        />
      </div>

      {/* 5 / 7 Feature Split */}
      <div className="my-14 border-y border-border py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="aspect-[4/3] overflow-hidden border border-border bg-muted lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1514986888952-8cd320577b67?w=1000&q=80"
              alt="Cookware and plating precision"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-4 lg:col-span-7">
            <p className="kicker">Photographed the way it's built.</p>
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              Brushed steel, copper coils, and tempered borosilicate glass.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We photograph our equipment unadorned under neutral studio light so you can observe seam welds, gauge thickness, and tactile toggle switches before investing. There are no computer renders or stylized enhancements — only true representations of the tools you will rely on.
            </p>
          </div>
        </div>
      </div>

      {/* Shortlist Gallery Grid */}
      <div className="my-12">
        <SectionHeading
          index="02"
          label="Specified Selection"
          title="Equipment in Service"
          description="A selection of high-duty machinery and culinary tools featured in professional Ghanaian kitchens."
          action={
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#2D4B73] hover:underline"
            >
              View Full Catalog
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                {p.images?.[0] ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <div className="p-4 border-t border-border">
                <p className="kicker text-[9px]">{p.brand}</p>
                <h4 className="mt-1 truncate font-body text-xs font-medium text-foreground">
                  {p.name}
                </h4>
                <p className="mt-2 font-mono text-xs font-semibold text-[#2D4B73]">
                  {formatGHS(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center border-t border-border pt-12">
        <Link to="/shop" className="btn-primary">
          Shop the Catalog
        </Link>
      </div>
    </div>
  );
}
