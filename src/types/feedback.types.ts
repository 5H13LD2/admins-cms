import { Timestamp } from 'firebase/firestore';

export interface Feedback {
  id: string;
  userId: string;
  username: string;
  userEmail: string;
  feedback: string;
  status: 'new' | 'pending' | 'reviewed' | 'resolved';
  timestamp: Timestamp | Date;
  appVersion: string;
  deviceInfo: string;
  resolvedAt?: Timestamp | Date;
  response?: string;
}

export type FeedbackStatus = Feedback['status'];

export interface CreateFeedbackData {
  userId: string;
  username: string;
  userEmail: string;
  feedback: string;
  appVersion: string;
  deviceInfo: string;
}

export interface UpdateFeedbackData {
  status?: FeedbackStatus;
  response?: string;
  resolvedAt?: Timestamp | Date;
}
