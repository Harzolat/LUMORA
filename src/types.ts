/**
 * Core Data Models & Types for LUMORA Foundation Application
 */

export type ProductCategory = 'clothing' | 'materials';

export type CatalogStatus = 'draft' | 'published' | 'archived';

export type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';

export type SewingStatus =
  | 'new'
  | 'reviewing'
  | 'quoted'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'Received'
  | 'Under Review'
  | 'Consultation Scheduled'
  | 'In Production';

export type ContactStatus = 'new' | 'contacted' | 'completed' | 'archived';

export type StaffRole = 'owner' | 'admin' | 'editor';

export type ClothingCategory =
  | 'All'
  | 'Dresses'
  | 'Two-Piece'
  | 'Traditional'
  | 'Occasion Wear'
  | 'New Arrivals'
  | 'Featured';

export type MaterialCategory =
  | 'All'
  | 'Lace'
  | 'Ankara'
  | 'Silk'
  | 'Chiffon'
  | 'Velvet'
  | 'Other';

export interface ColorOption {
  name: string;
  hex?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  subtitle?: string;
  category: 'clothing';
  clothingCategory: ClothingCategory;
  description: string;
  editorialStory?: string;
  images: string[];
  colors: ColorOption[];
  sizes: string[];
  materialInfo: string;
  availability: 'In Stock' | 'Made to Order' | 'Limited Piece';
  featured?: boolean;
  newArrival?: boolean;
  collectionId?: string;
  tags?: string[];
  status?: CatalogStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Material {
  id: string;
  name: string;
  slug?: string;
  category: MaterialCategory;
  description: string;
  textureNotes?: string;
  images: string[];
  colors: ColorOption[];
  availability: 'Available by Yard' | 'Exclusive Batch' | 'Limited Stock';
  origin?: string;
  featured?: boolean;
  recommendedFor?: string[];
  status?: CatalogStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  title: string;
  name?: string;
  slug?: string;
  subtitle: string;
  coverImage: string;
  heroImage?: string;
  editorialGallery: string[];
  gallery?: string[];
  description: string;
  story: string;
  year: string;
  season: string;
  featuredProductIds: string[];
  productIds?: string[];
  status?: CatalogStatus;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInquiry {
  id: string;
  itemType?: 'product' | 'material';
  itemId?: string;
  productId?: string;
  productName: string;
  customerName: string;
  email: string;
  phone: string;
  question: string;
  status?: InquiryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomSewingRequest {
  id: string;
  trackingCode: string;
  garmentType: 'Dress' | 'Two-Piece' | 'Traditional' | 'Bridal' | 'Occasion Wear' | 'Other' | string;
  designVision?: string;
  designDescription?: string;
  colorPreference: string;
  fabricPreference: string;
  styleNotes: string;
  measurements: {
    bust?: string;
    waist?: string;
    hips?: string;
    height?: string;
    additionalNotes?: string;
    scheduleSession?: boolean;
  };
  inspirationImages: string[];
  eventDate?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  customerName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt?: string;
  status: SewingStatus;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: ContactStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface StaffUser {
  uid: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type AppRoute =
  | { path: '/' }
  | { path: '/shop' }
  | { path: '/shop/clothing'; filter?: ClothingCategory }
  | { path: '/shop/materials'; filter?: MaterialCategory }
  | { path: '/product/:id'; id: string }
  | { path: '/material/:id'; id: string }
  | { path: '/collections' }
  | { path: '/collections/:id'; id: string }
  | { path: '/custom-sewing' }
  | { path: '/about' }
  | { path: '/contact' }
  | { path: '/admin/login' }
  | { path: '/admin' }
  | { path: '/admin/catalog' };

