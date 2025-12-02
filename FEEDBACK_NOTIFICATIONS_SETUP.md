# Feedback Notifications Setup

## What Was Added

### 1. Real-Time Notification Hook
**File:** `src/hooks/useFeedbackNotifications.ts`

This hook uses Firestore's real-time listeners (`onSnapshot`) to monitor new feedback submissions:

- ✅ Listens for feedback with status = 'new'
- ✅ Shows up to 5 most recent feedback entries
- ✅ Tracks unread count
- ✅ Updates automatically when new feedback is submitted
- ✅ Auto-cleanup on unmount

### 2. Enhanced Header Component
**File:** `src/components/layout/Header.tsx`

Added notification bell with real-time updates:

- ✅ Red badge showing unread count (e.g., "3" or "9+" for 10+)
- ✅ Dropdown menu showing recent feedback
- ✅ Click notification to navigate to Feedback page
- ✅ "Time ago" formatting (e.g., "2m ago", "1h ago", "3d ago")
- ✅ Responsive design with proper styling

## How It Works

### Real-Time Updates
When a user submits feedback from the mobile app:

1. Feedback is created with `status: 'new'`
2. Firestore listener detects the new document
3. Badge count updates automatically
4. New feedback appears in the dropdown
5. Admin clicks bell icon to see notifications
6. Admin can click "View all feedback" to manage submissions

### Notification Lifecycle

```
Mobile App → Submit Feedback → Firestore (status: 'new')
                                      ↓
                                Real-time Listener
                                      ↓
                              CMS Header Updates
                                      ↓
                              Admin Sees Badge (🔴 1)
                                      ↓
                         Admin Changes Status (new → pending)
                                      ↓
                              Badge Count Decreases
```

## Features

### Visual Indicators
- **Red Badge**: Shows count of new feedback
- **No Badge**: No new feedback to review
- **"9+"**: More than 9 unread items

### Notification Dropdown
- **Recent Items**: Last 5 new feedback entries
- **User Info**: Username and preview of feedback text
- **Timestamp**: "Just now", "5m ago", "2h ago", "1d ago"
- **Click to View**: Opens Feedback management page
- **Empty State**: "No new feedback" message

### Auto-Refresh
- No page reload needed
- Updates in real-time as feedback arrives
- Counts decrease as you change status
- Always shows current state

## User Workflow

1. **User submits feedback** in mobile app
2. **Bell icon shows red badge** with count
3. **Admin clicks bell** to see dropdown
4. **Reviews recent feedback** in dropdown
5. **Clicks notification** or "View all feedback"
6. **Manages feedback** (change status, respond, resolve)
7. **Badge updates** as items are processed

## Status Management

Feedback statuses affect the notification count:

- ✅ `new` - Counted as unread (shows in notifications)
- ❌ `pending` - Not counted (removed from notifications)
- ❌ `reviewed` - Not counted
- ❌ `resolved` - Not counted

**Tip:** Change status from "new" to "pending" when you start reviewing to clear it from notifications.

## Next Steps

After deploying the updated Firestore rules:

1. Test by submitting feedback from mobile app
2. Check CMS header for notification badge
3. Click bell to see dropdown with feedback
4. Change feedback status to clear notifications
5. Verify real-time updates work correctly
