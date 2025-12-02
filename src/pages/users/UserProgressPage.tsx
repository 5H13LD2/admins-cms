import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target, Users, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types';

export default function UserProgressPage() {
  const { userId } = useParams<{ userId: string }>();
  const { getUser, getUserCourseProgress, getUserTechnicalAssessmentProgress } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  const [courseProgress, setCourseProgress] = useState<any[]>([]);
  const [technicalAssessmentProgress, setTechnicalAssessmentProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          setLoading(true);
          const userData = await getUser(userId);
          setUser(userData);

          // Fetch detailed course progress
          try {
            const progressData = await getUserCourseProgress(userId);
            setCourseProgress(progressData);
          } catch (progressError) {
            console.log('No course progress data found');
            setCourseProgress([]);
          }

          // Fetch technical assessment progress
          try {
            const assessmentData = await getUserTechnicalAssessmentProgress(userId);
            setTechnicalAssessmentProgress(assessmentData);
          } catch (assessmentError) {
            console.log('No technical assessment progress data found');
            setTechnicalAssessmentProgress([]);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [userId, getUser, getUserCourseProgress, getUserTechnicalAssessmentProgress]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardContent className="py-12">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3 animate-pulse" />
            Loading progress data...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>User not found</CardTitle>
            <CardDescription>The requested user is unavailable.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/users">
              <Button>Back to Users</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Merge enrolled courses with progress data
  const learningPath = user.courseTaken?.map((course) => {
    const progressData = courseProgress.find(cp => cp.courseId === course.courseId);
    return {
      id: course.courseId,
      course: course.courseName,
      completion: progressData?.overall_progress || 0,
      focus: course.category,
      difficulty: course.difficulty,
      enrolledAt: course.enrolledAt,
      totalLessons: progressData?.total_lessons || 0,
      completedLessons: progressData?.completed_lessons || 0,
      totalModules: progressData?.total_modules || 0,
      completedModules: progressData?.completed_modules || 0
    };
  }) || [];

  // Calculate XP progress to next level (assuming 1000 XP per level)
  const currentLevelXP = ((user.level || 1) - 1) * 1000;
  const nextLevelXP = (user.level || 1) * 1000;
  const xpProgress = ((user.totalXP || 0) - currentLevelXP) / (nextLevelXP - currentLevelXP) * 100;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      <div className="flex items-center gap-4 mb-6">
        <Link to={`/users/${user.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}'s` : user.username + "'s"} Progress
          </h1>
          <p className="text-muted-foreground mt-1">Learning trajectory and milestone tracking</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Level {user.level || 1}</Badge>
          <Badge variant="secondary">{user.totalXP || 0} XP</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total XP</CardTitle>
            <CardDescription>Experience Points Earned</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{user.totalXP || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courses Enrolled</CardTitle>
            <CardDescription>Active learning paths</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{user.courseTaken?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quizzes Taken</CardTitle>
            <CardDescription>Quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{user.quizzesTaken || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assessments</CardTitle>
            <CardDescription>Technical completions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{user.technicalAssessmentsCompleted || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress to Next Level */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
          <CardDescription>
            Level {user.level || 1} - {Math.max(0, Math.floor(xpProgress))}% to Level {(user.level || 1) + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={Math.max(0, Math.min(100, xpProgress))} className="h-4" />
          <p className="text-sm text-muted-foreground mt-2">
            {Math.max(0, nextLevelXP - (user.totalXP || 0))} XP needed for next level
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Enrolled Courses
            </CardTitle>
            <CardDescription>
              {learningPath.length > 0 ? 'Course-level progress' : 'No courses enrolled yet'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {learningPath.length > 0 ? (
              learningPath.map((path) => (
                <div key={path.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{path.course}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{path.focus}</p>
                        <Badge variant="outline" className="text-xs">{path.difficulty}</Badge>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{path.completion}%</span>
                  </div>
                  <Progress value={path.completion} />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {path.completedLessons}/{path.totalLessons} lessons • {path.completedModules}/{path.totalModules} modules
                    </span>
                    <span>
                      Enrolled: {new Date(path.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No courses enrolled yet. Enroll in a course to start learning!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Achievements Unlocked
            </CardTitle>
            <CardDescription>
              {user.achievementsUnlocked?.length || 0} achievements earned
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.achievementsUnlocked && user.achievementsUnlocked.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.achievementsUnlocked.map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {achievement}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No achievements unlocked yet. Keep learning to earn achievements!
              </p>
            )}

            {user.currentBadge && (
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-2">Current Badge</p>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {user.currentBadge}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Module Progress Details */}
      {courseProgress.length > 0 && courseProgress.some(cp => cp.modules && cp.modules.length > 0) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Module Progress</CardTitle>
            <CardDescription>Detailed breakdown by course modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {courseProgress.map((courseData) => {
              if (!courseData.modules || courseData.modules.length === 0) return null;

              const courseName = user.courseTaken?.find(c => c.courseId === courseData.courseId)?.courseName || courseData.courseId;

              return (
                <div key={courseData.courseId} className="space-y-3">
                  <h4 className="font-semibold text-foreground">{courseName}</h4>
                  <div className="space-y-3 pl-4 border-l-2 border-border">
                    {courseData.modules.map((module: any) => (
                      <div key={module.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{module.module_id}</p>
                          <span className="text-xs font-semibold text-foreground">{module.progress || 0}%</span>
                        </div>
                        <Progress value={module.progress || 0} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {module.completed_count || 0}/{module.total_lessons || 0} lessons completed
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Technical Assessment Progress */}
      {technicalAssessmentProgress.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Technical Assessment Progress</CardTitle>
            <CardDescription>SQL and coding assessment completions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {technicalAssessmentProgress.map((assessment) => (
              <div key={assessment.assessmentId} className="space-y-2 p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{assessment.assessmentId}</p>
                    {assessment.completed_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Completed: {new Date(assessment.completed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {assessment.status && (
                      <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'}>
                        {assessment.status}
                      </Badge>
                    )}
                    {assessment.score !== undefined && (
                      <Badge variant="outline">
                        Score: {assessment.score}%
                      </Badge>
                    )}
                  </div>
                </div>
                {assessment.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold text-foreground">{assessment.progress}%</span>
                    </div>
                    <Progress value={assessment.progress} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Learning Activity Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Learning Activity Summary</CardTitle>
          <CardDescription>Key metrics and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Current Progress</p>
              <p className="text-sm text-muted-foreground">
                {user.courseTaken && user.courseTaken.length > 0
                  ? `Enrolled in ${user.courseTaken.length} course${user.courseTaken.length !== 1 ? 's' : ''} with ${user.totalXP || 0} total XP earned.`
                  : 'No active courses yet. Start your learning journey today!'}
              </p>
              {user.quizzesTaken && user.quizzesTaken > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Completed {user.quizzesTaken} quiz{user.quizzesTaken !== 1 ? 'zes' : ''} and {user.technicalAssessmentsCompleted || 0} technical assessment{user.technicalAssessmentsCompleted !== 1 ? 's' : ''}.
                </p>
              )}
            </div>
          </div>

          {user.achievementsUnlocked && user.achievementsUnlocked.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Target className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Achievements</p>
                <p className="text-sm text-muted-foreground">
                  Unlocked {user.achievementsUnlocked.length} achievement{user.achievementsUnlocked.length !== 1 ? 's' : ''} and earned the {user.currentBadge || 'BRONZE'} badge.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Next Milestone</p>
              <p className="text-sm text-muted-foreground">
                {user.level && user.level >= 1
                  ? `Reach Level ${(user.level || 1) + 1} by earning ${Math.max(0, nextLevelXP - (user.totalXP || 0))} more XP.`
                  : 'Complete quizzes and assessments to earn XP and level up!'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

