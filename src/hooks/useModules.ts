import { useState, useCallback } from 'react';
import { Module } from '@/types';
import { modulesService } from '@/services/modules.service';

export const useModules = (courseId?: string) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchModules = useCallback(async () => {
        if (!courseId) return;
        try {
            setLoading(true);
            const data = await modulesService.getByCourseId(courseId);
            setModules(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    return {
        modules,
        loading,
        error,
        fetchModules,
        getModule: modulesService.getById,
        createModule: modulesService.create,
        updateModule: modulesService.update,
        deleteModule: modulesService.delete,
        reorderModules: modulesService.reorder
    };
};
