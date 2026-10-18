import React from 'react';

const MAPS = {
  order: {
    pending_payment: ['Pending Payment', 'warn'],
    confirmed: ['Confirmed', 'pos'],
    processing: ['Processing', 'pos'],
    completed: ['Completed', 'pos'],
    cancelled: ['Cancelled', 'neg'],
    unable_to_fulfill: ['Unable to Fulfil', 'neg'],
  },
  payment: {
    pending: ['Pending', 'warn'],
    processing: ['Processing', 'warn'],
    paid: ['Paid', 'pos'],
    failed: ['Failed', 'neg'],
    expired: ['Expired', 'neg'],
    refunded: ['Refunded', 'neg'],
  },
  delivery: {
    not_started: ['Not Started', 'neutral'],
    arranging: ['Arranging', 'warn'],
    confirmed: ['Confirmed', 'pos'],
    dispatched: ['Dispatched', 'pos'],
    out_for_delivery: ['Out for Delivery', 'pos'],
    ready_for_pickup: ['Ready for Pickup', 'pos'],
    picked_up: ['Picked Up', 'pos'],
    delivered: ['Delivered', 'pos'],
  },
};

const TONES = {
  warn: 'border-amber-800 text-amber-800 dark:border-amber-400 dark:text-amber-400',
  pos: 'border-[#2D4B73] text-[#2D4B73]',
  neg: 'border-destructive text-destructive',
  neutral: 'border-border text-muted-foreground',
};

const DOTS = {
  warn: 'bg-amber-700 dark:bg-amber-400',
  pos: 'bg-[#2D4B73]',
  neg: 'bg-destructive',
  neutral: 'bg-muted-foreground',
};

export default function StatusBadge({ type, value }) {
  const map = MAPS[type];
  if (!map || !value) return null;
  const [label, tone] = map[value] || [`${value}`, 'neutral'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${TONES[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[tone]}`} />
      {label}
    </span>
  );
}
