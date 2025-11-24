import { Link } from 'react-router-dom';
import { Award, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyAchievements } from '@/data/dummyData';

export default function AchievementsPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">


      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground mt-1">Motivate learners with badges and milestones</p>
        </div>
        <Link to="/achievements/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Achievement
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyAchievements.map((achievement) => (
          <Card key={achievement.id} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{achievement.icon ?? '🏅'}</div>
                <div>
                  <CardTitle>{achievement.title}</CardTitle>
                  <CardDescription className="capitalize">{achievement.category}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Points</span>
                <Badge variant="secondary">{achievement.points}</Badge>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                Criteria: {achievement.criteria.type.replace('_', ' ')}
                {achievement.criteria.target && ` (${achievement.criteria.target})`}
              </div>
            </CardContent>
          </Card>
        ))}
        {dummyAchievements.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              <Award className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              No achievements yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

