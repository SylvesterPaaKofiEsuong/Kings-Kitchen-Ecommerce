import React from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    num: '01',
    title: 'Agreement to Terms',
    body: 'These Terms of Service ("Terms") constitute a legally binding agreement between you and King\'s Kitchen Culinary Equipment ("King\'s Kitchen", "we", "us"), governing your access to and purchase of professional kitchen equipment, culinary appliances, and services through our online storefront located in Accra, Ghana. By creating an account, browsing the catalog, or placing an order, you agree to be bound by these terms.',
  },
  {
    num: '02',
    title: 'Customer Account & Security',
    body: 'Access to purchasing, live order tracking, and fulfilment communication requires an authenticated customer account. You are responsible for safeguarding your login credentials. You agree to provide accurate, current, and complete information including your legal name, Ghanaian mobile telephone number, and delivery location.',
  },
  {
    num: '03',
    title: 'Orders & Contract Formation',
    body: 'The presentation of equipment on our storefront does not constitute a legally binding offer, but rather an invitation to treat. When you place an order, you make an offer to purchase the specified goods. A binding contract is formed only when your payment is verified and our system marks your order as "Confirmed".',
  },
  {
    num: '04',
    title: 'Pricing & Currency',
    body: 'All prices are quoted and payable in Ghana Cedis (GHS). While we endeavour to ensure all prices, specifications, and variation options are accurate, typographical errors may occur. In the event of a material pricing discrepancy, we will contact you before processing the order and offer the option to reconfirm or cancel.',
  },
  {
    num: '05',
    title: 'Payment Verification',
    body: 'Payments are processed through authorised payment gateways (including Paystack) accepting Visa, Mastercard, MTN Mobile Money, Telecel Cash, and AT Money. Orders will remain in a "Pending Payment" state until verified by our automated systems. King\'s Kitchen does not store payment card details directly.',
  },
  {
    num: '06',
    title: 'Fulfilment Models & Delivery',
    body: 'We operate two primary fulfilment models: (a) Courier Delivery within Greater Accra at a flat rate of GHS 40.00, arriving within 1–3 business days; and (b) Arranged Pickup free of charge from designated depots in Osu, Tema, Kumasi, and Takoradi. Delivery windows must be mutually confirmed via the order conversation.',
  },
  {
    num: '07',
    title: 'Title, Risk of Loss & Inspection',
    body: 'Title and risk of loss pass to the customer upon delivery by the courier to the specified address or upon collection from an arranged pickup point. Customers must inspect packaging and goods immediately upon receipt and report any shipping damage or missing components within 48 hours.',
  },
  {
    num: '08',
    title: 'Order Cancellations',
    body: 'Orders may be cancelled without penalty prior to courier dispatch by notifying our team through the order conversation. Once an item is marked as "Dispatched" or "Out for Delivery", return shipping costs will be deducted from any refund amount.',
  },
  {
    num: '09',
    title: 'Two-Year Commercial Warranty',
    body: 'All electrical appliances and motor-driven units carry a 24-month limited warranty covering manufacturing defects, internal electrical faults, and motor bearing failures under standard commercial culinary use. Consumables and wear items (gaskets, seals, bulbs) are covered for 90 days. Warranty claims are serviced at our Accra workshop.',
  },
  {
    num: '10',
    title: 'Returns & Restocking',
    body: 'Unused, uninstalled equipment in its original unbroken packaging may be returned within 7 calendar days of receipt. A standard 10% restocking inspection fee applies. Special-order commercial equipment or customized variations are non-refundable unless defective upon arrival.',
  },
  {
    num: '11',
    title: 'Equipment Operation & Safety',
    body: 'Commercial appliances require dedicated power circuits, appropriate grounding, and operator training in accordance with Ghanaian electrical codes and manufacturer specifications. King\'s Kitchen is not liable for damage resulting from electrical surges, incorrect voltage supply, or failure to follow descaling protocols.',
  },
  {
    num: '12',
    title: 'Intellectual Property',
    body: 'All website text, typography designs, product specifications, images, and brand assets are the exclusive intellectual property of King\'s Kitchen or our manufacturer partners. Any reproduction, crawling, or scraping without prior written consent is strictly prohibited.',
  },
  {
    num: '13',
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by the laws of Ghana, King\'s Kitchen shall not be liable for any indirect, incidental, punitive, or consequential damages, including loss of restaurant revenue, food spoilage, or business interruption arising from equipment delivery delays or mechanical downtime.',
  },
  {
    num: '14',
    title: 'Governing Law & Jurisdiction',
    body: 'These Terms are governed by and construed in accordance with the laws of the Republic of Ghana. Any dispute arising out of or in connection with these Terms shall be referred to arbitration in Accra under the Alternative Dispute Resolution Act, 2010 (Act 798).',
  },
];

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <p className="kicker">Legal & Governance</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          The legal framework governing equipment purchase, warranty enforcement, payment verification, and delivery across Ghana.
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Effective date: 1 January 2026 · Accra, Ghana
        </p>
      </div>

      {/* 14 Sections: 4 col title / 8 col body */}
      <div className="mt-12 divide-y divide-border">
        {SECTIONS.map((sec) => (
          <div key={sec.num} className="grid gap-6 py-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="font-mono text-xs text-[#2D4B73]">{sec.num}</span>
              <h2 className="mt-1 font-display text-xl font-medium text-foreground">
                {sec.title}
              </h2>
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground lg:col-span-8">
              <p>{sec.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 border-t border-border pt-10 text-center">
        <p className="text-sm text-muted-foreground">
          Questions regarding our commercial terms or warranty enforcement?
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Link to="/contact" className="btn-primary">
            Contact Legal & Support
          </Link>
          <Link to="/faq" className="btn-outline">
            Review FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
