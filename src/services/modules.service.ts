import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Module } from '@/types';

const COURSES_COLLECTION = 'courses';

export const modulesService = {
  // Get all modules for a specific course
  getByCourseId: async (courseId: string): Promise<Module[]> => {
    try {
      const modulesRef = collection(db, `courses/${courseId}/modules`);
      const querySnapshot = await getDocs(modulesRef);
      const modules = querySnapshot.docs.map(doc => ({
        id: doc.id,
        courseId,
        ...doc.data()
      })) as Module[];

      // Sort by order on client side
      return modules.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('Error getting modules:', error);
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
  create: async (moduleData: Omit<Module, 'id'> & { moduleId: string }): Promise<string> => {
    try {
      const { moduleId, ...restData } = moduleData;
      const batch = writeBatch(db);

      // Create the module document with the specific moduleId as the document ID
      const moduleDocRef = doc(db, `courses/${moduleData.courseId}/modules`, moduleId);

      // Add module creation to batch
      batch.set(moduleDocRef, {
        ...restData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Update course module count
      const courseRef = doc(db, COURSES_COLLECTION, moduleData.courseId);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const currentModuleCount = courseSnap.data().moduleCount || 0;
        batch.update(courseRef, {
          moduleCount: currentModuleCount + 1,
          updatedAt: Timestamp.now()
        });
      }

      // Commit all changes atomically
      await batch.commit();
      return moduleId;
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  },

  // Update module
  update: async (courseId: string, moduleId: string, moduleData: Partial<Module>): Promise<void> => {
    try {
      const docRef = doc(db, `courses/${courseId}/modules`, moduleId);
      await updateDoc(docRef, {
        ...moduleData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    }
  },

  // Delete module
  delete: async (courseId: string, moduleId: string): Promise<void> => {
    try {
      const batch = writeBatch(db);

      // Delete the module from subcollection
      batch.delete(doc(db, `courses/${courseId}/modules`, moduleId));

      // Update course module count
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        const currentModuleCount = courseSnap.data().moduleCount || 0;
        batch.update(courseRef, {
          moduleCount: Math.max(0, currentModuleCount - 1),
          updatedAt: Timestamp.now()
        });
      }

      await batch.commit();
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  },

  // Delete all modules for a course (useful when deleting a course)
  deleteAllByCourseId: async (courseId: string): Promise<void> => {
    try {
      const modulesRef = collection(db, `courses/${courseId}/modules`);
      const querySnapshot = await getDocs(modulesRef);

      const batch = writeBatch(db);
      querySnapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error deleting modules for course:', error);
      throw error;
    }
  },

  // Reorder modules
  reorder: async (courseId: string, moduleUpdates: { id: string; order: number }[]): Promise<void> => {
    try {
      const batch = writeBatch(db);

      moduleUpdates.forEach(({ id, order }) => {
        const docRef = doc(db, `courses/${courseId}/modules`, id);
        batch.update(docRef, {
          order,
          updatedAt: Timestamp.now()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error reordering modules:', error);
      throw error;
    }
  },

  // Get all modules (across all courses) - for admin purposes
  getAll: async (): Promise<Module[]> => {
    try {
      const coursesSnapshot = await getDocs(collection(db, COURSES_COLLECTION));
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
  }
};
