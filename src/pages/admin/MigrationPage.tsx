import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { migrateModuleCount } from '@/scripts/migrateModuleCount';

export default function MigrationPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        details?: { updatedCount: number; skippedCount: number; total: number };
    } | null>(null);

    const handleRunMigration = async () => {
        setIsRunning(true);
        setResult(null);

        try {
            const migrationResult = await migrateModuleCount();
            setResult({
                success: true,
                message: 'Migration completed successfully!',
                details: migrationResult
            });
        } catch (error) {
            setResult({
                success: false,
                message: error instanceof Error ? error.message : 'Migration failed'
            });
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Database Migrations</h1>
                <p className="text-muted-foreground mt-1">
                    Run database migrations to fix data inconsistencies
                </p>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Database className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>Initialize Module Count</CardTitle>
                                <CardDescription>
                                    Updates all courses to have the correct moduleCount field based on actual module data
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-semibold text-sm">What this migration does:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Counts the actual number of modules for each course</li>
                                <li>Updates the <code className="bg-background px-1 py-0.5 rounded">moduleCount</code> field</li>
                                <li>Skips courses that already have the correct count</li>
                                <li>Safe to run multiple times</li>
                            </ul>
                        </div>

                        <Button
                            onClick={handleRunMigration}
                            disabled={isRunning}
                            className="w-full sm:w-auto"
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Running Migration...
                                </>
                            ) : (
                                <>
                                    <Database className="mr-2 h-4 w-4" />
                                    Run Migration
                                </>
                            )}
                        </Button>

                        {result && (
                            <Alert variant={result.success ? 'default' : 'destructive'}>
                                {result.success ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertDescription>
                                    <div className="space-y-2">
                                        <p className="font-semibold">{result.message}</p>
                                        {result.details && (
                                            <div className="text-sm space-y-1">
                                                <p>✅ Updated: {result.details.updatedCount} courses</p>
                                                <p>⏭️ Skipped: {result.details.skippedCount} courses</p>
                                                <p>📊 Total: {result.details.total} courses</p>
                                            </div>
                                        )}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
