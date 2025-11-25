import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/types';
import { coursesService } from '@/services/courses.service';

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const data = await coursesService.getAll();
            setCourses(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return {
        courses,
        loading,
        error,
        refresh: fetchCourses,
        getCourse: coursesService.getById,
        createCourse: coursesService.create,
        updateCourse: coursesService.update,
        deleteCourse: coursesService.delete
    };
};
