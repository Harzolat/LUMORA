/**
 * Central Brand & Site Configuration for LUMORA
 */

export const BRAND_CONFIG = {
  name: 'LUMORA',
  tagline: 'Quiet Luxury • African Craftsmanship • Contemporary Femininity',
  shortStatement: 'A contemporary fashion house from Nigeria, crafting ready-to-wear, bespoke garments, and luxury textiles for an international audience.',
  
  // Contact & Social Placeholders (unconfigured state until provided)
  whatsapp: {
    configured: false,
    displayNumber: '',
    rawNumber: '',
  },
  
  email: {
    configured: false,
    primary: '',
    customSewing: '',
  },

  social: {
    instagram: {
      configured: false,
      handle: '',
      url: '',
    },
  },

  location: {
    city: 'Lagos',
    country: 'Nigeria',
    configured: false,
    studio: '',
    shippingStatement: 'Worldwide express delivery available upon consultation.',
  },

  year: '2026',
};

/**
 * Generates a standard WhatsApp click-to-chat URL with optional pre-filled message.
 * Returns null if WhatsApp is not configured.
 */
export function buildWhatsAppLink(message?: string): string | null {
  if (!BRAND_CONFIG.whatsapp.configured || !BRAND_CONFIG.whatsapp.rawNumber) {
    return null;
  }
  const baseUrl = `https://wa.me/${BRAND_CONFIG.whatsapp.rawNumber}`;
  if (!message) return baseUrl;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Standard pricing text policy (Quiet luxury understated presentation)
 */
export const PRICING_PRESENTATION = {
  label: 'Contact for Pricing',
  customStatement: 'Prices provided upon inquiry based on fabric selection and bespoke measurements.',
};

