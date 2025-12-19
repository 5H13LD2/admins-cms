import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Plus, Loader2 } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

import SearchBar from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAssessments } from '@/hooks/useAssessments';
import { useCourses } from '@/hooks/useCourses';

export default function AssessmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  const { assessments, loading: assessmentsLoading } = useAssessments();
  const { courses } = useCourses();

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || assessment.difficulty === difficultyFilter;
    const matchesCourse = courseFilter === 'all' || assessment.courseId === courseFilter;
    return matchesSearch && matchesDifficulty && matchesCourse;
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Snowfall />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground mt-1">Technical challenges and projects</p>
        </div>
        <Link to="/assessments/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <SearchBar placeholder="Search assessments..." onSearch={setSearchQuery} className="max-w-md" />
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Advanced
          </Button>
        </div>
      </div>

      {assessmentsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{assessment.title}</CardTitle>
                    <CardDescription className="mt-2">{assessment.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {assessment.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {assessment.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="capitalize">
                    {assessment.type === 'brokenCode' ? 'Broken Code' : assessment.type?.replace('_', ' ')}
                  </span>
                  <span>Status: {assessment.status}</span>
                </div>
                <Link to={`/assessments/${assessment.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {filteredAssessments.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No assessments match your filters.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

