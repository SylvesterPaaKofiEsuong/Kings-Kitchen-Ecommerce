import React from 'react';
import { Link } from 'react-router-dom';
import FaqSection from '@/components/store/FaqSection';

const CARE_FAQS = [
  {
    q: 'How should I clean and maintain high-volume commercial blenders?',
    a: 'Rinse the jar immediately after each cycle with warm water. For deep cleaning, blend warm water with a few drops of dish soap on high for 30 seconds, then rinse thoroughly. Never submerge the motor base in liquid; wipe the stainless steel housing with a damp microfibre cloth. Inspect blade drive sockets monthly for signs of wear.',
  },
  {
    q: 'What is the correct protocol for seasoning and preserving cast iron and carbon steel cookware?',
    a: 'Wash with hot water and a stiff brush without harsh detergents. Dry completely on medium stovetop heat for 2 minutes, then apply a micro-thin layer of high-smoke-point oil (flaxseed, grapeseed, or canola) while warm. Store in a dry, ventilated area away from coastal humid airflow.',
  },
  {
    q: 'How frequently should convection ovens and commercial combi units be descaled?',
    a: 'In Accra where municipal water supplies carry moderate to high mineral hardness, boiler-based equipment should undergo descaling every 4 to 6 weeks, or whenever scale indicators activate. We recommend inline food-grade water filtration on all plumbed appliances.',
  },
  {
    q: 'What are your recommendations for Japanese knife maintenance?',
    a: 'Hand wash immediately after contact with acidic ingredients (tomatoes, citrus). Never wash in a commercial dishwasher. Hone regularly on a ceramic rod and sharpen on water stones (1000/6000 grit). Store on magnetic strips or in wooden blade sheaths.',
  },
];

const SHIPPING_FAQS = [
  {
    q: 'How does courier delivery within Greater Accra operate?',
    a: 'Orders placed and confirmed before 12:00 PM are dispatched next business day via our dedicated logistics partner. Delivery is a flat GHS 40.00 to Cantonments, Airport, East Legon, Osu, Spintex, Tema, and surrounding Accra municipal zones. Your courier contacts you prior to arrival.',
  },
  {
    q: 'How does arranged pickup outside Accra work?',
    a: 'For clients in Kumasi, Takoradi, Cape Coast, Tamale, and beyond, pickup is arranged free of charge through regional partner collection depots. Once your order is packed and dispatched from Accra, our fulfilment desk communicates pickup times and tracking directly via your order conversation.',
  },
  {
    q: 'Can I request scheduled delivery for commercial project installations?',
    a: 'Yes. For commercial installations, bulk restaurant outfitting, or newly built kitchen handovers, notify our team during checkout in the Order Note or through your order conversation. We will coordinate staging and timed arrival.',
  },
];

const WARRANTY_FAQS = [
  {
    q: 'What warranty coverage applies to electrical appliances and motors?',
    a: 'All electrical appliances and motor-driven machinery carry a 2-year manufacturer warranty against internal component defects, bearing failures, and electrical faults under normal commercial kitchen usage. Wear items such as gaskets, silicone seals, and light bulbs are covered for 90 days.',
  },
  {
    q: 'How do I lodge a warranty claim or request servicing?',
    a: 'You can initiate a service request directly through the order conversation on your order page, or submit a inquiry via our Contact page with subject "Warranty claim". Include your order number (#MK-XXXXXX) and a brief description of the issue. Our technicians operate out of our Accra technical workshop.',
  },
  {
    q: 'Are replacement parts kept in stock locally in Accra?',
    a: 'Yes. We maintain a local inventory of essential spare parts — including blender drive sockets, heating elements, thermostat sensors, and replacement blades — specifically to prevent downtime for commercial culinary operators in Ghana.',
  },
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <p className="kicker">Knowledge Base</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
          Frequently Answered
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Specifications, equipment maintenance protocols, delivery logistics across Ghana, and our two-year commercial warranty standard.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="mt-12 space-y-12 max-w-4xl">
        <FaqSection
          index="01"
          title="Equipment Care & Maintenance"
          items={CARE_FAQS}
        />

        <FaqSection
          index="02"
          title="Shipping & Nationwide Fulfilment"
          items={SHIPPING_FAQS}
        />

        <FaqSection
          index="03"
          title="Warranty, Servicing & Spare Parts"
          items={WARRANTY_FAQS}
        />
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 border border-border bg-card p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="kicker">Have a technical enquiry?</p>
            <h3 className="mt-1 font-display text-2xl font-medium">
              Speak with a kitchen specialist directly.
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Our engineering and culinary team is based in Accra, Ghana.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">
              Contact Support
            </Link>
            <Link to="/orders" className="btn-outline">
              Check an Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
