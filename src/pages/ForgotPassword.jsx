import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPassword() {
  const { resetPasswordRequest } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPasswordRequest(email.trim());
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={<KeyRound className="h-6 w-6" />}
      title="Reset password"
      subtitle="Enter your email to receive password recovery instructions."
      footer={
        <Link to="/login" className="font-semibold text-foreground hover:underline">
          ← Return to sign in
        </Link>
      }
    >
      {submitted ? (
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2D4B73]/10 text-[#2D4B73]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-medium">Instructions Dispatched</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If an account exists with <strong>{email}</strong>, a password reset link has been sent. Please check your inbox and spam folder.
          </p>
          <div className="pt-4">
            <Link to="/login" className="btn-primary w-full text-xs">
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="field-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
                Sending Link…
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
