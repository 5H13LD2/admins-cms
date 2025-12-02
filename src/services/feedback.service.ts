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
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Feedback, CreateFeedbackData, UpdateFeedbackData, FeedbackStatus } from '@/types/feedback.types';

const FEEDBACK_COLLECTION = 'feedback';

export const feedbackService = {
    // Get all feedback
    getAll: async (): Promise<Feedback[]> => {
        try {
            const q = query(collection(db, FEEDBACK_COLLECTION), orderBy('timestamp', 'desc'));
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

    // Get feedback by status
    getByStatus: async (status: FeedbackStatus): Promise<Feedback[]> => {
        try {
            const q = query(
                collection(db, FEEDBACK_COLLECTION),
                where('status', '==', status),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Feedback[];
        } catch (error) {
            console.error('Error getting feedback by status:', error);
            throw error;
        }
    },

    // Get feedback by user
    getByUser: async (userId: string): Promise<Feedback[]> => {
        try {
            const q = query(
                collection(db, FEEDBACK_COLLECTION),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Feedback[];
        } catch (error) {
            console.error('Error getting feedback by user:', error);
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
    create: async (feedbackData: CreateFeedbackData): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
                ...feedbackData,
                status: 'new' as FeedbackStatus,
                timestamp: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating feedback:', error);
            throw error;
        }
    },

    // Update feedback status
    updateStatus: async (id: string, status: FeedbackStatus): Promise<void> => {
        try {
            const docRef = doc(db, FEEDBACK_COLLECTION, id);
            const updates: any = { status };

            if (status === 'resolved') {
                updates.resolvedAt = Timestamp.now();
            }

            await updateDoc(docRef, updates);
        } catch (error) {
            console.error('Error updating feedback status:', error);
            throw error;
        }
    },

    // Add response to feedback
    addResponse: async (id: string, response: string): Promise<void> => {
        try {
            const docRef = doc(db, FEEDBACK_COLLECTION, id);
            await updateDoc(docRef, {
                response,
                status: 'reviewed' as FeedbackStatus
            });
        } catch (error) {
            console.error('Error adding response to feedback:', error);
            throw error;
        }
    },

    // Update feedback
    update: async (id: string, feedbackData: UpdateFeedbackData): Promise<void> => {
        try {
            const docRef = doc(db, FEEDBACK_COLLECTION, id);
            await updateDoc(docRef, feedbackData as any);
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
