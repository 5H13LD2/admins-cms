import DataTable, { type DataColumn } from './DataTable';
import { dashboardAssessmentsTable, type DashboardAssessmentRow } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';

export default function AssessmentsTable() {
  const columns: DataColumn<DashboardAssessmentRow>[] = [
    { key: 'title', header: 'Assessment' },
    {
      key: 'type',
      header: 'Type',
      render: (row) => (
        <Badge variant="outline" className="capitalize">
          {row.type.replace('_', ' ')}
        </Badge>
      ),
    },
    { key: 'category', header: 'Category' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'default' : 'secondary'} className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    { key: 'submissions', header: 'Submissions' },
    {
      key: 'passRate',
      header: 'Pass Rate',
      render: (row) => `${row.passRate}%`,
    },
  ];

  return <DataTable columns={columns} data={dashboardAssessmentsTable} />;
}

