import { useState, useEffect, useCallback } from 'react';
import { Quiz } from '@/types';
import { quizzesService } from '@/services/quizzes.service';

interface UseQuizzesOptions {
  courseId?: string;
  moduleId?: string;
  limit?: number;
}

export const useQuizzes = (options?: UseQuizzesOptions) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      let data: Quiz[];

      if (options?.moduleId) {
        data = await quizzesService.getByModuleId(options.moduleId, options?.limit);
      } else if (options?.courseId) {
        data = await quizzesService.getByCourseId(options.courseId, options?.limit);
      } else {
        data = await quizzesService.getAll(options?.limit);
      }

      setQuizzes(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options?.courseId, options?.moduleId, options?.limit]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return {
    quizzes,
    loading,
    error,
    refresh: fetchQuizzes,
    getAllQuizzes: quizzesService.getAll,
    getByCourseId: quizzesService.getByCourseId,
    getByModuleId: quizzesService.getByModuleId,
    getQuiz: quizzesService.getById,
    getQuestions: quizzesService.getQuestions,
    createQuiz: quizzesService.create,
    updateQuiz: quizzesService.update,
    updateQuizWithQuestions: quizzesService.updateWithQuestions,
    deleteQuiz: quizzesService.delete
  };
};
