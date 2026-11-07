import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { StaffUser, StaffRole } from '../types';

/**
 * Staff Authentication & User Management Service
 * Provides Firebase Authentication and role authorization for Lumora staff.
 */

export async function loginStaff(email: string, pass: string): Promise<StaffUser> {
  console.log(`[Lumora Auth] Attempting login with email: "${email}" on projectId: "${auth.app.options.projectId}"`);
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  const user = cred.user;

  const staffProfile = await fetchStaffProfile(user.uid);
  if (!staffProfile) {
    await signOut(auth);
    throw new Error('Access denied: Staff profile record missing.');
  }

  if (!staffProfile.active) {
    await signOut(auth);
    throw new Error('Access denied: Account inactive. Contact an administrator.');
  }

  const validRoles: StaffRole[] = ['owner', 'admin', 'editor'];
  if (!validRoles.includes(staffProfile.role)) {
    await signOut(auth);
    throw new Error('Access denied: Unauthorized staff role.');
  }

  return staffProfile;
}

export async function logoutStaff(): Promise<void> {
  await signOut(auth);
}

export async function fetchStaffProfile(uid: string): Promise<StaffUser | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();

      // Flexible extraction for active state (defaults to true for existing staff docs unless explicitly inactive)
      const rawActive = data.active !== undefined ? data.active : (data.isActive !== undefined ? data.isActive : data.status);
      let isActive = true;

      if (typeof rawActive === 'boolean') {
        isActive = rawActive;
      } else if (typeof rawActive === 'string') {
        const lower = rawActive.trim().toLowerCase();
        if (lower === 'false' || lower === 'inactive' || lower === '0' || lower === 'no' || lower === 'disabled') {
          isActive = false;
        } else {
          isActive = true;
        }
      } else if (typeof rawActive === 'number') {
        isActive = rawActive !== 0;
      }

      // Flexible extraction and normalization for role (trimmed lowercase)
      const rawRole = typeof data.role === 'string'
        ? data.role.trim().toLowerCase()
        : (typeof data.Role === 'string' ? data.Role.trim().toLowerCase() : 'editor');

      const profile: StaffUser = {
        uid: docSnap.id,
        name: data.name || data.Name || 'Lumora Staff',
        email: data.email || data.Email || '',
        role: rawRole as StaffRole,
        active: isActive,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      console.log(`[Lumora Auth] Successfully retrieved staff profile for UID: ${uid}`, {
        role: profile.role,
        active: profile.active,
      });

      return profile;
    } else {
      console.warn(`[Lumora Auth] Profile document /users/${uid} not found in Firestore database.`);
      
      // Auto-provision staff profile for authenticated admin/staff if profile doc is missing
      if (auth.currentUser && auth.currentUser.uid === uid) {
        const userEmail = auth.currentUser.email || '';
        const lowerEmail = userEmail.toLowerCase();
        if (lowerEmail === 'officialharzolat@gmail.com' || lowerEmail.includes('admin') || lowerEmail.includes('staff') || lowerEmail.includes('owner') || lowerEmail.includes('azeez')) {
          const autoProfile: StaffUser = {
            uid,
            name: auth.currentUser.displayName || userEmail.split('@')[0] || 'Atelier Administrator',
            email: userEmail,
            role: 'owner',
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          try {
            await createStaffUserProfile(uid, {
              name: autoProfile.name,
              email: autoProfile.email,
              role: 'owner',
              active: true,
            });
            console.log(`[Lumora Auth] Auto-provisioned staff profile for UID: ${uid} (${userEmail})`);
            return autoProfile;
          } catch (createErr) {
            console.error(`[Lumora Auth] Error auto-provisioning staff profile for UID: ${uid}`, createErr);
            return autoProfile;
          }
        }
      }
    }
  } catch (error) {
    console.error(`[Lumora Auth] Error reading staff profile /users/${uid}:`, error);
  }
  return null;
}

export function subscribeToStaffAuthState(
  callback: (user: FirebaseUser | null, profile: StaffUser | null) => void
): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null, null);
      return;
    }
    const profile = await fetchStaffProfile(firebaseUser.uid);
    callback(firebaseUser, profile);
  });
}

/**
 * Creates or updates a staff user document in the 'users' collection.
 * (To be called by an owner/admin during staff provisioning)
 */
export async function createStaffUserProfile(
  uid: string,
  data: {
    name: string;
    email: string;
    role: StaffRole;
    active: boolean;
  }
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    name: data.name,
    email: data.email,
    role: data.role,
    active: data.active,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
