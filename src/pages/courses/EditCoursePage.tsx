import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { useToastContext } from '@/context/ToastContext';

export default function EditCoursePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCourse, updateCourse } = useCourses();
    const { user } = useAuth();
    const { success, error: showError } = useToastContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        image: '',
        status: 'active' as 'active' | 'inactive' | 'draft' | 'archived',
        compilerTypeId: '',
        CourseId: '',
        CourseDetail: '',
    });

    useEffect(() => {
        const loadCourse = async () => {
            if (!id) return;
            try {
                setIsFetching(true);
                const course = await getCourse(id);
                if (course) {
                    setFormData({
                        title: course.title || '',
                        description: course.description || '',
                        duration: course.duration || '',
                        image: course.image || '',
                        status: course.status || 'active',
                        compilerTypeId: course.compilerTypeId || '',
                        CourseId: course.CourseId || '',
                        CourseDetail: course.CourseDetail || '',
                    });
                }
            } catch (error) {
                console.error('Error loading course:', error);
                showError('Failed to load course');
            } finally {
                setIsFetching(false);
            }
        };

        loadCourse();
    }, [id, getCourse]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showError('User must be logged in to update a course');
            return;
        }

        if (!id) return;

        setIsLoading(true);

        try {
            await updateCourse(id, {
                title: formData.title,
                description: formData.description,
                duration: formData.duration,
                image: formData.image,
                status: formData.status,
                compilerTypeId: formData.compilerTypeId,
                CourseId: formData.CourseId,
                CourseDetail: formData.CourseDetail,
            });
            success('Course updated successfully!');
            navigate(`/courses/${id}`);
        } catch (error) {
            console.error('Error updating course:', error);
            showError(error instanceof Error ? error.message : 'Failed to update course');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (isFetching) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <Snowfall />
            <div className="flex items-center gap-4 mb-6">
                <Link to={`/courses/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
                    <p className="text-gray-500 mt-1">Update course information</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Introduction to Python Programming"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe what students will learn in this course..."
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    placeholder="e.g., 8 weeks"
                                    value={formData.duration}
                                    onChange={(e) => handleChange('duration', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleChange('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL (optional)</Label>
                            <Input
                                id="image"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={formData.image}
                                onChange={(e) => handleChange('image', e.target.value)}
                            />
                            <p className="text-xs text-gray-500">
                                Enter a URL for the course thumbnail image
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="compilerTypeId">Compiler Type ID</Label>
                                <Input
                                    id="compilerTypeId"
                                    placeholder="e.g., python, javascript"
                                    value={formData.compilerTypeId}
                                    onChange={(e) => handleChange('compilerTypeId', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="CourseId">Course ID</Label>
                                <Input
                                    id="CourseId"
                                    placeholder="Enter course identifier"
                                    value={formData.CourseId}
                                    onChange={(e) => handleChange('CourseId', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="CourseDetail">Course Detail</Label>
                                <Input
                                    id="CourseDetail"
                                    placeholder="Additional course details"
                                    value={formData.CourseDetail}
                                    onChange={(e) => handleChange('CourseDetail', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Course'
                                )}
                            </Button>
                            <Link to={`/courses/${id}`}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
