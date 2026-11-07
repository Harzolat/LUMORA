import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Material, Collection, CatalogStatus } from '../types';
import { MOCK_PRODUCTS, MOCK_MATERIALS, MOCK_COLLECTIONS } from '../data/mockData';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';

/**
 * Catalog Service
 * Serves products, materials, and collections from Cloud Firestore with fallback to local data.
 * Adheres strictly to status == 'published' for public display.
 */

let cachedProducts: Product[] = MOCK_PRODUCTS;
let cachedMaterials: Material[] = MOCK_MATERIALS;
let cachedCollections: Collection[] = MOCK_COLLECTIONS;
let seedAttempted = false;

/**
 * Automatically seeds Firestore with initial published items if empty.
 */
export async function seedInitialFirestoreCatalogIfNeeded(): Promise<void> {
  if (seedAttempted) return;
  seedAttempted = true;

  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(query(productsRef, where('status', '==', 'published')));
    if (snapshot.empty) {
      for (const prod of MOCK_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), {
          ...prod,
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    const materialsRef = collection(db, 'materials');
    const matSnapshot = await getDocs(query(materialsRef, where('status', '==', 'published')));
    if (matSnapshot.empty) {
      for (const mat of MOCK_MATERIALS) {
        await setDoc(doc(db, 'materials', mat.id), {
          ...mat,
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    const collectionsRef = collection(db, 'collections');
    const colSnapshot = await getDocs(query(collectionsRef, where('status', '==', 'published')));
    if (colSnapshot.empty) {
      for (const col of MOCK_COLLECTIONS) {
        await setDoc(doc(db, 'collections', col.id), {
          ...col,
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (err) {
    console.warn('Firestore catalog initialization notice:', err);
  }
}

/**
 * Async Products Fetcher (Public: status == 'published')
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    await seedInitialFirestoreCatalogIfNeeded();
    const q = query(collection(db, 'products'), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
      cachedProducts = items;
      return items;
    }
  } catch (error) {
    console.error('Error reading products from Firestore, using fallback:', error);
  }
  return MOCK_PRODUCTS;
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  if (!id) return undefined;
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (!data.status || data.status === 'published') {
        return { id: docSnap.id, ...data } as Product;
      }
    }
  } catch (error) {
    console.error(`Error reading product ${id} from Firestore:`, error);
  }
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

/**
 * Async Materials Fetcher (Public: status == 'published')
 */
export async function fetchMaterials(): Promise<Material[]> {
  try {
    await seedInitialFirestoreCatalogIfNeeded();
    const q = query(collection(db, 'materials'), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Material[];
      cachedMaterials = items;
      return items;
    }
  } catch (error) {
    console.error('Error reading materials from Firestore, using fallback:', error);
  }
  return MOCK_MATERIALS;
}

export async function fetchMaterialById(id: string): Promise<Material | undefined> {
  if (!id) return undefined;
  try {
    const docRef = doc(db, 'materials', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (!data.status || data.status === 'published') {
        return { id: docSnap.id, ...data } as Material;
      }
    }
  } catch (error) {
    console.error(`Error reading material ${id} from Firestore:`, error);
  }
  return MOCK_MATERIALS.find((m) => m.id === id);
}

/**
 * Async Collections Fetcher (Public: status == 'published')
 */
export async function fetchCollections(): Promise<Collection[]> {
  try {
    await seedInitialFirestoreCatalogIfNeeded();
    const q = query(collection(db, 'collections'), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Collection[];
      cachedCollections = items;
      return items;
    }
  } catch (error) {
    console.error('Error reading collections from Firestore, using fallback:', error);
  }
  return MOCK_COLLECTIONS;
}

export async function fetchCollectionById(id: string): Promise<Collection | undefined> {
  if (!id) return undefined;
  try {
    const docRef = doc(db, 'collections', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (!data.status || data.status === 'published') {
        return { id: docSnap.id, ...data } as Collection;
      }
    }
  } catch (error) {
    console.error(`Error reading collection ${id} from Firestore:`, error);
  }
  return MOCK_COLLECTIONS.find((c) => c.id === id);
}

/**
 * Synchronous Getters (Return cached Firestore data or mockData fallback)
 */
export function getProducts(): Product[] {
  return cachedProducts.length > 0 ? cachedProducts : MOCK_PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return cachedProducts.find((p) => p.id === id) || MOCK_PRODUCTS.find((p) => p.id === id);
}

export function getMaterials(): Material[] {
  return cachedMaterials.length > 0 ? cachedMaterials : MOCK_MATERIALS;
}

export function getMaterialById(id: string): Material | undefined {
  return cachedMaterials.find((m) => m.id === id) || MOCK_MATERIALS.find((m) => m.id === id);
}

export function getCollections(): Collection[] {
  return cachedCollections.length > 0 ? cachedCollections : MOCK_COLLECTIONS;
}

export function getCollectionById(id: string): Collection | undefined {
  return cachedCollections.find((c) => c.id === id) || MOCK_COLLECTIONS.find((c) => c.id === id);
}

/* ============================================================================
 * ADMIN CATALOG MANAGEMENT SERVICES (Requires Staff Authentication / isStaff)
 * ============================================================================ */

/**
 * Admin: Fetch ALL Products regardless of status (published, draft, archived)
 */
export async function fetchAllProductsAdmin(): Promise<Product[]> {
  try {
    await seedInitialFirestoreCatalogIfNeeded();
    const snapshot = await getDocs(collection(db, 'products'));
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          status: 'draft',
          ...data,
        } as Product;
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'products');
    console.error('Error fetching admin products from Firestore:', error);
  }
  return MOCK_PRODUCTS;
}

/**
 * Admin: Save or Update Product in Firestore
 */
export async function saveProductAdmin(productData: Partial<Product> & { id?: string }): Promise<Product> {
  const id = productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const product: Product = {
    id,
    name: productData.name?.trim() || 'Untitled Garment',
    slug: productData.slug || id,
    subtitle: productData.subtitle || '',
    category: 'clothing',
    clothingCategory: productData.clothingCategory || 'Dresses',
    description: productData.description || '',
    editorialStory: productData.editorialStory || '',
    images: productData.images && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000'],
    colors: productData.colors || [{ name: 'Default' }],
    sizes: productData.sizes || ['XS', 'S', 'M', 'L', 'XL'],
    materialInfo: productData.materialInfo || 'Luxury Atelier Fabric',
    availability: productData.availability || 'In Stock',
    featured: productData.featured ?? false,
    newArrival: productData.newArrival ?? false,
    collectionId: productData.collectionId || '',
    tags: productData.tags || [],
    status: productData.status || 'draft',
    createdAt: productData.createdAt || now,
    updatedAt: now,
  };

  const docRef = doc(db, 'products', id);
  await setDoc(docRef, product, { merge: true });
  return product;
}

/**
 * Admin: Delete Product from Firestore
 */
export async function deleteProductAdmin(id: string): Promise<void> {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
}

/**
 * Admin: Fetch ALL Materials regardless of status
 */
export async function fetchAllMaterialsAdmin(): Promise<Material[]> {
  try {
    await seedInitialFirestoreCatalogIfNeeded();
    const snapshot = await getDocs(collection(db, 'materials'));
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          status: 'draft',
          ...data,
        } as Material;
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'materials');
    console.error('Error fetching admin materials from Firestore:', error);
  }
  return MOCK_MATERIALS;
}

/**
 * Admin: Save or Update Material in Firestore
 */
export async function saveMaterialAdmin(materialData: Partial<Material> & { id?: string }): Promise<Material> {
  const id = materialData.id || `mat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const material: Material = {
    id,
    name: materialData.name?.trim() || 'Untitled Material',
    slug: materialData.slug || id,
    category: materialData.category || 'Lace',
    description: materialData.description || '',
    textureNotes: materialData.textureNotes || '',
    images: materialData.images && materialData.images.length > 0 ? materialData.images : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
    colors: materialData.colors || [{ name: 'Default' }],
    availability: materialData.availability || 'Available by Yard',
    origin: materialData.origin || 'Exclusive Import',
    featured: materialData.featured ?? false,
    recommendedFor: materialData.recommendedFor || [],
    status: materialData.status || 'draft',
    createdAt: materialData.createdAt || now,
    updatedAt: now,
  };

  const docRef = doc(db, 'materials', id);
  await setDoc(docRef, material, { merge: true });
  return material;
}

/**
 * Admin: Delete Material from Firestore
 */
export async function deleteMaterialAdmin(id: string): Promise<void> {
  const docRef = doc(db, 'materials', id);
  await deleteDoc(docRef);
}

/**
 * Admin: Fetch ALL Collections regardless of status
 */
export async function fetchAllCollectionsAdmin(): Promise<Collection[]> {
  try {
    await seedInitialFirestoreCatalogIfNeeded();
    const snapshot = await getDocs(collection(db, 'collections'));
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          status: 'draft',
          ...data,
        } as Collection;
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'collections');
    console.error('Error fetching admin collections from Firestore:', error);
  }
  return MOCK_COLLECTIONS;
}

/**
 * Admin: Save or Update Collection in Firestore
 */
export async function saveCollectionAdmin(collectionData: Partial<Collection> & { id?: string }): Promise<Collection> {
  const id = collectionData.id || `col_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const collectionItem: Collection = {
    id,
    title: collectionData.title?.trim() || collectionData.name?.trim() || 'Untitled Collection',
    name: collectionData.name?.trim() || collectionData.title?.trim() || 'Untitled Collection',
    slug: collectionData.slug || id,
    subtitle: collectionData.subtitle || '',
    coverImage: collectionData.coverImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
    heroImage: collectionData.heroImage || collectionData.coverImage || '',
    editorialGallery: collectionData.editorialGallery || [],
    gallery: collectionData.gallery || collectionData.editorialGallery || [],
    description: collectionData.description || '',
    story: collectionData.story || '',
    year: collectionData.year || `${new Date().getFullYear()}`,
    season: collectionData.season || 'Spring / Summer',
    featuredProductIds: collectionData.featuredProductIds || [],
    productIds: collectionData.productIds || collectionData.featuredProductIds || [],
    featured: collectionData.featured ?? false,
    status: collectionData.status || 'draft',
    createdAt: collectionData.createdAt || now,
    updatedAt: now,
  };

  const docRef = doc(db, 'collections', id);
  await setDoc(docRef, collectionItem, { merge: true });
  return collectionItem;
}

/**
 * Admin: Delete Collection from Firestore
 */
export async function deleteCollectionAdmin(id: string): Promise<void> {
  const docRef = doc(db, 'collections', id);
  await deleteDoc(docRef);
}

/**
 * Admin: Quick status update for any item type
 */
export async function updateCatalogItemStatusAdmin(
  itemType: 'product' | 'material' | 'collection',
  id: string,
  newStatus: CatalogStatus
): Promise<void> {
  const collectionName = itemType === 'product' ? 'products' : itemType === 'material' ? 'materials' : 'collections';
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    status: newStatus,
    updatedAt: new Date().toISOString(),
  });
}

