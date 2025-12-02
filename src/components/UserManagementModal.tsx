import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Edit2, Award, BookOpen, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/types';
import { useToast } from '@/hooks/useToast';

interface UserManagementModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export function UserManagementModal({
  user,
  open,
  onClose,
  onUserUpdated
}: UserManagementModalProps) {
  const {
    unenrollUserFromCourse,
    addOrUpdateAssessment,
    deleteAssessment,
    updateUserXP,
    addAchievement,
    removeAchievement,
    updateUserBadge,
    getUserTechnicalAssessmentProgress,
    loading
  } = useUsers();

  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'courses' | 'assessments' | 'achievements' | 'xp'>('courses');
  const [courseToUnenroll, setCourseToUnenroll] = useState<string>('');
  const [assessmentId, setAssessmentId] = useState('');
  const [assessmentScore, setAssessmentScore] = useState('');
  const [assessmentPassed, setAssessmentPassed] = useState(false);
  const [xpToAdd, setXpToAdd] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [technicalAssessmentProgress, setTechnicalAssessmentProgress] = useState<any[]>([]);

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setCourseToUnenroll('');
      setAssessmentId('');
      setAssessmentScore('');
      setAssessmentPassed(false);
      setXpToAdd('');
      setNewAchievement('');
      setNewBadge('');
      setTechnicalAssessmentProgress([]);
    } else if (user) {
      // Fetch technical assessment progress when modal opens
      console.log('🔍 Fetching technical assessments for user:', user.id);
      const fetchTechnicalAssessments = async () => {
        try {
          const data = await getUserTechnicalAssessmentProgress(user.id);
          console.log('✅ Technical assessment data received:', data);
          setTechnicalAssessmentProgress(data);
        } catch (error) {
          console.error('❌ Error fetching technical assessment progress:', error);
          setTechnicalAssessmentProgress([]);
        }
      };
      fetchTechnicalAssessments();
    }
  }, [open, user, getUserTechnicalAssessmentProgress]);

  if (!user) return null;

  const handleUnenroll = async () => {
    if (!courseToUnenroll) {
      toast.error('Please select a course');
      return;
    }

    try {
      await unenrollUserFromCourse(user.email, courseToUnenroll);
      toast.success('User unenrolled successfully');
      onUserUpdated();
      setCourseToUnenroll('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to unenroll user');
    }
  };

  const handleAddAssessment = async () => {
    if (!assessmentId || !assessmentScore) {
      toast.error('Please fill all assessment fields');
      return;
    }

    try {
      const score = parseFloat(assessmentScore);
      if (isNaN(score) || score < 0 || score > 100) {
        toast.error('Score must be between 0 and 100');
        return;
      }

      await addOrUpdateAssessment(user.id, assessmentId, score, assessmentPassed);
      toast.success('Assessment added/updated successfully');
      onUserUpdated();
      setAssessmentId('');
      setAssessmentScore('');
      setAssessmentPassed(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add assessment');
    }
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;

    try {
      await deleteAssessment(user.id, assessmentId);
      toast.success('Assessment deleted successfully');
      onUserUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete assessment');
    }
  };

  const handleUpdateXP = async () => {
    if (!xpToAdd) {
      toast.error('Please enter XP amount');
      return;
    }

    try {
      const xp = parseInt(xpToAdd);
      if (isNaN(xp)) {
        toast.error('XP must be a number');
        return;
      }

      await updateUserXP(user.id, xp);
      toast.success(`Added ${xp} XP to user`);
      onUserUpdated();
      setXpToAdd('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update XP');
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievement) {
      toast.error('Please enter achievement name');
      return;
    }

    try {
      await addAchievement(user.id, newAchievement);
      toast.success('Achievement added successfully');
      onUserUpdated();
      setNewAchievement('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add achievement');
    }
  };

  const handleRemoveAchievement = async (achievementName: string) => {
    if (!confirm('Are you sure you want to remove this achievement?')) return;

    try {
      await removeAchievement(user.id, achievementName);
      toast.success('Achievement removed successfully');
      onUserUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove achievement');
    }
  };

  const handleUpdateBadge = async () => {
    if (!newBadge) {
      toast.error('Please enter badge name');
      return;
    }

    try {
      await updateUserBadge(user.id, newBadge);
      toast.success('Badge updated successfully');
      onUserUpdated();
      setNewBadge('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update badge');
    }
  };

  const assessmentScores = user.assessmentScores || {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manage User: {user.username}
          </DialogTitle>
          <DialogDescription>
            Manage courses, assessments, achievements, and XP for this user
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b mb-4">
          <Button
            variant={activeTab === 'courses' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('courses')}
            className="rounded-b-none"
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </Button>
          <Button
            variant={activeTab === 'assessments' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('assessments')}
            className="rounded-b-none"
            size="sm"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Assessments
          </Button>
          <Button
            variant={activeTab === 'achievements' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('achievements')}
            className="rounded-b-none"
            size="sm"
          >
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </Button>
          <Button
            variant={activeTab === 'xp' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('xp')}
            className="rounded-b-none"
            size="sm"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            XP & Badge
          </Button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Unenroll from Course</Label>
              <div className="flex gap-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={courseToUnenroll}
                  onChange={(e) => setCourseToUnenroll(e.target.value)}
                >
                  <option value="">Select a course...</option>
                  {user.courseTaken?.map((course, idx) => (
                    <option key={idx} value={course.courseName}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleUnenroll}
                  disabled={!courseToUnenroll || loading}
                  variant="destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Unenroll
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Enrolled Courses ({user.courseTaken?.length || 0})</Label>
              <div className="grid grid-cols-2 gap-2">
                {user.courseTaken && user.courseTaken.length > 0 ? (
                  user.courseTaken.map((course, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="font-semibold">{course.courseName}</div>
                      <div className="text-sm text-muted-foreground">{course.category}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground col-span-2">No courses enrolled</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div className="space-y-4">
            <div className="space-y-4 border p-4 rounded-lg">
              <h3 className="font-semibold">Add/Edit Assessment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assessment ID</Label>
                  <Input
                    value={assessmentId}
                    onChange={(e) => setAssessmentId(e.target.value)}
                    placeholder="assessment-id"
                  />
                </div>
                <div>
                  <Label>Score (0-100)</Label>
                  <Input
                    type="number"
                    value={assessmentScore}
                    onChange={(e) => setAssessmentScore(e.target.value)}
                    placeholder="85"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="passed"
                  checked={assessmentPassed}
                  onChange={(e) => setAssessmentPassed(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="passed">Passed</Label>
              </div>
              <Button onClick={handleAddAssessment} disabled={loading}>
                <Plus className="h-4 w-4 mr-2" />
                Add/Update Assessment
              </Button>
            </div>

            <div className="space-y-2">
              <Label>User Assessments ({Object.keys(assessmentScores).length + technicalAssessmentProgress.length})</Label>

              {/* Assessment Scores from User Document */}
              {Object.keys(assessmentScores).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Manual Assessments</h4>
                  {Object.entries(assessmentScores).map(([id, data]: [string, any]) => (
                    <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-semibold">{id}</div>
                        <div className="text-sm text-muted-foreground">
                          Score: {data.score}% {data.passed ? '✓ Passed' : '✗ Failed'}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAssessment(id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Technical Assessment Progress from Firestore */}
              {technicalAssessmentProgress.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Technical Assessments (From Progress)</h4>
                  {technicalAssessmentProgress.map((assessment) => (
                    <div key={assessment.assessmentId} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{assessment.assessmentId}</div>
                        {assessment.status && (
                          <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'}>
                            {assessment.status}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {assessment.score !== undefined && (
                          <div>Score: {assessment.score}%</div>
                        )}
                        {assessment.progress !== undefined && (
                          <div>Progress: {assessment.progress}%</div>
                        )}
                        {assessment.completed_at && (
                          <div>Completed: {new Date(assessment.completed_at).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {Object.keys(assessmentScores).length === 0 && technicalAssessmentProgress.length === 0 && (
                <p className="text-sm text-muted-foreground">No assessments recorded</p>
              )}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="space-y-2 border p-4 rounded-lg">
              <h3 className="font-semibold">Add Achievement</h3>
              <div className="flex gap-2">
                <Input
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Achievement name"
                />
                <Button onClick={handleAddAchievement} disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Unlocked Achievements ({user.achievementsUnlocked?.length || 0})</Label>
              <div className="flex flex-wrap gap-2">
                {user.achievementsUnlocked && user.achievementsUnlocked.length > 0 ? (
                  user.achievementsUnlocked.map((achievement, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-2">
                      {achievement}
                      <button
                        onClick={() => handleRemoveAchievement(achievement)}
                        className="ml-1 hover:text-destructive"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No achievements unlocked</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* XP & Badge Tab */}
        {activeTab === 'xp' && (
          <div className="space-y-4">
            <div className="space-y-2 border p-4 rounded-lg">
              <h3 className="font-semibold">Update XP</h3>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={xpToAdd}
                  onChange={(e) => setXpToAdd(e.target.value)}
                  placeholder="XP to add (can be negative)"
                />
                <Button onClick={handleUpdateXP} disabled={loading}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Update XP
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Current XP: {user.totalXP || 0}
              </p>
            </div>

            <div className="space-y-2 border p-4 rounded-lg">
              <h3 className="font-semibold">Update Badge</h3>
              <div className="flex gap-2">
                <Input
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="BRONZE, SILVER, GOLD, etc."
                />
                <Button onClick={handleUpdateBadge} disabled={loading}>
                  <Award className="h-4 w-4 mr-2" />
                  Update Badge
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Current Badge: {user.currentBadge || 'N/A'}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

