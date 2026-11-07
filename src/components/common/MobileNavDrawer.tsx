import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ArrowRight, Instagram, Mail } from 'lucide-react';
import { BRAND_CONFIG, buildWhatsAppLink } from '../../config/brand';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  currentPath,
  onNavigate,
}) => {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Clothing', path: '/shop/clothing' },
    { label: 'Materials', path: '/shop/materials' },
    { label: 'Collections', path: '/collections' },
    { label: 'Custom Sewing', path: '/custom-sewing' },
    { label: 'About Lumora', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  const whatsappUrl = buildWhatsAppLink('Hello Lumora, I am inquiring about your fashion collections and services.');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#171513]/60 backdrop-blur-sm md:hidden"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[#171513] text-[#F7F3EC] p-6 flex flex-col justify-between overflow-y-auto md:hidden shadow-2xl border-l border-[#A88963]/20"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E8DED0]/15">
                <span className="font-serif text-2xl tracking-[0.25em] text-[#F7F3EC]">
                  LUMORA
                </span>
                <button
                  onClick={onClose}
                  className="p-2 text-[#E8DED0] hover:text-[#A88963] transition-colors rounded-full focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-8 space-y-4">
                {navItems.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleLinkClick(item.path)}
                      className={`w-full flex items-center justify-between text-left py-2 text-lg font-light tracking-wider transition-all duration-300 ${
                        isActive
                          ? 'text-[#A88963] font-medium translate-x-2'
                          : 'text-[#F7F3EC]/80 hover:text-[#F7F3EC] hover:translate-x-1'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <ArrowRight className="w-4 h-4 text-[#A88963]" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Footer / CTA Section */}
            <div className="pt-8 border-t border-[#E8DED0]/15 space-y-6">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#A88963] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#8C6D48] transition-colors rounded-none shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>
              ) : (
                <button
                  onClick={() => handleLinkClick('/contact')}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#A88963] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#8C6D48] transition-colors rounded-none shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Atelier</span>
                </button>
              )}

              <div className="space-y-2 text-xs text-[#E8DED0]/70 font-light">
                {BRAND_CONFIG.email.configured && BRAND_CONFIG.email.primary && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#A88963]" />
                    <span>{BRAND_CONFIG.email.primary}</span>
                  </div>
                )}
                {BRAND_CONFIG.social.instagram.configured && BRAND_CONFIG.social.instagram.handle && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-[#A88963]" />
                    <span>{BRAND_CONFIG.social.instagram.handle}</span>
                  </div>
                )}
                <p className="pt-2 text-[10px] text-[#E8DED0]/40 uppercase tracking-widest">
                  Lagos, Nigeria • Worldwide Delivery
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
