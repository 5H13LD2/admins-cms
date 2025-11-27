import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Quiz, Question, QuizFormData } from '@/types';

export const quizzesService = {
  // Get all quizzes with optional limit
  getAll: async (limitCount?: number): Promise<Quiz[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'course_quiz'));
      const quizzes = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Extract courseId from quiz ID if not present (e.g., "java_quiz" -> "course_java")
        const courseId = data.courseId || `course_${doc.id.replace('_quiz', '')}`;

        return {
          id: doc.id,
          courseId,
          moduleId: data.moduleId || data.module_id || '',
          title: data.title || doc.id.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: data.description || '',
          difficulty: data.difficulty || 'NORMAL',
          passingScore: data.passingScore || 70,
          questionCount: data.questionCount || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Quiz;
      });

      // Sort by createdAt on client side (newest first)
      const sorted = quizzes.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime; // descending order
      });

      // Apply limit if specified
      return limitCount ? sorted.slice(0, limitCount) : sorted;
    } catch (error) {
      console.error('Error getting quizzes:', error);
      throw error;
    }
  },

  // Get quizzes by course ID with optional limit
  getByCourseId: async (courseId: string, limitCount?: number): Promise<Quiz[]> => {
    try {
      // Get all quizzes first, then filter by courseId
      const allQuizzes = await quizzesService.getAll();

      // Filter by courseId (derived or actual)
      const filtered = allQuizzes.filter(quiz => quiz.courseId === courseId);

      // Apply limit if specified
      return limitCount ? filtered.slice(0, limitCount) : filtered;
    } catch (error) {
      console.error('Error getting quizzes by course:', error);
      throw error;
    }
  },

  // Get quizzes by module ID with optional limit
  getByModuleId: async (moduleId: string, limitCount?: number): Promise<Quiz[]> => {
    try {
      // Get all quizzes first, then filter by moduleId
      const allQuizzes = await quizzesService.getAll();

      // Filter by moduleId
      const filtered = allQuizzes.filter(quiz => quiz.moduleId === moduleId);

      // Apply limit if specified
      return limitCount ? filtered.slice(0, limitCount) : filtered;
    } catch (error) {
      console.error('Error getting quizzes by module:', error);
      throw error;
    }
  },

  // Get single quiz by ID
  getById: async (quizId: string): Promise<Quiz | null> => {
    try {
      const docRef = doc(db, 'course_quiz', quizId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const quizData = docSnap.data();

        // Fetch all question modules for this quiz
        const questionsSnapshot = await getDocs(
          collection(db, `course_quiz/${quizId}/questions`)
        );

        // Flatten questions from all modules
        const questions: Question[] = [];
        questionsSnapshot.docs.forEach((moduleDoc) => {
          const moduleData = moduleDoc.data();

          // Check if this is the new format (questions array) or old format (individual question docs)
          if (moduleData.questions && Array.isArray(moduleData.questions)) {
            // New format: questions stored as array in module document
            const moduleQuestions = moduleData.questions;

            moduleQuestions.forEach((q: any, index: number) => {
              questions.push({
                id: `${moduleDoc.id}_q${index + 1}`,
                quizId: quizId,
                question: q.question,
                options: q.options,
                correctOptionIndex: q.correctOptionIndex,
                explanation: q.explanation,
                order: q.order !== undefined ? q.order : questions.length,
                module_id: moduleDoc.id,
              } as Question);
            });
          } else {
            // Old format: each document is a single question
            questions.push({
              id: moduleDoc.id,
              quizId: quizId,
              question: moduleData.question || '',
              options: moduleData.options || [],
              correctOptionIndex: moduleData.correctOptionIndex || 0,
              explanation: moduleData.explanation,
              order: moduleData.order !== undefined ? moduleData.order : questions.length,
              module_id: moduleData.module_id || moduleDoc.id,
            } as Question);
          }
        });

        // Sort questions by order
        questions.sort((a, b) => (a.order || 0) - (b.order || 0));

        // Extract courseId from quiz ID if not present (e.g., "java_quiz" -> "course_java")
        const courseId = quizData.courseId || `course_${docSnap.id.replace('_quiz', '')}`;

        return {
          id: docSnap.id,
          courseId,
          moduleId: quizData.moduleId || quizData.module_id || '',
          title: quizData.title || docSnap.id.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: quizData.description || '',
          difficulty: quizData.difficulty || 'NORMAL',
          timeLimit: quizData.timeLimit,
          passingScore: quizData.passingScore || 70,
          questionCount: questions.length,
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

  // Get questions for a quiz by module
  // Questions are stored with IDs like: java_module_1, java_module_2, etc.
  // Each module document contains an array of 50 questions (new format) or individual question docs (old format)
  getQuestions: async (quizId: string, moduleId?: string): Promise<Question[]> => {
    try {
      const questionsRef = collection(db, `course_quiz/${quizId}/questions`);

      if (moduleId) {
        // If moduleId is provided, fetch only that specific module's questions
        const questionDocRef = doc(db, `course_quiz/${quizId}/questions`, moduleId);
        const questionDoc = await getDoc(questionDocRef);

        if (questionDoc.exists()) {
          const moduleData = questionDoc.data();

          // Check if new format (questions array) or old format (single question)
          if (moduleData.questions && Array.isArray(moduleData.questions)) {
            // New format
            const moduleQuestions = moduleData.questions;
            return moduleQuestions.map((q: any, index: number) => ({
              id: `${questionDoc.id}_q${index + 1}`,
              quizId,
              question: q.question,
              options: q.options,
              correctOptionIndex: q.correctOptionIndex,
              explanation: q.explanation,
              order: q.order !== undefined ? q.order : index,
              module_id: questionDoc.id,
            })) as Question[];
          } else {
            // Old format
            return [{
              id: questionDoc.id,
              quizId,
              question: moduleData.question || '',
              options: moduleData.options || [],
              correctOptionIndex: moduleData.correctOptionIndex || 0,
              explanation: moduleData.explanation,
              order: moduleData.order || 0,
              module_id: moduleData.module_id || questionDoc.id,
            }] as Question[];
          }
        }
        return [];
      } else {
        // Fetch all questions from all modules for the quiz
        const querySnapshot = await getDocs(questionsRef);
        const questions: Question[] = [];

        querySnapshot.docs.forEach((moduleDoc) => {
          const moduleData = moduleDoc.data();

          // Check if new format (questions array) or old format (single question)
          if (moduleData.questions && Array.isArray(moduleData.questions)) {
            // New format: questions stored as array
            const moduleQuestions = moduleData.questions;
            moduleQuestions.forEach((q: any, index: number) => {
              questions.push({
                id: `${moduleDoc.id}_q${index + 1}`,
                quizId,
                question: q.question,
                options: q.options,
                correctOptionIndex: q.correctOptionIndex,
                explanation: q.explanation,
                order: q.order !== undefined ? q.order : questions.length,
                module_id: moduleDoc.id,
              } as Question);
            });
          } else {
            // Old format: each document is a single question
            questions.push({
              id: moduleDoc.id,
              quizId,
              question: moduleData.question || '',
              options: moduleData.options || [],
              correctOptionIndex: moduleData.correctOptionIndex || 0,
              explanation: moduleData.explanation,
              order: moduleData.order !== undefined ? moduleData.order : questions.length,
              module_id: moduleData.module_id || moduleDoc.id,
            } as Question);
          }
        });

        // Sort questions by order
        questions.sort((a, b) => (a.order || 0) - (b.order || 0));
        return questions;
      }
    } catch (error) {
      console.error('Error getting questions:', error);
      throw error;
    }
  },

  // Get questions for a specific module (helper function)
  // moduleNumber: 1 for questions 1-50, 2 for questions 51-100, etc.
  getQuestionsByModule: async (quizId: string, courseName: string, moduleNumber: number): Promise<Question[]> => {
    try {
      const moduleId = `${courseName}_module_${moduleNumber}`;
      const questionDocRef = doc(db, `course_quiz/${quizId}/questions`, moduleId);
      const questionDoc = await getDoc(questionDocRef);

      if (questionDoc.exists()) {
        const moduleData = questionDoc.data();
        const moduleQuestions = moduleData.questions || [];

        return moduleQuestions.map((q: any, index: number) => ({
          id: `${questionDoc.id}_q${index + 1}`,
          quizId,
          question: q.question,
          options: q.options,
          correctOptionIndex: q.correctOptionIndex,
          explanation: q.explanation,
          order: q.order,
          module_id: questionDoc.id,
        })) as Question[];
      }
      return [];
    } catch (error) {
      console.error('Error getting questions by module:', error);
      throw error;
    }
  },

  // Create new quiz with questions
  // Questions are grouped by module: {course}_module_{number}
  // Each module can have up to 50 questions
  create: async (quizData: QuizFormData): Promise<string> => {
    try {
      const batch = writeBatch(db);

      // Extract course name from courseId (e.g., "course_java" -> "java")
      const courseName = quizData.courseId.replace('course_', '');
      const quizId = `${courseName}_quiz`;
      const quizRef = doc(db, 'course_quiz', quizId);

      // Create quiz document
      batch.set(quizRef, {
        courseId: quizData.courseId,
        moduleId: quizData.moduleId,
        title: quizData.title,
        description: quizData.description || '',
        difficulty: quizData.difficulty,
        passingScore: quizData.passingScore || null,
        questionCount: quizData.questions.length,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Group questions by module (50 questions per module)
      const QUESTIONS_PER_MODULE = 50;
      const questionsByModule: { [key: string]: any[] } = {};

      quizData.questions.forEach((question, index) => {
        const moduleNumber = Math.floor(index / QUESTIONS_PER_MODULE) + 1;
        const moduleId = `${courseName}_module_${moduleNumber}`;

        if (!questionsByModule[moduleId]) {
          questionsByModule[moduleId] = [];
        }

        questionsByModule[moduleId].push({
          question: question.question,
          options: question.options,
          correctOptionIndex: question.correctOptionIndex,
          explanation: question.explanation || '',
          order: question.order,
        });
      });

      // Create question documents (one document per module)
      Object.entries(questionsByModule).forEach(([moduleId, questions]) => {
        const questionRef = doc(db, `course_quiz/${quizId}/questions`, moduleId);

        batch.set(questionRef, {
          module_id: moduleId,
          questions: questions,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      });

      await batch.commit();
      return quizId;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  // Update quiz (without questions)
  update: async (quizId: string, quizData: Partial<Quiz>): Promise<void> => {
    try {
      const docRef = doc(db, 'course_quiz', quizId);
      await updateDoc(docRef, {
        ...quizData,
        updatedAt: Timestamp.now()
      });

      // Note: Updating questions would require more complex logic
      // This is a basic implementation that only updates metadata
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  // Update quiz with questions
  updateWithQuestions: async (quizId: string, quizData: QuizFormData): Promise<void> => {
    try {
      const batch = writeBatch(db);

      // Update quiz document
      const quizRef = doc(db, 'course_quiz', quizId);
      batch.update(quizRef, {
        title: quizData.title,
        description: quizData.description || '',
        difficulty: quizData.difficulty,
        passingScore: quizData.passingScore || null,
        questionCount: quizData.questions.length,
        updatedAt: Timestamp.now()
      });

      // Delete existing questions
      const questionsRef = collection(db, `course_quiz/${quizId}/questions`);
      const questionsSnapshot = await getDocs(questionsRef);
      questionsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Group questions by module (50 questions per module)
      const QUESTIONS_PER_MODULE = 50;
      const courseName = quizId.replace('_quiz', '');
      const questionsByModule: { [key: string]: any[] } = {};

      quizData.questions.forEach((question, index) => {
        const moduleNumber = Math.floor(index / QUESTIONS_PER_MODULE) + 1;
        const moduleId = `${courseName}_module_${moduleNumber}`;

        if (!questionsByModule[moduleId]) {
          questionsByModule[moduleId] = [];
        }

        questionsByModule[moduleId].push({
          question: question.question,
          options: question.options,
          correctOptionIndex: question.correctOptionIndex,
          explanation: question.explanation || '',
          order: question.order,
        });
      });

      // Create question documents (one document per module)
      Object.entries(questionsByModule).forEach(([moduleId, questions]) => {
        const questionRef = doc(db, `course_quiz/${quizId}/questions`, moduleId);

        batch.set(questionRef, {
          module_id: moduleId,
          questions: questions,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error updating quiz with questions:', error);
      throw error;
    }
  },

  // Delete quiz and all its questions
  delete: async (quizId: string): Promise<void> => {
    try {
      const batch = writeBatch(db);

      // Delete all questions first
      const questionsRef = collection(db, `course_quiz/${quizId}/questions`);
      const questionsSnapshot = await getDocs(questionsRef);
      questionsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete quiz document
      const quizRef = doc(db, 'course_quiz', quizId);
      batch.delete(quizRef);

      await batch.commit();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  }
};
