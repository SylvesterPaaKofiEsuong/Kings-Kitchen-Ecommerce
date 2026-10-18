import React from 'react';
import { Lock, ShieldCheck, CreditCard } from 'lucide-react';
import { formatGHS } from '@/lib/format';

export default function StepPayment({
  total,
  onPay,
  placing,
  onBack,
  error,
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="kicker mb-2">Step 04 — Payment</p>
        <h2 className="font-display text-2xl font-medium tracking-tight">Authorise transaction</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Payments are securely processed in Ghana Cedis (GHS).
        </p>
      </div>

      {/* Payment Provider Card */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-border bg-secondary">
              <CreditCard className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-heading text-lg font-medium leading-none">
                Card / Mobile Money
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                via Paystack (Ghana)
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#2D4B73] border border-[#2D4B73] px-2 py-0.5">
            Instant
          </span>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between border-y border-border py-4">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Amount Due
            </span>
            <span className="font-display text-2xl font-semibold text-foreground">
              {formatGHS(total)}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[#2D4B73]" strokeWidth={1.5} />
            <span>Accepts MTN MoMo, Telecel Cash, AT Money, Visa, & Mastercard</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <span>Verified by our system before fulfilment begins</span>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 border-l-2 border-destructive pl-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onPay}
          disabled={placing}
          className="btn-primary mt-8 w-full py-4 text-xs font-semibold"
        >
          {placing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Processing Order…
            </span>
          ) : (
            `Pay ${formatGHS(total)}`
          )}
        </button>

        <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">
          Secured by Paystack: placing will initiate order verification and track delivery.
        </p>
      </div>

      <div className="flex items-center justify-start pt-2">
        <button type="button" onClick={onBack} disabled={placing} className="btn-outline">
          ← Back
        </button>
      </div>
    </div>
  );
}
