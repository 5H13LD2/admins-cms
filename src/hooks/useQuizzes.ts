import { useState, useCallback } from 'react';
import { Quiz } from '@/types';
import { quizzesService } from '@/services/quizzes.service';

export const useQuizzes = (moduleId?: string) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchQuizzes = useCallback(async () => {
        if (!moduleId) return;
        try {
            setLoading(true);
            const data = await quizzesService.getByModuleId(moduleId);
            setQuizzes(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [moduleId]);

    return {
        quizzes,
        loading,
        error,
        fetchQuizzes,
        getAllQuizzes: quizzesService.getAll,
        getQuiz: quizzesService.getById,
        createQuiz: quizzesService.create,
        updateQuiz: quizzesService.update,
        deleteQuiz: quizzesService.delete,
        addQuestion: quizzesService.addQuestion,
        updateQuestion: quizzesService.updateQuestion,
        deleteQuestion: quizzesService.deleteQuestion,
        getQuestions: quizzesService.getQuestions,
        createQuestionWithId: quizzesService.createQuestionWithId
    };
};
