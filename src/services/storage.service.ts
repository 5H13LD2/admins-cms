import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const storageService = {
  // Upload file
  uploadFile: async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Upload image
  uploadImage: async (file: File, folder: string = 'images'): Promise<string> => {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    return storageService.uploadFile(file, fileName);
  },

  // Delete file
  deleteFile: async (path: string): Promise<void> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};
