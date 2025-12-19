import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import SearchBar from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsers } from '@/hooks/useUsers';
import { formatBase64Image } from '@/utils/helpers';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { users, loading, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesSearch =
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.firstName && user.lastName &&
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [users, searchQuery, statusFilter]);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Snowfall />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage learners and mentors</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <SearchBar placeholder="Search users..." onSearch={setSearchQuery} className="max-w-md" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3 animate-pulse" />
            Loading users...
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            No users match your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="flex flex-col">
              <CardHeader className="flex flex-row gap-4 items-center">
                {formatBase64Image(user.profilePhotoBase64) ? (
                  <img
                    src={formatBase64Image(user.profilePhotoBase64)}
                    alt={user.username}
                    className="h-16 w-16 rounded-full object-cover border border-border"
                  />
                ) : user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-16 w-16 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border border-border">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </div>
                <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>
                  {user.status || 'offline'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Courses Taken</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.courseTaken?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total XP</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.totalXP || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Level</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.level || 1}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Badge</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.currentBadge || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quizzes Taken</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.quizzesTaken || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assessments</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.technicalAssessmentsCompleted || 0}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to={`/users/${user.id}`}>
                    <Button variant="outline">View Profile</Button>
                  </Link>
                  <Link to={`/users/${user.id}/progress`}>
                    <Button variant="secondary">Progress</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

