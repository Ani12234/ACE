// Course Progress Management Utilities
export const CourseProgressManager = {
  // Get enrolled courses from localStorage
  getEnrolledCourses: () => {
    try {
      return JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    } catch (error) {
      console.error('Failed to load enrolled courses:', error);
      return [];
    }
  },

  // Enroll in a course
  enrollInCourse: (course) => {
    try {
      const enrolled = CourseProgressManager.getEnrolledCourses();
      if (!enrolled.some(c => c.id === course.id)) {
        const updatedEnrolled = [...enrolled, course];
        localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolled));
        
        // Initialize progress for new course
        CourseProgressManager.updateProgress(course.id, 0);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to enroll in course:', error);
      return false;
    }
  },

  // Get course progress
  getCourseProgress: (courseId) => {
    try {
      const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      return progress[courseId] || 0;
    } catch (error) {
      console.error('Failed to load course progress:', error);
      return 0;
    }
  },

  // Update course progress
  updateProgress: (courseId, progress) => {
    try {
      const allProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      allProgress[courseId] = Math.min(100, Math.max(0, progress));
      localStorage.setItem('courseProgress', JSON.stringify(allProgress));
      return true;
    } catch (error) {
      console.error('Failed to update course progress:', error);
      return false;
    }
  },

  // Get all course progress
  getAllProgress: () => {
    try {
      return JSON.parse(localStorage.getItem('courseProgress') || '{}');
    } catch (error) {
      console.error('Failed to load all course progress:', error);
      return {};
    }
  },

  // Calculate learning statistics
  getLearningStats: () => {
    try {
      const enrolled = CourseProgressManager.getEnrolledCourses();
      const progress = CourseProgressManager.getAllProgress();
      
      return {
        totalCourses: enrolled.length,
        completedCourses: Object.values(progress).filter(p => p >= 100).length,
        inProgressCourses: Object.values(progress).filter(p => p > 0 && p < 100).length,
        totalHours: enrolled.reduce((total, course) => {
          const hours = parseInt(course.hours) || 0;
          const courseProgress = progress[course.id] || 0;
          return total + (hours * courseProgress / 100);
        }, 0),
        currentStreak: parseInt(localStorage.getItem('learningStreak') || '0')
      };
    } catch (error) {
      console.error('Failed to calculate learning stats:', error);
      return {
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalHours: 0,
        currentStreak: 0
      };
    }
  },

  // Update learning streak
  updateStreak: () => {
    try {
      const lastActivity = localStorage.getItem('lastLearningActivity');
      const today = new Date().toDateString();
      
      if (lastActivity !== today) {
        const currentStreak = parseInt(localStorage.getItem('learningStreak') || '0');
        const newStreak = lastActivity ? currentStreak + 1 : 1;
        localStorage.setItem('learningStreak', newStreak.toString());
        localStorage.setItem('lastLearningActivity', today);
        return newStreak;
      }
      
      return parseInt(localStorage.getItem('learningStreak') || '0');
    } catch (error) {
      console.error('Failed to update learning streak:', error);
      return 0;
    }
  },

  // Mark lesson as completed and update progress
  completeLesson: (courseId, lessonProgress = 10) => {
    try {
      const currentProgress = CourseProgressManager.getCourseProgress(courseId);
      const newProgress = Math.min(100, currentProgress + lessonProgress);
      
      CourseProgressManager.updateProgress(courseId, newProgress);
      CourseProgressManager.updateStreak();
      
      return newProgress;
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      return CourseProgressManager.getCourseProgress(courseId);
    }
  },

  // Check if user is enrolled in a course
  isEnrolled: (courseId) => {
    const enrolled = CourseProgressManager.getEnrolledCourses();
    return enrolled.some(course => course.id === courseId);
  },

  // Get enrolled course by ID
  getEnrolledCourse: (courseId) => {
    const enrolled = CourseProgressManager.getEnrolledCourses();
    return enrolled.find(course => course.id === courseId);
  }
};

export default CourseProgressManager;
