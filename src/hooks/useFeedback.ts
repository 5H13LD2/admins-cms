import { useState, useCallback } from 'react';
import { Feedback } from '@/types';
import { feedbackService } from '@/services/feedback.service';

export const useFeedback = () => {
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchFeedback = useCallback(async () => {
        try {
            setLoading(true);
            const data = await feedbackService.getAll();
            setFeedbackList(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        feedbackList,
        loading,
        error,
        fetchFeedback,
        getFeedback: feedbackService.getById,
        createFeedback: feedbackService.create,
        updateFeedback: feedbackService.update,
        deleteFeedback: feedbackService.delete
    };
};
