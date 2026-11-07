import React, { useState, useEffect, useCallback } from 'react';
import { subscribeToStaffAuthState, logoutStaff } from '../services/staffAuthService';
import {
  StaffUser,
  Product,
  Material,
  Collection,
  CatalogStatus,
  ClothingCategory,
  MaterialCategory,
  ColorOption,
} from '../types';
import {
  fetchAllProductsAdmin,
  saveProductAdmin,
  deleteProductAdmin,
  fetchAllMaterialsAdmin,
  saveMaterialAdmin,
  deleteMaterialAdmin,
  fetchAllCollectionsAdmin,
  saveCollectionAdmin,
  deleteCollectionAdmin,
  updateCatalogItemStatusAdmin,
} from '../services/catalogService';
import { uploadMediaAsset } from '../services/storageService';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Layers,
  Package,
  Scissors,
  Building2,
  LogOut,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  Upload,
  Check,
  Star,
  ArrowLeft,
  Eye,
  FileText,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface AdminCatalogPageProps {
  onNavigate: (path: string) => void;
}

type TabType = 'products' | 'materials' | 'collections';

const CLOTHING_CATEGORIES: ClothingCategory[] = [
  'Dresses',
  'Two-Piece',
  'Traditional',
  'Occasion Wear',
  'New Arrivals',
  'Featured',
];

const MATERIAL_CATEGORIES: MaterialCategory[] = [
  'Lace',
  'Ankara',
  'Silk',
  'Chiffon',
  'Velvet',
  'Other',
];

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Measurement'];

export const AdminCatalogPage: React.FC<AdminCatalogPageProps> = ({ onNavigate }) => {
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Active Catalog Tab & Filters
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [statusFilter, setStatusFilter] = useState<'all' | CatalogStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data Collections
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Feedback Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingType, setEditingType] = useState<TabType>('products');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Deletion Dialog State
  const [deletingTarget, setDeletingTarget] = useState<{
    type: TabType;
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show Toast
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Auth Verification
  useEffect(() => {
    const unsubscribe = subscribeToStaffAuthState((_user, profile) => {
      if (profile && profile.active && ['owner', 'admin', 'editor'].includes(profile.role)) {
        setStaff(profile);
        setAuthLoading(false);
      } else {
        setStaff(null);
        setAuthLoading(false);
        onNavigate('/admin/login');
      }
    });
    return () => unsubscribe();
  }, [onNavigate]);

  // Load All Admin Data
  const loadAdminCatalog = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [prods, mats, cols] = await Promise.all([
        fetchAllProductsAdmin(),
        fetchAllMaterialsAdmin(),
        fetchAllCollectionsAdmin(),
      ]);
      setProducts(prods);
      setMaterials(mats);
      setCollections(cols);
    } catch (err: any) {
      console.error('Error loading admin catalog:', err);
      setDataError('Failed to load catalog items from Firestore. Please check connection.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (staff) {
      loadAdminCatalog();
    }
  }, [staff, loadAdminCatalog]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logoutStaff();
      onNavigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Quick Status Toggle
  const handleQuickStatusChange = async (
    type: TabType,
    id: string,
    newStatus: CatalogStatus
  ) => {
    // Optimistic UI Update
    if (type === 'products') {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } else if (type === 'materials') {
      setMaterials((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } else {
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    }

    try {
      const itemType = type === 'products' ? 'product' : type === 'materials' ? 'material' : 'collection';
      await updateCatalogItemStatusAdmin(itemType, id, newStatus);
      showToast(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update status in Firestore', 'error');
      loadAdminCatalog(); // revert on error
    }
  };

  // Open Editor for New Item
  const handleOpenCreateModal = (type: TabType) => {
    setEditingType(type);
    setNewImageUrl('');

    if (type === 'products') {
      setEditingItem({
        name: '',
        subtitle: '',
        category: 'clothing',
        clothingCategory: 'Dresses',
        description: '',
        editorialStory: '',
        images: [],
        colors: [{ name: 'Default Black', hex: '#171513' }],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        materialInfo: '',
        availability: 'In Stock',
        featured: false,
        newArrival: true,
        collectionId: collections[0]?.id || '',
        tags: ['New Season'],
        status: 'draft',
      } as Partial<Product>);
    } else if (type === 'materials') {
      setEditingItem({
        name: '',
        category: 'Lace',
        description: '',
        textureNotes: '',
        images: [],
        colors: [{ name: 'Gold Accent', hex: '#D4AF37' }],
        availability: 'Available by Yard',
        origin: 'Exclusive Import',
        featured: false,
        recommendedFor: ['Occasion Wear', 'Bridal Gowns'],
        status: 'draft',
      } as Partial<Material>);
    } else {
      setEditingItem({
        title: '',
        subtitle: '',
        coverImage: '',
        heroImage: '',
        editorialGallery: [],
        description: '',
        story: '',
        year: `${new Date().getFullYear()}`,
        season: 'Spring / Summer',
        featuredProductIds: [],
        featured: false,
        status: 'draft',
      } as Partial<Collection>);
    }

    setIsEditorOpen(true);
  };

  // Open Editor for Existing Item
  const handleOpenEditModal = (type: TabType, item: any) => {
    setEditingType(type);
    setEditingItem({ ...item });
    setNewImageUrl('');
    setIsEditorOpen(true);
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const categoryPath =
        editingType === 'products'
          ? 'products'
          : editingType === 'materials'
          ? 'materials'
          : 'collections';
      const url = await uploadMediaAsset(categoryPath, file);

      if (editingType === 'collections') {
        if (!editingItem.coverImage) {
          setEditingItem((prev: any) => ({ ...prev, coverImage: url }));
        } else {
          setEditingItem((prev: any) => ({
            ...prev,
            editorialGallery: [...(prev.editorialGallery || []), url],
          }));
        }
      } else {
        setEditingItem((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), url],
        }));
      }

      showToast('Image uploaded successfully to Firebase Storage');
    } catch (err: any) {
      console.error('Image upload error:', err);
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add External Image URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const url = newImageUrl.trim();

    if (editingType === 'collections') {
      if (!editingItem.coverImage) {
        setEditingItem((prev: any) => ({ ...prev, coverImage: url }));
      } else {
        setEditingItem((prev: any) => ({
          ...prev,
          editorialGallery: [...(prev.editorialGallery || []), url],
        }));
      }
    } else {
      setEditingItem((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
    }

    setNewImageUrl('');
  };

  // Save Modal Item
  const handleSaveModal = async () => {
    if (!editingItem) return;

    if (editingType === 'products' && !editingItem.name?.trim()) {
      showToast('Product name is required', 'error');
      return;
    }
    if (editingType === 'materials' && !editingItem.name?.trim()) {
      showToast('Material name is required', 'error');
      return;
    }
    if (editingType === 'collections' && !editingItem.title?.trim() && !editingItem.name?.trim()) {
      showToast('Collection title is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingType === 'products') {
        const saved = await saveProductAdmin(editingItem);
        setProducts((prev) => {
          const idx = prev.findIndex((p) => p.id === saved.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = saved;
            return copy;
          }
          return [saved, ...prev];
        });
        showToast(`Garment "${saved.name}" saved successfully`);
      } else if (editingType === 'materials') {
        const saved = await saveMaterialAdmin(editingItem);
        setMaterials((prev) => {
          const idx = prev.findIndex((m) => m.id === saved.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = saved;
            return copy;
          }
          return [saved, ...prev];
        });
        showToast(`Textile "${saved.name}" saved successfully`);
      } else {
        const saved = await saveCollectionAdmin(editingItem);
        setCollections((prev) => {
          const idx = prev.findIndex((c) => c.id === saved.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = saved;
            return copy;
          }
          return [saved, ...prev];
        });
        showToast(`Collection "${saved.title}" saved successfully`);
      }

      setIsEditorOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      console.error('Error saving item:', err);
      showToast(err.message || 'Error saving item to Firestore', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Execute Deletion
  const handleConfirmDelete = async () => {
    if (!deletingTarget) return;

    setIsDeleting(true);
    try {
      const { type, id, title } = deletingTarget;
      if (type === 'products') {
        await deleteProductAdmin(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else if (type === 'materials') {
        await deleteMaterialAdmin(id);
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      } else {
        await deleteCollectionAdmin(id);
        setCollections((prev) => prev.filter((c) => c.id !== id));
      }

      showToast(`Deleted "${title}" permanently`);
      setDeletingTarget(null);
    } catch (err: any) {
      console.error('Error deleting item:', err);
      showToast(err.message || 'Failed to delete item', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clothingCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCollections = collections.filter((c) => {
    const title = c.title || c.name || '';
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.season && c.season.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F7F3EC]">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#8C7355] border-t-transparent"></div>
          <p className="text-xs uppercase tracking-widest text-[#665E55] font-medium">
            Authenticating Atelier Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!staff) return null;

  const roleBadgeStyle: Record<string, string> = {
    owner: 'bg-[#171513] text-[#D4AF37] border-[#D4AF37]/30',
    admin: 'bg-[#2D2926] text-[#F7F3EC] border-[#8C7355]/40',
    editor: 'bg-[#EBE5DA] text-[#171513] border-[#8C7355]/30',
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#171513] pb-16">
      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-xl border flex items-center gap-3 transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-[#171513] text-[#F7F3EC] border-[#D4AF37]'
              : 'bg-red-900 text-white border-red-500'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
          )}
          <span className="text-xs font-medium tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb Bar */}
      <header className="bg-[#FFFFFF] border-b border-[#E5DFD5] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/admin')}
              className="p-2 text-[#665E55] hover:text-[#171513] hover:bg-[#F7F3EC] rounded-lg transition-colors border border-transparent hover:border-[#E5DFD5]"
              title="Return to Staff Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#8C7355] uppercase">
                  LUMORA ATELIER
                </span>
                <span className="text-[#C5BCB0]">•</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#171513]">
                  Catalog Management System
                </span>
              </div>
              <h1 className="text-xl font-serif text-[#171513] font-medium">
                Inventory & Editorial Catalog
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-medium text-[#171513]">{staff.name}</span>
              <span
                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                  roleBadgeStyle[staff.role] || roleBadgeStyle.editor
                }`}
              >
                {staff.role}
              </span>
            </div>

            <button
              onClick={() => onNavigate('/')}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#171513] bg-[#F7F3EC] hover:bg-[#EBE5DA] border border-[#E5DFD5] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Public Storefront</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Tab Navigation & Item Counter Bar */}
        <div className="bg-[#FFFFFF] p-2 border border-[#E5DFD5] rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'products'
                  ? 'bg-[#171513] text-[#F7F3EC] shadow-sm'
                  : 'text-[#665E55] hover:text-[#171513] hover:bg-[#F7F3EC]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Clothing & Garments</span>
              <span
                className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'products'
                    ? 'bg-[#2D2926] text-[#D4AF37]'
                    : 'bg-[#EBE5DA] text-[#171513]'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'materials'
                  ? 'bg-[#171513] text-[#F7F3EC] shadow-sm'
                  : 'text-[#665E55] hover:text-[#171513] hover:bg-[#F7F3EC]'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Textiles & Fabrics</span>
              <span
                className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'materials'
                    ? 'bg-[#2D2926] text-[#D4AF37]'
                    : 'bg-[#EBE5DA] text-[#171513]'
                }`}
              >
                {materials.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('collections')}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'collections'
                  ? 'bg-[#171513] text-[#F7F3EC] shadow-sm'
                  : 'text-[#665E55] hover:text-[#171513] hover:bg-[#F7F3EC]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Editorial Collections</span>
              <span
                className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === 'collections'
                    ? 'bg-[#2D2926] text-[#D4AF37]'
                    : 'bg-[#EBE5DA] text-[#171513]'
                }`}
              >
                {collections.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => handleOpenCreateModal(activeTab)}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#171513] bg-[#D4AF37] hover:bg-[#C5A028] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>
              {activeTab === 'products'
                ? 'Create New Garment'
                : activeTab === 'materials'
                ? 'Add New Fabric'
                : 'New Collection'}
            </span>
          </button>
        </div>

        {/* Search & Status Filter Bar */}
        <div className="bg-[#FFFFFF] p-4 border border-[#E5DFD5] rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8C7355] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#171513] text-[#171513]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7355] hover:text-[#171513]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-semibold uppercase text-[#8C7355] flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>

            {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors shrink-0 ${
                  statusFilter === st
                    ? 'bg-[#171513] text-[#F7F3EC]'
                    : 'bg-[#F7F3EC] text-[#665E55] hover:bg-[#EBE5DA]'
                }`}
              >
                {st}
              </button>
            ))}

            <button
              onClick={loadAdminCatalog}
              disabled={dataLoading}
              className="p-2 text-[#665E55] hover:text-[#171513] hover:bg-[#F7F3EC] rounded-lg transition-colors border border-[#E5DFD5] ml-2 shrink-0"
              title="Refresh Catalog Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {dataError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{dataError}</span>
            </div>
            <button
              onClick={loadAdminCatalog}
              className="underline font-semibold hover:text-red-900"
            >
              Retry Load
            </button>
          </div>
        )}

        {/* Content Section */}
        {dataLoading ? (
          <div className="bg-[#FFFFFF] p-12 border border-[#E5DFD5] rounded-xl text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#8C7355] border-t-transparent"></div>
            <p className="text-xs uppercase tracking-widest text-[#665E55]">
              Fetching Firestore Catalog Data...
            </p>
          </div>
        ) : (
          <>
            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                {filteredProducts.length === 0 ? (
                  <div className="bg-[#FFFFFF] p-12 border border-[#E5DFD5] rounded-xl text-center space-y-3">
                    <Package className="w-10 h-10 text-[#C5BCB0] mx-auto" />
                    <h3 className="text-sm font-serif text-[#171513]">No clothing items found</h3>
                    <p className="text-xs text-[#665E55]">
                      Try adjusting search filters or create a new garment for the catalog.
                    </p>
                    <button
                      onClick={() => handleOpenCreateModal('products')}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#171513] bg-[#D4AF37] hover:bg-[#C5A028] rounded-lg transition-colors inline-flex items-center gap-2 mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Garment</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Thumbnail */}
                          <div className="relative h-48 bg-[#F7F3EC] overflow-hidden">
                            {prod.images && prod.images.length > 0 ? (
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#C5BCB0]">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}

                            {/* Status Badge */}
                            <div className="absolute top-3 left-3">
                              <span
                                className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                                  prod.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : prod.status === 'archived'
                                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                {prod.status || 'draft'}
                              </span>
                            </div>

                            {/* Badges */}
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                              {prod.featured && (
                                <span
                                  className="p-1.5 bg-[#171513]/80 text-[#D4AF37] rounded-full backdrop-blur-sm"
                                  title="Featured Item"
                                >
                                  <Star className="w-3 h-3 fill-[#D4AF37]" />
                                </span>
                              )}
                              {prod.newArrival && (
                                <span
                                  className="px-2 py-0.5 bg-[#D4AF37] text-[#171513] text-[9px] font-bold uppercase rounded-full shadow-sm"
                                >
                                  New
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="p-5 space-y-3">
                            <div>
                              <div className="text-[10px] font-semibold uppercase text-[#8C7355] tracking-wider">
                                {prod.clothingCategory}
                              </div>
                              <h3 className="text-base font-serif text-[#171513] font-medium leading-tight">
                                {prod.name}
                              </h3>
                              {prod.subtitle && (
                                <p className="text-xs text-[#665E55] italic">{prod.subtitle}</p>
                              )}
                            </div>

                            <p className="text-xs text-[#665E55] line-clamp-2 leading-relaxed">
                              {prod.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                              <span className="px-2 py-0.5 bg-[#F7F3EC] border border-[#E5DFD5] text-[#665E55] rounded">
                                {prod.availability}
                              </span>
                              <span className="px-2 py-0.5 bg-[#F7F3EC] border border-[#E5DFD5] text-[#665E55] rounded">
                                {prod.sizes?.length || 0} Sizes
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-[#FBF9F5] border-t border-[#E5DFD5] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-[#8C7355] uppercase">
                              Status:
                            </span>
                            <select
                              value={prod.status || 'draft'}
                              onChange={(e) =>
                                handleQuickStatusChange(
                                  'products',
                                  prod.id,
                                  e.target.value as CatalogStatus
                                )
                              }
                              className="text-xs bg-[#FFFFFF] border border-[#E5DFD5] rounded px-2 py-1 text-[#171513] focus:outline-none"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Publish</option>
                              <option value="archived">Archive</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal('products', prod)}
                              className="p-1.5 text-[#171513] hover:bg-[#EBE5DA] rounded-lg transition-colors border border-[#E5DFD5]"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeletingTarget({
                                  type: 'products',
                                  id: prod.id,
                                  title: prod.name,
                                })
                              }
                              className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MATERIALS TAB */}
            {activeTab === 'materials' && (
              <div className="space-y-4">
                {filteredMaterials.length === 0 ? (
                  <div className="bg-[#FFFFFF] p-12 border border-[#E5DFD5] rounded-xl text-center space-y-3">
                    <Scissors className="w-10 h-10 text-[#C5BCB0] mx-auto" />
                    <h3 className="text-sm font-serif text-[#171513]">No textile items found</h3>
                    <p className="text-xs text-[#665E55]">
                      Create new luxury fabrics or materials in Firestore.
                    </p>
                    <button
                      onClick={() => handleOpenCreateModal('materials')}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#171513] bg-[#D4AF37] hover:bg-[#C5A028] rounded-lg transition-colors inline-flex items-center gap-2 mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Material</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMaterials.map((mat) => (
                      <div
                        key={mat.id}
                        className="bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Image Thumbnail */}
                          <div className="relative h-48 bg-[#F7F3EC] overflow-hidden">
                            {mat.images && mat.images.length > 0 ? (
                              <img
                                src={mat.images[0]}
                                alt={mat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#C5BCB0]">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}

                            {/* Status Badge */}
                            <div className="absolute top-3 left-3">
                              <span
                                className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                                  mat.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : mat.status === 'archived'
                                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                                    : 'bg-amber-50 text-amber-300 border-amber-300'
                                }`}
                              >
                                {mat.status || 'draft'}
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="p-5 space-y-3">
                            <div>
                              <div className="text-[10px] font-semibold uppercase text-[#8C7355] tracking-wider">
                                {mat.category} Textile
                              </div>
                              <h3 className="text-base font-serif text-[#171513] font-medium leading-tight">
                                {mat.name}
                              </h3>
                              {mat.origin && (
                                <p className="text-xs text-[#665E55] italic">Origin: {mat.origin}</p>
                              )}
                            </div>

                            <p className="text-xs text-[#665E55] line-clamp-2 leading-relaxed">
                              {mat.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                              <span className="px-2 py-0.5 bg-[#F7F3EC] border border-[#E5DFD5] text-[#665E55] rounded">
                                {mat.availability}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-[#FBF9F5] border-t border-[#E5DFD5] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-[#8C7355] uppercase">
                              Status:
                            </span>
                            <select
                              value={mat.status || 'draft'}
                              onChange={(e) =>
                                handleQuickStatusChange(
                                  'materials',
                                  mat.id,
                                  e.target.value as CatalogStatus
                                )
                              }
                              className="text-xs bg-[#FFFFFF] border border-[#E5DFD5] rounded px-2 py-1 text-[#171513] focus:outline-none"
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Publish</option>
                              <option value="archived">Archive</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal('materials', mat)}
                              className="p-1.5 text-[#171513] hover:bg-[#EBE5DA] rounded-lg transition-colors border border-[#E5DFD5]"
                              title="Edit Material"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeletingTarget({
                                  type: 'materials',
                                  id: mat.id,
                                  title: mat.name,
                                })
                              }
                              className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                              title="Delete Material"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COLLECTIONS TAB */}
            {activeTab === 'collections' && (
              <div className="space-y-4">
                {filteredCollections.length === 0 ? (
                  <div className="bg-[#FFFFFF] p-12 border border-[#E5DFD5] rounded-xl text-center space-y-3">
                    <Layers className="w-10 h-10 text-[#C5BCB0] mx-auto" />
                    <h3 className="text-sm font-serif text-[#171513]">No collections found</h3>
                    <p className="text-xs text-[#665E55]">
                      Create editorial collections to showcase garments and themes.
                    </p>
                    <button
                      onClick={() => handleOpenCreateModal('collections')}
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#171513] bg-[#D4AF37] hover:bg-[#C5A028] rounded-lg transition-colors inline-flex items-center gap-2 mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Collection</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCollections.map((col) => {
                      const title = col.title || col.name || 'Untitled Collection';
                      return (
                        <div
                          key={col.id}
                          className="bg-[#FFFFFF] border border-[#E5DFD5] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Image Banner */}
                            <div className="relative h-56 bg-[#F7F3EC] overflow-hidden">
                              {col.coverImage ? (
                                <img
                                  src={col.coverImage}
                                  alt={title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#C5BCB0]">
                                  <ImageIcon className="w-8 h-8" />
                                </div>
                              )}

                              {/* Status Badge */}
                              <div className="absolute top-3 left-3">
                                <span
                                  className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                                    col.status === 'published'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : col.status === 'archived'
                                      ? 'bg-slate-100 text-slate-700 border-slate-300'
                                      : 'bg-amber-50 text-amber-800 border-amber-300'
                                  }`}
                                >
                                  {col.status || 'draft'}
                                </span>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 space-y-3">
                              <div>
                                <div className="text-[10px] font-semibold uppercase text-[#8C7355] tracking-wider">
                                  {col.season} {col.year}
                                </div>
                                <h3 className="text-lg font-serif text-[#171513] font-medium leading-tight">
                                  {title}
                                </h3>
                                {col.subtitle && (
                                  <p className="text-xs text-[#665E55] italic">{col.subtitle}</p>
                                )}
                              </div>

                              <p className="text-xs text-[#665E55] line-clamp-2 leading-relaxed">
                                {col.description}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="p-4 bg-[#FBF9F5] border-t border-[#E5DFD5] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-mono text-[#8C7355] uppercase">
                                Status:
                              </span>
                              <select
                                value={col.status || 'draft'}
                                onChange={(e) =>
                                  handleQuickStatusChange(
                                    'collections',
                                    col.id,
                                    e.target.value as CatalogStatus
                                  )
                                }
                                className="text-xs bg-[#FFFFFF] border border-[#E5DFD5] rounded px-2 py-1 text-[#171513] focus:outline-none"
                              >
                                <option value="draft">Draft</option>
                                <option value="published">Publish</option>
                                <option value="archived">Archive</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditModal('collections', col)}
                                className="p-1.5 text-[#171513] hover:bg-[#EBE5DA] rounded-lg transition-colors border border-[#E5DFD5]"
                                title="Edit Collection"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeletingTarget({
                                    type: 'collections',
                                    id: col.id,
                                    title,
                                  })
                                }
                                className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                title="Delete Collection"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ITEM EDITOR MODAL DRAWER */}
      {isEditorOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-[#171513]/60 backdrop-blur-sm flex justify-end p-0 sm:p-4 transition-opacity">
          <div className="w-full max-w-2xl bg-[#FFFFFF] h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E5DFD5]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FBF9F5] border-b border-[#E5DFD5] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#171513] text-[#D4AF37] rounded-lg">
                  {editingType === 'products' ? (
                    <Package className="w-4 h-4" />
                  ) : editingType === 'materials' ? (
                    <Scissors className="w-4 h-4" />
                  ) : (
                    <Layers className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-serif text-[#171513] font-medium">
                    {editingItem.id ? 'Edit' : 'Create'}{' '}
                    {editingType === 'products'
                      ? 'Garment'
                      : editingType === 'materials'
                      ? 'Textile'
                      : 'Collection'}
                  </h2>
                  <p className="text-[11px] text-[#665E55]">
                    Catalog Item ID: {editingItem.id || 'Auto-generated on Save'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-[#665E55] hover:text-[#171513] rounded-lg hover:bg-[#EBE5DA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Form */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Common Status & Visibility Selector */}
              <div className="p-4 bg-[#F7F3EC] border border-[#E5DFD5] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                    Catalog Status
                  </label>
                  <select
                    value={editingItem.status || 'draft'}
                    onChange={(e) =>
                      setEditingItem((prev: any) => ({
                        ...prev,
                        status: e.target.value as CatalogStatus,
                      }))
                    }
                    className="w-full p-2 bg-[#FFFFFF] border border-[#E5DFD5] rounded-lg text-xs focus:ring-1 focus:ring-[#171513]"
                  >
                    <option value="draft">Draft (Internal Only)</option>
                    <option value="published">Published (Visible on Storefront)</option>
                    <option value="archived">Archived (Hidden)</option>
                  </select>
                </div>

                {editingType === 'products' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Stock / Availability
                    </label>
                    <select
                      value={editingItem.availability || 'In Stock'}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          availability: e.target.value,
                        }))
                      }
                      className="w-full p-2 bg-[#FFFFFF] border border-[#E5DFD5] rounded-lg text-xs focus:ring-1 focus:ring-[#171513]"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Made to Order">Made to Order</option>
                      <option value="Limited Piece">Limited Piece</option>
                    </select>
                  </div>
                )}

                {editingType === 'materials' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Material Availability
                    </label>
                    <select
                      value={editingItem.availability || 'Available by Yard'}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          availability: e.target.value,
                        }))
                      }
                      className="w-full p-2 bg-[#FFFFFF] border border-[#E5DFD5] rounded-lg text-xs focus:ring-1 focus:ring-[#171513]"
                    >
                      <option value="Available by Yard">Available by Yard</option>
                      <option value="Exclusive Batch">Exclusive Batch</option>
                      <option value="Limited Stock">Limited Stock</option>
                    </select>
                  </div>
                )}
              </div>

              {/* SPECIFIC FIELDS FOR PRODUCTS */}
              {editingType === 'products' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                        Garment Name *
                      </label>
                      <input
                        type="text"
                        value={editingItem.name || ''}
                        onChange={(e) =>
                          setEditingItem((prev: any) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g. Lumora Royal Silk Dress"
                        className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                        Category
                      </label>
                      <select
                        value={editingItem.clothingCategory || 'Dresses'}
                        onChange={(e) =>
                          setEditingItem((prev: any) => ({
                            ...prev,
                            clothingCategory: e.target.value as ClothingCategory,
                          }))
                        }
                        className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                      >
                        {CLOTHING_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={editingItem.subtitle || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({ ...prev, subtitle: e.target.value }))
                      }
                      placeholder="e.g. Hand-embroidered organza gown"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Garment Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingItem.description || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe silhouette, craftsmanship, and styling notes..."
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Editorial Craftsmanship Story
                    </label>
                    <textarea
                      rows={3}
                      value={editingItem.editorialStory || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          editorialStory: e.target.value,
                        }))
                      }
                      placeholder="Detailed narrative on heritage techniques or inspiration..."
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Fabric & Material Details
                    </label>
                    <input
                      type="text"
                      value={editingItem.materialInfo || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          materialInfo: e.target.value,
                        }))
                      }
                      placeholder="e.g. 100% Pure Italian Silk Crepe with Velvet trim"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>

                  {/* Sizing Checkboxes */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1.5">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SIZES.map((sz) => {
                        const isChecked = editingItem.sizes?.includes(sz);
                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => {
                              const curr = editingItem.sizes || [];
                              const updated = isChecked
                                ? curr.filter((s: string) => s !== sz)
                                : [...curr, sz];
                              setEditingItem((prev: any) => ({ ...prev, sizes: updated }));
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
                              isChecked
                                ? 'bg-[#171513] text-[#F7F3EC] border-[#171513]'
                                : 'bg-[#F7F3EC] text-[#665E55] border-[#E5DFD5]'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 text-[#D4AF37]" />}
                            <span>{sz}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feature Toggles */}
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.featured || false}
                        onChange={(e) =>
                          setEditingItem((prev: any) => ({
                            ...prev,
                            featured: e.target.checked,
                          }))
                        }
                        className="rounded border-[#E5DFD5] text-[#171513] focus:ring-0"
                      />
                      <span className="text-xs font-semibold text-[#171513]">Featured Item</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.newArrival || false}
                        onChange={(e) =>
                          setEditingItem((prev: any) => ({
                            ...prev,
                            newArrival: e.target.checked,
                          }))
                        }
                        className="rounded border-[#E5DFD5] text-[#171513] focus:ring-0"
                      />
                      <span className="text-xs font-semibold text-[#171513]">New Arrival</span>
                    </label>
                  </div>
                </div>
              )}

              {/* SPECIFIC FIELDS FOR MATERIALS */}
              {editingType === 'materials' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                        Textile Name *
                      </label>
                      <input
                        type="text"
                        value={editingItem.name || ''}
                        onChange={(e) =>
                          setEditingItem((prev: any) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g. Austrian Beaded Guipure Lace"
                        className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                        Category
                      </label>
                      <select
                        value={editingItem.category || 'Lace'}
                        onChange={(e) =>
                          setEditingItem((prev: any) => ({
                            ...prev,
                            category: e.target.value as MaterialCategory,
                          }))
                        }
                        className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                      >
                        {MATERIAL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Origin / Provenance
                    </label>
                    <input
                      type="text"
                      value={editingItem.origin || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({ ...prev, origin: e.target.value }))
                      }
                      placeholder="e.g. St. Gallen, Switzerland"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Material Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingItem.description || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe weave, weight, luster, and transparency..."
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Tactile & Texture Notes
                    </label>
                    <input
                      type="text"
                      value={editingItem.textureNotes || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          textureNotes: e.target.value,
                        }))
                      }
                      placeholder="e.g. Crisp structure with subtle metallic sheen"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>
                </div>
              )}

              {/* SPECIFIC FIELDS FOR COLLECTIONS */}
              {editingType === 'collections' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                        Collection Title *
                      </label>
                      <input
                        type="text"
                        value={editingItem.title || editingItem.name || ''}
                        onChange={(e) =>
                          setEditingItem((prev: any) => ({
                            ...prev,
                            title: e.target.value,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g. Lumora Luminescence 2026"
                        className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                        Season & Year
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingItem.season || ''}
                          onChange={(e) =>
                            setEditingItem((prev: any) => ({
                              ...prev,
                              season: e.target.value,
                            }))
                          }
                          placeholder="e.g. Spring / Summer"
                          className="w-2/3 p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                        />
                        <input
                          type="text"
                          value={editingItem.year || ''}
                          onChange={(e) =>
                            setEditingItem((prev: any) => ({ ...prev, year: e.target.value }))
                          }
                          placeholder="2026"
                          className="w-1/3 p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Collection Subtitle
                    </label>
                    <input
                      type="text"
                      value={editingItem.subtitle || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({ ...prev, subtitle: e.target.value }))
                      }
                      placeholder="e.g. A celebration of architectural silhouettes and gold filigree"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#171513] mb-1">
                      Editorial Story & Narrative
                    </label>
                    <textarea
                      rows={4}
                      value={editingItem.story || editingItem.description || ''}
                      onChange={(e) =>
                        setEditingItem((prev: any) => ({
                          ...prev,
                          story: e.target.value,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Write the editorial concept behind this collection..."
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                  </div>
                </div>
              )}

              {/* MEDIA & IMAGES SECTION (Shared for All Types) */}
              <div className="p-4 bg-[#FBF9F5] border border-[#E5DFD5] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#171513] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#8C7355]" />
                    Media & Image Gallery
                  </span>
                  <span className="text-[10px] text-[#8C7355]">Firebase Storage Upload</span>
                </div>

                {/* Upload or Add URL Input */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="w-full sm:w-auto px-4 py-2 bg-[#171513] text-[#F7F3EC] hover:bg-[#2D2926] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-1 w-full">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste Image URL..."
                      className="w-full p-2 bg-[#FFFFFF] border border-[#E5DFD5] rounded-lg text-xs focus:outline-none focus:border-[#171513]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-[#F7F3EC] hover:bg-[#EBE5DA] border border-[#E5DFD5] rounded-lg text-xs font-semibold text-[#171513]"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Images List Preview */}
                {editingType === 'collections' ? (
                  <div className="space-y-2 pt-2">
                    {editingItem.coverImage && (
                      <div className="flex items-center gap-3 p-2 bg-[#FFFFFF] border border-[#E5DFD5] rounded-lg">
                        <img
                          src={editingItem.coverImage}
                          alt="Cover"
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-emerald-700 uppercase">
                            Primary Cover Image
                          </div>
                          <div className="text-[10px] text-[#665E55] truncate">
                            {editingItem.coverImage}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingItem((prev: any) => ({ ...prev, coverImage: '' }))}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {(editingItem.images || []).map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative h-20 bg-[#FFFFFF] border border-[#E5DFD5] rounded-lg overflow-hidden group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Asset ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-[#171513] text-[#D4AF37] text-[8px] font-bold px-1.5 py-0.5 rounded">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem((prev: any) => ({
                              ...prev,
                              images: prev.images.filter((_: any, i: number) => i !== idx),
                            }));
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FBF9F5] border-t border-[#E5DFD5] flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#665E55] bg-[#F7F3EC] hover:bg-[#EBE5DA] border border-[#E5DFD5] rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveModal}
                disabled={isSaving}
                className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-[#171513] bg-[#D4AF37] hover:bg-[#C5A028] rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Item</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETION CONFIRMATION MODAL */}
      {deletingTarget && (
        <div className="fixed inset-0 z-50 bg-[#171513]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl shadow-2xl p-6 border border-[#E5DFD5] space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif text-[#171513] font-medium">
                Confirm Destructive Deletion
              </h3>
            </div>

            <p className="text-xs text-[#665E55] leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[#171513]">"{deletingTarget.title}"</strong> from Cloud
              Firestore? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#665E55] bg-[#F7F3EC] hover:bg-[#EBE5DA] border border-[#E5DFD5] rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
