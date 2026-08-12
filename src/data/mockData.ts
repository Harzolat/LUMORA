import { Product, Material, Collection } from '../types';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'heritage-aurora-2026',
    title: 'Heritage Aurora',
    subtitle: 'Resort & Evening High Couture 2026',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    editorialGallery: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An exploration of architectural drapery infused with contemporary West African silhouettes. Designed for moments of effortless presence.',
    story: 'Heritage Aurora draws inspiration from the warm glow of dusk across the Lagos skyline. Combining hand-loomed silk blends with hand-embroidered metallic accents, each piece pays homage to traditional West African royalty while maintaining a streamlined, modern feminine line.',
    year: '2026',
    season: 'Resort / Evening',
    featuredProductIds: ['lum-dress-01', 'lum-two-01', 'lum-trad-01', 'lum-dress-02']
  },
  {
    id: 'lagos-monolith-2026',
    title: 'Lagos Monolith',
    subtitle: 'Bespoke Tailoring & Clean Lines',
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
    editorialGallery: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Tailored two-piece sets and structured dresses celebrating quiet luxury and sharp, statuesque tailoring.',
    story: 'Designed for the globally minded woman who commands the room with subtle power. Lagos Monolith strips away visual noise in favor of immaculate cuts, custom bronze details, and fluid movement.',
    year: '2026',
    season: 'Spring / Summer',
    featuredProductIds: ['lum-two-02', 'lum-occ-01', 'lum-dress-03']
  },
  {
    id: 'solstice-silk-2025',
    title: 'Solstice & Silk',
    subtitle: 'Traditional Occasion & Bridal Couture',
    coverImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1600&q=80',
    editorialGallery: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Rich velvet, French corded lace, and handcrafted corsetry tailored for celebratory milestones.',
    story: 'Rooted in West African ceremony and joyous gatherings, Solstice & Silk balances opulent hand-beading with breathable silk linings to ensure timeless elegance and comfort.',
    year: '2025/2026',
    season: 'Occasion Wear',
    featuredProductIds: ['lum-trad-02', 'lum-occ-02', 'lum-dress-04']
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'lum-dress-01',
    name: 'The Zaria Asymmetric Silk Gown',
    subtitle: 'Draped Shoulder • Floor Length • Bronze Satin Accent',
    category: 'clothing',
    clothingCategory: 'Dresses',
    description: 'A sculptural floor-length dress crafted from heavyweight fluid silk. Features an asymmetrical draped neckline and a hidden corset interior that offers flawless structure.',
    editorialStory: 'Named after the historic northern Nigerian city known for architectural grace, the Zaria Gown reflects pure fluid luxury. Each pleat is hand-pinned in our Lagos atelier.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#171513' },
      { name: 'Ivory Sand', hex: '#E8DED0' },
      { name: 'Muted Bronze', hex: '#A88963' }
    ],
    sizes: ['UK 8 / US 4', 'UK 10 / US 6', 'UK 12 / US 8', 'UK 14 / US 10', 'UK 16 / US 12', 'Custom Measurements'],
    materialInfo: '100% Raw Silk Crepe with Breathable Viscose Lining',
    availability: 'Made to Order',
    featured: true,
    newArrival: true,
    collectionId: 'heritage-aurora-2026',
    tags: ['Evening', 'Red Carpet', 'Silk', 'Asymmetric']
  },
  {
    id: 'lum-two-01',
    name: 'The Moremi Tailored Silk Two-Piece',
    subtitle: 'Extended Wrap Blazer • High-Waist Wide Trouser',
    category: 'clothing',
    clothingCategory: 'Two-Piece',
    description: 'An commanding two-piece ensemble featuring a wrapped double-breasted jacket and flowing wide-leg trousers cut to elongate the silhouette.',
    editorialStory: 'The Moremi ensemble redefines power dressing with soft femininity. Designed for the modern leader, transitioning effortlessly from executive engagements to evening galas.',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Sandstone Ivory', hex: '#F7F3EC' },
      { name: 'Obsidian Black', hex: '#171513' }
    ],
    sizes: ['UK 8 / US 4', 'UK 10 / US 6', 'UK 12 / US 8', 'UK 14 / US 10', 'Custom Measurements'],
    materialInfo: 'Heavyweight Italian Wool-Silk Blend with Hand-finished Lapels',
    availability: 'In Stock',
    featured: true,
    newArrival: false,
    collectionId: 'lagos-monolith-2026',
    tags: ['Tailored', 'Blazer', 'Two-Piece', 'Suiting']
  },
  {
    id: 'lum-trad-01',
    name: 'The Queen Amina Beaded Corset Iro & Buba Set',
    subtitle: 'Modern Nigerian Traditional • Hand-Beaded French Lace',
    category: 'clothing',
    clothingCategory: 'Traditional',
    description: 'A contemporary interpretation of the classic Yoruba Iro & Buba. Incorporates a boned internal corset top adorned with tonal glass seed beads and a structured wrapper skirt.',
    editorialStory: 'Honoring heritage while embracing contemporary precision. Ideal for milestone celebrations, traditional weddings, and cultural galas.',
    images: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Muted Bronze & Gold', hex: '#A88963' },
      { name: 'Midnight Obsidian', hex: '#171513' }
    ],
    sizes: ['UK 8 / US 4', 'UK 10 / US 6', 'UK 12 / US 8', 'UK 14 / US 10', 'UK 16 / US 12', 'Bespoke Fitting'],
    materialInfo: 'Hand-beaded French Chantilly Lace & Silk Satin Wrapper',
    availability: 'Made to Order',
    featured: true,
    newArrival: true,
    collectionId: 'solstice-silk-2025',
    tags: ['Traditional', 'Lagos Wedding', 'Beaded', 'Corset']
  },
  {
    id: 'lum-dress-02',
    name: 'The Oya Flared Column Midi',
    subtitle: 'Sculpted Waistline • Pleated Hemline',
    category: 'clothing',
    clothingCategory: 'Dresses',
    description: 'An understated midi column dress showcasing clean tailoring with a pleated flared hem that dances with every step.',
    editorialStory: 'Minimalism at its highest expression. The Oya Midi is structured through internal darts to highlight the waist without restricting natural ease.',
    images: [
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Terracotta Earth', hex: '#A88963' },
      { name: 'Deep Obsidian', hex: '#171513' }
    ],
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14'],
    materialInfo: 'Double-face Crepe Satin',
    availability: 'In Stock',
    featured: false,
    newArrival: true,
    collectionId: 'heritage-aurora-2026',
    tags: ['Midi', 'Cocktail', 'Minimalist']
  },
  {
    id: 'lum-occ-01',
    name: 'The Idia Velvet Corseted Gala Dress',
    subtitle: 'Sweetheart Neckline • Hand-embroidered Gold Motif',
    category: 'clothing',
    clothingCategory: 'Occasion Wear',
    description: 'A breathtaking gala dress crafted from plush cotton-silk velvet with subtle hand-embroidered metallic thread along the bodice spine.',
    editorialStory: 'Designed for grand occasions. The velvet weight provides effortless drape while keeping thermal comfort balanced.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Rich Velvet Obsidian', hex: '#171513' },
      { name: 'Earthy Bronze', hex: '#8C6D48' }
    ],
    sizes: ['UK 8', 'UK 10', 'UK 12', 'UK 14', 'Custom Order'],
    materialInfo: 'Plush Cotton-Silk Velvet with Micro-beading',
    availability: 'Limited Piece',
    featured: true,
    newArrival: false,
    collectionId: 'solstice-silk-2025',
    tags: ['Gala', 'Velvet', 'Occasion']
  },
  {
    id: 'lum-two-02',
    name: 'The Eko Drape Vest & Tapered Trouser Set',
    subtitle: 'Asymmetric Vest • Cropped Tailored Pants',
    category: 'clothing',
    clothingCategory: 'Two-Piece',
    description: 'A lightweight linen-silk ensemble incorporating an asymmetric button-down vest paired with sharp ankle-tapered pants.',
    editorialStory: 'Tailored for warm tropical days and summer soirées. Breathable fabric combined with elevated urban tailoring.',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Warm Ivory Sand', hex: '#E8DED0' },
      { name: 'Oatmeal Natural', hex: '#F7F3EC' }
    ],
    sizes: ['UK 8', 'UK 10', 'UK 12', 'UK 14'],
    materialInfo: 'Organic Linen-Silk Blend',
    availability: 'In Stock',
    featured: false,
    newArrival: true,
    collectionId: 'lagos-monolith-2026',
    tags: ['Resort', 'Linen', 'Two-Piece']
  }
];

export const MOCK_MATERIALS: Material[] = [
  {
    id: 'mat-lace-01',
    name: 'Lumora Imperial Corded French Lace',
    category: 'Lace',
    description: 'An extraordinarily intricate corded French lace featuring raised floral filigree and subtle metallic gold thread woven along scalloped borders.',
    textureNotes: 'Supple yet structured drape with micro-bead embellishment along border floral motifs.',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Sandstone Gold', hex: '#A88963' },
      { name: 'Obsidian Noir', hex: '#171513' },
      { name: 'Ivory Cream', hex: '#F7F3EC' }
    ],
    availability: 'Available by Yard',
    origin: 'Imported French Weave, Custom Finished in Lagos',
    featured: true,
    recommendedFor: ['Occasion Gowns', 'Bridal Wear', 'Bespoke Iro & Buba', 'Statement Sleeves']
  },
  {
    id: 'mat-silk-01',
    name: 'Lumora Heavyweight Fluid Silk Satin',
    category: 'Silk',
    description: 'A 40mm Mulberry silk satin with unmatched lustre and heavy, liquid drape that skims the body without clinging.',
    textureNotes: 'Silky smooth face with a rich matte back for premium comfort against the skin.',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Muted Bronze', hex: '#A88963' },
      { name: 'Ivory Sand', hex: '#E8DED0' },
      { name: 'Deep Obsidian', hex: '#171513' }
    ],
    availability: 'Available by Yard',
    origin: '100% Pure Mulberry Silk',
    featured: true,
    recommendedFor: ['Asymmetric Gowns', 'Fluid Slip Dresses', 'Bespoke Lining', 'Evening Wraps']
  },
  {
    id: 'mat-velvet-01',
    name: 'Lumora Plush Royal Cotton-Silk Velvet',
    category: 'Velvet',
    description: 'Ultra-dense cotton-silk blend velvet offering deep shadow dimensions and luxurious softness suited for evening tailoring.',
    textureNotes: 'Dense short pile with soft luminous sheen under focal lighting.',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Midnight Obsidian', hex: '#171513' },
      { name: 'Earthy Amber', hex: '#8C6D48' }
    ],
    availability: 'Exclusive Batch',
    origin: 'Custom Milled Italian Velvet',
    featured: false,
    recommendedFor: ['Corseted Gowns', 'Tailored Jackets', 'Structured Wrappers']
  },
  {
    id: 'mat-ankara-01',
    name: 'Lumora Heritage Wax Print Silk-Cotton',
    category: 'Ankara',
    description: 'An elevated, high-thread-count wax print crafted on a soft silk-cotton substrate rather than stiff canvas.',
    textureNotes: 'Featherlight softness with rich color vibrancy on both sides.',
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Bronze & Obsidian Geometric', hex: '#A88963' },
      { name: 'Ivory & Gold Spiral', hex: '#E8DED0' }
    ],
    availability: 'Limited Stock',
    origin: 'Bespoke Nigerian Artisan Print',
    featured: true,
    recommendedFor: ['Contemporary Dresses', 'Two-Piece Suits', 'Statement Scarves']
  },
  {
    id: 'mat-chiffon-01',
    name: 'Lumora Sheer Organza Silk Chiffon',
    category: 'Chiffon',
    description: 'Ethereal sheer chiffon with a subtle metallic thread lattice, ideal for layered capes, sheer overlays, and airy trains.',
    textureNotes: 'Light as air with crisp architectural shape retention.',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80'
    ],
    colors: [
      { name: 'Sandstone Ivory', hex: '#F7F3EC' },
      { name: 'Bronze Shimmer', hex: '#A88963' }
    ],
    availability: 'Available by Yard',
    origin: 'Silk Blend Sheer Weave',
    featured: false,
    recommendedFor: ['Draped Capes', 'Sheer Sleeves', 'Over-skirts', 'Veils']
  }
];
