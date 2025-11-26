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
    Timestamp,
    setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Quiz, Question } from '@/types';

const QUIZZES_COLLECTION = 'course_quiz';
const QUESTIONS_SUBCOLLECTION = 'questions';

export const quizzesService = {
    // Get all quizzes
    getAll: async (): Promise<Quiz[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, QUIZZES_COLLECTION));
            const quizzes = await Promise.all(
                querySnapshot.docs.map(async (docSnapshot) => {
                    // Fetch questions for this quiz
                    try {
                        const questionsSnapshot = await getDocs(
                            collection(db, QUIZZES_COLLECTION, docSnapshot.id, QUESTIONS_SUBCOLLECTION)
                        );
                        const questions = questionsSnapshot.docs.map(qDoc => ({
                            id: qDoc.id,
                            ...qDoc.data()
                        })) as Question[];

                        return {
                            ...docSnapshot.data(),
                            id: docSnapshot.id,
                            questions
                        } as Quiz;
                    } catch (error) {
                        // If there's an error fetching questions, return quiz without questions
                        console.warn(`Error fetching questions for quiz ${docSnapshot.id}:`, error);
                        return {
                            ...docSnapshot.data(),
                            id: docSnapshot.id,
                            questions: []
                        } as unknown as Quiz;
                    }
                })
            );
            return quizzes;
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
                // Fetch questions for this quiz
                const questionsSnapshot = await getDocs(
                    query(
                        collection(db, QUIZZES_COLLECTION, id, QUESTIONS_SUBCOLLECTION),
                        orderBy('order', 'asc')
                    )
                );
                const questions = questionsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Question[];

                return { id: docSnap.id, ...docSnap.data(), questions } as Quiz;
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
            // First delete all questions in the subcollection
            const questionsSnapshot = await getDocs(
                collection(db, QUIZZES_COLLECTION, id, QUESTIONS_SUBCOLLECTION)
            );
            const deletePromises = questionsSnapshot.docs.map(questionDoc =>
                deleteDoc(questionDoc.ref)
            );
            await Promise.all(deletePromises);

            // Then delete the quiz document
            const docRef = doc(db, QUIZZES_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw error;
        }
    },

    // Add a question to a quiz
    addQuestion: async (quizId: string, questionData: Omit<Question, 'id'>): Promise<string> => {
        try {
            const questionRef = await addDoc(
                collection(db, QUIZZES_COLLECTION, quizId, QUESTIONS_SUBCOLLECTION),
                questionData
            );
            return questionRef.id;
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    },

    // Update a question
    updateQuestion: async (quizId: string, questionId: string, questionData: Partial<Question>): Promise<void> => {
        try {
            const questionRef = doc(db, QUIZZES_COLLECTION, quizId, QUESTIONS_SUBCOLLECTION, questionId);
            await updateDoc(questionRef, questionData);
        } catch (error) {
            console.error('Error updating question:', error);
            throw error;
        }
    },

    // Delete a question
    deleteQuestion: async (quizId: string, questionId: string): Promise<void> => {
        try {
            const questionRef = doc(db, QUIZZES_COLLECTION, quizId, QUESTIONS_SUBCOLLECTION, questionId);
            await deleteDoc(questionRef);
        } catch (error) {
            console.error('Error deleting question:', error);
            throw error;
        }
    },

    // Get all questions for a quiz
    getQuestions: async (quizId: string): Promise<Question[]> => {
        try {
            const q = query(
                collection(db, QUIZZES_COLLECTION, quizId, QUESTIONS_SUBCOLLECTION),
                orderBy('order', 'asc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Question[];
        } catch (error) {
            console.error('Error getting questions:', error);
            throw error;
        }
    },

    // Create a question with a specific ID (for the format: java_q1, java_q2, etc.)
    createQuestionWithId: async (quizId: string, questionId: string, questionData: Omit<Question, 'id'>): Promise<void> => {
        try {
            const questionRef = doc(db, QUIZZES_COLLECTION, quizId, QUESTIONS_SUBCOLLECTION, questionId);
            await setDoc(questionRef, questionData);
        } catch (error) {
            console.error('Error creating question with ID:', error);
            throw error;
        }
    }
};
