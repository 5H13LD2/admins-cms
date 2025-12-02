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
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
  collectionGroup
} from 'firebase/firestore';
import { db } from './firebase';
import { Question } from '@/types';

const COURSE_QUIZ_COLLECTION = 'course_quiz';
const QUESTIONS_SUBCOLLECTION = 'questions';

export interface QuizQuestion extends Question {
  courseId?: string;
  difficulty?: 'EASY' | 'NORMAL' | 'HARD';
}

export interface PaginatedQuestions {
  questions: QuizQuestion[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}

export const quizzesService = {
  // Get paginated questions with optional filters
  // This fetches questions from course_quiz/{courseId}_quiz/questions
  getPaginated: async (
    options: {
      courseId?: string;
      moduleId?: string;
      pageSize?: number;
      lastDoc?: DocumentSnapshot | null;
    } = {}
  ): Promise<PaginatedQuestions> => {
    try {
      const {
        courseId,
        moduleId,
        pageSize = 10,
        lastDoc = null
      } = options;

      let questions: QuizQuestion[] = [];
      let newLastDoc: DocumentSnapshot | null = null;
      let hasMore = false;

      if (courseId) {
        // Fetch from specific course's questions subcollection
        const quizDocRef = doc(db, COURSE_QUIZ_COLLECTION, `${courseId}_quiz`);
        const questionsRef = collection(quizDocRef, QUESTIONS_SUBCOLLECTION);

        const constraints: QueryConstraint[] = [];

        // Filter by module if provided
        if (moduleId) {
          constraints.push(where('module_id', '==', moduleId));
        }

        // Add ordering
        try {
          constraints.push(orderBy('order', 'asc'));
        } catch (e) {
          // If orderBy fails, continue without it
        }

        // Add pagination
        if (lastDoc) {
          constraints.push(startAfter(lastDoc));
        }
        constraints.push(limit(pageSize + 1));

        const q = constraints.length > 0
          ? query(questionsRef, ...constraints)
          : questionsRef;

        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;
        hasMore = docs.length > pageSize;

        const questionDocs = hasMore ? docs.slice(0, pageSize) : docs;
        questions = questionDocs.map(doc => ({
          id: doc.id,
          courseId,
          quizId: `${courseId}_quiz`,
          ...doc.data()
        })) as QuizQuestion[];

        newLastDoc = questionDocs.length > 0 ? questionDocs[questionDocs.length - 1] : null;

        // Debug logging
        console.log('📊 Pagination Debug (specific course):', {
          courseId,
          moduleId,
          requestedPageSize: pageSize,
          totalDocsReceived: docs.length,
          questionsReturned: questions.length,
          hasMore,
          lastDocId: newLastDoc?.id
        });
      } else {
        // Fetch from all courses using collectionGroup
        const constraints: QueryConstraint[] = [];

        if (moduleId) {
          constraints.push(where('module_id', '==', moduleId));
        }

        try {
          constraints.push(orderBy('order', 'asc'));
        } catch (e) {
          // Continue without ordering
        }

        if (lastDoc) {
          constraints.push(startAfter(lastDoc));
        }
        constraints.push(limit(pageSize + 1));

        const q = query(collectionGroup(db, QUESTIONS_SUBCOLLECTION), ...constraints);
        const querySnapshot = await getDocs(q);

        const docs = querySnapshot.docs;
        hasMore = docs.length > pageSize;

        const questionDocs = hasMore ? docs.slice(0, pageSize) : docs;
        questions = questionDocs.map(doc => {
          // Extract courseId from the document path
          // Path format: course_quiz/{courseId}_quiz/questions/{questionId}
          const pathParts = doc.ref.path.split('/');
          const quizDocId = pathParts[1]; // e.g., "java_quiz"
          const courseId = quizDocId.replace('_quiz', ''); // e.g., "java"

          return {
            id: doc.id,
            courseId,
            quizId: quizDocId,
            ...doc.data()
          } as QuizQuestion;
        });

        newLastDoc = questionDocs.length > 0 ? questionDocs[questionDocs.length - 1] : null;

        // Debug logging
        console.log('📊 Pagination Debug (all courses):', {
          moduleId,
          requestedPageSize: pageSize,
          totalDocsReceived: docs.length,
          questionsReturned: questions.length,
          hasMore,
          lastDocId: newLastDoc?.id
        });
      }

      return {
        questions,
        lastDoc: newLastDoc,
        hasMore
      };
    } catch (error) {
      console.error('Error getting paginated questions:', error);
      throw error;
    }
  },

  // Get all questions for a course (with optional module filter)
  getQuestions: async (courseId: string, moduleFilter?: string): Promise<QuizQuestion[]> => {
    try {
      const quizRef = doc(db, COURSE_QUIZ_COLLECTION, `${courseId}_quiz`);
      const questionsRef = collection(quizRef, QUESTIONS_SUBCOLLECTION);

      let q = query(questionsRef);

      // Filter by module if provided
      if (moduleFilter && moduleFilter !== 'all') {
        q = query(questionsRef, where('module_id', '==', moduleFilter));
      }

      // Try to order by order field
      try {
        q = query(questionsRef, orderBy('order', 'asc'));
        if (moduleFilter && moduleFilter !== 'all') {
          q = query(questionsRef, where('module_id', '==', moduleFilter), orderBy('order', 'asc'));
        }
      } catch (error) {
        // If orderBy fails, continue without it
        console.warn('OrderBy failed, fetching without ordering');
      }

      const snapshot = await getDocs(q);
      const questions = snapshot.docs.map((doc) => ({
        id: doc.id,
        courseId,
        quizId: `${courseId}_quiz`,
        ...doc.data()
      })) as QuizQuestion[];

      return questions;
    } catch (error) {
      console.error(`Error getting questions for course ${courseId}:`, error);
      throw error;
    }
  },

  // Get single question by ID
  getById: async (courseId: string, questionId: string): Promise<QuizQuestion | null> => {
    try {
      const questionRef = doc(
        db,
        COURSE_QUIZ_COLLECTION,
        `${courseId}_quiz`,
        QUESTIONS_SUBCOLLECTION,
        questionId
      );
      const docSnap = await getDoc(questionRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          courseId,
          quizId: `${courseId}_quiz`,
          ...docSnap.data()
        } as QuizQuestion;
      }
      return null;
    } catch (error) {
      console.error('Error getting question:', error);
      throw error;
    }
  },

  // Add a new quiz question
  addQuestion: async (courseId: string, questionData: Omit<QuizQuestion, 'id' | 'courseId' | 'quizId'>): Promise<string> => {
    try {
      // Validate required fields
      if (!questionData.question) {
        throw new Error('Question text is required');
      }

      if (!questionData.options || !Array.isArray(questionData.options) || questionData.options.length < 4) {
        throw new Error('Four answer options are required');
      }

      if (
        typeof questionData.correctOptionIndex !== 'number' ||
        questionData.correctOptionIndex < 0 ||
        questionData.correctOptionIndex >= questionData.options.length
      ) {
        throw new Error('Valid correct option index is required (0-3)');
      }

      if (!questionData.module_id) {
        throw new Error('Module ID is required');
      }

      const quizRef = doc(db, COURSE_QUIZ_COLLECTION, `${courseId}_quiz`);
      const questionsRef = collection(quizRef, QUESTIONS_SUBCOLLECTION);

      const questionToAdd = {
        question: questionData.question,
        options: questionData.options,
        correctOptionIndex: questionData.correctOptionIndex,
        module_id: questionData.module_id,
        difficulty: questionData.difficulty || 'NORMAL',
        explanation: questionData.explanation || '',
        order: questionData.order || 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const newDoc = await addDoc(questionsRef, questionToAdd);

      console.log(`Question added: ${newDoc.id} for course ${courseId}`);

      return newDoc.id;
    } catch (error) {
      console.error(`Error adding question to course ${courseId}:`, error);
      throw error;
    }
  },

  // Update quiz question
  updateQuestion: async (
    courseId: string,
    questionId: string,
    updatedData: Partial<QuizQuestion>
  ): Promise<void> => {
    try {
      const questionRef = doc(
        db,
        COURSE_QUIZ_COLLECTION,
        `${courseId}_quiz`,
        QUESTIONS_SUBCOLLECTION,
        questionId
      );

      // Check if document exists
      const docSnapshot = await getDoc(questionRef);
      if (!docSnapshot.exists()) {
        throw new Error('Question not found');
      }

      // Validate data if provided
      if (updatedData.options && (!Array.isArray(updatedData.options) || updatedData.options.length < 4)) {
        throw new Error('Four answer options are required');
      }

      if (
        updatedData.correctOptionIndex !== undefined &&
        (typeof updatedData.correctOptionIndex !== 'number' ||
          updatedData.correctOptionIndex < 0 ||
          updatedData.correctOptionIndex >= 4)
      ) {
        throw new Error('Valid correct option index is required (0-3)');
      }

      // Prepare data to update
      const dataToUpdate: any = {
        ...updatedData,
        updatedAt: Timestamp.now()
      };

      // Remove fields that shouldn't be updated
      delete dataToUpdate.id;
      delete dataToUpdate.courseId;
      delete dataToUpdate.quizId;
      delete dataToUpdate.createdAt;

      // Remove undefined values
      Object.keys(dataToUpdate).forEach(
        (key) => dataToUpdate[key] === undefined && delete dataToUpdate[key]
      );

      await updateDoc(questionRef, dataToUpdate);

      console.log(`Question updated: ${questionId} for course ${courseId}`);
    } catch (error) {
      console.error(`Error updating question ${questionId} for course ${courseId}:`, error);
      throw error;
    }
  },

  // Delete quiz question
  deleteQuestion: async (courseId: string, questionId: string): Promise<void> => {
    try {
      const questionRef = doc(
        db,
        COURSE_QUIZ_COLLECTION,
        `${courseId}_quiz`,
        QUESTIONS_SUBCOLLECTION,
        questionId
      );

      // Check if document exists
      const docSnapshot = await getDoc(questionRef);
      if (!docSnapshot.exists()) {
        throw new Error('Question not found');
      }

      await deleteDoc(questionRef);

      console.log(`Question deleted: ${questionId} for course ${courseId}`);
    } catch (error) {
      console.error(`Error deleting question ${questionId} for course ${courseId}:`, error);
      throw error;
    }
  },

  // Get quiz statistics for a course
  getStats: async (courseId: string): Promise<{
    total: number;
    byDifficulty: Record<string, number>;
    byModule: Record<string, number>;
  }> => {
    try {
      const questions = await quizzesService.getQuestions(courseId);

      const stats = {
        total: questions.length,
        byDifficulty: {} as Record<string, number>,
        byModule: {} as Record<string, number>
      };

      questions.forEach((question) => {
        // Count by difficulty
        const difficulty = question.difficulty || 'NORMAL';
        stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;

        // Count by module
        const module = question.module_id || 'Unassigned';
        stats.byModule[module] = (stats.byModule[module] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error(`Error getting quiz stats for course ${courseId}:`, error);
      throw error;
    }
  }
};
