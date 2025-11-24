import { Timestamp } from 'firebase/firestore';

export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export type FirebaseDate = Date | Timestamp | FirestoreTimestamp;

export interface FirebaseError {
  code: string;
  message: string;
  name: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  totalPoints: number;
  rank: number;
  quizScore: number;
  challengeScore: number;
  streakDays: number;
}

export interface Feedback {
  id: string;
  userId: string;
  username?: string;
  type: 'bug' | 'feature' | 'content' | 'general';
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date | any;
  resolvedAt?: Date | any;
  response?: string;
}
