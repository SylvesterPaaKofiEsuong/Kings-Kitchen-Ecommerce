import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function PageNotFound() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="kicker mb-4">404 — Not Found</p>
      <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl">
        Page not found.
      </h1>
      <p className="mt-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      {user?.role === 'admin' && (
        <div className="mt-6 border border-amber-800 dark:border-amber-400 bg-amber-50 dark:bg-amber-900/10 px-5 py-3 text-left max-w-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-800 dark:text-amber-400 mb-1">
            Admin note
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-400">
            You're signed in as admin. This route may not be registered, or the URL is incorrect.
          </p>
        </div>
      )}
      <div className="mt-8 flex gap-4">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/shop" className="btn-outline">Browse Catalog</Link>
      </div>
    </div>
  );
}
