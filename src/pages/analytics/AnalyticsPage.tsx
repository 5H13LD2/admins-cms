
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  analyticsStats,
  courseCompletionMetrics,
  engagementMetrics,
  trafficSources,
} from '@/data/analytics.dummy';

export default function AnalyticsPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Pulse across learners, content, and growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {analyticsStats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div
                className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {stat.trend === 'up' ? '▲' : '▼'} {stat.change}% vs last week
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>Key health metrics for learner activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {engagementMetrics.map((metric) => (
              <div key={metric.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.description}</p>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {metric.current}/{metric.target}
                  </div>
                </div>
                <Progress value={(metric.current / metric.target) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where new signups originate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{source.channel}</p>
                  <p className="text-xs text-muted-foreground">
                    {source.change >= 0 ? '▲' : '▼'} {Math.abs(source.change)} pts vs week prior
                  </p>
                </div>
                <span className="text-lg font-semibold text-foreground">{source.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Completion</CardTitle>
          <CardDescription>Percent of learners completing each course</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courseCompletionMetrics.map((metric) => (
            <div key={metric.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">{metric.course}</p>
                  <p className="text-xs text-muted-foreground">{metric.activeLearners} active learners</p>
                </div>
                <span className="text-lg font-semibold text-foreground">{metric.completionRate}%</span>
              </div>
              <Progress value={metric.completionRate} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

