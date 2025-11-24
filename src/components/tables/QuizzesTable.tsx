import DataTable, { type DataColumn } from './DataTable';
import { dashboardQuizzesTable, type DashboardQuizRow } from '@/data/dummyData';

export default function QuizzesTable() {
  const columns: DataColumn<DashboardQuizRow>[] = [
    { key: 'title', header: 'Quiz' },
    { key: 'module', header: 'Module' },
    { key: 'attempts', header: 'Attempts' },
    {
      key: 'avgScore',
      header: 'Avg. Score',
      render: (row) => `${row.avgScore}%`,
    },
    {
      key: 'passRate',
      header: 'Pass Rate',
      render: (row) => `${row.passRate}%`,
    },
  ];

  return <DataTable columns={columns} data={dashboardQuizzesTable} />;
}

