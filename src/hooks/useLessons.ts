import { useState, useEffect, useCallback } from 'react';
import { Lesson } from '@/types';
import { lessonsService } from '@/services/lessons.service';

export const useLessons = (courseId?: string, moduleId?: string) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchLessons = useCallback(async () => {
        try {
            setLoading(true);
            const data = (courseId && moduleId)
                ? await lessonsService.getByModuleId(courseId, moduleId)
                : await lessonsService.getAll();
            setLessons(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [courseId, moduleId]);

    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    return {
        lessons,
        loading,
        error,
        refresh: fetchLessons,
        getLesson: lessonsService.getById,
        createLesson: lessonsService.create,
        updateLesson: lessonsService.update,
        deleteLesson: lessonsService.delete
    };
};
