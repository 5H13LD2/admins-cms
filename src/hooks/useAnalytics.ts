import { useState, useEffect } from 'react';
import { analyticsService } from '@/services/analytics.service';
import {
  AnalyticsData,
  AnalyticsStat,
  EngagementMetric,
  CourseCompletionMetric,
  ReportSummary,
  UserActivityData,
  CourseEnrollmentData
} from '@/types/analytics.types';

interface UseAnalyticsReturn {
  analyticsData: AnalyticsData | null;
  userActivityData: UserActivityData | null;
  courseEnrollmentData: CourseEnrollmentData[];
  isLoading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [userActivityData, setUserActivityData] = useState<UserActivityData | null>(null);
  const [courseEnrollmentData, setCourseEnrollmentData] = useState<CourseEnrollmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [analytics, userActivity, courseEnrollment] = await Promise.all([
        analyticsService.getAnalyticsData(),
        analyticsService.getUserActivityData(),
        analyticsService.getCourseEnrollmentData()
      ]);

      setAnalyticsData(analytics);
      setUserActivityData(userActivity);
      setCourseEnrollmentData(courseEnrollment);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const refreshAnalytics = async () => {
    await loadAnalytics();
  };

  return {
    analyticsData,
    userActivityData,
    courseEnrollmentData,
    isLoading,
    error,
    refreshAnalytics
  };
};

// Hook for individual analytics components
export const useAnalyticsStats = () => {
  const [stats, setStats] = useState<AnalyticsStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsService.getAnalyticsStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, isLoading, error };
};

export const useEngagementMetrics = () => {
  const [metrics, setMetrics] = useState<EngagementMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsService.getEngagementMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load engagement metrics');
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return { metrics, isLoading, error };
};

export const useCourseCompletionMetrics = () => {
  const [metrics, setMetrics] = useState<CourseCompletionMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsService.getCourseCompletionMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course metrics');
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return { metrics, isLoading, error };
};

export const useReportSummaries = () => {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsService.getReportSummaries();
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  return { reports, isLoading, error };
};
