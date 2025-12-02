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

const DAILY_PROBLEMS_COLLECTION = 'daily_problem';

// Helper function to convert Firestore data to DailyProblem
const convertFirestoreData = (id: string, data: any): DailyProblem => {
    return {
        id,
        title: data.title || '',
        description: data.description || '',
        difficulty: data.difficulty || 'Easy',
        type: data.type || 'code',
        content: data.content || '',
        solution: data.solution,
        hints: data.hints,
        date: data.date?.toDate ? data.date.toDate() : data.date,
        points: data.points || 10
    };
};

export const dailyProblemsService = {
    // Get all daily problems
    getAll: async (): Promise<DailyProblem[]> => {
        try {
            const q = query(collection(db, DAILY_PROBLEMS_COLLECTION), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => convertFirestoreData(doc.id, doc.data()));
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
                return convertFirestoreData(docSnap.id, docSnap.data());
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
            // Convert Date to Timestamp for Firestore
            const dataToSave = {
                title: problemData.title,
                description: problemData.description,
                difficulty: problemData.difficulty,
                type: problemData.type,
                content: problemData.content,
                solution: problemData.solution,
                hints: problemData.hints,
                date: problemData.date instanceof Date ? Timestamp.fromDate(problemData.date) : Timestamp.now(),
                points: problemData.points,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            const docRef = await addDoc(collection(db, DAILY_PROBLEMS_COLLECTION), dataToSave);
            console.log(`Daily problem created: ${docRef.id}`);
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

            // Prepare data to update
            const dataToUpdate: any = { ...problemData };

            // Convert Date to Timestamp if present
            if (dataToUpdate.date instanceof Date) {
                dataToUpdate.date = Timestamp.fromDate(dataToUpdate.date);
            }

            // Remove id field if present
            delete dataToUpdate.id;

            // Add updatedAt timestamp
            dataToUpdate.updatedAt = Timestamp.now();

            await updateDoc(docRef, dataToUpdate);
            console.log(`Daily problem updated: ${id}`);
        } catch (error) {
            console.error('Error updating daily problem:', error);
            throw error;
        }
    },

    // Delete daily problem
    delete: async (id: string): Promise<void> => {
        try {
            const docRef = doc(db, DAILY_PROBLEMS_COLLECTION, id);

            // Check if document exists
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                throw new Error('Daily problem not found');
            }

            await deleteDoc(docRef);
            console.log(`Daily problem deleted: ${id}`);
        } catch (error) {
            console.error('Error deleting daily problem:', error);
            throw error;
        }
    }
};
