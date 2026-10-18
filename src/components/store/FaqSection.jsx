import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function FaqSection({ title, index, items }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div>
      <div className="border-y border-border py-6">
        <p className="kicker">{index}</p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight md:text-3xl">{title}</h2>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              aria-expanded={openIdx === i}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="font-medium text-sm">{item.q}</span>
              <Plus
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  openIdx === i ? 'rotate-45' : ''
                }`}
                strokeWidth={1.5}
              />
            </button>
            {openIdx === i && (
              <div className="pb-5 pl-0">
                <div className="border-l-2 border-foreground/10 pl-4 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
