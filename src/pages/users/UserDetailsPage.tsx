import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Users, Award, BookOpen, Settings } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers } from '@/hooks/useUsers';
import { formatDate } from '@/utils/formatters';
import { formatBase64Image } from '@/utils/helpers';
import { User } from '@/types';
import { UserManagementModal } from '@/components/UserManagementModal';

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const { getUser } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [managementModalOpen, setManagementModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          setLoading(true);
          const userData = await getUser(userId);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUser();
  }, [userId, getUser]);

  const handleUserUpdated = async () => {
    if (userId) {
      try {
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <Card className="max-w-lg mx-auto">
          <CardContent className="py-12">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3 animate-pulse" />
            Loading user details...
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

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Link to="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
          </h1>
          <p className="text-muted-foreground mt-1">@{user.username}</p>
        </div>
        <Button
          onClick={() => setManagementModalOpen(true)}
          variant="outline"
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage User
        </Button>
        <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>
          {user.status || 'offline'}
        </Badge>
      </div>

      <Card className="mb-6">
        <CardContent className="flex flex-col md:flex-row gap-6 items-start pt-6">
          {formatBase64Image(user.profilePhotoBase64) ? (
            <img
              src={formatBase64Image(user.profilePhotoBase64)}
              alt={user.username}
              className="h-28 w-28 rounded-2xl object-cover border border-border"
            />
          ) : user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="h-28 w-28 rounded-2xl object-cover border border-border"
            />
          ) : (
            <div className="h-28 w-28 rounded-2xl bg-muted flex items-center justify-center border border-border">
              <Users className="h-14 w-14 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 space-y-4">
            {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {user.email}
              </div>
              {user.createdAt && (
                <div className="text-muted-foreground">
                  Joined {formatDate(user.createdAt)}
                  {user.lastLogin && ` • Last login ${formatDate(user.lastLogin)}`}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {user.currentBadge && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {user.currentBadge}
                </Badge>
              )}
              <Badge variant="secondary">
                Level {user.level || 1}
              </Badge>
              <Badge variant="secondary">
                {user.totalXP || 0} XP
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Courses enrolled</p>
            <p className="text-2xl font-bold text-foreground">{user.courseTaken?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Total XP</p>
            <p className="text-2xl font-bold text-foreground">{user.totalXP || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assessments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Technical Assessments</p>
            <p className="text-2xl font-bold text-foreground">{user.technicalAssessmentsCompleted || 0}</p>
            <p className="text-sm text-muted-foreground">Quizzes Taken</p>
            <p className="text-2xl font-bold text-foreground">{user.quizzesTaken || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Unlocked</p>
            <p className="text-2xl font-bold text-foreground">{user.achievementsUnlocked?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Current Badge</p>
            <p className="text-2xl font-bold text-foreground">{user.currentBadge || 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses Section */}
      {user.courseTaken && user.courseTaken.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Enrolled Courses ({user.courseTaken.length})
            </CardTitle>
            <CardDescription>Courses this user is currently enrolled in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.courseTaken.map((course, index) => (
                <div key={index} className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{course.courseName}</h4>
                      <p className="text-sm text-muted-foreground">{course.category}</p>
                    </div>
                    <Badge variant="outline">{course.difficulty}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements Section */}
      {user.achievementsUnlocked && user.achievementsUnlocked.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements ({user.achievementsUnlocked.length})
            </CardTitle>
            <CardDescription>Unlocked achievements and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.achievementsUnlocked.map((achievement, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>High-level look at their journey</CardDescription>
          </div>
          <Link to={`/users/${user.id}/progress`}>
            <Button size="sm" variant="outline">
              Open Progress View
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Level</p>
            <p className="text-2xl font-bold text-foreground">{user.level || 1}</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Total XP</p>
            <p className="text-lg font-semibold text-foreground">
              {user.totalXP || 0} XP
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Courses Enrolled</p>
            <p className="text-lg font-semibold text-foreground">
              {user.courseTaken?.length || 0} courses
            </p>
          </div>
        </CardContent>
      </Card>

      <UserManagementModal
        user={user}
        open={managementModalOpen}
        onClose={() => setManagementModalOpen(false)}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}

