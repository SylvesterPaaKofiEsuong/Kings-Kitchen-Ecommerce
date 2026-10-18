import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import AuthLayout from '@/components/AuthLayout';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <AuthLayout
        icon={<AlertCircle className="h-6 w-6 text-destructive" />}
        title="Invalid reset link"
        subtitle="This password reset token is missing or has expired."
        footer={
          <Link to="/forgot-password" className="font-semibold text-foreground hover:underline">
            Request a new reset link
          </Link>
        }
      >
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Please submit a new password recovery request from the forgot password page.
          </p>
          <div className="mt-6">
            <Link to="/login" className="btn-primary w-full text-xs">
              Return to Login
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ resetToken: token, newPassword: password });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={<Lock className="h-6 w-6" />}
      title="Create new password"
      subtitle="Enter a new password for your King's Kitchen account."
      footer={
        <Link to="/login" className="font-semibold text-foreground hover:underline">
          ← Return to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="new-pw" className="field-label">New Password (Min. 8 characters)</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              id="new-pw"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-pw" className="field-label">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              id="confirm-pw"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="field-input pl-10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-xs font-semibold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating…
            </span>
          ) : (
            'Set New Password'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
