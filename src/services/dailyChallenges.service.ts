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
import { DailyChallenge } from '@/types/daily.types';

const DAILY_CHALLENGES_COLLECTION = 'daily_challenges';

// Helper function to convert Firestore data to DailyChallenge
const convertFirestoreData = (id: string, data: any): DailyChallenge & { id: string } => {
    return {
        id,
        compilerType: data.compilerType || '',
        courseId: data.courseId || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        description: data.description || '',
        difficulty: data.difficulty || 'easy',
        expiredAt: data.expiredAt?.toDate ? data.expiredAt.toDate() : new Date(),
        hints: Array.isArray(data.hints) ? data.hints : [],
        isActive: data.isActive ?? true,
        points: data.points || 100,
        problemStatement: data.problemStatement || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        testCases: Array.isArray(data.testCases) ? data.testCases : [],
        title: data.title || ''
    };
};

export const dailyChallengesService = {
    // Get all daily challenges
    getAll: async (): Promise<(DailyChallenge & { id: string })[]> => {
        try {
            const q = query(
                collection(db, DAILY_CHALLENGES_COLLECTION),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => convertFirestoreData(doc.id, doc.data()));
        } catch (error) {
            console.error('Error getting daily challenges:', error);
            throw error;
        }
    },

    // Get active daily challenges
    getActive: async (): Promise<(DailyChallenge & { id: string })[]> => {
        try {
            const now = Timestamp.now();
            const q = query(
                collection(db, DAILY_CHALLENGES_COLLECTION),
                where('isActive', '==', true),
                where('expiredAt', '>', now),
                orderBy('expiredAt', 'asc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => convertFirestoreData(doc.id, doc.data()));
        } catch (error) {
            console.error('Error getting active daily challenges:', error);
            throw error;
        }
    },

    // Get challenges by course
    getByCourse: async (courseId: string): Promise<(DailyChallenge & { id: string })[]> => {
        try {
            const q = query(
                collection(db, DAILY_CHALLENGES_COLLECTION),
                where('courseId', '==', courseId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => convertFirestoreData(doc.id, doc.data()));
        } catch (error) {
            console.error('Error getting challenges by course:', error);
            throw error;
        }
    },

    // Get single daily challenge by ID
    getById: async (id: string): Promise<(DailyChallenge & { id: string }) | null> => {
        try {
            const docRef = doc(db, DAILY_CHALLENGES_COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return convertFirestoreData(docSnap.id, docSnap.data());
            }
            return null;
        } catch (error) {
            console.error('Error getting daily challenge:', error);
            throw error;
        }
    },

    // Create new daily challenge
    create: async (challengeData: Omit<DailyChallenge, 'id'>): Promise<string> => {
        try {
            const dataToSave = {
                compilerType: challengeData.compilerType,
                courseId: challengeData.courseId,
                description: challengeData.description,
                difficulty: challengeData.difficulty,
                hints: challengeData.hints || [],
                isActive: challengeData.isActive ?? true,
                points: challengeData.points,
                problemStatement: challengeData.problemStatement,
                tags: challengeData.tags || [],
                testCases: challengeData.testCases || [],
                title: challengeData.title,
                createdAt: challengeData.createdAt instanceof Date
                    ? Timestamp.fromDate(challengeData.createdAt)
                    : Timestamp.now(),
                expiredAt: challengeData.expiredAt instanceof Date
                    ? Timestamp.fromDate(challengeData.expiredAt)
                    : Timestamp.now()
            };

            const docRef = await addDoc(collection(db, DAILY_CHALLENGES_COLLECTION), dataToSave);
            console.log(`Daily challenge created: ${docRef.id}`);
            return docRef.id;
        } catch (error) {
            console.error('Error creating daily challenge:', error);
            throw error;
        }
    },

    // Update daily challenge
    update: async (id: string, challengeData: Partial<DailyChallenge>): Promise<void> => {
        try {
            const docRef = doc(db, DAILY_CHALLENGES_COLLECTION, id);

            const dataToUpdate: any = { ...challengeData };

            // Convert Date to Timestamp if present
            if (dataToUpdate.createdAt instanceof Date) {
                dataToUpdate.createdAt = Timestamp.fromDate(dataToUpdate.createdAt);
            }
            if (dataToUpdate.expiredAt instanceof Date) {
                dataToUpdate.expiredAt = Timestamp.fromDate(dataToUpdate.expiredAt);
            }

            // Remove id field if present
            delete dataToUpdate.id;

            await updateDoc(docRef, dataToUpdate);
            console.log(`Daily challenge updated: ${id}`);
        } catch (error) {
            console.error('Error updating daily challenge:', error);
            throw error;
        }
    },

    // Delete daily challenge
    delete: async (id: string): Promise<void> => {
        try {
            const docRef = doc(db, DAILY_CHALLENGES_COLLECTION, id);

            // Check if document exists
            const docSnapshot = await getDoc(docRef);
            if (!docSnapshot.exists()) {
                throw new Error('Daily challenge not found');
            }

            await deleteDoc(docRef);
            console.log(`Daily challenge deleted: ${id}`);
        } catch (error) {
            console.error('Error deleting daily challenge:', error);
            throw error;
        }
    },

    // Toggle active status
    toggleActive: async (id: string, isActive: boolean): Promise<void> => {
        try {
            const docRef = doc(db, DAILY_CHALLENGES_COLLECTION, id);
            await updateDoc(docRef, { isActive });
            console.log(`Daily challenge ${id} isActive set to: ${isActive}`);
        } catch (error) {
            console.error('Error toggling active status:', error);
            throw error;
        }
    }
};
