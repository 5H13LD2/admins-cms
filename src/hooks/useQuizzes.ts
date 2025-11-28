import { useState, useEffect, useCallback } from 'react';
import { quizzesService, QuizQuestion } from '@/services/quizzes.service';
import { DocumentSnapshot } from 'firebase/firestore';

interface UseQuizzesOptions {
  courseId?: string;
  moduleId?: string;
  pageSize?: number;
}

interface UseQuizzesReturn {
  questions: QuizQuestion[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useQuizzes(options: UseQuizzesOptions = {}): UseQuizzesReturn {
  const { courseId, moduleId, pageSize = 10 } = options;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial fetch
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await quizzesService.getPaginated({
        courseId,
        moduleId,
        pageSize,
        lastDoc: null // Reset pagination
      });

      setQuestions(result.questions);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);

      // Debug logging
      console.log('✅ Questions fetched successfully:', {
        count: result.questions.length,
        hasMore: result.hasMore,
        sampleQuestion: result.questions[0]?.question.substring(0, 50) + '...'
      });
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err as Error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [courseId, moduleId, pageSize]);

  // Load more questions
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      setError(null);

      const result = await quizzesService.getPaginated({
        courseId,
        moduleId,
        pageSize,
        lastDoc
      });

      setQuestions(prev => [...prev, ...result.questions]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);

      // Debug logging
      console.log('➕ More questions loaded:', {
        newQuestionsCount: result.questions.length,
        totalQuestionsNow: questions.length + result.questions.length,
        hasMore: result.hasMore
      });
    } catch (err) {
      console.error('Error loading more questions:', err);
      setError(err as Error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [courseId, moduleId, pageSize, lastDoc, hasMore, isLoadingMore]);

  // Refresh (reset and fetch from beginning)
  const refresh = useCallback(async () => {
    setLastDoc(null);
    await fetchQuestions();
  }, [fetchQuestions]);

  // Fetch questions when options change
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    loading: loading || isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh
  };
}

// Hook for getting questions for a specific course
export function useCourseQuestions(courseId: string | undefined, moduleFilter?: string) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await quizzesService.getQuestions(courseId, moduleFilter);
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching course questions:', err);
        setError(err as Error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId, moduleFilter]);

  const refresh = useCallback(async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const data = await quizzesService.getQuestions(courseId, moduleFilter);
      setQuestions(data);
    } catch (err) {
      console.error('Error refreshing questions:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [courseId, moduleFilter]);

  return { questions, loading, error, refresh };
}

// Hook for getting a single question
export function useQuestion(courseId: string | undefined, questionId: string | undefined) {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId || !questionId) {
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await quizzesService.getById(courseId, questionId);
        setQuestion(data);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError(err as Error);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [courseId, questionId]);

  const refresh = useCallback(async () => {
    if (!courseId || !questionId) return;

    try {
      setLoading(true);
      const data = await quizzesService.getById(courseId, questionId);
      setQuestion(data);
    } catch (err) {
      console.error('Error refreshing question:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [courseId, questionId]);

  return { question, loading, error, refresh };
}

// Hook for question CRUD operations
export function useQuestionActions(courseId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addQuestion = useCallback(async (questionData: Omit<QuizQuestion, 'id' | 'courseId' | 'quizId'>) => {
    try {
      setLoading(true);
      setError(null);
      const id = await quizzesService.addQuestion(courseId, questionData);
      return id;
    } catch (err) {
      console.error('Error adding question:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const updateQuestion = useCallback(async (questionId: string, questionData: Partial<QuizQuestion>) => {
    try {
      setLoading(true);
      setError(null);
      await quizzesService.updateQuestion(courseId, questionId, questionData);
    } catch (err) {
      console.error('Error updating question:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const deleteQuestion = useCallback(async (questionId: string) => {
    try {
      setLoading(true);
      setError(null);
      await quizzesService.deleteQuestion(courseId, questionId);
    } catch (err) {
      console.error('Error deleting question:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  return {
    addQuestion,
    updateQuestion,
    deleteQuestion,
    loading,
    error
  };
}
