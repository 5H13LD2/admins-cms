# TechLaunch CMS - Complete Folder Structure

## 📁 Project Root Structure

```
techlaunch-cms/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       │   ├── logo.svg
│       │   ├── default-module.jpg
│       │   └── placeholder-avatar.png
│       └── icons/
│
├── src/
│   ├── components/
│   │   ├── ui/                          # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── alert.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── layout/                      # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── CMSLayout.tsx
│   │   │
│   │   ├── cards/                       # Card components
│   │   │   ├── ModuleCard.tsx
│   │   │   ├── LessonCard.tsx
│   │   │   ├── QuizCard.tsx
│   │   │   ├── DetailedQuizCard.tsx
│   │   │   ├── DetailedAssessmentCard.tsx
│   │   │   ├── UserCard.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   └── AchievementCard.tsx
│   │   │
│   │   ├── forms/                       # Form components
│   │   │   ├── ModuleForm.tsx
│   │   │   ├── LessonForm.tsx
│   │   │   ├── QuizForm.tsx
│   │   │   ├── QuestionForm.tsx
│   │   │   ├── AssessmentForm.tsx
│   │   │   ├── CourseForm.tsx
│   │   │   └── UserForm.tsx
│   │   │
│   │   ├── modals/                      # Modal components
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   ├── EditModal.tsx
│   │   │   ├── CreateModal.tsx
│   │   │   └── PreviewModal.tsx
│   │   │
│   │   ├── tables/                      # Table components
│   │   │   ├── DataTable.tsx
│   │   │   ├── UsersTable.tsx
│   │   │   ├── QuizzesTable.tsx
│   │   │   ├── AssessmentsTable.tsx
│   │   │   └── LeaderboardTable.tsx
│   │   │
│   │   ├── charts/                      # Chart components
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   ├── ActivityChart.tsx
│   │   │   └── AnalyticsChart.tsx
│   │   │
│   │   └── common/                      # Shared components
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── SearchBar.tsx
│   │       ├── FilterPanel.tsx
│   │       ├── Pagination.tsx
│   │       └── BreadcrumbNav.tsx
│   │
│   ├── pages/                           # Page components
│   │   ├── Dashboard.tsx                # Main dashboard
│   │   │
│   │   ├── courses/
│   │   │   ├── CoursesPage.tsx
│   │   │   ├── CourseDetailsPage.tsx
│   │   │   └── CreateCoursePage.tsx
│   │   │
│   │   ├── modules/
│   │   │   ├── ModulesPage.tsx
│   │   │   ├── ModuleDetailsPage.tsx
│   │   │   └── CreateModulePage.tsx
│   │   │
│   │   ├── lessons/
│   │   │   ├── LessonsPage.tsx
│   │   │   ├── LessonDetailsPage.tsx
│   │   │   └── CreateLessonPage.tsx
│   │   │
│   │   ├── quizzes/
│   │   │   ├── QuizzesPage.tsx
│   │   │   ├── QuizDetailsPage.tsx
│   │   │   ├── CreateQuizPage.tsx
│   │   │   └── QuizManagementPage.tsx
│   │   │
│   │   ├── assessments/
│   │   │   ├── AssessmentsPage.tsx
│   │   │   ├── AssessmentDetailsPage.tsx
│   │   │   └── CreateAssessmentPage.tsx
│   │   │
│   │   ├── users/
│   │   │   ├── UsersPage.tsx
│   │   │   ├── UserDetailsPage.tsx
│   │   │   └── UserProgressPage.tsx
│   │   │
│   │   ├── leaderboard/
│   │   │   └── LeaderboardPage.tsx
│   │   │
│   │   ├── achievements/
│   │   │   ├── AchievementsPage.tsx
│   │   │   └── CreateAchievementPage.tsx
│   │   │
│   │   ├── daily-problems/
│   │   │   ├── DailyProblemsPage.tsx
│   │   │   └── CreateDailyProblemPage.tsx
│   │   │
│   │   ├── feedback/
│   │   │   └── FeedbackPage.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── ReportsPage.tsx
│   │   │
│   │   └── settings/
│   │       └── SettingsPage.tsx
│   │
│   ├── hooks/                           # Custom React hooks
│   │   ├── useUserProgressData.ts
│   │   ├── useCourses.ts
│   │   ├── useModules.ts
│   │   ├── useLessons.ts
│   │   ├── useQuizzes.ts
│   │   ├── useAssessments.ts
│   │   ├── useUsers.ts
│   │   ├── useLeaderboard.ts
│   │   ├── useAchievements.ts
│   │   ├── useDailyProblems.ts
│   │   ├── useFeedback.ts
│   │   ├── useAuth.ts
│   │   ├── useFirestore.ts
│   │   └── useToast.ts
│   │
│   ├── services/                        # Firebase services
│   │   ├── firebase.ts                  # Firebase config
│   │   ├── auth.service.ts
│   │   ├── courses.service.ts
│   │   ├── modules.service.ts
│   │   ├── lessons.service.ts
│   │   ├── quizzes.service.ts
│   │   ├── assessments.service.ts
│   │   ├── users.service.ts
│   │   ├── leaderboard.service.ts
│   │   ├── achievements.service.ts
│   │   ├── dailyProblems.service.ts
│   │   ├── feedback.service.ts
│   │   └── storage.service.ts
│   │
│   ├── data/                            # Dummy data and types
│   │   ├── dummyData.ts
│   │   ├── courses.dummy.ts
│   │   ├── modules.dummy.ts
│   │   ├── lessons.dummy.ts
│   │   ├── quizzes.dummy.ts
│   │   ├── assessments.dummy.ts
│   │   └── users.dummy.ts
│   │
│   ├── types/                           # TypeScript types
│   │   ├── index.ts
│   │   ├── course.types.ts
│   │   ├── module.types.ts
│   │   ├── lesson.types.ts
│   │   ├── quiz.types.ts
│   │   ├── assessment.types.ts
│   │   ├── user.types.ts
│   │   ├── achievement.types.ts
│   │   └── firebase.types.ts
│   │
│   ├── utils/                           # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   ├── dateUtils.ts
│   │   └── firebaseUtils.ts
│   │
│   ├── context/                         # React context
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── CMSContext.tsx
│   │
│   ├── lib/                             # Library configurations
│   │   └── utils.ts
│   │
│   ├── styles/                          # Global styles
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env.example                         # Environment variables template
├── .env.local                           # Local environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── components.json                      # Shadcn/UI config
└── README.md
```

---

## 📋 Detailed Component Descriptions

### 🎨 Layout Components (`src/components/layout/`)

#### **Sidebar.tsx**
- Navigation menu for CMS sections
- Collapsible menu items
- Active route highlighting
- User profile section

#### **Header.tsx**
- Page title and breadcrumbs
- Search functionality
- Notification bell
- User dropdown menu

#### **DashboardLayout.tsx**
- Main layout wrapper
- Combines Sidebar + Header + Content area
- Responsive design

---

### 🃏 Card Components (`src/components/cards/`)

#### **ModuleCard.tsx** ✅ (Already exists)
- Display module information
- Progress indicator
- Lesson count and duration
- Click to view details

#### **LessonCard.tsx** ✅ (Already exists)
- Lesson title and content preview
- Completion status
- Duration display

#### **QuizCard.tsx** ✅ (Already exists)
- Quiz overview
- Question count
- Start quiz button

#### **DetailedQuizCard.tsx** ✅ (Already exists)
- Full quiz details
- All options displayed
- Correct answer highlighted
- Edit/Delete actions

#### **DetailedAssessmentCard.tsx** ✅ (Already exists)
- Technical assessment details
- Code preview for code_fix type
- SQL table info for sql_query type
- Activate/Deactivate toggle

#### **UserCard.tsx** ✅ (Already exists)
- User profile information
- Activity statistics
- Performance metrics
- Online status

---

### 📝 Form Components (`src/components/forms/`)

#### **ModuleForm.tsx**
- Create/Edit module
- Fields: title, description, duration, image
- Validation

#### **LessonForm.tsx**
- Create/Edit lesson
- Rich text editor for content
- Module selection
- Duration input

#### **QuizForm.tsx**
- Create/Edit quiz
- Question list management
- Difficulty selection
- Add/Remove questions

#### **QuestionForm.tsx**
- Single question editor
- Multiple choice options (A, B, C, D)
- Correct answer selection
- Explanation field

#### **AssessmentForm.tsx**
- Create/Edit technical assessments
- Type selection (code_fix/sql_query)
- Code editor integration
- Test cases management

---

### 📊 Table Components (`src/components/tables/`)

#### **DataTable.tsx**
- Reusable table component
- Sorting functionality
- Filtering options
- Pagination

#### **UsersTable.tsx**
- List all users
- Search and filter
- Progress overview
- Quick actions

#### **QuizzesTable.tsx**
- All quizzes list
- Module filtering
- Difficulty badges
- Edit/Delete actions

---

### 📄 Pages Structure

#### **Dashboard.tsx**
- Overview statistics
- Recent activities
- Quick actions
- Charts and graphs

#### **CoursesPage.tsx**
- List all courses
- Create new course
- Search and filter
- Grid/List view toggle

#### **ModulesPage.tsx**
- All modules by course
- Progress tracking
- Module management

#### **QuizzesPage.tsx**
- Quiz management interface
- Bulk operations
- Filter by module/difficulty

#### **UsersPage.tsx**
- User management
- Progress monitoring
- Activity tracking

---

## 🔥 Firebase Services Structure

### **firebase.ts**
```typescript
// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};
```

### **Collections Mapping**

Based on your Firestore rules:

1. **users** → `users.service.ts`
   - User profiles
   - Achievements
   - Quiz scores & attempts
   - Quiz results
   - Daily problem progress
   - Login tracking

2. **achievements** → `achievements.service.ts`
   - Global achievements list

3. **user_progress** → `users.service.ts`
   - Lesson completion
   - Technical assessment progress
   - Course/Module progress

4. **courses** → `courses.service.ts`
   - Course data
   - Modules subcollection
   - Lessons subcollection

5. **course_quiz** → `quizzes.service.ts`
   - Quiz definitions
   - Questions subcollection

6. **leaderboard** → `leaderboard.service.ts`
   - User rankings

7. **technical_assesment** → `assessments.service.ts`
   - Challenge definitions

8. **feedback** → `feedback.service.ts`
   - User feedback

9. **daily_problem** → `dailyProblems.service.ts`
   - Daily problem definitions

---

## 🎯 Key Features to Implement

### 1. **Dashboard**
- Total users count
- Total courses/modules/lessons
- Active quizzes count
- Recent user activities
- Performance charts

### 2. **CRUD Operations**
- Create, Read, Update, Delete for:
  - Courses
  - Modules
  - Lessons
  - Quizzes
  - Assessments
  - Users
  - Achievements

### 3. **User Management**
- View all users
- User progress tracking
- Activity monitoring
- Performance analytics

### 4. **Content Management**
- Module organization
- Lesson sequencing
- Quiz assignment
- Assessment management

### 5. **Analytics**
- User engagement metrics
- Quiz performance stats
- Assessment completion rates
- Leaderboard rankings

---

## 📦 Dependencies to Install

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "firebase": "^10.7.1",
    
    // UI Components
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    
    // Icons
    "lucide-react": "^0.294.0",
    
    // Forms
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    
    // Utilities
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "date-fns": "^2.30.0",
    
    // Code Editor (for assessments)
    "@monaco-editor/react": "^4.6.0",
    
    // Charts
    "recharts": "^2.10.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

---

## 🚀 Getting Started Steps

### 1. **Initialize Project**
```bash
npm create vite@latest techlaunch-cms -- --template react-ts
cd techlaunch-cms
npm install
```

### 2. **Install Dependencies**
```bash
npm install firebase react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. **Setup Shadcn/UI**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge dialog input
```

### 4. **Setup Firebase**
- Create `.env.local` file
- Add Firebase configuration
- Initialize Firebase in `src/services/firebase.ts`

### 5. **Create Folder Structure**
- Follow the structure outlined above
- Copy existing card components
- Create services for each collection

### 6. **Implement Core Features**
- Dashboard with statistics
- CRUD operations for each collection
- User authentication
- Data fetching from Firebase

---

## 🎨 UI Design Recommendations

### Color Scheme
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Background: White/Gray (#F9FAFB)

### Typography
- Headings: Inter/Poppins
- Body: Inter/System Font

### Components Style
- Rounded corners (border-radius: 8px)
- Subtle shadows
- Hover effects
- Smooth transitions

---

## 📱 Responsive Design

- Desktop: Full sidebar + content
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation + hamburger menu

---

## 🔒 Security Considerations

1. Implement proper authentication
2. Validate user roles (admin check)
3. Secure environment variables
4. Follow Firebase security rules
5. Input validation on forms
6. XSS protection

---

## 📈 Future Enhancements

1. Real-time updates with Firestore listeners
2. Bulk operations
3. Export data (CSV/Excel)
4. Advanced filtering and search
5. Email notifications
6. Activity logs
7. Role-based access control
8. Dark mode
9. Multi-language support
10. PWA capabilities

---

## 📚 Documentation Links

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)

---

This structure provides a solid foundation for your TechLaunch CMS. Start by setting up the core infrastructure, then gradually add features based on priority. Focus on getting the CRUD operations working first, then enhance with analytics and advanced features.
