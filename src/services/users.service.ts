import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '@/types';

const USERS_COLLECTION = 'users';

export const usersService = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    try {
      const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  // Get single user by ID
  getById: async (id: string): Promise<User | null> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id: string, userData: Partial<User>): Promise<void> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, id);
      await updateDoc(docRef, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Get user progress
  getUserProgress: async (userId: string) => {
    try {
      const progressRef = doc(db, 'user_progress', userId);
      const progressSnap = await getDoc(progressRef);

      if (progressSnap.exists()) {
        return progressSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }
};
