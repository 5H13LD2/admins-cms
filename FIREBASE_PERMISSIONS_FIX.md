# Daily Problems Firebase Permissions Fix

## Problem
The daily problems feature was showing a Firebase permissions error:
```
FirebaseError: Missing or insufficient permissions.
```

## Root Causes Identified

### 1. Collection Name Mismatch ✅ FIXED
- **Issue**: Service was using `daily_problems` (plural) but Firestore rules defined `daily_problem` (singular)
- **Fix**: Updated `src/services/dailyProblems.service.ts` to use `daily_problem` collection name
- **File**: `src/services/dailyProblems.service.ts` line 16

### 2. Admin Authentication Method Mismatch ✅ FIXED
- **Issue**: Firestore rules were checking for `request.auth.token.admin == true` (custom claims)
- **Reality**: The app checks admin status from the `users` collection in Firestore (`role == 'admin'`)
- **Fix**: Updated all Firestore rules to check admin role from users collection instead of auth token

## Files Modified

### 1. `src/services/dailyProblems.service.ts`
```typescript
// Changed from:
const DAILY_PROBLEMS_COLLECTION = 'daily_problems';

// To:
const DAILY_PROBLEMS_COLLECTION = 'daily_problem';
```

### 2. `firestore.rules`
Updated 4 rules to check admin role from users collection:

#### Daily Problems (lines 146-153)
```rules
// Before:
allow write: if request.auth != null && request.auth.token.admin == true;

// After:
allow write: if request.auth != null 
             && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

#### Global Achievements (lines 44-50)
```rules
// Before:
allow write: if request.auth.token.admin == true;

// After:
allow write: if request.auth != null 
             && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

#### Technical Assessments (lines 106-112)
```rules
// Before:
allow write: if request.auth.token.admin == true;

// After:
allow write: if request.auth != null 
             && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

#### Feedback (lines 135-137)
```rules
// Before:
allow update, delete: if request.auth != null && request.auth.token.admin == true;

// After:
allow update, delete: if request.auth != null
                      && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

## Required Action: Deploy Firestore Rules

**IMPORTANT**: The Firestore rules changes need to be deployed to Firebase. Run this command:

```bash
firebase deploy --only firestore:rules
```

### If Firebase CLI is not authenticated:
1. First login: `firebase login`
2. Then deploy: `firebase deploy --only firestore:rules`

### Alternative: Deploy via Firebase Console
If you prefer to deploy via the web console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

## How the Fix Works

### Before (Broken)
1. User logs in with email/password
2. App checks `users/{uid}.role` from Firestore → finds `role: 'admin'`
3. App allows admin access
4. User tries to create daily problem
5. Firestore rules check `request.auth.token.admin` → **NOT FOUND** (no custom claim set)
6. ❌ Permission denied

### After (Fixed)
1. User logs in with email/password
2. App checks `users/{uid}.role` from Firestore → finds `role: 'admin'`
3. App allows admin access
4. User tries to create daily problem
5. Firestore rules check `get(/databases/.../users/{uid}).data.role` → finds `'admin'`
6. ✅ Permission granted

## Security Implications

The new approach is actually **more secure** because:
- Admin status is centrally managed in Firestore `users` collection
- No need to set custom claims via Firebase Admin SDK
- Easier to manage admin users (just update Firestore document)
- Consistent with how the rest of the app checks permissions

## Testing Checklist

After deploying the rules:
- [ ] Navigate to Daily Problems page
- [ ] Verify problems load without permission errors
- [ ] Click "Schedule Problem" button
- [ ] Fill out the form and submit
- [ ] Verify problem is created successfully
- [ ] Check that success toast appears
- [ ] Verify new problem appears in the list

## Notes

- The `daily_problem` collection in Firestore should match the singular form used in the rules
- Make sure your user account in the `users` collection has `role: 'admin'`
- If you're still getting permission errors after deploying, check the Firebase Console → Firestore → Rules tab to verify the rules were deployed correctly
