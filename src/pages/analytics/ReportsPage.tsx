
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { reportSummaries } from '@/data/analytics.dummy';

export default function ReportsPage() {
  return (
    <div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Scheduled insights for stakeholders</p>
        </div>
        <Button variant="outline">Generate Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportSummaries.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Last generated</span>
                <span>{report.lastGenerated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Frequency</span>
                <span>{report.frequency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Owner</span>
                <span>{report.owner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="capitalize">{report.status}</span>
              </div>
              <Button className="w-full mt-4">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

