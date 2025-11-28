// ================================
// services/quizService.js
// ================================

const { initializeFirebase, admin } = require('../../config/firebase-config');
const logger = require('../../utils/logger');

// Initialize Firebase and get db instance
const db = initializeFirebase();

// 📚 Get all quiz questions for a course (optionally filter by module)
exports.getQuizzes = async (courseId, moduleFilter = null) => {
  try {
    const quizRef = db
      .collection("course_quiz")
      .doc(`${courseId}_quiz`)
      .collection("questions");

    let query = quizRef;

    // Filter by module if provided
    if (moduleFilter && moduleFilter !== 'all') {
      query = query.where('module_id', '==', moduleFilter);
    }

    // Order by order field if it exists
    query = query.orderBy('order', 'asc');

    const snapshot = await query.get();
    const quizzes = snapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    return quizzes;
  } catch (error) {
    logger.error(`Error getting quizzes for course ${courseId}:`, error);
    
    // If orderBy fails (field doesn't exist), try without it
    if (error.code === 5 || error.message.includes('index')) {
      try {
        const quizRef = db
          .collection("course_quiz")
          .doc(`${courseId}_quiz`)
          .collection("questions");

        let query = quizRef;

        if (moduleFilter && moduleFilter !== 'all') {
          query = query.where('module_id', '==', moduleFilter);
        }

        const snapshot = await query.get();
        return snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
      } catch (retryError) {
        logger.error(`Retry failed for course ${courseId}:`, retryError);
        throw retryError;
      }
    }
    throw error;
  }
};

// ➕ Add a new quiz question
exports.addQuiz = async (courseId, quizData) => {
  try {
    // Validate required fields based on new structure
    if (!quizData.question) {
      throw new Error('Question text is required');
    }

    if (!quizData.options || !Array.isArray(quizData.options) || quizData.options.length < 4) {
      throw new Error('Four answer options are required');
    }

    if (typeof quizData.correctOptionIndex !== 'number' || 
        quizData.correctOptionIndex < 0 || 
        quizData.correctOptionIndex >= quizData.options.length) {
      throw new Error('Valid correct option index is required (0-3)');
    }

    if (!quizData.module_id) {
      throw new Error('Module ID is required');
    }

    const quizRef = db
      .collection("course_quiz")
      .doc(`${courseId}_quiz`)
      .collection("questions");

    // Add timestamp if not provided
    const quizToAdd = {
      question: quizData.question,
      options: quizData.options,
      correctOptionIndex: quizData.correctOptionIndex,
      module_id: quizData.module_id,
      difficulty: quizData.difficulty || 'NORMAL',
      explanation: quizData.explanation || '',
      order: quizData.order || 0,
      createdAt: quizData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newDoc = await quizRef.add(quizToAdd);
    
    logger.info(`Quiz question added: ${newDoc.id} for course ${courseId}`);
    
    return { id: newDoc.id, ...quizToAdd };
  } catch (error) {
    logger.error(`Error adding quiz to course ${courseId}:`, error);
    throw error;
  }
};

// ✏️ Update quiz question
exports.updateQuiz = async (courseId, questionId, updatedData) => {
  try {
    const quizDoc = db
      .collection("course_quiz")
      .doc(`${courseId}_quiz`)
      .collection("questions")
      .doc(questionId);

    // Check if document exists
    const docSnapshot = await quizDoc.get();
    if (!docSnapshot.exists) {
      throw new Error('Quiz question not found');
    }

    // Validate data if provided
    if (updatedData.options && 
        (!Array.isArray(updatedData.options) || updatedData.options.length < 4)) {
      throw new Error('Four answer options are required');
    }

    if (updatedData.correctOptionIndex !== undefined && 
        (typeof updatedData.correctOptionIndex !== 'number' || 
         updatedData.correctOptionIndex < 0 || 
         updatedData.correctOptionIndex >= 4)) {
      throw new Error('Valid correct option index is required (0-3)');
    }

    // Prepare data to update
    const dataToUpdate = {
      ...updatedData,
      updatedAt: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(dataToUpdate).forEach(key => 
      dataToUpdate[key] === undefined && delete dataToUpdate[key]
    );

    await quizDoc.update(dataToUpdate);
    
    logger.info(`Quiz question updated: ${questionId} for course ${courseId}`);
    
    // Return updated document
    const updated = await quizDoc.get();
    return { id: questionId, ...updated.data() };
  } catch (error) {
    logger.error(`Error updating quiz ${questionId} for course ${courseId}:`, error);
    throw error;
  }
};

// ❌ Delete quiz question
exports.deleteQuiz = async (courseId, questionId) => {
  try {
    const quizDoc = db
      .collection("course_quiz")
      .doc(`${courseId}_quiz`)
      .collection("questions")
      .doc(questionId);

    // Check if document exists
    const docSnapshot = await quizDoc.get();
    if (!docSnapshot.exists) {
      throw new Error('Quiz question not found');
    }

    await quizDoc.delete();
    
    logger.info(`Quiz question deleted: ${questionId} for course ${courseId}`);
    
    return { success: true, message: "Quiz deleted successfully" };
  } catch (error) {
    logger.error(`Error deleting quiz ${questionId} for course ${courseId}:`, error);
    throw error;
  }
};

// 📊 Get quiz statistics for a course
exports.getQuizStats = async (courseId) => {
  try {
    const quizzes = await exports.getQuizzes(courseId);
    
    const stats = {
      total: quizzes.length,
      byDifficulty: {},
      byModule: {}
    };

    quizzes.forEach(quiz => {
      // Count by difficulty
      const difficulty = quiz.difficulty || 'NORMAL';
      stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;

      // Count by module
      const module = quiz.module_id || 'Unassigned';
      stats.byModule[module] = (stats.byModule[module] || 0) + 1;
    });

    return stats;
  } catch (error) {
    logger.error(`Error getting quiz stats for course ${courseId}:`, error);
    throw error;
  }
};

//context only
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechLaunch - Quizzes</title>
    <link rel="icon" type="image/x-icon" href="../favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="../pages/styles/quiz.css">
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            TechLaunch
        </div>

        <div class="breadcrumb">Quizzes Page</div>
        
        <div class="page-header">
            <div>
                <h1 class="page-title">Quizzes</h1>
                <p class="page-subtitle">Add and edit quiz questions for each course lessons</p>
            </div>
            <div class="header-controls">
                <div class="dropdown">
                    <select id="moduleFilter">
                        <option value="all">All Modules</option>
                        <!-- Module options will be populated by JavaScript -->
                    </select>
                </div>
                <div class="dropdown">
                    <select id="courseFilter">
                        <option value="java">Java Course</option>
                        <option value="python">Python Course</option>
                        <option value="sql">SQL Course</option>
                    </select>
                </div>
                <button class="add-question-btn" onclick="openAddQuestionModal()">
                    <i class="fas fa-plus"></i>
                    Add Question
                </button>
            </div>
        </div>

        <div class="quiz-container" id="quizContainer">
            <div class="loading-spinner" id="loadingSpinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading quizzes...</p>
            </div>
        </div>
    </div>

    <!-- Add Question Modal -->
    <div id="addQuestionModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Quiz Question</h2>
                <span class="close" onclick="closeAddQuestionModal()">&times;</span>
            </div>
            <form id="addQuestionForm">
                <div class="form-group">
                    <label for="questionText">Question:</label>
                    <textarea id="questionText" name="question" required placeholder="Enter your question here..."></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="difficulty">Difficulty:</label>
                        <select id="difficulty" name="difficulty" required>
                            <option value="">Select Difficulty</option>
                            <option value="EASY">Easy</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="module">Module:</label>
                        <select id="module" name="module" required>
                            <option value="">Select Module</option>
                            <!-- Module options will be populated by JavaScript -->
                        </select>
                    </div>
                </div>

                <div class="options-container">
                    <h3>Answer Options:</h3>
                    <div class="form-group">
                        <label for="optionA">Option A:</label>
                        <input type="text" id="optionA" name="optionA" required placeholder="Enter option A">
                    </div>
                    <div class="form-group">
                        <label for="optionB">Option B:</label>
                        <input type="text" id="optionB" name="optionB" required placeholder="Enter option B">
                    </div>
                    <div class="form-group">
                        <label for="optionC">Option C:</label>
                        <input type="text" id="optionC" name="optionC" required placeholder="Enter option C">
                    </div>
                    <div class="form-group">
                        <label for="optionD">Option D:</label>
                        <input type="text" id="optionD" name="optionD" required placeholder="Enter option D">
                    </div>
                    <div class="form-group">
                        <label for="correctAnswer">Correct Answer:</label>
                        <select id="correctAnswer" name="correctAnswer" required>
                            <option value="">Select Correct Answer</option>
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="explanation">Explanation (Optional):</label>
                    <textarea id="explanation" name="explanation" placeholder="Explain why this is the correct answer..."></textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeAddQuestionModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Add Question</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Question Modal -->
    <div id="editQuestionModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Quiz Question</h2>
                <span class="close" onclick="closeEditQuestionModal()">&times;</span>
            </div>
            <form id="editQuestionForm">
                <input type="hidden" id="editQuestionId" name="id">
                <div class="form-group">
                    <label for="editQuestionText">Question:</label>
                    <textarea id="editQuestionText" name="question" required></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDifficulty">Difficulty:</label>
                        <select id="editDifficulty" name="difficulty" required>
                            <option value="EASY">Easy</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HARD">Hard</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editModule">Module:</label>
                        <select id="editModule" name="module" required>
                            <option value="">Select Module</option>
                            <!-- Module options will be populated by JavaScript -->
                        </select>
                    </div>
                </div>

                <div class="options-container">
                    <h3>Answer Options:</h3>
                    <div class="form-group">
                        <label for="editOptionA">Option A:</label>
                        <input type="text" id="editOptionA" name="optionA" required>
                    </div>
                    <div class="form-group">
                        <label for="editOptionB">Option B:</label>
                        <input type="text" id="editOptionB" name="optionB" required>
                    </div>
                    <div class="form-group">
                        <label for="editOptionC">Option C:</label>
                        <input type="text" id="editOptionC" name="optionC" required>
                    </div>
                    <div class="form-group">
                        <label for="editOptionD">Option D:</label>
                        <input type="text" id="editOptionD" name="optionD" required>
                    </div>
                    <div class="form-group">
                        <label for="editCorrectAnswer">Correct Answer:</label>
                        <select id="editCorrectAnswer" name="correctAnswer" required>
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="editExplanation">Explanation (Optional):</label>
                    <textarea id="editExplanation" name="explanation" placeholder="Explain why this is the correct answer..."></textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeEditQuestionModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Update Question</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../scripts/managers/quiz.js"></script>
</body>
</html>