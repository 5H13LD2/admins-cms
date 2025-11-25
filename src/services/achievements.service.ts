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
import { Achievement } from '@/types';

const ACHIEVEMENTS_COLLECTION = 'achievements';

export const achievementsService = {
    // Get all achievements
    getAll: async (): Promise<Achievement[]> => {
        try {
            const q = query(collection(db, ACHIEVEMENTS_COLLECTION), orderBy('points', 'asc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Achievement[];
        } catch (error) {
            console.error('Error getting achievements:', error);
            throw error;
        }
    },

    // Get single achievement by ID
    getById: async (id: string): Promise<Achievement | null> => {
        try {
            const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Achievement;
            }
            return null;
        } catch (error) {
            console.error('Error getting achievement:', error);
            throw error;
        }
    },

    // Create new achievement
    create: async (achievementData: Omit<Achievement, 'id'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, ACHIEVEMENTS_COLLECTION), {
                ...achievementData,
                createdAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating achievement:', error);
            throw error;
        }
    },

    // Update achievement
    update: async (id: string, achievementData: Partial<Achievement>): Promise<void> => {
        try {
            const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
            await updateDoc(docRef, achievementData);
        } catch (error) {
            console.error('Error updating achievement:', error);
            throw error;
        }
    },

    // Delete achievement
    delete: async (id: string): Promise<void> => {
        try {
            const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting achievement:', error);
            throw error;
        }
    }
};
