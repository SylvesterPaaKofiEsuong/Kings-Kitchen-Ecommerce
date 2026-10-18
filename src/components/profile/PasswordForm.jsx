import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function PasswordForm() {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword: current, newPassword: next });
      setSuccess(true);
      setCurrent('');
      setNext('');
      setConfirm('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err?.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-border bg-card p-6">
      <div className="border-b border-border pb-4">
        <p className="kicker">Security</p>
        <h3 className="mt-1 font-display text-lg font-medium">Change Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="current-pw" className="field-label">Current Password</label>
          <input
            id="current-pw"
            type="password"
            required
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="new-pw" className="field-label">New Password</label>
          <input
            id="new-pw"
            type="password"
            required
            minLength={8}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="field-input"
          />
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            Must be at least 8 characters.
          </p>
        </div>

        <div>
          <label htmlFor="confirm-pw" className="field-label">Confirm New Password</label>
          <input
            id="confirm-pw"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="field-input"
          />
        </div>

        {error && (
          <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <p className="font-mono text-xs text-[#2D4B73]">
            ✓ Password updated successfully.
          </p>
        )}

        <div className="pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
