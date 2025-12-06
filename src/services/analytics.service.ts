import { usersService } from './users.service';
import { coursesService } from './courses.service';
import {
  AnalyticsData,
  AnalyticsStat,
  EngagementMetric,
  TrafficSource,
  CourseCompletionMetric,
  ReportSummary,
  UserActivityData,
  CourseEnrollmentData
} from '@/types/analytics.types';

export const analyticsService = {
  /**
   * Get all analytics data for the dashboard
   */
  getAnalyticsData: async (): Promise<AnalyticsData> => {
    try {
      const [stats, engagementMetrics, trafficSources, courseCompletionMetrics, reportSummaries] = await Promise.all([
        analyticsService.getAnalyticsStats(),
        analyticsService.getEngagementMetrics(),
        analyticsService.getTrafficSources(),
        analyticsService.getCourseCompletionMetrics(),
        analyticsService.getReportSummaries()
      ]);

      return {
        stats,
        engagementMetrics,
        trafficSources,
        courseCompletionMetrics,
        reportSummaries
      };
    } catch (error) {
      console.error('L Failed to get analytics data:', error);
      throw new Error('Failed to retrieve analytics data');
    }
  },

  /**
   * Get top-level analytics statistics
   */
  getAnalyticsStats: async (): Promise<AnalyticsStat[]> => {
    try {
      const users = await usersService.getAll();

      // Calculate active learners (logged in within last 7 days)
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);

      const activeThisWeek = users.filter(user => {
        const lastLogin = user.lastLogin;
        if (!lastLogin) return false;
        const loginTime = lastLogin instanceof Date ? lastLogin.getTime() :
                         typeof lastLogin === 'object' && 'seconds' in lastLogin ? lastLogin.seconds * 1000 :
                         typeof lastLogin === 'number' ? lastLogin : 0;
        return loginTime >= sevenDaysAgo;
      }).length;

      const activeLastWeek = users.filter(user => {
        const lastLogin = user.lastLogin;
        if (!lastLogin) return false;
        const loginTime = lastLogin instanceof Date ? lastLogin.getTime() :
                         typeof lastLogin === 'object' && 'seconds' in lastLogin ? lastLogin.seconds * 1000 :
                         typeof lastLogin === 'number' ? lastLogin : 0;
        return loginTime >= fourteenDaysAgo && loginTime < sevenDaysAgo;
      }).length;

      const activeLearnerChange = activeLastWeek > 0
        ? Math.round(((activeThisWeek - activeLastWeek) / activeLastWeek) * 100)
        : 0;

      // Calculate course completions (users with at least 1 completed course)
      const usersWithCompletedCourses = users.filter(user =>
        user.courseTaken && user.courseTaken.length > 0
      ).length;

      // Calculate average quiz score
      const usersWithQuizzes = users.filter(user => (user.quizzesTaken || 0) > 0);
      const totalQuizScore = usersWithQuizzes.reduce((sum, user) => {
        // Estimate score based on XP and quizzes taken
        const avgScore = user.totalXP && user.quizzesTaken
          ? Math.min(100, (user.totalXP / (user.quizzesTaken * 10)) * 100)
          : 0;
        return sum + avgScore;
      }, 0);
      const avgQuizScore = usersWithQuizzes.length > 0
        ? Math.round(totalQuizScore / usersWithQuizzes.length)
        : 0;

      // Calculate total assessments completed
      const totalAssessments = users.reduce((sum, user) =>
        sum + (user.technicalAssessmentsCompleted || 0), 0
      );

      return [
        {
          id: 'stat-1',
          label: 'Active Learners',
          value: activeThisWeek.toString(),
          change: activeLearnerChange,
          trend: activeLearnerChange >= 0 ? 'up' : 'down'
        },
        {
          id: 'stat-2',
          label: 'Course Completions',
          value: usersWithCompletedCourses.toString(),
          change: 8, // Could be calculated with historical data
          trend: 'up'
        },
        {
          id: 'stat-3',
          label: 'Avg. Quiz Score',
          value: `${avgQuizScore}%`,
          change: -2, // Could be calculated with historical data
          trend: 'down'
        },
        {
          id: 'stat-4',
          label: 'Assessments Completed',
          value: totalAssessments.toString(),
          change: 5, // Could be calculated with historical data
          trend: 'up'
        }
      ];
    } catch (error) {
      console.error('L Failed to get analytics stats:', error);
      throw new Error('Failed to retrieve analytics statistics');
    }
  },

  /**
   * Get engagement metrics
   */
  getEngagementMetrics: async (): Promise<EngagementMetric[]> => {
    try {
      const users = await usersService.getAll();

      // Weekly Active Users
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

      const weeklyActiveUsers = users.filter(user => {
        const lastLogin = user.lastLogin;
        if (!lastLogin) return false;
        const loginTime = lastLogin instanceof Date ? lastLogin.getTime() :
                         typeof lastLogin === 'object' && 'seconds' in lastLogin ? lastLogin.seconds * 1000 :
                         typeof lastLogin === 'number' ? lastLogin : 0;
        return loginTime >= sevenDaysAgo;
      }).length;

      const wauTarget = Math.max(weeklyActiveUsers, Math.ceil(users.length * 0.7));

      // Lesson Completion Rate (users with courses / total enrolled users)
      const enrolledUsers = users.filter(user => user.isEnrolled || (user.courseTaken && user.courseTaken.length > 0)).length;
      const usersWithProgress = users.filter(user => user.quizzesTaken && user.quizzesTaken > 0).length;
      const lessonCompletionRate = enrolledUsers > 0
        ? Math.round((usersWithProgress / enrolledUsers) * 100)
        : 0;

      // Assessment Pass Rate
      const usersWithAssessments = users.filter(user => {
        const scores = user.assessmentScores || {};
        return Object.keys(scores).length > 0;
      });

      const passedAssessments = usersWithAssessments.filter(user => {
        const scores = user.assessmentScores || {};
        return Object.values(scores).some((score: any) => score.passed);
      }).length;

      const assessmentPassRate = usersWithAssessments.length > 0
        ? Math.round((passedAssessments / usersWithAssessments.length) * 100)
        : 0;

      return [
        {
          id: 'eng-1',
          label: 'Weekly Active Users',
          description: 'Learners who engaged with any learning asset this week',
          current: weeklyActiveUsers,
          target: wauTarget,
          change: 6 // Could be calculated with historical data
        },
        {
          id: 'eng-2',
          label: 'Lesson Completion Rate',
          description: 'Percent of lessons that learners finish after starting',
          current: lessonCompletionRate,
          target: 85,
          change: 3 // Could be calculated with historical data
        },
        {
          id: 'eng-3',
          label: 'Assessment Pass Rate',
          description: 'Learners passing technical assessments on first try',
          current: assessmentPassRate,
          target: 70,
          change: -1 // Could be calculated with historical data
        }
      ];
    } catch (error) {
      console.error('L Failed to get engagement metrics:', error);
      throw new Error('Failed to retrieve engagement metrics');
    }
  },

  /**
   * Get traffic sources (placeholder - would need signup tracking)
   */
  getTrafficSources: async (): Promise<TrafficSource[]> => {
    // This would require additional tracking of signup sources in the user model
    // For now, returning placeholder data
    return [
      { id: 'src-1', channel: 'Direct', percentage: 42, change: 4 },
      { id: 'src-2', channel: 'Email Campaigns', percentage: 28, change: 2 },
      { id: 'src-3', channel: 'Partner Schools', percentage: 18, change: -3 },
      { id: 'src-4', channel: 'Community Events', percentage: 12, change: 1 }
    ];
  },

  /**
   * Get course completion metrics
   */
  getCourseCompletionMetrics: async (): Promise<CourseCompletionMetric[]> => {
    try {
      const [users, courses] = await Promise.all([
        usersService.getAll(),
        coursesService.getAll()
      ]);

      const courseMetrics: CourseCompletionMetric[] = [];

      for (const course of courses) {
        const courseName = course.title || 'Unnamed Course';

        // Find users enrolled in this course
        const enrolledUsers = users.filter(user =>
          user.courseTaken?.some(c => c.courseName === courseName)
        );

        if (enrolledUsers.length === 0) continue;

        // Estimate completion based on users who have taken quizzes and assessments
        // This is a simplified calculation - you might want to add a "completed" flag to courseTaken
        const completedUsers = enrolledUsers.filter(user => {
          // Consider completed if user has significant XP or completed assessments
          return user.totalXP && user.totalXP > 100;
        });

        const completionRate = enrolledUsers.length > 0
          ? Math.round((completedUsers.length / enrolledUsers.length) * 100)
          : 0;

        courseMetrics.push({
          id: `cc-${course.id}`,
          course: courseName,
          completionRate,
          activeLearners: enrolledUsers.length
        });
      }

      // Sort by number of active learners (descending)
      return courseMetrics
        .sort((a, b) => b.activeLearners - a.activeLearners)
        .slice(0, 6); // Return top 6 courses
    } catch (error) {
      console.error('L Failed to get course completion metrics:', error);
      throw new Error('Failed to retrieve course completion metrics');
    }
  },

  /**
   * Get report summaries
   */
  getReportSummaries: async (): Promise<ReportSummary[]> => {
    // Generate reports based on current date
    const now = new Date();
    const lastWeek = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const lastMonth = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const lastQuarter = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));

    return [
      {
        id: 'report-1',
        title: 'Weekly Learning Health',
        description: 'Engagement, retention, and completion snapshots for leadership.',
        lastGenerated: lastWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        frequency: 'Weekly',
        owner: 'Growth Team',
        status: 'ready'
      },
      {
        id: 'report-2',
        title: 'Assessment Outcomes',
        description: 'Breakdown of technical assessment performance by cohort.',
        lastGenerated: lastWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        frequency: 'Weekly',
        owner: 'Instruction',
        status: 'scheduled'
      },
      {
        id: 'report-3',
        title: 'Monthly Course Insights',
        description: 'Course-by-course deep dive with NPS, completions, and feedback.',
        lastGenerated: lastMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        frequency: 'Monthly',
        owner: 'Program Ops',
        status: 'ready'
      },
      {
        id: 'report-4',
        title: 'Quarterly Accreditation Summary',
        description: 'Outcomes required for partner accreditation renewals.',
        lastGenerated: lastQuarter.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        frequency: 'Quarterly',
        owner: 'Compliance',
        status: 'in-progress'
      }
    ];
  },

  /**
   * Get detailed user activity data
   */
  getUserActivityData: async (): Promise<UserActivityData> => {
    try {
      const users = await usersService.getAll();
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);

      const activeThisWeek = users.filter(user => {
        const lastLogin = user.lastLogin;
        if (!lastLogin) return false;
        const loginTime = lastLogin instanceof Date ? lastLogin.getTime() :
                         typeof lastLogin === 'object' && 'seconds' in lastLogin ? lastLogin.seconds * 1000 :
                         typeof lastLogin === 'number' ? lastLogin : 0;
        return loginTime >= sevenDaysAgo;
      }).length;

      const activeLastWeek = users.filter(user => {
        const lastLogin = user.lastLogin;
        if (!lastLogin) return false;
        const loginTime = lastLogin instanceof Date ? lastLogin.getTime() :
                         typeof lastLogin === 'object' && 'seconds' in lastLogin ? lastLogin.seconds * 1000 :
                         typeof lastLogin === 'number' ? lastLogin : 0;
        return loginTime >= fourteenDaysAgo && loginTime < sevenDaysAgo;
      }).length;

      const usersWithCourses = users.filter(user =>
        user.courseTaken && user.courseTaken.length > 0
      ).length;

      const totalQuizzesTaken = users.reduce((sum, user) =>
        sum + (user.quizzesTaken || 0), 0
      );

      const totalAssessmentsCompleted = users.reduce((sum, user) =>
        sum + (user.technicalAssessmentsCompleted || 0), 0
      );

      const totalXP = users.reduce((sum, user) =>
        sum + (user.totalXP || 0), 0
      );

      const averageXP = users.length > 0 ? totalXP / users.length : 0;

      return {
        totalUsers: users.length,
        activeUsersThisWeek: activeThisWeek,
        activeUsersLastWeek: activeLastWeek,
        usersWithCourses,
        totalQuizzesTaken,
        totalAssessmentsCompleted,
        totalXP,
        averageXP
      };
    } catch (error) {
      console.error('L Failed to get user activity data:', error);
      throw new Error('Failed to retrieve user activity data');
    }
  },

  /**
   * Get course enrollment data
   */
  getCourseEnrollmentData: async (): Promise<CourseEnrollmentData[]> => {
    try {
      const [users, courses] = await Promise.all([
        usersService.getAll(),
        coursesService.getAll()
      ]);

      const enrollmentData: CourseEnrollmentData[] = [];

      for (const course of courses) {
        const courseName = course.title || 'Unnamed Course';

        const enrolledUsers = users.filter(user =>
          user.courseTaken?.some(c => c.courseName === courseName)
        );

        if (enrolledUsers.length === 0) continue;

        // Simplified completion logic - could be enhanced with actual completion tracking
        const completedUsers = enrolledUsers.filter(user =>
          user.totalXP && user.totalXP > 100
        );

        enrollmentData.push({
          courseName,
          totalEnrolled: enrolledUsers.length,
          completedCount: completedUsers.length,
          inProgressCount: enrolledUsers.length - completedUsers.length,
          completionRate: Math.round((completedUsers.length / enrolledUsers.length) * 100)
        });
      }

      return enrollmentData.sort((a, b) => b.totalEnrolled - a.totalEnrolled);
    } catch (error) {
      console.error('L Failed to get course enrollment data:', error);
      throw new Error('Failed to retrieve course enrollment data');
    }
  }
};
