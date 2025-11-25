import { useState, useCallback } from 'react';
import { TechnicalAssessment } from '@/types';
import { assessmentsService } from '@/services/assessments.service';

export const useAssessments = (courseId?: string) => {
    const [assessments, setAssessments] = useState<TechnicalAssessment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchAssessments = useCallback(async () => {
        if (!courseId) return;
        try {
            setLoading(true);
            const data = await assessmentsService.getByCourseId(courseId);
            setAssessments(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    return {
        assessments,
        loading,
        error,
        fetchAssessments,
        getAllAssessments: assessmentsService.getAll,
        getAssessment: assessmentsService.getById,
        createAssessment: assessmentsService.create,
        updateAssessment: assessmentsService.update,
        deleteAssessment: assessmentsService.delete
    };
};
