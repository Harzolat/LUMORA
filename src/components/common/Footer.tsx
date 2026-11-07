import React from 'react';
import { MessageCircle, Mail, Instagram, MapPin, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG, buildWhatsAppLink } from '../../config/brand';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const whatsappUrl = buildWhatsAppLink('Hello Lumora, I am making a general inquiry from your website.');

  return (
    <footer className="bg-[#171513] text-[#F7F3EC] pt-16 pb-12 border-t border-[#A88963]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#E8DED0]/10">
          
          {/* Brand Info & Mission */}
          <div className="md:col-span-5 space-y-6">
            <button
              onClick={() => onNavigate('/')}
              className="text-left focus:outline-none group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[#A88963]/40 flex items-center justify-center rounded-full">
                  <span className="font-serif italic text-base text-[#A88963]">L</span>
                </div>
                <div>
                  <span className="font-serif text-3xl tracking-widest-xl font-light text-[#F7F3EC] group-hover:text-[#A88963] transition-colors block">
                    LUMORA
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-sans block mt-0.5">
                    Lagos • London • New York
                  </span>
                </div>
              </div>
            </button>

            <p className="text-sm font-light leading-relaxed text-[#E8DED0]/80 max-w-md">
              {BRAND_CONFIG.shortStatement}
            </p>

            {BRAND_CONFIG.location.configured && BRAND_CONFIG.location.studio && (
              <div className="pt-2 flex items-center gap-2 text-xs text-[#A88963] font-mono">
                <MapPin className="w-3.5 h-3.5" />
                <span>{BRAND_CONFIG.location.studio}</span>
              </div>
            )}
          </div>

          {/* Quick Links Column 1 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#A88963] font-medium">
              Explore
            </h4>
            <ul className="space-y-3 text-sm font-light text-[#E8DED0]/80">
              <li>
                <button
                  onClick={() => onNavigate('/shop')}
                  className="hover:text-[#F7F3EC] transition-colors hover:underline underline-offset-4"
                >
                  Shop All
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/clothing')}
                  className="hover:text-[#F7F3EC] transition-colors hover:underline underline-offset-4"
                >
                  Clothing Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/materials')}
                  className="hover:text-[#F7F3EC] transition-colors hover:underline underline-offset-4"
                >
                  Materials & Fabrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/collections')}
                  className="hover:text-[#F7F3EC] transition-colors hover:underline underline-offset-4"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/custom-sewing')}
                  className="hover:text-[#F7F3EC] transition-colors hover:underline underline-offset-4"
                >
                  Custom Sewing & Bespoke
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#A88963] font-medium">
              The Brand
            </h4>
            <ul className="space-y-3 text-sm font-light text-[#E8DED0]/80">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#F7F3EC] transition-colors hover:underline underline-offset-4"
                >
                  About Lumora
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#F7F3EC] transition-colors hover:underline underline-offset-4"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#A88963] font-medium">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs text-[#E8DED0]/80 font-light">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#A88963] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#A88963]" />
                  <span>WhatsApp Atelier</span>
                  <ArrowUpRight className="w-3 h-3 text-[#E8DED0]/50" />
                </a>
              )}

              {BRAND_CONFIG.email.configured && BRAND_CONFIG.email.primary && (
                <a
                  href={`mailto:${BRAND_CONFIG.email.primary}`}
                  className="flex items-center gap-2 hover:text-[#A88963] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#A88963]" />
                  <span className="truncate">{BRAND_CONFIG.email.primary}</span>
                </a>
              )}

              {BRAND_CONFIG.social.instagram.configured && BRAND_CONFIG.social.instagram.handle && (
                <a
                  href={BRAND_CONFIG.social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#A88963] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#A88963]" />
                  <span>{BRAND_CONFIG.social.instagram.handle}</span>
                </a>
              )}

              <button
                onClick={() => onNavigate('/contact')}
                className="flex items-center gap-2 hover:text-[#A88963] transition-colors text-left"
              >
                <Mail className="w-4 h-4 text-[#A88963]" />
                <span>Client Inquiry Form</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-light text-[#E8DED0]/60 gap-4">
          <p>© {BRAND_CONFIG.year} LUMORA. All rights reserved.</p>
          <p className="text-[11px] tracking-wider uppercase text-[#A88963]">
            {BRAND_CONFIG.location.shippingStatement}
          </p>
        </div>
      </div>
    </footer>
  );
};
