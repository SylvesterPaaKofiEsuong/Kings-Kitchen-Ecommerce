import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function ContactInfoForm() {
  const { user, updateMe } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateMe({ phone: phone.trim() });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.message || 'Failed to update phone number.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-border bg-card p-6">
      <div className="border-b border-border pb-4">
        <p className="kicker">Personal Information</p>
        <h3 className="mt-1 font-display text-lg font-medium">Contact Details</h3>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="field-label">Full Name</label>
          <input
            type="text"
            disabled
            value={user?.full_name || ''}
            className="field-input cursor-not-allowed opacity-70"
          />
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Identity registered with your King&apos;s Kitchen account.
          </p>
        </div>

        <div>
          <label className="field-label">Email Address</label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="field-input cursor-not-allowed opacity-70"
          />
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Used for login and order communication.
          </p>
        </div>

        <div>
          <label htmlFor="user-phone" className="field-label">Phone Number</label>
          <input
            id="user-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="024 412 3456"
            className="field-input"
          />
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Used by delivery couriers and for SMS dispatch notifications.
          </p>
        </div>

        {error && (
          <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <p className="font-mono text-xs text-[#2D4B73]">
            ✓ Contact details updated successfully.
          </p>
        )}

        <div className="pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Contact Details'}
          </button>
        </div>
      </form>
    </div>
  );
}
