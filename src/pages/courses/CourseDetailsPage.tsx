import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { dummyCourses, dummyModules } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const course = dummyCourses.find((c) => c.id === id);
  const modules = dummyModules.filter((m) => m.courseId === id);

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <Link to="/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    console.log('Deleting course:', id);
    setShowDeleteModal(false);
    // Navigate back after delete
  };

  return (
    <div>


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
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
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
              {course.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{course.duration}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{course.moduleCount}</p>
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
                <span className="font-medium">{formatDate(course.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDate(course.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Course Modules</h3>
            <Link to="/modules/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    <Badge>{module.lessons} lessons</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{module.duration}</span>
                    <Link to={`/modules/${module.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
