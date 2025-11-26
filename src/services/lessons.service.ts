import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Lesson } from '@/types';

export const lessonsService = {
  // Get all lessons for a module
  getByModuleId: async (courseId: string, moduleId: string): Promise<Lesson[]> => {
    try {
      const lessonsRef = collection(db, `courses/${courseId}/modules/${moduleId}/lessons`);
      const querySnapshot = await getDocs(lessonsRef);
      const lessons = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lesson[];

      // Sort by order on client side
      return lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('Error getting lessons:', error);
      throw error;
    }
  },

  // Get all lessons (across all modules)
  getAll: async (): Promise<Lesson[]> => {
    try {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const allLessons: Lesson[] = [];

      for (const courseDoc of coursesSnapshot.docs) {
        const modulesSnapshot = await getDocs(collection(db, `courses/${courseDoc.id}/modules`));

        for (const moduleDoc of modulesSnapshot.docs) {
          const lessonsRef = collection(db, `courses/${courseDoc.id}/modules/${moduleDoc.id}/lessons`);
          const lessonsSnapshot = await getDocs(lessonsRef);
          const lessons = lessonsSnapshot.docs.map(doc => ({
            id: doc.id,
            moduleId: moduleDoc.id,
            courseId: courseDoc.id,
            ...doc.data()
          })) as Lesson[];
          allLessons.push(...lessons);
        }
      }

      return allLessons;
    } catch (error) {
      console.error('Error getting all lessons:', error);
      throw error;
    }
  },

  // Get single lesson by ID
  getById: async (courseId: string, moduleId: string, lessonId: string): Promise<Lesson | null> => {
    try {
      const docRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, moduleId, courseId, ...docSnap.data() } as Lesson;
      }
      return null;
    } catch (error) {
      console.error('Error getting lesson:', error);
      throw error;
    }
  },

  // Create new lesson
  create: async (courseId: string, moduleId: string, lessonData: Omit<Lesson, 'id' | 'moduleId' | 'courseId' | 'createdAt' | 'updatedAt'> & { lessonId: string }): Promise<string> => {
    try {
      const { lessonId, ...restData } = lessonData;

      // Create the lesson document with the specific lessonId as the document ID
      const lessonDocRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);

      // Use setDoc to create the document with the specified ID
      await setDoc(lessonDocRef, {
        ...restData,
        moduleId,
        courseId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return lessonId;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  // Update lesson
  update: async (courseId: string, moduleId: string, lessonId: string, lessonData: Partial<Lesson>): Promise<void> => {
    try {
      const docRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);
      await updateDoc(docRef, {
        ...lessonData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  },

  // Delete lesson
  delete: async (courseId: string, moduleId: string, lessonId: string): Promise<void> => {
    try {
      const docRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }
};
