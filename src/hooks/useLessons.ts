import { useState, useCallback } from 'react';
import { Lesson } from '@/types';
import { lessonsService } from '@/services/lessons.service';

export const useLessons = (courseId?: string, moduleId?: string) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchLessons = useCallback(async () => {
        if (!courseId || !moduleId) return;
        try {
            setLoading(true);
            const data = await lessonsService.getByModuleId(courseId, moduleId);
            setLessons(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [courseId, moduleId]);

    return {
        lessons,
        loading,
        error,
        fetchLessons,
        getLesson: lessonsService.getById,
        createLesson: lessonsService.create,
        updateLesson: lessonsService.update,
        deleteLesson: lessonsService.delete
    };
};
