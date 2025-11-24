
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dummyFeedback } from '@/data/dummyData';
import { formatDate } from '@/utils/formatters';

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  pending: 'secondary',
  reviewed: 'outline',
  resolved: 'default',
};

export default function FeedbackPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Feedback</h1>
        <p className="text-muted-foreground mt-1">Direct learner signal for the product team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Response</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyFeedback.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-semibold text-foreground">{item.subject}</div>
                    <div className="text-xs text-muted-foreground">@{item.username}</div>
                  </TableCell>
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[item.status]} className="capitalize">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.response ? 'Responded' : 'Pending'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

