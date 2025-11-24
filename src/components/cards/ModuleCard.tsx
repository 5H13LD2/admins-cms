import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Module } from '@/types';

interface ModuleCardProps {
  module: Module;
  courseName?: string;
}

export default function ModuleCard({ module, courseName }: ModuleCardProps) {
  return (
    <Card className="flex flex-col border border-border/80 bg-white text-gray-900 transition-colors dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
      {module.image && (
        <div className="h-40 overflow-hidden rounded-t-lg">
          <img
            src={module.image}
            alt={module.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{module.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
              {module.description}
            </CardDescription>
          </div>
          <Badge variant="outline">{module.lessons} lessons</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>{courseName}</span>
          <span>{module.duration}</span>
        </div>
        <Link to={`/modules/${module.id}`}>
          <Button variant="outline" className="w-full bg-white dark:bg-gray-900 dark:text-gray-100">
            View Module
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

