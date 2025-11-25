import DataTable, { type DataColumn } from './DataTable';
import { dashboardUsersTable, type DashboardUserRow } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';

export default function UsersTable() {
  const columns: DataColumn<DashboardUserRow>[] = [
    { key: 'name', header: 'User' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => <Badge variant="outline">{row.role}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'online' ? 'default' : 'secondary'}>{row.status}</Badge>
      ),
    },
    { key: 'lastLogin', header: 'Last Login' },
    {
      key: 'streak',
      header: 'Streak',
      render: (row) => `${row.streak} days`,
    },
  ];

  return <DataTable columns={columns} data={dashboardUsersTable} />;
}





