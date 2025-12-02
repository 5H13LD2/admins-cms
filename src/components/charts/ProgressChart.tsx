import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { useCourses } from '@/hooks/useCourses';
import { useUsers } from '@/hooks/useUsers';

interface CourseProgress {
  courseId: string;
  courseName: string;
  completionRate: number;
  activeLearners: number;
}

export default function ProgressChart() {
  const { courses } = useCourses();
  const { users } = useUsers();
  const [progressData, setProgressData] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (courses.length === 0 || users.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const courseProgressMap = new Map<string, { totalProgress: number; userCount: number }>();

        // Fetch user_progress data for each user
        for (const user of users) {
          try {
            const userProgressRef = collection(db, `user_progress/${user.id}/courses`);
            const coursesSnapshot = await getDocs(userProgressRef);

            // For each course the user is enrolled in
            for (const courseDoc of coursesSnapshot.docs) {
              const courseId = courseDoc.id;
              const courseData = courseDoc.data();

              try {
                // Get modules subcollection to calculate progress
                const modulesRef = collection(db, `user_progress/${user.id}/courses/${courseId}/modules`);
                const modulesSnapshot = await getDocs(modulesRef);

                if (modulesSnapshot.size > 0) {
                  // Calculate progress based on completed modules
                  let completedModules = 0;
                  let totalModules = modulesSnapshot.size;

                  modulesSnapshot.forEach(moduleDoc => {
                    const moduleData = moduleDoc.data();
                    if (moduleData.completed === true || moduleData.progress === 100) {
                      completedModules++;
                    }
                  });

                  const progress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

                  if (!courseProgressMap.has(courseId)) {
                    courseProgressMap.set(courseId, { totalProgress: 0, userCount: 0 });
                  }

                  const stats = courseProgressMap.get(courseId)!;
                  stats.totalProgress += progress;
                  stats.userCount++;
                } else if (courseData.progress !== undefined) {
                  // Fallback to course-level progress if modules don't exist
                  if (!courseProgressMap.has(courseId)) {
                    courseProgressMap.set(courseId, { totalProgress: 0, userCount: 0 });
                  }

                  const stats = courseProgressMap.get(courseId)!;
                  stats.totalProgress += (courseData.progress || 0);
                  stats.userCount++;
                }
              } catch (moduleError) {
                // If modules don't exist, check course-level progress
                if (courseData.progress !== undefined) {
                  if (!courseProgressMap.has(courseId)) {
                    courseProgressMap.set(courseId, { totalProgress: 0, userCount: 0 });
                  }

                  const stats = courseProgressMap.get(courseId)!;
                  stats.totalProgress += (courseData.progress || 0);
                  stats.userCount++;
                }
              }
            }
          } catch (error) {
            // User may not have progress data
            console.log(`No progress data for user ${user.id}`);
          }
        }

        // Calculate average completion rate for each course
        const progressArray: CourseProgress[] = [];

        courses.forEach(course => {
          const stats = courseProgressMap.get(course.id);

          if (stats && stats.userCount > 0) {
            const avgCompletion = Math.round(stats.totalProgress / stats.userCount);
            progressArray.push({
              courseId: course.id,
              courseName: course.title,
              completionRate: avgCompletion,
              activeLearners: stats.userCount
            });
          } else {
            // Show courses even if no progress data, with 0%
            const enrolledUsers = users.filter(user =>
              user.courseTaken?.some(c => c.courseName === course.title)
            );

            if (enrolledUsers.length > 0) {
              progressArray.push({
                courseId: course.id,
                courseName: course.title,
                completionRate: 0,
                activeLearners: enrolledUsers.length
              });
            }
          }
        });

        // Sort by active learners and take top 5
        const sortedProgress = progressArray
          .sort((a, b) => b.activeLearners - a.activeLearners)
          .slice(0, 5);

        setProgressData(sortedProgress);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [courses, users]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Course Completion</p>
          <p className="text-2xl font-semibold text-foreground">Learning progress</p>
        </div>
        <span className="text-xs text-muted-foreground">Source: user_progress</span>
      </div>
      <div className="space-y-4">
        {progressData.length > 0 ? (
          progressData.map((point) => (
            <div key={point.courseId}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{point.courseName}</span>
                <span className="text-muted-foreground">{point.completionRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${point.completionRate}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {point.activeLearners} active learners
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No course data available</p>
        )}
      </div>
    </div>
  );
}





