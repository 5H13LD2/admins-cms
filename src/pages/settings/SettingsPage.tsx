import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    orgName: 'TechLaunch',
    timezone: 'UTC-5',
    notificationEmail: 'ops@techlaunch.io',
    weeklyDigest: true,
    autoPublish: false,
  });

  const handleToggle = (field: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Control organization preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={settings.orgName}
                onChange={(event) => setSettings((prev) => ({ ...prev, orgName: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings.timezone}
                onChange={(event) => setSettings((prev) => ({ ...prev, timezone: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notificationEmail">Notification Email</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={settings.notificationEmail}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, notificationEmail: event.target.value }))
                }
              />
            </div>
            <Button className="w-full">Save</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm">
              <div>
                <p className="font-semibold text-foreground">Weekly digest</p>
                <p className="text-xs text-muted-foreground">Send instructors a weekly performance summary</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={settings.weeklyDigest}
                onChange={() => handleToggle('weeklyDigest')}
              />
            </label>

            <label className="flex items-center justify-between rounded-lg border border-border p-4 text-sm">
              <div>
                <p className="font-semibold text-foreground">Auto-publish content</p>
                <p className="text-xs text-muted-foreground">Publish drafts when QA approves</p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={settings.autoPublish}
                onChange={() => handleToggle('autoPublish')}
              />
            </label>
            <Button variant="outline" className="w-full">
              Update automation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border p-4">
              <p className="font-semibold text-foreground">Session Management</p>
              <p className="text-sm text-muted-foreground mb-4">Sign out of your account on this device</p>
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

