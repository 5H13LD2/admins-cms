import { useState, useCallback, useEffect } from 'react';
import { TechnicalAssessment } from '@/types';
import { assessmentsService } from '@/services/assessments.service';

export const useAssessments = (courseId?: string) => {
    const [assessments, setAssessments] = useState<TechnicalAssessment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Fetch assessments (all or by course)
     */
    const fetchAssessments = useCallback(async () => {
        try {
            setLoading(true);
            const data = courseId
                ? await assessmentsService.getByCourseId(courseId)
                : await assessmentsService.getAll();
            setAssessments(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    /**
     * Auto-fetch on mount or when courseId updates
     */
    useEffect(() => {
        fetchAssessments();
    }, [fetchAssessments]);

    /**
     * CRUD Actions
     */
    const actions = {
        getAll: assessmentsService.getAll,
        getOne: assessmentsService.getById,

        create: async (payload: Omit<TechnicalAssessment, 'id'>) => {
            const id = await assessmentsService.create(payload);
            await fetchAssessments(); // refresh list
            return id;
        },

        update: async (id: string, payload: Partial<TechnicalAssessment>) => {
            await assessmentsService.update(id, payload);
            await fetchAssessments();
        },

        remove: async (id: string) => {
            await assessmentsService.delete(id);
            await fetchAssessments();
        }
    };

    return {
        assessments,
        loading,
        error,
        fetchAssessments,
        ...actions
    };
};
