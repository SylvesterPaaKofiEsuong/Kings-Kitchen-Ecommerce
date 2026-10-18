import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Outlet, Navigate } from 'react-router-dom';

function DefaultFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-foreground" />
    </div>
  );
}

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError } = useAuth();

  if (isLoadingAuth || !authChecked) return fallback;
  if (authError) {
    if (authError.type === 'user_not_registered') {
      // UserNotRegisteredError rendered in App shell
      return null;
    }
    return unauthenticatedElement;
  }
  if (!isAuthenticated) return unauthenticatedElement;
  return <Outlet />;
}
