import DataTable, { type DataColumn } from './DataTable';
import { dashboardLeaderboardTable, type DashboardLeaderboardRow } from '@/data/dummyData';

export default function LeaderboardTable() {
  const columns: DataColumn<DashboardLeaderboardRow>[] = [
    { key: 'rank', header: 'Rank' },
    { key: 'username', header: 'User' },
    { key: 'totalPoints', header: 'Points' },
    {
      key: 'quizzesPassed',
      header: 'Quizzes',
      render: (row) => `${row.quizzesPassed}`,
    },
    {
      key: 'assessmentsCleared',
      header: 'Assessments',
      render: (row) => `${row.assessmentsCleared}`,
    },
    {
      key: 'streakDays',
      header: 'Streak',
      render: (row) => `${row.streakDays}d`,
    },
  ];

  return <DataTable columns={columns} data={dashboardLeaderboardTable} />;
}

