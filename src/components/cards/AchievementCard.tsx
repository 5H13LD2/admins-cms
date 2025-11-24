import { Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Achievement } from '@/types';

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <Card className="border border-border/80 bg-white text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <CardHeader className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{achievement.icon ?? <Trophy className="h-6 w-6 text-primary" />}</div>
          <div>
            <CardTitle>{achievement.title}</CardTitle>
            <CardDescription className="capitalize text-muted-foreground">
              {achievement.category}
            </CardDescription>
          </div>
        </div>
        <Badge variant="secondary">{achievement.points} pts</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
          Criteria: {achievement.criteria.type.replace('_', ' ')}
          {achievement.criteria.target && ` (${achievement.criteria.target})`}
        </div>
      </CardContent>
    </Card>
  );
}

