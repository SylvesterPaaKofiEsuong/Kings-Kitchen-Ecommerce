import React from 'react';
import ContactInfoForm from '@/components/profile/ContactInfoForm';
import PasswordForm from '@/components/profile/PasswordForm';
import AddressBook from '@/components/profile/AddressBook';

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <p className="kicker">Account Management</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
          Your Details
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Update your contact phone, password credentials, and saved fulfilment addresses.
        </p>
      </div>

      {/* Main Grid: Contact info & Security */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <ContactInfoForm />
        <PasswordForm />
      </div>

      {/* Address Book */}
      <div className="mt-10">
        <AddressBook />
      </div>
    </div>
  );
}
