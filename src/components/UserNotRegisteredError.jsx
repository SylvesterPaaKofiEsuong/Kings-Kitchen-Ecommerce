import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function UserNotRegisteredError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="h-7 w-7 text-amber-600" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl font-medium">Access Restricted</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account isn't set up with the right permissions to access this application.
          </p>
          <div className="mt-6 border border-border bg-muted/40 p-4 text-left">
            <p className="kicker mb-2">What you can do</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Try signing in with a different account</li>
              <li>• Contact <a href="mailto:hello@kingskitchen.com.gh" className="text-foreground underline">hello@kingskitchen.com.gh</a> to request access</li>
              <li>• Return to the <a href="/login" className="text-foreground underline">login page</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
