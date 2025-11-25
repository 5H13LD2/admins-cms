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
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Module } from '@/types';

const MODULES_COLLECTION = 'modules';
const COURSES_COLLECTION = 'courses';

export const modulesService = {
  // Get all modules for a specific course
  getByCourseId: async (courseId: string): Promise<Module[]> => {
    try {
      const q = query(
        collection(db, MODULES_COLLECTION),
        where('courseId', '==', courseId),
        orderBy('order', 'asc')
      );
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

  // Get single module by ID
  getById: async (moduleId: string): Promise<Module | null> => {
    try {
      const docRef = doc(db, MODULES_COLLECTION, moduleId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Module;
      }
      return null;
    } catch (error) {
      console.error('Error getting module:', error);
      throw error;
    }
  },

  // Get module with course validation
  getByIdWithCourse: async (courseId: string, moduleId: string): Promise<Module | null> => {
    try {
      const module = await modulesService.getById(moduleId);

      if (module && module.courseId === courseId) {
        return module;
      }
      return null;
    } catch (error) {
      console.error('Error getting module with course validation:', error);
      throw error;
    }
  },

  // Create new module
  create: async (moduleData: Omit<Module, 'id'>): Promise<string> => {
    try {
      const batch = writeBatch(db);

      // Add the module
      const moduleRef = doc(collection(db, MODULES_COLLECTION));
      batch.set(moduleRef, {
        ...moduleData,
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

      await batch.commit();
      return moduleRef.id;
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  },

  // Update module
  update: async (moduleId: string, moduleData: Partial<Module>): Promise<void> => {
    try {
      const docRef = doc(db, MODULES_COLLECTION, moduleId);
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
  delete: async (moduleId: string): Promise<void> => {
    try {
      const batch = writeBatch(db);

      // Get the module to find its courseId
      const moduleSnap = await getDoc(doc(db, MODULES_COLLECTION, moduleId));

      if (moduleSnap.exists()) {
        const moduleData = moduleSnap.data();
        const courseId = moduleData.courseId;

        // Delete the module
        batch.delete(doc(db, MODULES_COLLECTION, moduleId));

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
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  },

  // Delete all modules for a course (useful when deleting a course)
  deleteAllByCourseId: async (courseId: string): Promise<void> => {
    try {
      const q = query(
        collection(db, MODULES_COLLECTION),
        where('courseId', '==', courseId)
      );
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error deleting modules for course:', error);
      throw error;
    }
  },

  // Reorder modules
  reorder: async (moduleUpdates: { id: string; order: number }[]): Promise<void> => {
    try {
      const batch = writeBatch(db);

      moduleUpdates.forEach(({ id, order }) => {
        const docRef = doc(db, MODULES_COLLECTION, id);
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
  }
};
