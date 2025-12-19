import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { formatDate } from '@/utils/formatters';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { Course } from '@/types';
import { useToastContext } from '@/context/ToastContext';

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { getCourse, deleteCourse } = useCourses();
  const { modules, loading: modulesLoading } = useModules(id);
  const { success, error: showError } = useToastContext();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const courseData = await getCourse(id);
        setCourse(courseData);
        // Modules are automatically fetched by useModules hook
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, getCourse]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          {error ? 'Error loading course' : 'Course not found'}
        </h2>
        <p className="text-muted-foreground mt-2 mb-6">
          {error?.message || "The course you're looking for doesn't exist or has been removed."}
        </p>
        <Link to="/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteCourse(id);
      success('Course deleted successfully!');
      setShowDeleteModal(false);
      navigate('/courses');
    } catch (err) {
      console.error('Error deleting course:', err);
      showError(err instanceof Error ? err.message : 'Failed to delete course');
    }
  };

  return (
    <div>
      <Snowfall />
      <div className="flex items-center gap-4 mb-6">
        <Link to="/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-500 mt-1">Course Details</p>
        </div>
        <Link to={`/courses/${id}/edit`}>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {course.image && (
        <div className="h-64 overflow-hidden rounded-lg mb-6">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
              {course.status ?? 'draft'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{course.duration ?? 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{course.moduleCount ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{course.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{course.createdAt ? formatDate(course.createdAt) : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{course.updatedAt ? formatDate(course.updatedAt) : 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Course Modules</h3>
            <Link to={`/courses/${id}/modules/create`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </Link>
          </div>

          {modulesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No modules found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                      <Badge>{module.lessons ?? 0} lessons</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{module.duration ?? 'N/A'}</span>
                      <Link to={`/courses/${id}/modules/${module.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>
                Manage course visibility and access settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDelete}
        title="Delete Course"
        description={`Are you sure you want to delete "${course.title}"? This will also delete all associated modules and lessons.`}
      />
    </div>
  );
}
