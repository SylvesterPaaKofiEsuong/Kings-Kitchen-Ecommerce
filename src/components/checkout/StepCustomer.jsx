import React, { useState } from 'react';

const PHONE_RE = /^(\+233|0)\d{9}$/;

export default function StepCustomer({ customer, onChange, onNext }) {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const name = customer.name?.trim();
    const phone = customer.phone?.replace(/\s+/g, '');
    const email = customer.email?.trim();

    if (!name) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone || !PHONE_RE.test(phone)) {
      setError('Please enter a valid Ghanaian phone number (e.g. 0244123456 or +233244123456).');
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address for order notifications.');
      return;
    }

    onChange({ ...customer, name, phone, email });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="kicker mb-2">Step 01 — Contact Details</p>
        <h2 className="font-display text-2xl font-medium tracking-tight">Who is placing this order?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We use these details for your delivery coordination and live order status notifications.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="customer-name" className="field-label">Full Name *</label>
          <input
            id="customer-name"
            type="text"
            required
            value={customer.name || ''}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            placeholder="Kwame Mensah"
            className="field-input"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="customer-phone" className="field-label">Phone Number (Ghana) *</label>
            <input
              id="customer-phone"
              type="tel"
              required
              value={customer.phone || ''}
              onChange={(e) => onChange({ ...customer, phone: e.target.value })}
              placeholder="024 412 3456"
              className="field-input"
            />
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Format: 0XX XXXXXXX or +233XX XXXXXXX
            </p>
          </div>

          <div>
            <label htmlFor="customer-email" className="field-label">Email Address *</label>
            <input
              id="customer-email"
              type="email"
              required
              value={customer.email || ''}
              onChange={(e) => onChange({ ...customer, email: e.target.value })}
              placeholder="kwame@example.com"
              className="field-input"
            />
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              Order receipts and tracking will be sent here
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <button type="submit" className="btn-primary w-full sm:w-auto">
          Continue to Logistics →
        </button>
      </div>
    </form>
  );
}
