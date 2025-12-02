import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useFeedback } from '@/hooks/useFeedback';
import { Timestamp } from 'firebase/firestore';
import { Feedback, FeedbackStatus } from '@/types/feedback.types';
import { CheckCircle, MessageSquare, Trash2, Eye } from 'lucide-react';

const statusVariant: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  new: 'destructive',
  pending: 'secondary',
  reviewed: 'outline',
  resolved: 'default',
};

const formatDate = (timestamp: Timestamp | Date | any) => {
  if (!timestamp) return 'N/A';

  let date: Date;
  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return 'Invalid date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function FeedbackPage() {
  const {
    feedbackList,
    loading,
    error,
    fetchFeedback,
    updateStatus,
    addResponse,
    deleteFeedback
  } = useFeedback();

  const [statusFilter, setStatusFilter] = useState<'all' | FeedbackStatus>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const filteredFeedback = feedbackList.filter(item =>
    statusFilter === 'all' || item.status === statusFilter
  );

  const handleStatusChange = async (feedbackId: string, newStatus: FeedbackStatus) => {
    setIsUpdating(true);
    try {
      await updateStatus(feedbackId, newStatus);
      await fetchFeedback(); // Refresh the list
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddResponse = async () => {
    if (!selectedFeedback || !responseText.trim()) return;

    setIsUpdating(true);
    try {
      await addResponse(selectedFeedback.id, responseText);
      await fetchFeedback(); // Refresh the list
      setIsResponseDialogOpen(false);
      setResponseText('');
      setSelectedFeedback(null);
    } catch (err) {
      console.error('Failed to add response:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    setIsUpdating(true);
    try {
      await deleteFeedback(feedbackId);
      await fetchFeedback(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete feedback:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const openDetailDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDetailOpen(true);
  };

  const openResponseDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.response || '');
    setIsResponseDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
          <p className="text-muted-foreground mt-1">Direct learner signal for the product team</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading feedback...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
          <p className="text-muted-foreground mt-1">Direct learner signal for the product team</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-destructive">Error loading feedback: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
        <p className="text-muted-foreground mt-1">Direct learner signal for the product team</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent feedback ({filteredFeedback.length} of {feedbackList.length})</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFeedback.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {statusFilter === 'all' ? 'No feedback yet' : `No ${statusFilter} feedback`}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Device Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-semibold text-foreground">{item.username}</div>
                      <div className="text-xs text-muted-foreground">{item.userEmail}</div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={item.feedback}>
                        {item.feedback}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="max-w-[200px] truncate">{item.deviceInfo}</div>
                      <div className="text-xs">{item.appVersion}</div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.status}
                        onValueChange={(value) => handleStatusChange(item.id, value as FeedbackStatus)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Badge variant={statusVariant[item.status]} className="capitalize">
                            {item.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(item.timestamp)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailDialog(item)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openResponseDialog(item)}
                          title="Add/Edit response"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={isUpdating}
                          title="Delete"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              View complete feedback information
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">User</label>
                <p className="text-sm">{selectedFeedback.username} ({selectedFeedback.userEmail})</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Feedback</label>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedFeedback.feedback}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Device Info</label>
                  <p className="text-sm">{selectedFeedback.deviceInfo}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">App Version</label>
                  <p className="text-sm">{selectedFeedback.appVersion}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Status</label>
                  <div>
                    <Badge variant={statusVariant[selectedFeedback.status]} className="capitalize">
                      {selectedFeedback.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold">Submitted</label>
                  <p className="text-sm">{formatDate(selectedFeedback.timestamp)}</p>
                </div>
              </div>
              {selectedFeedback.response && (
                <div>
                  <label className="text-sm font-semibold">Admin Response</label>
                  <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">
                    {selectedFeedback.response}
                  </p>
                </div>
              )}
              {selectedFeedback.resolvedAt && (
                <div>
                  <label className="text-sm font-semibold">Resolved At</label>
                  <p className="text-sm">{formatDate(selectedFeedback.resolvedAt)}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Response</DialogTitle>
            <DialogDescription>
              Provide a response to {selectedFeedback?.username}'s feedback
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Feedback</label>
                <p className="text-sm bg-muted p-3 rounded-lg">{selectedFeedback.feedback}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Your Response</label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={5}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResponse} disabled={isUpdating || !responseText.trim()}>
              {isUpdating ? (
                <>Saving...</>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

