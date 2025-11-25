import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Quiz } from '@/types';

const QUIZZES_COLLECTION = 'quizzes';

export const quizzesService = {
    // Get all quizzes
    getAll: async (): Promise<Quiz[]> => {
        try {
            const q = query(collection(db, QUIZZES_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Quiz[];
        } catch (error) {
            console.error('Error getting quizzes:', error);
            throw error;
        }
    },

    // Get quizzes by module ID
    getByModuleId: async (moduleId: string): Promise<Quiz[]> => {
        try {
            const q = query(collection(db, QUIZZES_COLLECTION), where('moduleId', '==', moduleId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Quiz[];
        } catch (error) {
            console.error('Error getting quizzes by module:', error);
            throw error;
        }
    },

    // Get single quiz by ID
    getById: async (id: string): Promise<Quiz | null> => {
        try {
            const docRef = doc(db, QUIZZES_COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Quiz;
            }
            return null;
        } catch (error) {
            console.error('Error getting quiz:', error);
            throw error;
        }
    },

    // Create new quiz
    create: async (quizData: Omit<Quiz, 'id'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, QUIZZES_COLLECTION), {
                ...quizData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw error;
        }
    },

    // Update quiz
    update: async (id: string, quizData: Partial<Quiz>): Promise<void> => {
        try {
            const docRef = doc(db, QUIZZES_COLLECTION, id);
            await updateDoc(docRef, {
                ...quizData,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw error;
        }
    },

    // Delete quiz
    delete: async (id: string): Promise<void> => {
        try {
            const docRef = doc(db, QUIZZES_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw error;
        }
    }
};
