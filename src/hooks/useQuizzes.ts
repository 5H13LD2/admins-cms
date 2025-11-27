import { useState, useCallback } from 'react';
import { Quiz } from '@/types';
import { quizzesService } from '@/services/quizzes.service';
import { DocumentSnapshot } from 'firebase/firestore';

export const useQuizzes = (moduleId?: string) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchQuizzes = useCallback(async (pageSize: number = 10, loadMore: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      if (moduleId) {
        // For module-specific queries, fetch all and filter
        const data = await quizzesService.getByModuleId(moduleId);
        setQuizzes(data);
        setHasMore(false);
      } else {
        // Fetch quizzes with pagination (10 at a time)
        const { quizzes: newQuizzes, lastDoc: newLastDoc } = await quizzesService.getAll(
          pageSize,
          loadMore ? lastDoc || undefined : undefined
        );

        if (loadMore) {
          setQuizzes(prev => [...prev, ...newQuizzes]);
        } else {
          setQuizzes(newQuizzes);
        }

        setLastDoc(newLastDoc);
        setHasMore(newQuizzes.length === pageSize && newLastDoc !== null);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  }, [moduleId, lastDoc]);

  const createQuiz = async (quizData: Omit<Quiz, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const id = await quizzesService.create(quizData);
      await fetchQuizzes(10, false); // Refresh the list with first page
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
      await fetchQuizzes(10, false); // Refresh the list with first page
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
      await fetchQuizzes(10, false); // Refresh the list with first page
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting quiz:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchQuizzes(10, true);
    }
  }, [loading, hasMore, fetchQuizzes]);

  return {
    quizzes,
    loading,
    error,
    hasMore,
    fetchQuizzes,
    loadMore,
    getQuiz: quizzesService.getById,
    createQuiz,
    updateQuiz,
    deleteQuiz
  };
};
