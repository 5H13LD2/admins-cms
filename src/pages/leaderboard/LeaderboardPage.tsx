
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dummyLeaderboard, dummyUsers } from '@/data/dummyData';

const userMap = dummyUsers.reduce<Record<string, { name: string; avatar?: string }>>(
  (acc, user) => {
    acc[user.id] = { name: `${user.firstName} ${user.lastName}`, avatar: user.avatar };
    return acc;
  },
  {},
);

export default function LeaderboardPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Friendly competition across the community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Learners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Learner</TableHead>
                <TableHead>Total Points</TableHead>
                <TableHead>Quiz Score</TableHead>
                <TableHead>Challenges</TableHead>
                <TableHead>Streak</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyLeaderboard.map((entry) => {
                const profile = userMap[entry.userId];
                return (
                  <TableRow key={entry.userId}>
                    <TableCell className="font-semibold">#{entry.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatar ?? profile?.avatar}
                          alt={entry.username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{profile?.name ?? entry.username}</p>
                          <p className="text-xs text-muted-foreground">@{entry.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{entry.totalPoints}</TableCell>
                    <TableCell>{entry.quizScore}</TableCell>
                    <TableCell>{entry.challengeScore}</TableCell>
                    <TableCell>{entry.streakDays} days</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

