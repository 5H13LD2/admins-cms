import { Mail, Activity, UserRound } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type User } from '@/types';

interface UserCardProps {
  user: User;
  onViewProfile?: (userId: string) => void;
}

export default function UserCard({ user, onViewProfile }: UserCardProps) {
  return (
    <Card className="flex flex-col border border-border/80 bg-white text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <CardHeader className="flex flex-row items-center gap-4">
        <img
          src={user.avatar}
          alt={user.username}
          className="h-16 w-16 rounded-full border border-border object-cover"
        />
        <div className="flex-1">
          <CardTitle>{user.firstName ? `${user.firstName} ${user.lastName}` : user.username}</CardTitle>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
        <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>{user.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
          </span>
          {user.role && (
            <span className="flex items-center gap-2 capitalize">
              <UserRound className="h-4 w-4" />
              {user.role}
            </span>
          )}
        </div>
        {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Courses</p>
            <p className="text-lg font-semibold text-foreground">{user.coursesEnrolled}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Activities</p>
            <p className="text-lg font-semibold text-foreground">{user.totalActivities}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pass rate</p>
            <p className="text-lg font-semibold text-foreground">{user.overallPassRate}%</p>
          </div>
        </div>
        {onViewProfile && (
          <Button variant="outline" className="w-full" onClick={() => onViewProfile(user.id)}>
            View Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

