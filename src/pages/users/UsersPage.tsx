import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';

import SearchBar from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyUsers } from '@/data/dummyData';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return dummyUsers.filter((user) => {
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesSearch =
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">


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

      {filteredUsers.length === 0 ? (
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
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-16 w-16 rounded-full object-cover border border-border"
                />
                <div className="flex-1">
                  <CardTitle>{`${user.firstName} ${user.lastName}`}</CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </div>
                <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <p className="text-sm text-muted-foreground">{user.bio}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Courses</p>
                    <p className="text-lg font-semibold text-foreground">{user.coursesEnrolled}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Activities</p>
                    <p className="text-lg font-semibold text-foreground">{user.totalActivities}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Challenges Pass</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.codingChallenges.passed}/{user.codingChallenges.attempted}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quiz Pass Rate</p>
                    <p className="text-lg font-semibold text-foreground">
                      {user.quizzes.passRate}%
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

