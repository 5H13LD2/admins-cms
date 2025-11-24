import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import SearchBar from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dummyModules, dummyQuizzes } from '@/data/dummyData';

const difficultyCopy: Record<string, { label: string; variant: 'default' | 'secondary'; color: string }> = {
  EASY: { label: 'Easy', variant: 'secondary', color: 'text-green-600' },
  NORMAL: { label: 'Normal', variant: 'default', color: 'text-blue-600' },
  HARD: { label: 'Hard', variant: 'default', color: 'text-red-600' },
};

export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');

  const moduleMap = useMemo(() => {
    return dummyModules.reduce<Record<string, string>>((acc, module) => {
      acc[module.id] = module.title;
      return acc;
    }, {});
  }, []);

  const filteredQuizzes = dummyQuizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
    const matchesModule = moduleFilter === 'all' || quiz.moduleId === moduleFilter;
    return matchesSearch && matchesDifficulty && matchesModule;
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">


      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quizzes</h1>
          <p className="text-muted-foreground mt-1">Assess understanding after each module</p>
        </div>
        <div className="flex gap-3">
          <Link to="/quizzes/manage">
            <Button variant="outline">Management Hub</Button>
          </Link>
          <Link to="/quizzes/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <SearchBar placeholder="Search quizzes..." onSearch={setSearchQuery} className="max-w-md" />
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {dummyModules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Passing Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.map((quiz) => {
              const difficultyMeta = difficultyCopy[quiz.difficulty];
              return (
                <TableRow key={quiz.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{quiz.title}</div>
                    <div className="text-xs text-muted-foreground">{quiz.description ?? '—'}</div>
                  </TableCell>
                  <TableCell>{moduleMap[quiz.moduleId]}</TableCell>
                  <TableCell>
                    <Badge variant={difficultyMeta.variant}>{difficultyMeta.label}</Badge>
                  </TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{quiz.passingScore ?? '—'}%</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/quizzes/${quiz.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredQuizzes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  No quizzes found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

