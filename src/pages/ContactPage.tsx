import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, Send, CheckCircle2, Instagram } from 'lucide-react';
import { BRAND_CONFIG, buildWhatsAppLink } from '../config/brand';
import { submitContactSubmission } from '../services/submissionService';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await submitContactSubmission({
        name,
        email,
        phone,
        message,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'Failed to submit message. Please try again.');
    }
  };

  const whatsappUrl = buildWhatsAppLink('Hello Lumora, I am reaching out from your Contact page with an inquiry.');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
          Client Relations & Atelier Contact
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#171513]">
          Connect With Lumora
        </h1>
        <p className="text-sm font-light text-[#171513]/80 leading-relaxed font-serif italic">
          We welcome inquiries from clients across Nigeria and around the world. Our client advisors are at your service for orders, bespoke requests, and press inquiries.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info Left Column */}
        <div className="lg:col-span-5 space-y-8 bg-[#171513] text-[#F7F3EC] p-8 border border-[#A88963]/30 shadow-lg">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
              Direct Communication
            </span>
            <h2 className="font-serif text-2xl text-[#F7F3EC] mt-1">
              Atelier Channels
            </h2>
          </div>

          <div className="space-y-6 text-sm font-light text-[#E8DED0]/90">
            {/* WhatsApp CTA */}
            {whatsappUrl && BRAND_CONFIG.whatsapp.configured && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#F7F3EC]/10 border border-[#A88963]/30 hover:bg-[#A88963] hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#A88963]/20 flex items-center justify-center text-[#A88963] group-hover:bg-white group-hover:text-[#171513]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#A88963] font-medium block group-hover:text-white">
                    WhatsApp Concierge
                  </span>
                  <span className="text-xs font-mono">{BRAND_CONFIG.whatsapp.displayNumber}</span>
                </div>
              </a>
            )}

            {/* Email CTA */}
            {BRAND_CONFIG.email.configured && BRAND_CONFIG.email.primary && (
              <a
                href={`mailto:${BRAND_CONFIG.email.primary}`}
                className="flex items-center gap-4 p-4 bg-[#F7F3EC]/10 border border-[#A88963]/30 hover:bg-[#A88963] hover:text-white transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#A88963]/20 flex items-center justify-center text-[#A88963] group-hover:bg-white group-hover:text-[#171513]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#A88963] font-medium block group-hover:text-white">
                    Email Atelier
                  </span>
                  <span className="text-xs font-mono">{BRAND_CONFIG.email.primary}</span>
                </div>
              </a>
            )}

            {/* Location */}
            {BRAND_CONFIG.location.configured && BRAND_CONFIG.location.studio && (
              <div className="flex items-start gap-4 p-4 bg-[#F7F3EC]/5 border border-[#E8DED0]/10">
                <MapPin className="w-5 h-5 text-[#A88963] mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-[#A88963] font-medium block">
                    Studio Location
                  </span>
                  <p className="text-xs">{BRAND_CONFIG.location.studio}</p>
                  <p className="text-[11px] text-[#A88963] italic">Fittings by appointment only</p>
                </div>
              </div>
            )}

            {/* Instagram */}
            {BRAND_CONFIG.social.instagram.configured && BRAND_CONFIG.social.instagram.handle && (
              <a
                href={BRAND_CONFIG.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-[#E8DED0]/80 hover:text-[#A88963] transition-colors pt-2"
              >
                <Instagram className="w-4 h-4 text-[#A88963]" />
                <span>Follow {BRAND_CONFIG.social.instagram.handle}</span>
              </a>
            )}

            {/* Default Atelier info block when direct links not yet configured */}
            {!BRAND_CONFIG.whatsapp.configured && !BRAND_CONFIG.email.configured && (
              <div className="p-4 bg-[#F7F3EC]/5 border border-[#A88963]/30 text-xs text-[#E8DED0]/80 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#A88963] font-medium block">
                  Digital Concierge
                </span>
                <p>
                  Please submit your inquiry via the secure form on the right. Our client management team monitors submissions continuously and will respond directly to your email or phone.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Right Column */}
        <div className="lg:col-span-7 bg-[#F7F3EC] border border-[#E8DED0] p-8 shadow-sm">
          {!isSubmitted ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-[#171513]">
                  Send a Message
                </h3>
                <p className="text-xs text-[#171513]/70 font-light mt-1">
                  Fill in your details below and our client services team will respond within 24 hours.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-l-2 border-red-500 text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Zainab Ibrahim"
                    className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="zainab@example.com"
                      className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your order, press inquiry, or custom request..."
                    className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#A88963] transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Transmitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#A88963] mx-auto" />
              <h3 className="font-serif text-2xl text-[#171513]">
                Message Sent
              </h3>
              <p className="text-sm font-light text-[#171513]/80 max-w-md mx-auto">
                Thank you for contacting Lumora. Our client team will reach out via email or WhatsApp shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 py-2.5 px-6 border border-[#171513] text-[#171513] text-xs uppercase tracking-widest hover:bg-[#171513] hover:text-white transition-colors"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

