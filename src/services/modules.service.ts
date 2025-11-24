import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Module } from '@/types';

export const modulesService = {
  // Get all modules for a course
  getByCourseId: async (courseId: string): Promise<Module[]> => {
    try {
      const modulesRef = collection(db, `courses/${courseId}/modules`);
      const q = query(modulesRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Module[];
    } catch (error) {
      console.error('Error getting modules:', error);
      throw error;
    }
  },

  // Get all modules (across all courses)
  getAll: async (): Promise<Module[]> => {
    try {
      // This will require querying all courses first
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const allModules: Module[] = [];

      for (const courseDoc of coursesSnapshot.docs) {
        const modulesRef = collection(db, `courses/${courseDoc.id}/modules`);
        const modulesSnapshot = await getDocs(modulesRef);
        const modules = modulesSnapshot.docs.map(doc => ({
          id: doc.id,
          courseId: courseDoc.id,
          ...doc.data()
        })) as Module[];
        allModules.push(...modules);
      }

      return allModules;
    } catch (error) {
      console.error('Error getting all modules:', error);
      throw error;
    }
  },

  // Get single module by ID
  getById: async (courseId: string, moduleId: string): Promise<Module | null> => {
    try {
      const docRef = doc(db, `courses/${courseId}/modules`, moduleId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, courseId, ...docSnap.data() } as Module;
      }
      return null;
    } catch (error) {
      console.error('Error getting module:', error);
      throw error;
    }
  },

  // Create new module
  create: async (courseId: string, moduleData: Omit<Module, 'id' | 'courseId'>): Promise<string> => {
    try {
      const modulesRef = collection(db, `courses/${courseId}/modules`);
      const docRef = await addDoc(modulesRef, {
        ...moduleData,
        courseId
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  },

  // Update module
  update: async (courseId: string, moduleId: string, moduleData: Partial<Module>): Promise<void> => {
    try {
      const docRef = doc(db, `courses/${courseId}/modules`, moduleId);
      await updateDoc(docRef, moduleData);
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    }
  },

  // Delete module
  delete: async (courseId: string, moduleId: string): Promise<void> => {
    try {
      const docRef = doc(db, `courses/${courseId}/modules`, moduleId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  }
};
