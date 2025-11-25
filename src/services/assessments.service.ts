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
import { TechnicalAssessment } from '@/types';

const ASSESSMENTS_COLLECTION = 'assessments';

export const assessmentsService = {
    // Get all assessments
    getAll: async (): Promise<TechnicalAssessment[]> => {
        try {
            const q = query(collection(db, ASSESSMENTS_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TechnicalAssessment[];
        } catch (error) {
            console.error('Error getting assessments:', error);
            throw error;
        }
    },

    // Get assessments by course ID
    getByCourseId: async (courseId: string): Promise<TechnicalAssessment[]> => {
        try {
            const q = query(collection(db, ASSESSMENTS_COLLECTION), where('courseId', '==', courseId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TechnicalAssessment[];
        } catch (error) {
            console.error('Error getting assessments by course:', error);
            throw error;
        }
    },

    // Get single assessment by ID
    getById: async (id: string): Promise<TechnicalAssessment | null> => {
        try {
            const docRef = doc(db, ASSESSMENTS_COLLECTION, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as TechnicalAssessment;
            }
            return null;
        } catch (error) {
            console.error('Error getting assessment:', error);
            throw error;
        }
    },

    // Create new assessment
    create: async (assessmentData: Omit<TechnicalAssessment, 'id'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, ASSESSMENTS_COLLECTION), {
                ...assessmentData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating assessment:', error);
            throw error;
        }
    },

    // Update assessment
    update: async (id: string, assessmentData: Partial<TechnicalAssessment>): Promise<void> => {
        try {
            const docRef = doc(db, ASSESSMENTS_COLLECTION, id);
            await updateDoc(docRef, {
                ...assessmentData,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating assessment:', error);
            throw error;
        }
    },

    // Delete assessment
    delete: async (id: string): Promise<void> => {
        try {
            const docRef = doc(db, ASSESSMENTS_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting assessment:', error);
            throw error;
        }
    }
};
