import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Course } from '@/types';

const COURSES_COLLECTION = 'courses';

export const coursesService = {
  // Get all courses
  getAll: async (): Promise<Course[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, COURSES_COLLECTION));
      const courses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];

      // Sort by createdAt on client side (newest first)
      return courses.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime; // descending order
      });
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  },

  // Get single course by ID
  getById: async (id: string): Promise<Course | null> => {
    try {
      const docRef = doc(db, COURSES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Course;
      }
      return null;
    } catch (error) {
      console.error('Error getting course:', error);
      throw error;
    }
  },

  // Create new course
  create: async (courseData: Omit<Course, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COURSES_COLLECTION), {
        ...courseData,
        enrolledUsers: courseData.enrolledUsers || [],
        compilerTypeId: courseData.compilerTypeId || '',
        CourseId: courseData.CourseId || '',
        CourseDetail: courseData.CourseDetail || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update course
  update: async (id: string, courseData: Partial<Course>): Promise<void> => {
    try {
      const docRef = doc(db, COURSES_COLLECTION, id);
      await updateDoc(docRef, {
        ...courseData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete course
  delete: async (id: string): Promise<void> => {
    try {
      const docRef = doc(db, COURSES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};