import React, { useState, useEffect } from 'react';
import { Menu, MessageCircle } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { buildWhatsAppLink } from '../../config/brand';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/collections' },
    { label: 'Custom Sewing', path: '/custom-sewing' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const whatsappUrl = buildWhatsAppLink('Hello Lumora, I am interested in your luxury fashion collections.');

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F3EC]/95 backdrop-blur-md shadow-xs border-b border-[#E8DED0]/80 py-3.5'
            : 'bg-[#F7F3EC] py-5 border-b border-[#E8DED0]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo Wordmark */}
          <button
            onClick={() => onNavigate('/')}
            className="group text-left focus:outline-none"
            aria-label="LUMORA Home"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.3em] font-normal text-[#171513] group-hover:text-[#A88963] transition-colors block">
              LUMORA
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#A88963] font-sans block -mt-1 opacity-90">
              LAGOS • HIGH COUTURE
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path === '/shop' && currentPath.startsWith('/shop'));
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`text-xs uppercase tracking-[0.2em] font-medium transition-all relative py-1 focus:outline-none ${
                    isActive
                      ? 'text-[#171513]'
                      : 'text-[#171513]/70 hover:text-[#171513]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#A88963] animate-in fade-in duration-300" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* WhatsApp or Inquiry CTA Button */}
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 py-2 px-4 border border-[#171513] text-[#171513] hover:bg-[#171513] hover:text-[#F7F3EC] transition-all duration-300 text-[11px] uppercase tracking-[0.2em] font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#A88963]" />
                <span>WhatsApp</span>
              </a>
            ) : (
              <button
                onClick={() => onNavigate('/contact')}
                className="hidden sm:inline-flex items-center gap-2 py-2 px-4 border border-[#171513] text-[#171513] hover:bg-[#171513] hover:text-[#F7F3EC] transition-all duration-300 text-[11px] uppercase tracking-[0.2em] font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#A88963]" />
                <span>Inquire</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-[#171513] hover:text-[#A88963] transition-colors focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
    </>
  );
};
