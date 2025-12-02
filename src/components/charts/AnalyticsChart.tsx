import { useEffect, useState } from 'react';
import { useFeedback } from '@/hooks/useFeedback';

const palette = ['#6366f1', '#8b5cf6', '#f97316', '#10b981'];

interface FeedbackStats {
  label: string;
  value: number;
}

const statusLabels: Record<string, string> = {
  new: 'New',
  pending: 'Pending',
  reviewed: 'Reviewed',
  resolved: 'Resolved'
};

export default function AnalyticsChart() {
  const { feedbackList, fetchFeedback } = useFeedback();
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats[]>([]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  useEffect(() => {
    if (feedbackList.length > 0) {
      // Count feedback by status
      const statusCount: Record<string, number> = {
        new: 0,
        pending: 0,
        reviewed: 0,
        resolved: 0
      };

      feedbackList.forEach(feedback => {
        const status = feedback.status || 'new';
        if (status in statusCount) {
          statusCount[status]++;
        }
      });

      // Convert to array for display
      const stats = Object.entries(statusCount)
        .map(([status, count]) => ({
          label: statusLabels[status] || status,
          value: count
        }))
        .filter(item => item.value > 0); // Only show statuses with data

      setFeedbackStats(stats);
    }
  }, [feedbackList]);

  const total = feedbackStats.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Feedback Pipeline</p>
          <p className="text-2xl font-semibold text-foreground">Feedback status</p>
        </div>
        <span className="text-xs text-muted-foreground">Source: feedback</span>
      </div>
      <div className="space-y-4">
        {feedbackStats.length > 0 ? (
          feedbackStats.map((point, index) => {
            const percentage = total > 0 ? Math.round((point.value / total) * 100) : 0;
            return (
              <div key={point.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-6 rounded-full"
                      style={{ backgroundColor: palette[index % palette.length] }}
                    />
                    <span className="text-foreground">{point.label}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {point.value} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: palette[index % palette.length],
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No feedback data available</p>
        )}
      </div>
    </div>
  );
}

