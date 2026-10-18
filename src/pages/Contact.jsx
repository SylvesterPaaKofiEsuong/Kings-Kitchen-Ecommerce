import React, { useState } from 'react';
import { Mail, MapPin, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { createContactInquiry } from '@/lib/store-data';

const SUBJECTS = [
  'General enquiry',
  'Order support',
  'Delivery & pickup logistics',
  'Warranty & repair claim',
  'Commercial & wholesale outfitting',
];

export default function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: SUBJECTS[0],
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createContactInquiry({
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject,
        message: formData.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      subject: SUBJECTS[0],
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <p className="kicker">Direct Consultation</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
          Talk to a specialist, not a script.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Reach our kitchen equipment team in Accra for specifications, commercial kitchen planning, delivery scheduling, or warranty assistance.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        {/* Left: Contact Form or Success Panel */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="border border-border bg-card p-8 md:p-10 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D4B73]/10 text-[#2D4B73] mb-5">
                <CheckCircle2 className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <p className="kicker mb-1">Transmission Confirmed</p>
              <h2 className="font-display text-2xl font-medium tracking-tight">
                Message received.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A member of our Accra technical culinary team will review your inquiry and respond to <strong>{formData.email}</strong> within one working day.
              </p>
              <div className="mt-8 pt-6 border-t border-border">
                <button type="button" onClick={handleReset} className="btn-outline">
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-border bg-card p-6 md:p-8 space-y-5">
              <div>
                <p className="kicker mb-1">Consultation Form</p>
                <h2 className="font-display text-xl font-medium">Send an inquiry</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="field-label">Full Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Kwame Mensah"
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="field-label">Email Address *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="kwame@example.com"
                    className="field-input"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-phone" className="field-label">Phone (Optional)</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="024 412 3456"
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="field-label">Subject *</label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="field-input bg-card"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="field-label">Message / Technical Requirement *</label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your kitchen equipment requirements, volume needs, or specific questions..."
                  className="field-input resize-none"
                />
              </div>

              {error && (
                <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="pt-2">
                <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
                  {submitting ? 'Transmitting…' : 'Submit Technical Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Studio Details, Hours & Direct Note */}
        <div className="space-y-6 lg:col-span-5">
          {/* Studio Location */}
          <div className="border border-border bg-card p-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <MapPin className="h-5 w-5 text-[#2D4B73]" strokeWidth={1.5} />
              <div>
                <p className="kicker mb-0">Technical Showroom</p>
                <h3 className="font-heading text-lg font-medium">Accra, Ghana</h3>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p className="text-foreground font-medium">King&apos;s Kitchen Culinary Equipment</p>
              <p>Airport Residential Area</p>
              <p>Greater Accra, Ghana</p>
              <p className="font-mono text-xs pt-2 text-[#2D4B73]">hello@kingskitchen.com.gh</p>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="border border-border bg-card p-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Clock className="h-5 w-5 text-[#2D4B73]" strokeWidth={1.5} />
              <div>
                <p className="kicker mb-0">Operating Hours</p>
                <h3 className="font-heading text-lg font-medium">Workshop & Showroom</h3>
              </div>
            </div>
            <table className="mt-4 w-full font-mono text-xs">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 text-muted-foreground">Monday – Friday</td>
                  <td className="py-2 text-right font-medium text-foreground">08:30 – 17:30</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Saturday</td>
                  <td className="py-2 text-right font-medium text-foreground">09:00 – 14:00</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Sunday</td>
                  <td className="py-2 text-right text-muted-foreground">Closed</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Existing Order Tip */}
          <div className="border border-border bg-secondary/40 p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-[#2D4B73] shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <h4 className="font-body text-sm font-semibold text-foreground">
                  Already have an active order?
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  For real-time delivery scheduling, courier updates, or notes on an existing purchase, please use the dedicated conversation thread directly on your order detail page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
