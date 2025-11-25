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
import { DailyProblem } from '@/types';

const DAILY_PROBLEMS_COLLECTION = 'daily_problems';

export const dailyProblemsService = {
    // Get all daily problems
    getAll: async (): Promise<DailyProblem[]> => {
        try {
            const q = query(collection(db, DAILY_PROBLEMS_COLLECTION), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as DailyProblem[];
        } catch (error) {
            console.error('Error getting daily problems:', error);
            throw error;
        }
    },

    // Get single daily problem by ID
    getById: async (id: string): Promise<DailyProblem | null> => {
        try {
            const docRef = doc(db, DAILY_PROBLEMS_COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as DailyProblem;
            }
            return null;
        } catch (error) {
            console.error('Error getting daily problem:', error);
            throw error;
        }
    },

    // Create new daily problem
    create: async (problemData: Omit<DailyProblem, 'id'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, DAILY_PROBLEMS_COLLECTION), {
                ...problemData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating daily problem:', error);
            throw error;
        }
    },

    // Update daily problem
    update: async (id: string, problemData: Partial<DailyProblem>): Promise<void> => {
        try {
            const docRef = doc(db, DAILY_PROBLEMS_COLLECTION, id);
            await updateDoc(docRef, {
                ...problemData,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating daily problem:', error);
            throw error;
        }
    },

    // Delete daily problem
    delete: async (id: string): Promise<void> => {
        try {
            const docRef = doc(db, DAILY_PROBLEMS_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting daily problem:', error);
            throw error;
        }
    }
};
