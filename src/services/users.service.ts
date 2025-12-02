import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import { User } from '@/types';

const USERS_COLLECTION = 'users';
const COURSES_COLLECTION = 'courses';

export const usersService = {
  // Get all users with their course information
  getAll: async (): Promise<User[]> => {
    try {
      const usersSnapshot = await getDocs(collection(db, USERS_COLLECTION));
      const users: User[] = [];

      usersSnapshot.forEach(docSnap => {
        const userData = docSnap.data();
        users.push({
          id: docSnap.id,
          userId: userData.userId || docSnap.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          profilePhotoBase64: userData.profilePhotoBase64,
          courseTaken: userData.courseTaken || [],
          achievementsUnlocked: userData.achievementsUnlocked || [],
          currentBadge: userData.currentBadge,
          isEnrolled: userData.isEnrolled || false,
          level: userData.level || 1,
          quizzesTaken: userData.quizzesTaken || 0,
          technicalAssessmentsCompleted: userData.technicalAssessmentsCompleted || 0,
          totalXP: userData.totalXP || 0,
          createdAt: userData.createdAt || null,
          lastLogin: userData.lastLogin || null,
          status: userData.status || 'offline',
          coursesEnrolled: userData.courseTaken ? userData.courseTaken.length : 0,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar || userData.profilePhotoBase64,
          bio: userData.bio,
          role: userData.role,
          assessmentScores: userData.assessmentScores || {}
        } as User);
      });

      return users;
    } catch (error) {
      console.error('❌ Failed to retrieve users:', error);
      throw new Error('Failed to retrieve users from database');
    }
  },

  // Get single user by ID
  getById: async (id: string): Promise<User | null> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        return {
          id: docSnap.id,
          userId: userData.userId || docSnap.id,
          username: userData.username || 'N/A',
          email: userData.email,
          profilePhotoBase64: userData.profilePhotoBase64,
          courseTaken: userData.courseTaken || [],
          achievementsUnlocked: userData.achievementsUnlocked || [],
          currentBadge: userData.currentBadge,
          isEnrolled: userData.isEnrolled || false,
          level: userData.level || 1,
          quizzesTaken: userData.quizzesTaken || 0,
          technicalAssessmentsCompleted: userData.technicalAssessmentsCompleted || 0,
          totalXP: userData.totalXP || 0,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin,
          status: userData.status || 'offline',
          coursesEnrolled: userData.courseTaken ? userData.courseTaken.length : 0,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: userData.avatar || userData.profilePhotoBase64,
          bio: userData.bio,
          role: userData.role,
          assessmentScores: userData.assessmentScores || {}
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Get user by email
  getByEmail: async (email: string): Promise<User | null> => {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where('email', '==', email),
        limit(1)
      );
      const userSnapshot = await getDocs(q);

      if (userSnapshot.empty) {
        return null;
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      return {
        id: userDoc.id,
        userId: userData.userId || userDoc.id,
        username: userData.username || 'N/A',
        email: userData.email,
        profilePhotoBase64: userData.profilePhotoBase64,
        courseTaken: userData.courseTaken || [],
        achievementsUnlocked: userData.achievementsUnlocked || [],
        currentBadge: userData.currentBadge,
        isEnrolled: userData.isEnrolled || false,
        level: userData.level || 1,
        quizzesTaken: userData.quizzesTaken || 0,
        technicalAssessmentsCompleted: userData.technicalAssessmentsCompleted || 0,
        totalXP: userData.totalXP || 0,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin,
        status: userData.status || 'offline',
        coursesEnrolled: userData.courseTaken ? userData.courseTaken.length : 0,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: userData.avatar || userData.profilePhotoBase64,
        bio: userData.bio,
        role: userData.role,
        assessmentScores: userData.assessmentScores || {}
      } as User;
    } catch (error) {
      console.error('❌ Failed to find user by email:', { email, error });
      throw new Error('Failed to find user');
    }
  },

  // Create new user
  create: async (userData: Partial<User>): Promise<User> => {
    try {
      const { userId, username, email, profilePhotoBase64 } = userData;

      // Check if user already exists
      if (email) {
        const existingUser = await usersService.getByEmail(email);
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
      }

      const newUser = {
        userId: userId || '',
        username: username || 'N/A',
        email: email || '',
        profilePhotoBase64: profilePhotoBase64 || '',
        courseTaken: [],
        achievementsUnlocked: [],
        currentBadge: 'BRONZE',
        isEnrolled: false,
        level: 1,
        quizzesTaken: 0,
        technicalAssessmentsCompleted: 0,
        totalXP: 0,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        status: 'offline',
        ...userData
      };

      const docRef = await addDoc(collection(db, USERS_COLLECTION), newUser);

      return {
        id: docRef.id,
        ...newUser,
        createdAt: new Date(),
        lastLogin: new Date()
      } as User;
    } catch (error) {
      console.error('❌ Failed to create user:', { userData, error });
      throw new Error(error instanceof Error ? error.message : 'Failed to create user');
    }
  },

  // Update user
  update: async (id: string, userData: Partial<User>): Promise<void> => {
    try {
      const docRef = doc(db, USERS_COLLECTION, id);
      await updateDoc(docRef, {
        ...userData,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Enroll user in course using Firestore transaction
  enrollUserInCourse: async (userEmail: string, courseName: string) => {
    try {
      const result = await runTransaction(db, async (transaction) => {
        // Get user by email
        const userQuery = query(
          collection(db, USERS_COLLECTION),
          where('email', '==', userEmail),
          limit(1)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          throw new Error('User not found');
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        // Get course by name
        const courseQuery = query(
          collection(db, COURSES_COLLECTION),
          where('courseName', '==', courseName),
          limit(1)
        );
        const courseSnapshot = await getDocs(courseQuery);

        if (courseSnapshot.empty) {
          throw new Error('Course not found');
        }

        const courseDoc = courseSnapshot.docs[0];
        const courseData = courseDoc.data();

        // Check if user is already enrolled
        const userCourses = userData.courseTaken || [];
        if (userCourses.some((c: any) => c.courseName === courseName)) {
          throw new Error('User is already enrolled in this course');
        }

        // Create enrollment object
        const enrollment = {
          category: courseData.category || 'General',
          courseId: courseDoc.id,
          courseName: courseData.courseName,
          difficulty: courseData.difficulty || 'Beginner',
          enrolledAt: Date.now()
        };

        // Update user's courses
        const updatedUserCourses = [...userCourses, enrollment];
        transaction.update(userDoc.ref, {
          courseTaken: updatedUserCourses,
          lastUpdated: serverTimestamp()
        });

        // Update course's enrolled users
        const enrolledUsers = courseData.enrolledUsers || [];
        if (!enrolledUsers.includes(userEmail)) {
          const updatedEnrolledUsers = [...enrolledUsers, userEmail];
          transaction.update(courseDoc.ref, {
            enrolledUsers: updatedEnrolledUsers,
            lastUpdated: serverTimestamp()
          });
        }

        return {
          userEmail,
          courseName,
          success: true,
          message: 'User successfully enrolled in course'
        };
      });

      return result;
    } catch (error) {
      console.error('❌ Course enrollment failed:', { userEmail, courseName, error });
      throw new Error(error instanceof Error ? error.message : 'Failed to enroll user in course');
    }
  },

  // Get user's enrolled courses
  getUserCourses: async (email: string) => {
    try {
      const user = await usersService.getByEmail(email);

      if (!user) {
        throw new Error(`User not found with email: ${email}`);
      }

      const enrolledCourses = user.courseTaken || [];

      return {
        userEmail: email,
        courseTaken: enrolledCourses,
        totalCourses: enrolledCourses.length
      };
    } catch (error) {
      console.error('❌ Failed to get user courses:', { email, error });
      throw new Error('Failed to retrieve user courses');
    }
  },

  // Get users statistics
  getUserStats: async () => {
    try {
      const users = await usersService.getAll();

      const stats = {
        totalUsers: users.length,
        usersWithCourses: users.filter(user => user.courseTaken && user.courseTaken.length > 0).length,
        usersWithoutCourses: users.filter(user => !user.courseTaken || user.courseTaken.length === 0).length,
        averageCoursesPerUser: users.length > 0 ?
          users.reduce((sum, user) => sum + (user.courseTaken ? user.courseTaken.length : 0), 0) / users.length : 0,
        totalXP: users.reduce((sum, user) => sum + (user.totalXP || 0), 0),
        averageXP: users.length > 0 ?
          users.reduce((sum, user) => sum + (user.totalXP || 0), 0) / users.length : 0
      };

      return stats;
    } catch (error) {
      console.error('❌ Failed to get user statistics:', error);
      throw new Error('Failed to retrieve user statistics');
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
  },

  // Get detailed course progress for a user
  getUserCourseProgress: async (userId: string) => {
    try {
      // Get all courses progress
      const coursesRef = collection(db, `user_progress/${userId}/courses`);
      const coursesSnapshot = await getDocs(coursesRef);

      const coursesProgress: any[] = [];

      for (const courseDoc of coursesSnapshot.docs) {
        const courseData = courseDoc.data();

        // Get modules for this course
        const modulesRef = collection(db, `user_progress/${userId}/courses/${courseDoc.id}/modules`);
        const modulesSnapshot = await getDocs(modulesRef);

        const modules = modulesSnapshot.docs.map(moduleDoc => ({
          id: moduleDoc.id,
          ...moduleDoc.data()
        }));

        coursesProgress.push({
          courseId: courseDoc.id,
          ...courseData,
          modules
        });
      }

      return coursesProgress;
    } catch (error) {
      console.error('Error getting user course progress:', error);
      throw error;
    }
  },

  // Get technical assessment progress for a user
  getUserTechnicalAssessmentProgress: async (userId: string) => {
    try {
      // Get all technical assessment progress
      const path = `user_progress/${userId}/technical_assessment_progress`;
      console.log('📍 Fetching from Firestore path:', path);

      const assessmentsRef = collection(db, path);
      const assessmentsSnapshot = await getDocs(assessmentsRef);

      console.log('📊 Documents found:', assessmentsSnapshot.size);

      const assessmentsProgress: any[] = [];

      assessmentsSnapshot.forEach(assessmentDoc => {
        console.log('📄 Document ID:', assessmentDoc.id, 'Data:', assessmentDoc.data());
        assessmentsProgress.push({
          assessmentId: assessmentDoc.id,
          ...assessmentDoc.data()
        });
      });

      console.log('✅ Returning assessments:', assessmentsProgress);
      return assessmentsProgress;
    } catch (error) {
      console.error('Error getting user technical assessment progress:', error);
      throw error;
    }
  },

  // Unenroll user from course
  unenrollUserFromCourse: async (userEmail: string, courseName: string) => {
    try {
      const result = await runTransaction(db, async (transaction) => {
        // Get user by email
        const userQuery = query(
          collection(db, USERS_COLLECTION),
          where('email', '==', userEmail),
          limit(1)
        );
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          throw new Error('User not found');
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        // Get course by name
        const courseQuery = query(
          collection(db, COURSES_COLLECTION),
          where('courseName', '==', courseName),
          limit(1)
        );
        const courseSnapshot = await getDocs(courseQuery);

        if (courseSnapshot.empty) {
          throw new Error('Course not found');
        }

        const courseDoc = courseSnapshot.docs[0];
        const courseData = courseDoc.data();

        // Remove course from user's enrolled courses
        const userCourses = userData.courseTaken || [];
        const updatedUserCourses = userCourses.filter(
          (c: any) => c.courseName !== courseName
        );

        transaction.update(userDoc.ref, {
          courseTaken: updatedUserCourses,
          lastUpdated: serverTimestamp()
        });

        // Remove user from course's enrolled users
        const enrolledUsers = courseData.enrolledUsers || [];
        const updatedEnrolledUsers = enrolledUsers.filter(
          (email: string) => email !== userEmail
        );
        transaction.update(courseDoc.ref, {
          enrolledUsers: updatedEnrolledUsers,
          lastUpdated: serverTimestamp()
        });

        return {
          userEmail,
          courseName,
          success: true,
          message: 'User successfully unenrolled from course'
        };
      });

      return result;
    } catch (error) {
      console.error('❌ Course unenrollment failed:', { userEmail, courseName, error });
      throw new Error(error instanceof Error ? error.message : 'Failed to unenroll user from course');
    }
  },

  // Add or update user assessment score
  addOrUpdateAssessment: async (userId: string, assessmentId: string, score: number, passed: boolean) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data();

      // Get or create assessment scores object
      const assessmentScores = userData.assessmentScores || {};
      const wasAlreadyPassed = assessmentScores[assessmentId]?.passed;
      assessmentScores[assessmentId] = {
        score,
        passed,
        completedAt: Date.now()
      };

      // Update technical assessments count if passed
      const currentCount = userData.technicalAssessmentsCompleted || 0;
      const newCount = passed && !wasAlreadyPassed
        ? currentCount + 1
        : (!passed && wasAlreadyPassed && currentCount > 0)
          ? currentCount - 1
          : currentCount;

      await updateDoc(userRef, {
        assessmentScores,
        technicalAssessmentsCompleted: newCount,
        lastUpdated: serverTimestamp()
      });

      return {
        userId,
        assessmentId,
        score,
        passed,
        success: true
      };
    } catch (error) {
      console.error('❌ Failed to add/update assessment:', { userId, assessmentId, error });
      throw new Error('Failed to add/update assessment');
    }
  },

  // Delete user assessment
  deleteAssessment: async (userId: string, assessmentId: string) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data();
      const assessmentScores = userData.assessmentScores || {};

      // Check if assessment was passed to adjust count
      const wasPassed = assessmentScores[assessmentId]?.passed;
      const currentCount = userData.technicalAssessmentsCompleted || 0;
      const newCount = wasPassed ? Math.max(0, currentCount - 1) : currentCount;

      // Remove assessment from scores
      delete assessmentScores[assessmentId];

      await updateDoc(userRef, {
        assessmentScores,
        technicalAssessmentsCompleted: newCount,
        lastUpdated: serverTimestamp()
      });

      return {
        userId,
        assessmentId,
        success: true,
        message: 'Assessment deleted successfully'
      };
    } catch (error) {
      console.error('❌ Failed to delete assessment:', { userId, assessmentId, error });
      throw new Error('Failed to delete assessment');
    }
  },

  // Update user XP
  updateUserXP: async (userId: string, xpToAdd: number) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data();
      const currentXP = userData.totalXP || 0;
      const newXP = currentXP + xpToAdd;

      await updateDoc(userRef, {
        totalXP: Math.max(0, newXP),
        lastUpdated: serverTimestamp()
      });

      return {
        userId,
        newXP: Math.max(0, newXP),
        xpAdded: xpToAdd,
        success: true
      };
    } catch (error) {
      console.error('❌ Failed to update user XP:', { userId, error });
      throw new Error('Failed to update user XP');
    }
  },

  // Add achievement to user
  addAchievement: async (userId: string, achievementName: string) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data();
      const achievements = userData.achievementsUnlocked || [];

      if (achievements.includes(achievementName)) {
        throw new Error('Achievement already unlocked');
      }

      await updateDoc(userRef, {
        achievementsUnlocked: [...achievements, achievementName],
        lastUpdated: serverTimestamp()
      });

      return {
        userId,
        achievementName,
        success: true
      };
    } catch (error) {
      console.error('❌ Failed to add achievement:', { userId, achievementName, error });
      throw new Error(error instanceof Error ? error.message : 'Failed to add achievement');
    }
  },

  // Remove achievement from user
  removeAchievement: async (userId: string, achievementName: string) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data();
      const achievements = userData.achievementsUnlocked || [];
      const updatedAchievements = achievements.filter((a: string) => a !== achievementName);

      await updateDoc(userRef, {
        achievementsUnlocked: updatedAchievements,
        lastUpdated: serverTimestamp()
      });

      return {
        userId,
        achievementName,
        success: true
      };
    } catch (error) {
      console.error('❌ Failed to remove achievement:', { userId, achievementName, error });
      throw new Error('Failed to remove achievement');
    }
  },

  // Update user badge
  updateUserBadge: async (userId: string, badge: string) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      await updateDoc(userRef, {
        currentBadge: badge,
        lastUpdated: serverTimestamp()
      });

      return {
        userId,
        badge,
        success: true
      };
    } catch (error) {
      console.error('❌ Failed to update user badge:', { userId, badge, error });
      throw new Error('Failed to update user badge');
    }
  }
};
