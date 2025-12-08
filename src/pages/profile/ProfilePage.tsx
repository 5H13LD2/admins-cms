import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar, Briefcase, User, Edit } from 'lucide-react';
import { useAuthContext } from '@/components/auth/AuthProvider';

export default function ProfilePage() {
  const { user, userRole } = useAuthContext();

  // Static profile data - you can modify these values
  const profileData = {
    displayName: user?.displayName || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
    role: userRole || 'admin',
    department: 'Engineering',
    bio: 'Passionate educator and technology enthusiast dedicated to creating engaging learning experiences for students.',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information</p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-16 w-16 text-primary" />
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{profileData.displayName}</h2>
            <p className="text-muted-foreground capitalize">{profileData.role}</p>
            <p className="text-sm text-muted-foreground mt-2">{profileData.bio}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{profileData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{profileData.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{profileData.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-medium">{profileData.joinDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{profileData.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Email Notifications</span>
              <span className="text-sm text-primary">Enabled</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Two-Factor Authentication</span>
              <span className="text-sm text-muted-foreground">Disabled</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Account Status</span>
              <span className="text-sm text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Last Login</span>
              <span className="text-sm text-muted-foreground">Today, 9:30 AM</span>
            </div>
          </div>
        </Card>

        {/* Activity Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Courses Created</span>
              <span className="text-sm font-medium">12</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Modules Created</span>
              <span className="text-sm font-medium">48</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm">Lessons Created</span>
              <span className="text-sm font-medium">156</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Total Students</span>
              <span className="text-sm font-medium">324</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
