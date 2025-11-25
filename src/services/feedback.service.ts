import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Feedback } from '@/types';

const FEEDBACK_COLLECTION = 'feedback';

export const feedbackService = {
    // Get all feedback
    getAll: async (): Promise<Feedback[]> => {
        try {
            const q = query(collection(db, FEEDBACK_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Feedback[];
        } catch (error) {
            console.error('Error getting feedback:', error);
            throw error;
        }
    },

    // Get single feedback by ID
    getById: async (id: string): Promise<Feedback | null> => {
        try {
            const docRef = doc(db, FEEDBACK_COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Feedback;
            }
            return null;
        } catch (error) {
            console.error('Error getting feedback:', error);
            throw error;
        }
    },

    // Create new feedback
    create: async (feedbackData: Omit<Feedback, 'id'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
                ...feedbackData,
                createdAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating feedback:', error);
            throw error;
        }
    },

    // Update feedback (e.g., mark as read/resolved)
    update: async (id: string, feedbackData: Partial<Feedback>): Promise<void> => {
        try {
            const docRef = doc(db, FEEDBACK_COLLECTION, id);
            await updateDoc(docRef, feedbackData);
        } catch (error) {
            console.error('Error updating feedback:', error);
            throw error;
        }
    },

    // Delete feedback
    delete: async (id: string): Promise<void> => {
        try {
            const docRef = doc(db, FEEDBACK_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting feedback:', error);
            throw error;
        }
    }
};
