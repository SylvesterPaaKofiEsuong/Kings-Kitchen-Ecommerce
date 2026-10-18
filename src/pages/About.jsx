import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '@/components/store/SectionHeading';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      {/* Hero */}
      <div className="border-b border-border pb-8">
        <p className="kicker">About King&apos;s Kitchen</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium tracking-tight md:text-6xl">
          Built for people who cook seriously.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          We curate, specify, and service commercial culinary electronics, appliances, and tools in Accra, Ghana — bridging international manufacturing standards with West African kitchen reality.
        </p>
      </div>

      {/* Full-width editorial image */}
      <div className="my-10 aspect-[21/9] overflow-hidden border border-border bg-muted">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80"
          alt="Professional kitchen line in operation"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Mission: 4 / 8 Split */}
      <div className="border-y border-border py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker">The Proposition</p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl">
              Kitchen equipment should be chosen by engineering merit, not marketing.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground lg:col-span-8">
            <p>
              In West Africa, culinary operators face persistent friction: consumer appliances marketed as "heavy duty" burn out under constant daily service, spare parts are nonexistent, and electrical fluctuations cause unexpected downtime.
            </p>
            <p>
              King&apos;s Kitchen was founded in Accra to eliminate that guesswork. We select equipment strictly based on copper motor windings, stainless gauge thickness, heat dissipation engineering, and component accessibility. When an appliance is listed on King&apos;s Kitchen, it has earned its place on our line.
            </p>
          </div>
        </div>
      </div>

      {/* The Standard (3-cell grid) */}
      <div className="my-12">
        <SectionHeading
          index="02"
          label="Foundational Tenets"
          title="The King's Kitchen Standard"
          description="Three commitments that define every machine, pan, and tool we supply."
        />

        <div className="mt-8 grid gap-px bg-border sm:grid-cols-3 border border-border">
          <div className="bg-card p-6 md:p-8 space-y-3">
            <span className="font-mono text-xs text-[#2D4B73]">01</span>
            <h3 className="font-display text-lg font-medium text-foreground">
              Specified, not improvised.
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Every appliance specification is audited against real operating conditions: 230V Ghana grid tolerance, ambient tropical humidity, and continuous run-cycles.
            </p>
          </div>

          <div className="bg-card p-6 md:p-8 space-y-3">
            <span className="font-mono text-xs text-[#2D4B73]">02</span>
            <h3 className="font-display text-lg font-medium text-foreground">
              Tested before it ships.
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Commercial blenders, combi ovens, and refrigeration units undergo electrical inspection and seal integrity checks at our Accra warehouse before dispatch.
            </p>
          </div>

          <div className="bg-card p-6 md:p-8 space-y-3">
            <span className="font-mono text-xs text-[#2D4B73]">03</span>
            <h3 className="font-display text-lg font-medium text-foreground">
              Serviced, not replaced.
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              We stock local replacement blades, heating coils, gaskets, and drive gears. Equipment should be maintained over decades, not discarded after a season.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="border-t border-border pt-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="overflow-hidden border border-border bg-muted lg:col-span-5 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1000&q=80"
              alt="Culinary chef inspecting equipment"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4 lg:col-span-7">
            <p className="kicker">Origin</p>
            <h2 className="font-display text-3xl font-medium tracking-tight">
              From culinary frustration to precision supply.
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                King&apos;s Kitchen began out of direct frustration with the equipment available to restaurant kitchens, bakeries, and serious home culinary enthusiasts in Ghana. Too often, operators were forced to import gear sight-unseen or rely on sub-standard domestic retail chains.
              </p>
              <p>
                We built direct partnerships with premium manufacturers including Vitapro, Sanelli, Nuova, and Meridian. By maintaining inventory locally in Accra and backing every unit with a 2-year warranty and a responsive order channel, we give Ghanaian chefs tools they can trust without hesitation.
              </p>
              <p>
                Whether you are outfitting a high-output restaurant line in Osu or upgrading your private kitchen in Cantonments, King&apos;s Kitchen is your technical culinary partner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="mt-16 bg-foreground text-background p-8 md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/60">
              Ready to specify your kitchen?
            </p>
            <h3 className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl text-background">
              Explore our current curated inventory.
            </h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-background px-6 py-3 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-[#2D4B73] hover:text-background transition-colors"
            >
              Browse Catalog
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center border border-background/30 px-6 py-3 font-mono text-xs uppercase tracking-wider text-background hover:bg-background/10 transition-colors"
            >
              Talk to Specialist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
