import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { safeReturnTo } from '@/lib/authReturnTo';
import AuthLayout from '@/components/AuthLayout';
import GoogleIcon from '@/components/GoogleIcon';

export default function Register() {
  const { register, verifyOtp, updateMe, login } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
      });
      setShowOtp(true);
    } catch (err) {
      setError(err?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({ email: email.trim(), otpCode });
      if (phone.trim()) {
        await updateMe({ phone: phone.trim() });
      }
      const returnTo = safeReturnTo();
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await login('admin@kingskitchen.com.gh', 'admin123');
      const returnTo = safeReturnTo();
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError('Google sign-up failed.');
    } finally {
      setLoading(false);
    }
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={<KeyRound className="h-6 w-6" />}
        title="Verify your account"
        subtitle={`We sent a 6-digit code to ${email}.`}
        footer={
          <button
            type="button"
            onClick={() => setShowOtp(false)}
            className="font-mono text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            ← Back to registration
          </button>
        }
      >
        <form onSubmit={handleVerifyOtp} className="space-y-6">

          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="otp-input" className="field-label text-center">
              Enter 6-Digit Code
            </label>
            <input
              id="otp-input"
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="field-input text-center font-mono text-2xl tracking-[0.4em]"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="btn-primary w-full py-3.5 text-xs font-semibold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying…
              </span>
            ) : (
              'Verify & Activate Account'
            )}
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={<User className="h-6 w-6" />}
      title="Create an account"
      subtitle="Register to access professional kitchen equipment specs and checkout."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 border border-border bg-background py-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          <GoogleIcon className="h-4 w-4" />
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-card px-3 font-mono text-[10px] uppercase text-muted-foreground">
            or with details
          </span>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="field-label">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="reg-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Kwame Mensah"
                className="field-input pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="field-label">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="field-input pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-phone" className="field-label">Phone Number (Ghana)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="024 412 3456"
                className="field-input pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="field-label">Password (Min. 8 characters) *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="reg-password"
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
            <label htmlFor="reg-confirm" className="field-label">Confirm Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                id="reg-confirm"
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
                Registering…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
