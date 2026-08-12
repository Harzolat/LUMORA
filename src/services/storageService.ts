import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Storage Service
 * Provides Firebase Storage helper functions for managing media assets.
 */

export type StorageCategory =
  | 'products'
  | 'materials'
  | 'collections'
  | 'custom-sewing-inspiration';

/**
 * Uploads a file to Firebase Storage under a categorized path and returns its public URL.
 */
export async function uploadMediaAsset(
  category: StorageCategory,
  file: File,
  filename?: string
): Promise<string> {
  const sanitizedName = filename || `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `lumora/${category}/${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

/**
 * Deletes an asset by full storage reference path or URL.
 */
export async function deleteMediaAssetByPath(pathOrUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, pathOrUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error removing asset from Storage:', error);
  }
}
