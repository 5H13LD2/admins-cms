const userService = require('../services/firestore/userService');
const logger = require('../utils/logger');

class UserController {
  /**
   * Get all users
   * GET /api/users
   */
  async getAllUsers(req, res) {
    try {
      logger.debug('UserController: Getting all users');
      const users = await userService.getAll();
      
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        count: users.length
      });
    } catch (error) {
      logger.error('UserController: Error getting all users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get user by email
   * GET /api/users/:email
   */
  async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      logger.debug(`UserController: Getting user by email: ${email}`);
      
      const user = await userService.getByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User not found with email: ${email}`
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      logger.error(`UserController: Error getting user by email ${req.params.email}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Create a new user
   * POST /api/users
   */
  async createUser(req, res) {
    try {
      const userData = req.body;
      logger.debug(`UserController: Creating new user: ${userData.email}`);
      
      const newUser = await userService.create(userData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      logger.error(`UserController: Error creating user:`, error);
      
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get user's enrolled courses
   * GET /api/users/:email/courses
   */
  async getUserCourses(req, res) {
    try {
      const { email } = req.params;
      logger.debug(`UserController: Getting courses for user: ${email}`);
      
      const user = await userService.getByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User not found with email: ${email}`
        });
      }
      
      const enrolledCourses = user.courseTaken || [];
      
      res.status(200).json({
        success: true,
        message: 'User courses retrieved successfully',
        data: {
          userEmail: email,
          courseTaken: enrolledCourses,
          totalCourses: enrolledCourses.length
        }
      });
    } catch (error) {
      logger.error(`UserController: Error getting user courses for ${req.params.email}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user courses',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get users statistics
   * GET /api/users/stats
   */
  async getUserStats(req, res) {
    try {
      logger.debug('UserController: Getting user statistics');
      const users = await userService.getAll();
      
      const stats = {
        totalUsers: users.length,
        usersWithCourses: users.filter(user => user.courseTaken && user.courseTaken.length > 0).length,
        usersWithoutCourses: users.filter(user => !user.courseTaken || user.courseTaken.length === 0).length,
        averageCoursesPerUser: users.length > 0 ? 
          users.reduce((sum, user) => sum + (user.courseTaken ? user.courseTaken.length : 0), 0) / users.length : 0
      };
      
      res.status(200).json({
        success: true,
        message: 'User statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      logger.error('UserController: Error getting user statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = new UserController();

// service
const { initializeFirebase, admin } = require('../../config/firebase-config');
const logger = require('../../utils/logger');

// Initialize Firebase and get db instance
const db = initializeFirebase();

class UserService {
  // Get all users with their course information
  static async getAllUsers() {
    try {
      const usersSnapshot = await db.collection('users').get();
      const users = [];
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          userId: userData.userId || doc.id,
          username: userData.username || 'N/A',
          email: userData.email || 'N/A',
          coursesTaken: userData.coursesTaken || [],
          createdAt: userData.createdAt || null
        });
      });
      
      return users;
    } catch (error) {
      logger.error('❌ Failed to retrieve users:', { error: error.message });
      throw new Error('Failed to retrieve users from database');
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const userSnapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
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
        coursesTaken: userData.coursesTaken || []
      };
    } catch (error) {
      logger.error('❌ Failed to find user by email:', { 
        email, 
        error: error.message 
      });
      throw new Error('Failed to find user');
    }
  }

  // Create new user
  static async createUser(userData) {
    try {
      const { userId, username, email } = userData;
      
      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      const newUser = {
        userId,
        username,
        email,
        coursesTaken: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection('users').add(newUser);
      
      return {
        id: docRef.id,
        ...newUser,
        createdAt: new Date()
      };
    } catch (error) {
      logger.error('❌ Failed to create user:', { 
        userData,
        error: error.message 
      });
      throw new Error(error.message || 'Failed to create user');
    }
  }

  // Enroll user in course using Firestore transaction
  static async enrollUserInCourse(userEmail, courseName) {
    try {
      const result = await db.runTransaction(async (transaction) => {
        // Get user by email
        const userQuery = await db.collection('users')
          .where('email', '==', userEmail)
          .limit(1)
          .get();
        
        if (userQuery.empty) {
          throw new Error('User not found');
        }
        
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        
        // Get course by name
        const courseQuery = await db.collection('courses')
          .where('courseName', '==', courseName)
          .limit(1)
          .get();
        
        if (courseQuery.empty) {
          throw new Error('Course not found');
        }
        
        const courseDoc = courseQuery.docs[0];
        const courseData = courseDoc.data();
        
        // Check if user is already enrolled
        const userCourses = userData.coursesTaken || [];
        if (userCourses.includes(courseName)) {
          throw new Error('User is already enrolled in this course');
        }
        
        // Update user's courses
        const updatedUserCourses = [...userCourses, courseName];
        transaction.update(userDoc.ref, {
          coursesTaken: updatedUserCourses,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Update course's enrolled users
        const enrolledUsers = courseData.enrolledUsers || [];
        if (!enrolledUsers.includes(userEmail)) {
          const updatedEnrolledUsers = [...enrolledUsers, userEmail];
          transaction.update(courseDoc.ref, {
            enrolledUsers: updatedEnrolledUsers,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
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
      logger.error('❌ Course enrollment failed:', { 
        userEmail, 
        courseName, 
        error: error.message 
      });
      throw new Error(error.message || 'Failed to enroll user in course');
    }
  }

  // Get recent activity (last 10 enrollments)
  static async getRecentActivity() {
    try {
      // This is a simplified version - in a real app, you'd store enrollment history
      const users = await this.getAllUsers();
      const recentActivity = [];
      
      // Generate some sample recent activity based on existing data
      users.slice(0, 5).forEach(user => {
        if (user.coursesTaken && user.coursesTaken.length > 0) {
          recentActivity.push({
            type: 'enrollment',
            message: `${user.username} enrolled in ${user.coursesTaken[user.coursesTaken.length - 1]}`,
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
          });
        }
      });
      
      const sortedActivity = recentActivity.sort((a, b) => b.timestamp - a.timestamp);
      return sortedActivity;
    } catch (error) {
      logger.error('❌ Failed to retrieve recent activity:', { 
        error: error.message 
      });
      throw new Error('Failed to retrieve recent activity');
    }
  }
}

module.exports = UserService;