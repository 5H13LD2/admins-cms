import { useState, useEffect, useCallback } from 'react';
import { Module } from '@/types';
import { modulesService } from '@/services/modules.service';

export const useModules = (courseId?: string) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchModules = useCallback(async () => {
        try {
            setLoading(true);
            const data = courseId
                ? await modulesService.getByCourseId(courseId)
                : await modulesService.getAll();
            setModules(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    return {
        modules,
        loading,
        error,
        refresh: fetchModules,
        getModule: modulesService.getById,
        createModule: modulesService.create,
        updateModule: modulesService.update,
        deleteModule: modulesService.delete,
        reorderModules: modulesService.reorder
    };
};
