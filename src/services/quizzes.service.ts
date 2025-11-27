import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
    query,
    limit,
    startAfter,
    orderBy,
    DocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Quiz, Question } from '@/types';

// 🔹 Root collection path for all quizzes
const ROOT_COLLECTION = 'course_quiz';
const DEFAULT_PAGE_SIZE = 10;

export const quizzesService = {
    // Get all quizzes from all modules with pagination (without loading questions)
    getAll: async (pageSize: number = DEFAULT_PAGE_SIZE, lastDoc?: DocumentSnapshot): Promise<{ quizzes: Quiz[], lastDoc: DocumentSnapshot | null }> => {
        try {
            const quizzes: Quiz[] = [];

            // Build query with pagination
            let q = query(
                collection(db, ROOT_COLLECTION),
                orderBy('__name__'),
                limit(pageSize)
            );

            if (lastDoc) {
                q = query(
                    collection(db, ROOT_COLLECTION),
                    orderBy('__name__'),
                    startAfter(lastDoc),
                    limit(pageSize)
                );
            }

            const quizCollectionsSnapshot = await getDocs(q);
            const lastVisible = quizCollectionsSnapshot.docs[quizCollectionsSnapshot.docs.length - 1] || null;

            for (const quizDoc of quizCollectionsSnapshot.docs) {
                const quizData = quizDoc.data();

                // Get moduleId from quiz document
                const moduleId = quizData.moduleId || quizData.module_id || '';

                // Generate title from quiz ID if not provided
                const title = quizData.title || quizDoc.id
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                quizzes.push({
                    id: quizDoc.id,
                    moduleId: moduleId,
                    title: title,
                    description: quizData.description || `Quiz for ${title}`,
                    difficulty: quizData.difficulty || 'NORMAL',
                    timeLimit: quizData.timeLimit,
                    passingScore: quizData.passingScore || 70,
                    questions: [], // Don't load questions for list view
                    createdAt: quizData.createdAt,
                    updatedAt: quizData.updatedAt
                });
            }

            return { quizzes, lastDoc: lastVisible };
        } catch (error) {
            console.error('Error getting quizzes:', error);
            throw error;
        }
    },

    // Get quizzes by module ID
    getByModuleId: async (moduleId: string): Promise<Quiz[]> => {
        try {
            // Fetch all quizzes (we need to paginate through all to filter by moduleId)
            const allQuizzes: Quiz[] = [];
            let lastDoc: DocumentSnapshot | null = null;
            let hasMore = true;

            while (hasMore) {
                const { quizzes, lastDoc: newLastDoc } = await quizzesService.getAll(50, lastDoc || undefined);
                allQuizzes.push(...quizzes);

                if (!newLastDoc || quizzes.length < 50) {
                    hasMore = false;
                }
                lastDoc = newLastDoc;
            }

            return allQuizzes.filter(quiz => quiz.moduleId === moduleId);
        } catch (error) {
            console.error('Error getting quizzes by module:', error);
            throw error;
        }
    },

    // Get single quiz by ID
    getById: async (quizId: string): Promise<Quiz | null> => {
        try {
            const docRef = doc(db, `${ROOT_COLLECTION}/${quizId}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const quizData = docSnap.data();

                // Fetch all questions for this quiz
                const questionsSnapshot = await getDocs(
                    collection(db, `${ROOT_COLLECTION}/${quizId}/questions`)
                );

                const questions: Question[] = questionsSnapshot.docs.map((q) => ({
                    id: q.id,
                    ...q.data()
                } as Question));

                return {
                    id: docSnap.id,
                    moduleId: quizData.moduleId || quizData.module_id || '',
                    title: quizData.title || '',
                    description: quizData.description,
                    difficulty: quizData.difficulty || 'NORMAL',
                    timeLimit: quizData.timeLimit,
                    passingScore: quizData.passingScore,
                    questions: questions,
                    createdAt: quizData.createdAt,
                    updatedAt: quizData.updatedAt
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting quiz:', error);
            throw error;
        }
    },

    // Create new quiz with questions
    create: async (quizData: Omit<Quiz, 'id'>): Promise<string> => {
        try {
            const { questions, ...quizMetadata } = quizData;

            // Create the quiz document
            const quizRef = await addDoc(collection(db, ROOT_COLLECTION), {
                ...quizMetadata,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });

            // Add questions to the quiz
            if (questions && questions.length > 0) {
                const questionsCollection = collection(db, `${ROOT_COLLECTION}/${quizRef.id}/questions`);
                for (const question of questions) {
                    await addDoc(questionsCollection, question);
                }
            }

            return quizRef.id;
        } catch (error) {
            console.error('Error creating quiz:', error);
            throw error;
        }
    },

    // Update quiz
    update: async (quizId: string, quizData: Partial<Quiz>): Promise<void> => {
        try {
            const { questions, ...quizMetadata } = quizData;

            // Update quiz metadata
            const docRef = doc(db, `${ROOT_COLLECTION}/${quizId}`);
            await updateDoc(docRef, {
                ...quizMetadata,
                updatedAt: Timestamp.now()
            });

            // Note: Updating questions would require more complex logic
            // This is a basic implementation that only updates metadata
        } catch (error) {
            console.error('Error updating quiz:', error);
            throw error;
        }
    },

    // Delete quiz and all its questions
    delete: async (quizId: string): Promise<void> => {
        try {
            // Delete all questions first
            const questionsSnapshot = await getDocs(
                collection(db, `${ROOT_COLLECTION}/${quizId}/questions`)
            );

            for (const questionDoc of questionsSnapshot.docs) {
                await deleteDoc(questionDoc.ref);
            }

            // Delete the quiz document
            const docRef = doc(db, `${ROOT_COLLECTION}/${quizId}`);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting quiz:', error);
            throw error;
        }
    }
};
