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

const ASSESSMENTS_COLLECTION = 'technical_assesment';

/**
 * Converts Firestore document into TechnicalAssessment
 */
const convertToAssessment = (docSnap: any): TechnicalAssessment => {
    const data = docSnap.data();

    return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        type: data.type,
        difficulty: data.difficulty,
        category: data.category,
        topic: data.topic || undefined,
        courseId: data.courseId,

        // CODE FIX
        brokenCode: data.brokenCode || undefined,
        correctCode: data.correctCode || undefined,
        compilerType: data.compilerType || undefined,
        correctOutput: data.correctOutput || undefined,

        // SQL QUERY
        sample_table: data.sample_table ? {
            ...data.sample_table,
            rows: typeof data.sample_table.rows === 'string'
                ? JSON.parse(data.sample_table.rows)
                : data.sample_table.rows
        } : undefined,
        additionalTables: data.additionalTables ? data.additionalTables.map((table: any) => ({
            ...table,
            rows: typeof table.rows === 'string'
                ? JSON.parse(table.rows)
                : table.rows
        })) : undefined,
        expected_query: data.expected_query || undefined,
        expected_result: data.expected_result ? {
            ...data.expected_result,
            rows: typeof data.expected_result.rows === 'string'
                ? JSON.parse(data.expected_result.rows)
                : data.expected_result.rows
        } : undefined,

        tags: data.tags || [],
        hints: data.hints || [],
        order: data.order || undefined,
        status: data.status,

        author: data.author || undefined,

        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
    };
};

export const assessmentsService = {
    // Get all assessments (ordered by createdAt)
    getAll: async (): Promise<TechnicalAssessment[]> => {
        try {
            const q = query(
                collection(db, ASSESSMENTS_COLLECTION),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(convertToAssessment);
        } catch (error) {
            console.error('Error getting assessments:', error);
            throw error;
        }
    },

    // Get assessments by course ID
    getByCourseId: async (courseId: string): Promise<TechnicalAssessment[]> => {
        try {
            const q = query(
                collection(db, ASSESSMENTS_COLLECTION),
                where('courseId', '==', courseId)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(convertToAssessment);
        } catch (error) {
            console.error('Error getting assessments by course:', error);
            throw error;
        }
    },

    // Get single assessment
    getById: async (id: string): Promise<TechnicalAssessment | null> => {
        try {
            const ref = doc(db, ASSESSMENTS_COLLECTION, id);
            const snap = await getDoc(ref);

            if (!snap.exists()) return null;

            return convertToAssessment(snap);
        } catch (error) {
            console.error('Error getting assessment:', error);
            throw error;
        }
    },

    // Create assessment
    create: async (
        assessmentData: Omit<TechnicalAssessment, 'id'>
    ): Promise<string> => {
        try {
            const docRef = await addDoc(
                collection(db, ASSESSMENTS_COLLECTION),
                {
                    ...assessmentData,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                }
            );

            return docRef.id;
        } catch (error) {
            console.error('Error creating assessment:', error);
            throw error;
        }
    },

    // Update assessment
    update: async (
        id: string,
        assessmentData: Partial<TechnicalAssessment>
    ): Promise<void> => {
        try {
            const ref = doc(db, ASSESSMENTS_COLLECTION, id);

            await updateDoc(ref, {
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
            const ref = doc(db, ASSESSMENTS_COLLECTION, id);
            await deleteDoc(ref);
        } catch (error) {
            console.error('Error deleting assessment:', error);
            throw error;
        }
    }
};
