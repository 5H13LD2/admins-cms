# TechLaunch CMS

A Content Management System for managing courses, modules, lessons, quizzes, and assessments.

## Features

- Course Management
- Module Organization
- Lesson Management
- Quiz Creation and Management
- Technical Assessment Management
- User Management and Progress Tracking
- Leaderboard and Achievements
- Daily Problems
- Analytics Dashboard

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Routing**: React Router v6
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account and project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd techlaunch-cms
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
techlaunch-cms/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Shadcn UI components
│   │   ├── layout/      # Layout components
│   │   ├── cards/       # Card components
│   │   ├── forms/       # Form components
│   │   └── common/      # Shared components
│   ├── pages/           # Page components
│   ├── services/        # Firebase services
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Firebase Collections

- `courses/` - Course data
- `courses/{courseId}/modules/` - Module data
- `courses/{courseId}/modules/{moduleId}/lessons/` - Lesson data
- `course_quiz/` - Quiz data
- `technical_assesment/` - Assessment data
- `users/` - User data
- `user_progress/` - User progress tracking
- `leaderboard/` - Leaderboard rankings
- `achievements/` - Achievement definitions
- `daily_problem/` - Daily problems
- `feedback/` - User feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
