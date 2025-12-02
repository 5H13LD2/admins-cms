import { useState, useCallback } from 'react';
import { Feedback, FeedbackStatus } from '@/types/feedback.types';
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

    const fetchByStatus = useCallback(async (status: FeedbackStatus) => {
        try {
            setLoading(true);
            const data = await feedbackService.getByStatus(status);
            setFeedbackList(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchByUser = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            const data = await feedbackService.getByUser(userId);
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
        fetchByStatus,
        fetchByUser,
        getFeedback: feedbackService.getById,
        createFeedback: feedbackService.create,
        updateFeedback: feedbackService.update,
        updateStatus: feedbackService.updateStatus,
        addResponse: feedbackService.addResponse,
        deleteFeedback: feedbackService.delete
    };
};
