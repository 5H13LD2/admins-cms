# TechLaunch CMS - Visual Folder Structure

```
techlaunch-cms/
│
├── 📁 public/
│   ├── index.html
│   ├── favicon.ico
│   └── 📁 assets/
│       ├── 📁 images/
│       └── 📁 icons/
│
├── 📁 src/
│   │
│   ├── 📁 components/
│   │   │
│   │   ├── 📁 ui/                    [Shadcn/UI Base Components]
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   │
│   │   ├── 📁 layout/                [Layout Components]
│   │   │   ├── Sidebar.tsx           → Main navigation
│   │   │   ├── Header.tsx            → Top bar with search
│   │   │   ├── Footer.tsx
│   │   │   ├── DashboardLayout.tsx   → Wrapper layout
│   │   │   └── CMSLayout.tsx
│   │   │
│   │   ├── 📁 cards/                 [Display Cards]
│   │   │   ├── ModuleCard.tsx        ✅ Existing
│   │   │   ├── LessonCard.tsx        ✅ Existing
│   │   │   ├── QuizCard.tsx          ✅ Existing
│   │   │   ├── DetailedQuizCard.tsx  ✅ Existing
│   │   │   ├── DetailedAssessmentCard.tsx ✅ Existing
│   │   │   ├── UserCard.tsx          ✅ Existing
│   │   │   ├── CourseCard.tsx
│   │   │   └── AchievementCard.tsx
│   │   │
│   │   ├── 📁 forms/                 [Form Components]
│   │   │   ├── ModuleForm.tsx        → Create/Edit modules
│   │   │   ├── LessonForm.tsx        → Create/Edit lessons
│   │   │   ├── QuizForm.tsx          → Create/Edit quizzes
│   │   │   ├── QuestionForm.tsx      → Individual question editor
│   │   │   ├── AssessmentForm.tsx    → Technical assessments
│   │   │   ├── CourseForm.tsx
│   │   │   └── UserForm.tsx
│   │   │
│   │   ├── 📁 modals/                [Modal Dialogs]
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   ├── EditModal.tsx
│   │   │   ├── CreateModal.tsx
│   │   │   └── PreviewModal.tsx
│   │   │
│   │   ├── 📁 tables/                [Data Tables]
│   │   │   ├── DataTable.tsx         → Reusable base table
│   │   │   ├── UsersTable.tsx
│   │   │   ├── QuizzesTable.tsx
│   │   │   ├── AssessmentsTable.tsx
│   │   │   └── LeaderboardTable.tsx
│   │   │
│   │   ├── 📁 charts/                [Analytics Charts]
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   ├── ActivityChart.tsx
│   │   │   └── AnalyticsChart.tsx
│   │   │
│   │   └── 📁 common/                [Shared Components]
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── SearchBar.tsx
│   │       ├── FilterPanel.tsx
│   │       ├── Pagination.tsx
│   │       └── BreadcrumbNav.tsx
│   │
│   ├── 📁 pages/                     [Page Components]
│   │   │
│   │   ├── Dashboard.tsx             🏠 Main dashboard
│   │   │
│   │   ├── 📁 courses/
│   │   │   ├── CoursesPage.tsx       → List all courses
│   │   │   ├── CourseDetailsPage.tsx → Single course view
│   │   │   └── CreateCoursePage.tsx  → Create new course
│   │   │
│   │   ├── 📁 modules/
│   │   │   ├── ModulesPage.tsx       → List all modules
│   │   │   ├── ModuleDetailsPage.tsx → Single module view
│   │   │   └── CreateModulePage.tsx  → Create new module
│   │   │
│   │   ├── 📁 lessons/
│   │   │   ├── LessonsPage.tsx       → List all lessons
│   │   │   ├── LessonDetailsPage.tsx → Single lesson view
│   │   │   └── CreateLessonPage.tsx  → Create new lesson
│   │   │
│   │   ├── 📁 quizzes/
│   │   │   ├── QuizzesPage.tsx       → List all quizzes
│   │   │   ├── QuizDetailsPage.tsx   → Single quiz view
│   │   │   ├── CreateQuizPage.tsx    → Create new quiz
│   │   │   └── QuizManagementPage.tsx → Advanced management
│   │   │
│   │   ├── 📁 assessments/
│   │   │   ├── AssessmentsPage.tsx   → List all assessments
│   │   │   ├── AssessmentDetailsPage.tsx
│   │   │   └── CreateAssessmentPage.tsx
│   │   │
│   │   ├── 📁 users/
│   │   │   ├── UsersPage.tsx         → User management
│   │   │   ├── UserDetailsPage.tsx   → Individual user stats
│   │   │   └── UserProgressPage.tsx  → Progress tracking
│   │   │
│   │   ├── 📁 leaderboard/
│   │   │   └── LeaderboardPage.tsx   → Rankings & scores
│   │   │
│   │   ├── 📁 achievements/
│   │   │   ├── AchievementsPage.tsx
│   │   │   └── CreateAchievementPage.tsx
│   │   │
│   │   ├── 📁 daily-problems/
│   │   │   ├── DailyProblemsPage.tsx
│   │   │   └── CreateDailyProblemPage.tsx
│   │   │
│   │   ├── 📁 feedback/
│   │   │   └── FeedbackPage.tsx      → User feedback review
│   │   │
│   │   ├── 📁 analytics/
│   │   │   ├── AnalyticsPage.tsx     → Overview analytics
│   │   │   └── ReportsPage.tsx       → Detailed reports
│   │   │
│   │   └── 📁 settings/
│   │       └── SettingsPage.tsx      → CMS settings
│   │
│   ├── 📁 hooks/                     [Custom React Hooks]
│   │   ├── useAuth.ts                → Authentication
│   │   ├── useFirestore.ts           → Firestore operations
│   │   ├── useCourses.ts             → Course data
│   │   ├── useModules.ts             → Module data
│   │   ├── useLessons.ts             → Lesson data
│   │   ├── useQuizzes.ts             → Quiz data
│   │   ├── useAssessments.ts         → Assessment data
│   │   ├── useUsers.ts               → User data
│   │   ├── useUserProgressData.ts    ✅ Existing
│   │   ├── useLeaderboard.ts
│   │   ├── useAchievements.ts
│   │   ├── useDailyProblems.ts
│   │   ├── useFeedback.ts
│   │   └── useToast.ts
│   │
│   ├── 📁 services/                  [Firebase Services]
│   │   ├── firebase.ts               🔥 Firebase config
│   │   ├── auth.service.ts           → User authentication
│   │   ├── courses.service.ts        → CRUD for courses
│   │   ├── modules.service.ts        → CRUD for modules
│   │   ├── lessons.service.ts        → CRUD for lessons
│   │   ├── quizzes.service.ts        → CRUD for quizzes
│   │   ├── assessments.service.ts    → CRUD for assessments
│   │   ├── users.service.ts          → User management
│   │   ├── leaderboard.service.ts    → Leaderboard operations
│   │   ├── achievements.service.ts   → Achievement operations
│   │   ├── dailyProblems.service.ts  → Daily problem operations
│   │   ├── feedback.service.ts       → Feedback operations
│   │   └── storage.service.ts        → File uploads
│   │
│   ├── 📁 data/                      [Dummy Data & Mock Data]
│   │   ├── dummyData.ts              ✅ Existing
│   │   ├── courses.dummy.ts
│   │   ├── modules.dummy.ts
│   │   ├── lessons.dummy.ts
│   │   ├── quizzes.dummy.ts
│   │   ├── assessments.dummy.ts
│   │   └── users.dummy.ts
│   │
│   ├── 📁 types/                     [TypeScript Type Definitions]
│   │   ├── index.ts                  → Export all types
│   │   ├── course.types.ts
│   │   ├── module.types.ts
│   │   ├── lesson.types.ts
│   │   ├── quiz.types.ts
│   │   ├── assessment.types.ts
│   │   ├── user.types.ts
│   │   ├── achievement.types.ts
│   │   └── firebase.types.ts
│   │
│   ├── 📁 utils/                     [Utility Functions]
│   │   ├── formatters.ts             → Date, number formatting
│   │   ├── validators.ts             → Form validation
│   │   ├── helpers.ts                → Helper functions
│   │   ├── constants.ts              → App constants
│   │   ├── dateUtils.ts              → Date utilities
│   │   └── firebaseUtils.ts          → Firebase helpers
│   │
│   ├── 📁 context/                   [React Context Providers]
│   │   ├── AuthContext.tsx           → Authentication state
│   │   ├── ThemeContext.tsx          → Theme switching
│   │   └── CMSContext.tsx            → Global CMS state
│   │
│   ├── 📁 lib/                       [Library Configurations]
│   │   └── utils.ts                  → cn() helper, etc.
│   │
│   ├── 📁 styles/                    [Global Styles]
│   │   ├── globals.css               → Global CSS
│   │   └── tailwind.css              → Tailwind imports
│   │
│   ├── App.tsx                       → Main App component
│   ├── main.tsx                      → Entry point
│   └── vite-env.d.ts
│
├── .env.example                      📝 Environment variables template
├── .env.local                        🔒 Local environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── components.json                   [Shadcn/UI configuration]
└── README.md
```

---

## 🗂️ Firebase Collections Mapping

```
Firestore Database
│
├── 📚 users/                         → users.service.ts
│   ├── {userId}/
│   │   ├── achievements/             → User unlocked achievements
│   │   ├── quiz_scores/
│   │   │   └── attempts/
│   │   ├── quizResults/
│   │   ├── daily_problem_progress/
│   │   └── login_tracking/
│
├── 🏆 achievements/                  → achievements.service.ts
│   └── {achievementId}/              → Global achievement templates
│
├── 📊 user_progress/                 → users.service.ts
│   ├── {userId}/
│   │   ├── technical_assessment_progress/
│   │   └── courses/
│   │       └── modules/
│
├── 📖 courses/                       → courses.service.ts
│   ├── {courseId}/
│   │   └── modules/                  → modules.service.ts
│   │       └── lessons/              → lessons.service.ts
│
├── ❓ course_quiz/                   → quizzes.service.ts
│   ├── {quizId}/
│   │   └── questions/
│
├── 🏅 leaderboard/                   → leaderboard.service.ts
│   └── {userId}/
│
├── 💻 technical_assesment/           → assessments.service.ts
│   └── {docId}/
│
├── 💬 feedback/                      → feedback.service.ts
│   └── {feedbackId}/
│
└── 🎯 daily_problem/                 → dailyProblems.service.ts
    └── {docId}/
```

---

## 🎯 Component Hierarchy

```
App.tsx
│
├── AuthProvider (AuthContext)
│   └── ThemeProvider (ThemeContext)
│       └── Router
│           │
│           ├── DashboardLayout
│           │   ├── Sidebar
│           │   ├── Header
│           │   └── <Page Content>
│           │       │
│           │       ├── Dashboard
│           │       │   ├── StatCards
│           │       │   ├── ProgressChart
│           │       │   └── ActivityChart
│           │       │
│           │       ├── CoursesPage
│           │       │   ├── SearchBar
│           │       │   ├── FilterPanel
│           │       │   └── CourseCard[]
│           │       │
│           │       ├── ModulesPage
│           │       │   └── ModuleCard[]
│           │       │
│           │       ├── QuizzesPage
│           │       │   ├── QuizzesTable
│           │       │   └── DetailedQuizCard[]
│           │       │
│           │       ├── UsersPage
│           │       │   ├── UsersTable
│           │       │   └── UserCard[]
│           │       │
│           │       └── ...
│           │
│           └── CMSLayout
│               └── (Alternative layout for specific pages)
```

---

## 🔗 Routing Structure

```typescript
/ (root)
│
├── /dashboard                  → Dashboard.tsx
│
├── /courses
│   ├── /                       → CoursesPage.tsx
│   ├── /create                 → CreateCoursePage.tsx
│   └── /:courseId              → CourseDetailsPage.tsx
│
├── /modules
│   ├── /                       → ModulesPage.tsx
│   ├── /create                 → CreateModulePage.tsx
│   └── /:moduleId              → ModuleDetailsPage.tsx
│
├── /lessons
│   ├── /                       → LessonsPage.tsx
│   ├── /create                 → CreateLessonPage.tsx
│   └── /:lessonId              → LessonDetailsPage.tsx
│
├── /quizzes
│   ├── /                       → QuizzesPage.tsx
│   ├── /create                 → CreateQuizPage.tsx
│   ├── /manage                 → QuizManagementPage.tsx
│   └── /:quizId                → QuizDetailsPage.tsx
│
├── /assessments
│   ├── /                       → AssessmentsPage.tsx
│   ├── /create                 → CreateAssessmentPage.tsx
│   └── /:assessmentId          → AssessmentDetailsPage.tsx
│
├── /users
│   ├── /                       → UsersPage.tsx
│   ├── /:userId                → UserDetailsPage.tsx
│   └── /:userId/progress       → UserProgressPage.tsx
│
├── /leaderboard                → LeaderboardPage.tsx
│
├── /achievements
│   ├── /                       → AchievementsPage.tsx
│   └── /create                 → CreateAchievementPage.tsx
│
├── /daily-problems
│   ├── /                       → DailyProblemsPage.tsx
│   └── /create                 → CreateDailyProblemPage.tsx
│
├── /feedback                   → FeedbackPage.tsx
│
├── /analytics
│   ├── /                       → AnalyticsPage.tsx
│   └── /reports                → ReportsPage.tsx
│
└── /settings                   → SettingsPage.tsx
```

---

## 🎨 Page Layout Examples

### Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│  [Logo] TechLaunch CMS         🔍  🔔  👤      │ ← Header
├──────────┬──────────────────────────────────────┤
│          │                                      │
│  📊 Dash │  📊 Dashboard Overview               │
│  📚 Cours│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  📖 Modul│  │ 1,234│ │  156 │ │  89  │ │  45  ││
│  📄 Lesso│  │ Users│ │Course│ │ Quiz │ │Assess││
│  ❓ Quizz│  └──────┘ └──────┘ └──────┘ └──────┘│
│  💻 Asses│                                      │
│  👥 Users│  📈 Performance Chart                │
│  🏆 Leader│  [Chart visualization here]         │
│  🎯 Daily│                                      │
│  💬 Feedba│  📊 Recent Activities               │
│  📊 Analyt│  • User X completed Module Y        │
│  ⚙️  Settin│  • Quiz Z was created              │
│          │  • New user registered               │
└──────────┴──────────────────────────────────────┘
```

### List Page Layout (e.g., Modules)
```
┌─────────────────────────────────────────────────┐
│  Modules / All Modules                          │
├─────────────────────────────────────────────────┤
│  [🔍 Search]  [Filter ▼]  [+ Create Module]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ [Image] │  │ [Image] │  │ [Image] │        │
│  │ Module 1│  │ Module 2│  │ Module 3│        │
│  │ ⭐⭐⭐⭐  │  │ ⭐⭐⭐    │  │ ⭐⭐⭐⭐⭐ │        │
│  │ 12 Less │  │ 8 Less  │  │ 15 Less │        │
│  │ [View]  │  │ [View]  │  │ [View]  │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
│  [< Previous]  [1] [2] [3] ... [10]  [Next >] │
└─────────────────────────────────────────────────┘
```

---

## 📋 Implementation Priority

### Phase 1: Foundation (Week 1-2)
- ✅ Setup project structure
- ✅ Configure Firebase
- ✅ Create base components (buttons, cards, etc.)
- ✅ Setup routing
- ✅ Authentication system

### Phase 2: Core Features (Week 3-4)
- 🔨 Dashboard page
- 🔨 Courses CRUD
- 🔨 Modules CRUD
- 🔨 Lessons CRUD
- 🔨 Basic user management

### Phase 3: Advanced Features (Week 5-6)
- 🔨 Quizzes CRUD with questions
- 🔨 Technical assessments
- 🔨 User progress tracking
- 🔨 Leaderboard functionality

### Phase 4: Analytics & Polish (Week 7-8)
- 🔨 Analytics dashboard
- 🔨 Charts and visualizations
- 🔨 Feedback management
- 🔨 Daily problems
- 🔨 Performance optimization
- 🔨 UI/UX improvements

---

This visual structure should help you better understand the organization and relationships between different parts of the CMS!
