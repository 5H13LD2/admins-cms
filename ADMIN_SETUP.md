# Admin Access Setup Guide

## Overview

This CMS has been configured to **only allow users with the `admin` role** to log in. This ensures that only authorized administrators can access and manage the content management system.

## How It Works

1. When a user tries to log in, the system checks their role in the Firestore database
2. Only users with `role: 'admin'` can successfully log in
3. Non-admin users will see: "Access denied. Only administrators can access this system."
4. Users without a role or with roles like `student` or `instructor` cannot access the CMS

## Setting Up Admin Users

### Method 1: Using the Migration Page (Recommended)

1. **Get Initial Access**: You need at least one admin user to access the system
   - Temporarily comment out the admin check in the code to get in, OR
   - Manually set a user's role to 'admin' in Firebase Console (see Method 2)

2. **Access the Migration Page**: Navigate to `/admin/migrations` in your CMS

3. **Use the Admin Role Management Section**:
   - Enter the email address of the user you want to make an admin
   - Click "Set as Admin"
   - The system will update their role to `admin` in Firestore

4. **View All User Roles**: Click "Refresh" to see all users and their current roles

### Method 2: Manually in Firebase Console

1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Find the `users` collection
4. Locate the user document by email
5. Add or update the `role` field to `"admin"`
6. Save the changes

### Method 3: Using Firebase Admin SDK (For Developers)

If you have access to Firebase Admin SDK, you can run a script:

```javascript
import { setAdminRole } from './src/scripts/setAdminRole';

// Set a single user as admin
await setAdminRole('user@example.com');

// Set multiple users as admin
await setMultipleAdminRoles([
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
]);
```

## User Data Structure

Each user document in the `users` collection should have:

```javascript
{
  email: "user@example.com",
  username: "username",
  role: "admin",  // Must be "admin" to access CMS
  // ... other user fields
}
```

## Valid Roles

- `admin` - Full access to CMS (required for login)
- `instructor` - Cannot access CMS
- `student` - Cannot access CMS
- No role or other values - Cannot access CMS

## Security Features

1. **Login Check**: Role is verified during the login process
2. **Route Protection**: Protected routes check user role on every navigation
3. **Auto Sign-Out**: Non-admin users are automatically signed out if detected
4. **Firestore Queries**: Role is fetched from Firestore to prevent tampering

## Troubleshooting

### "Access denied" Error
- Check that the user's email exists in the `users` collection
- Verify that `role` field is set to exactly `"admin"` (case-sensitive)
- Ensure there are no typos in the email address

### Unable to Set Admin Role
- Make sure you're logged in as an existing admin
- Check Firebase security rules allow updating user documents
- Verify network connection to Firestore

### First-Time Setup (No Admin Users Exist)
If you don't have any admin users yet:

1. Use Firebase Console to manually set the first admin (Method 2 above)
2. OR temporarily modify the code to bypass the check:
   - In `src/hooks/useAuth.ts`, comment out the admin check in the `signIn` function
   - Log in, go to `/admin/migrations`, and set your role to admin
   - Restore the code changes
   - Log out and log back in

## Important Notes

- Never share admin credentials
- Regularly audit who has admin access
- Use the Migration Page to manage admin roles
- Admin role is required for ALL pages in the CMS
- The login page is the only public page

## Files Modified

The following files implement the admin-only access:

- `src/hooks/useAuth.ts` - Checks role during authentication
- `src/components/auth/ProtectedRoute.tsx` - Guards protected routes
- `src/components/auth/LoginForm.tsx` - Displays access denied errors
- `src/scripts/setAdminRole.ts` - Helper functions to manage roles
- `src/pages/admin/MigrationPage.tsx` - UI for role management

## Support

If you encounter issues setting up admin access, check:
1. Firebase Console user data
2. Browser console for error messages
3. Network tab for failed Firestore requests
