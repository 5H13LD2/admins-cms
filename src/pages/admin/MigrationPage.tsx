import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Database, Shield, UserCog } from 'lucide-react';
import { migrateModuleCount } from '@/scripts/migrateModuleCount';
import { setAdminRole, getAllUserRoles } from '@/scripts/setAdminRole';

export default function MigrationPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        details?: { updatedCount: number; skippedCount: number; total: number };
    } | null>(null);

    const [adminEmail, setAdminEmail] = useState('');
    const [adminResult, setAdminResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const [isSettingAdmin, setIsSettingAdmin] = useState(false);

    const [userRoles, setUserRoles] = useState<any[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);

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

    const handleSetAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSettingAdmin(true);
        setAdminResult(null);

        try {
            const result = await setAdminRole(adminEmail);
            setAdminResult({
                success: true,
                message: result.message
            });
            setAdminEmail('');
            // Reload user roles
            await loadUserRoles();
        } catch (error) {
            setAdminResult({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to set admin role'
            });
        } finally {
            setIsSettingAdmin(false);
        }
    };

    const loadUserRoles = async () => {
        setIsLoadingRoles(true);
        try {
            const roles = await getAllUserRoles();
            setUserRoles(roles);
        } catch (error) {
            console.error('Failed to load user roles:', error);
        } finally {
            setIsLoadingRoles(false);
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
                {/* Admin Role Management */}
                <Card className="border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>Admin Role Management</CardTitle>
                                <CardDescription>
                                    Set user roles to 'admin' to allow access to this CMS
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 space-y-2">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-100">Important: Admin-Only Access</h4>
                                    <p className="text-sm text-amber-800 dark:text-amber-200">
                                        Only users with role='admin' can log into this CMS. Use the form below to grant admin access to user accounts.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSetAdmin} className="space-y-4">
                            <div>
                                <label htmlFor="adminEmail" className="block text-sm font-medium mb-2">
                                    User Email
                                </label>
                                <input
                                    id="adminEmail"
                                    type="email"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                                    required
                                    disabled={isSettingAdmin}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSettingAdmin || !adminEmail.trim()}
                                className="w-full sm:w-auto"
                            >
                                {isSettingAdmin ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Setting Admin...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="mr-2 h-4 w-4" />
                                        Set as Admin
                                    </>
                                )}
                            </Button>
                        </form>

                        {adminResult && (
                            <Alert variant={adminResult.success ? 'default' : 'destructive'}>
                                {adminResult.success ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <AlertCircle className="h-4 w-4" />
                                )}
                                <AlertDescription>{adminResult.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <UserCog className="h-4 w-4" />
                                    All User Roles
                                </h4>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={loadUserRoles}
                                    disabled={isLoadingRoles}
                                >
                                    {isLoadingRoles ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        'Refresh'
                                    )}
                                </Button>
                            </div>

                            {userRoles.length > 0 ? (
                                <div className="rounded-lg border overflow-hidden">
                                    <div className="max-h-64 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted sticky top-0">
                                                <tr>
                                                    <th className="text-left p-3 font-semibold">Email</th>
                                                    <th className="text-left p-3 font-semibold">Username</th>
                                                    <th className="text-left p-3 font-semibold">Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userRoles.map((user) => (
                                                    <tr key={user.id} className="border-t hover:bg-muted/50">
                                                        <td className="p-3">{user.email}</td>
                                                        <td className="p-3">{user.username}</td>
                                                        <td className="p-3">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                user.role === 'admin'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Click "Refresh" to load user roles
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Module Count Migration */}
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
