import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Toaster from './components/common/Toaster';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailsPage from './pages/courses/CourseDetailsPage';
import CreateCoursePage from './pages/courses/CreateCoursePage';
import ModulesPage from './pages/modules/ModulesPage';
import ModuleDetailsPage from './pages/modules/ModuleDetailsPage';
import CreateModulePage from './pages/modules/CreateModulePage';
import EditModulePage from './pages/modules/EditModulePage';
import LessonsPage from './pages/lessons/LessonsPage';
import LessonDetailsPage from './pages/lessons/LessonDetailsPage';
import CreateLessonPage from './pages/lessons/CreateLessonPage';
import QuizzesPage from './pages/quizzes/QuizzesPage';
import QuizDetailsPage from './pages/quizzes/QuizDetailsPage';
import CreateQuizPage from './pages/quizzes/CreateQuizPage';
import QuizManagementPage from './pages/quizzes/QuizManagementPage';
import AssessmentsPage from './pages/assessments/AssessmentsPage';
import AssessmentDetailsPage from './pages/assessments/AssessmentDetailsPage';
import CreateAssessmentPage from './pages/assessments/CreateAssessmentPage';
import UsersPage from './pages/users/UsersPage';
import UserDetailsPage from './pages/users/UserDetailsPage';
import UserProgressPage from './pages/users/UserProgressPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import AchievementsPage from './pages/achievements/AchievementsPage';
import CreateAchievementPage from './pages/achievements/CreateAchievementPage';
import DailyProblemsPage from './pages/daily-problems/DailyProblemsPage';
import CreateDailyProblemPage from './pages/daily-problems/CreateDailyProblemPage';
import FeedbackPage from './pages/feedback/FeedbackPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ReportsPage from './pages/analytics/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import LoginPage from './pages/auth/LoginPage';
import EditCoursePage from './pages/courses/EditCoursePage';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Toaster />
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/create" element={<CreateCoursePage />} />
            <Route path="courses/:id/edit" element={<EditCoursePage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />

            <Route path="modules" element={<ModulesPage />} />
            <Route path="modules/create" element={<CreateModulePage />} />
            <Route path="modules/:moduleId/edit" element={<EditModulePage />} />
            <Route path="modules/:moduleId" element={<ModuleDetailsPage />} />

            <Route path="lessons" element={<LessonsPage />} />
            <Route path="lessons/create" element={<CreateLessonPage />} />
            <Route path="lessons/:lessonId" element={<LessonDetailsPage />} />

            <Route path="quizzes" element={<QuizzesPage />} />
            <Route path="quizzes/create" element={<CreateQuizPage />} />
            <Route path="quizzes/manage" element={<QuizManagementPage />} />
            <Route path="quizzes/:quizId" element={<QuizDetailsPage />} />

            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="assessments/create" element={<CreateAssessmentPage />} />
            <Route path="assessments/:assessmentId" element={<AssessmentDetailsPage />} />

            <Route path="users" element={<UsersPage />} />
            <Route path="users/:userId" element={<UserDetailsPage />} />
            <Route path="users/:userId/progress" element={<UserProgressPage />} />

            <Route path="leaderboard" element={<LeaderboardPage />} />

            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="achievements/create" element={<CreateAchievementPage />} />

            <Route path="daily-problems" element={<DailyProblemsPage />} />
            <Route path="daily-problems/create" element={<CreateDailyProblemPage />} />

            <Route path="feedback" element={<FeedbackPage />} />

            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="analytics/reports" element={<ReportsPage />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
