import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import SearchBar from '@/components/common/SearchBar';
import { dummyCourses } from '@/data/dummyData';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses] = useState(dummyCourses);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            {course.image && (
              <div className="h-48 overflow-hidden rounded-t-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                  {course.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{course.moduleCount} modules</span>
                <span>{course.duration}</span>
              </div>
              <Link to={`/courses/${course.id}`}>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
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
