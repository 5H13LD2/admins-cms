import { useState, useCallback } from 'react';
import { Quiz } from '@/types';
import { quizzesService } from '@/services/quizzes.service';
import { DocumentSnapshot } from 'firebase/firestore';

export const useQuizzes = (moduleId?: string) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (moduleId) {
        // For module-specific queries, fetch all and filter
        const data = await quizzesService.getByModuleId(moduleId);
        setQuizzes(data);
      } else {
        // Fetch ALL quizzes by paginating through everything
        const allQuizzes: Quiz[] = [];
        let lastDocument: DocumentSnapshot | null = null;
        let hasMoreData = true;

        while (hasMoreData) {
          const { quizzes: newQuizzes, lastDoc: newLastDoc } = await quizzesService.getAll(
            50, // Fetch 50 at a time for efficiency
            lastDocument || undefined
          );

          allQuizzes.push(...newQuizzes);

          if (!newLastDoc || newQuizzes.length < 50) {
            hasMoreData = false;
          }
          lastDocument = newLastDoc;
        }

        setQuizzes(allQuizzes);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  const createQuiz = async (quizData: Omit<Quiz, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const id = await quizzesService.create(quizData);
      await fetchQuizzes(); // Refresh the list
      return id;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating quiz:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (quizId: string, quizData: Partial<Quiz>) => {
    try {
      setLoading(true);
      setError(null);
      await quizzesService.update(quizId, quizData);
      await fetchQuizzes(); // Refresh the list
    } catch (err) {
      setError(err as Error);
      console.error('Error updating quiz:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      setError(null);
      await quizzesService.delete(quizId);
      await fetchQuizzes(); // Refresh the list
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting quiz:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    getQuiz: quizzesService.getById,
    createQuiz,
    updateQuiz,
    deleteQuiz
  };
};
