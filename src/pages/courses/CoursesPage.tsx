import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import SearchBar from '@/components/common/SearchBar';
import { useCourses } from '@/hooks/useCourses';
import CourseCard from '@/components/cards/CourseCard';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { courses, loading, error } = useCourses();

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p>Error loading courses: {error.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage all courses and their content</p>
        </div>
        <Link to="/courses/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Search courses..."
          onSearch={setSearchQuery}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}
