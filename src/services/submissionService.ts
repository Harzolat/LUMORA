import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProductInquiry, CustomSewingRequest, ContactSubmission } from '../types';

/**
 * Submission Service
 * Directs public form submissions to Cloud Firestore collections with graceful fallback.
 */

export async function submitProductInquiry(
  data: Omit<ProductInquiry, 'id' | 'createdAt'>
): Promise<{ success: boolean; inquiry: ProductInquiry; message: string }> {
  try {
    const inquiryPayload = {
      productId: data.productId || data.itemId || '',
      productName: data.productName || (data as any).itemName || '',
      customerName: data.customerName,
      email: data.email,
      phone: data.phone || '',
      question: data.question || '',
      itemType: data.itemType || 'product',
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'productInquiries'), inquiryPayload);

    const inquiry: ProductInquiry = {
      ...data,
      id: docRef.id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      inquiry,
      message: 'Your inquiry has been submitted successfully. Our atelier concierge will contact you shortly.',
    };
  } catch (error: any) {
    console.error('Error recording product inquiry in Firestore:', error);
    throw new Error(error?.message || 'Failed to submit inquiry. Please try again.');
  }
}

export async function submitCustomSewingRequest(
  data: Omit<CustomSewingRequest, 'id' | 'createdAt' | 'trackingCode' | 'status'>
): Promise<{ success: boolean; request: CustomSewingRequest; message: string }> {
  try {
    const trackingCode = `LUM-BESPOKE-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const requestPayload = {
      garmentType: data.garmentType,
      designVision: data.designVision || data.designDescription || '',
      designDescription: data.designDescription || '',
      styleNotes: data.styleNotes || '',
      colorPreference: data.colorPreference || '',
      fabricPreference: data.fabricPreference || '',
      measurements: data.measurements || {},
      inspirationImages: data.inspirationImages || [],
      eventDate: data.eventDate || '',
      customer: {
        name: data.customerName || data.customer?.name || '',
        email: data.email || data.customer?.email || '',
        phone: data.phone || data.customer?.phone || '',
      },
      customerName: data.customerName || data.customer?.name || '',
      email: data.email || data.customer?.email || '',
      phone: data.phone || data.customer?.phone || '',
      trackingCode,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'customSewingRequests'), requestPayload);

    const request: CustomSewingRequest = {
      ...data,
      id: docRef.id,
      trackingCode,
      status: 'Received',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      request,
      message: 'Your bespoke custom sewing request has been recorded.',
    };
  } catch (error: any) {
    console.error('Error recording custom sewing request in Firestore:', error);
    throw new Error(error?.message || 'Failed to submit custom request. Please try again.');
  }
}

export async function submitContactSubmission(
  data: Omit<ContactSubmission, 'id' | 'createdAt'>
): Promise<{ success: boolean; submission: ContactSubmission; message: string }> {
  try {
    const contactPayload = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      message: data.message,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'contactSubmissions'), contactPayload);

    const submission: ContactSubmission = {
      ...data,
      id: docRef.id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      submission,
      message: 'Thank you for contacting Lumora Atelier. Your message has been received.',
    };
  } catch (error: any) {
    console.error('Error recording contact submission in Firestore:', error);
    throw new Error(error?.message || 'Failed to submit message. Please try again.');
  }
}
