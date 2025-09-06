import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const courseDatabase = {
  'web-development': {
    beginner: [
      {
        id: 'web-basics',
        title: 'Web Development Fundamentals',
        description: 'Master the essential building blocks of modern web development. Learn HTML5 for semantic structure, CSS3 for stunning designs, and JavaScript for interactive functionality. Build responsive websites that work perfectly on all devices.',
        duration: '8 weeks',
        hours: 120,
        difficulty: 'Beginner',
        rating: 4.8,
        students: 15420,
        instructor: 'Sarah Johnson',
        price: 'Free',
        isPremium: false, 
        modules: [
          'HTML5 Structure & Semantic Elements - Learn modern HTML tags, forms, and accessibility',
          'CSS3 Styling & Advanced Layouts - Master Flexbox, Grid, animations, and responsive design',
          'JavaScript Fundamentals - Variables, functions, DOM manipulation, and event handling',
          'Responsive Web Design - Mobile-first approach, media queries, and flexible layouts',
          'Web Accessibility (WCAG) - Creating inclusive websites for all users',
          'Version Control with Git - Collaborative development and code management',
          'Portfolio Website Project - Build and deploy your professional portfolio',
          'Web Performance & SEO - Optimization techniques and search engine visibility'
        ],
        skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git', 'Responsive Design', 'Web Accessibility', 'SEO'],
        certificate: true,
        nextCourse: 'react-fundamentals',
        detailedContent: {
          overview: 'This comprehensive course covers everything you need to start your web development journey. You\'ll learn to create modern, responsive websites using industry-standard technologies.',
          prerequisites: ['Basic computer literacy', 'No prior programming experience required'],
          outcomes: ['Build responsive websites from scratch', 'Understand modern web development workflow', 'Create accessible and SEO-friendly websites', 'Use Git for version control']
        }
      },
      {
        id: 'react-fundamentals',
        title: 'React.js for Beginners',
        description: 'Dive into the world of modern frontend development with React.js. Learn component-based architecture, state management, and build dynamic, interactive web applications that scale.',
        duration: '6 weeks',
        hours: 90,
        difficulty: 'Beginner',
        rating: 4.7,
        students: 12350,
        instructor: 'Mike Chen',
        price: '$49',
        isPremium: true,
        modules: [
          'React Components & JSX - Understanding component architecture and JSX syntax',
          'Props & State Management - Data flow and component communication',
          'Event Handling & Forms - User interactions and form validation',
          'React Hooks (useState, useEffect) - Modern React patterns and lifecycle management',
          'API Integration & Async Operations - Fetching data and handling promises',
          'React Router - Single Page Application navigation and routing',
          'Todo Application Project - Build a full-featured task management app',
          'Testing React Components - Unit testing with Jest and React Testing Library'
        ],
        skills: ['React.js', 'JSX', 'Hooks', 'API Integration', 'Testing', 'SPA Development'],
        certificate: true,
        nextCourse: 'advanced-react',
        detailedContent: {
          overview: 'Master React.js, the most popular frontend library. Build modern, interactive web applications with component-based architecture.',
          prerequisites: ['HTML, CSS, JavaScript fundamentals', 'Basic understanding of ES6+ features'],
          outcomes: ['Build React applications from scratch', 'Manage application state effectively', 'Integrate with REST APIs', 'Test React components']
        }
      }
    ],
    intermediate: [
      {
        id: 'advanced-react',
        title: 'Advanced React & State Management',
        description: 'Take your React skills to the next level with advanced patterns, Redux for state management, performance optimization, and modern development practices.',
        duration: '8 weeks',
        hours: 140,
        difficulty: 'Intermediate',
        rating: 4.9,
        students: 8920,
        instructor: 'Emily Rodriguez',
        price: '$99',
        isPremium: true,
        modules: [
          'Advanced React Patterns - Render props, HOCs, compound components',
          'Context API & Redux Toolkit - Global state management solutions',
          'Performance Optimization - React.memo, useMemo, useCallback, code splitting',
          'Custom Hooks & Advanced Hooks - Creating reusable logic and advanced patterns',
          'Server-Side Rendering (Next.js) - SEO optimization and performance',
          'Testing Strategies - Integration testing, mocking, and test-driven development',
          'E-commerce Platform Project - Build a complete online store with cart and checkout',
          'Deployment & CI/CD - Production deployment and continuous integration'
        ],
        skills: ['Advanced React', 'Redux', 'Next.js', 'Performance Optimization', 'Testing', 'CI/CD'],
        certificate: true,
        nextCourse: 'fullstack-mastery',
        detailedContent: {
          overview: 'Advanced React development covering complex state management, performance optimization, and production-ready applications.',
          prerequisites: ['Solid React fundamentals', 'Experience with JavaScript ES6+', 'Basic understanding of web APIs'],
          outcomes: ['Build scalable React applications', 'Implement complex state management', 'Optimize application performance', 'Deploy production applications']
        }
      }
    ],
    advanced: [
      {
        id: 'fullstack-mastery',
        title: 'Full Stack Web Development Mastery',
        description: 'Complete full-stack development mastery combining advanced frontend techniques with backend development, databases, and cloud deployment.',
        duration: '12 weeks',
        hours: 200,
        difficulty: 'Advanced',
        rating: 4.9,
        students: 5680,
        instructor: 'David Kim',
        price: '$199',
        isPremium: true,
        modules: [
          'Advanced Frontend Architecture - Micro-frontends, design systems, and scalable patterns',
          'Node.js & Express.js Backend - RESTful APIs, middleware, and server architecture',
          'Database Design & Management - SQL/NoSQL databases, ORMs, and data modeling',
          'Authentication & Security - JWT, OAuth, security best practices, and data protection',
          'Microservices Architecture - Service design, API gateways, and distributed systems',
          'DevOps & Cloud Deployment - Docker, Kubernetes, AWS/Azure deployment strategies',
          'Social Media Platform Project - Build a complete social platform with real-time features',
          'Performance & Scalability - Load balancing, caching, monitoring, and optimization'
        ],
        skills: ['Full Stack Development', 'Node.js', 'Databases', 'DevOps', 'Cloud Architecture', 'Microservices'],
        certificate: true,
        nextCourse: null,
        detailedContent: {
          overview: 'Master full-stack development with modern technologies and architectural patterns. Build scalable, production-ready applications.',
          prerequisites: ['Advanced React knowledge', 'JavaScript proficiency', 'Basic backend understanding'],
          outcomes: ['Architect full-stack applications', 'Deploy to cloud platforms', 'Implement security best practices', 'Build scalable systems']
        }
      }
    ]
  },
  'machine-learning': {
    beginner: [
      {
        id: 'ml-basics',
        title: 'Machine Learning Fundamentals',
        description: 'Start your AI journey with comprehensive machine learning fundamentals. Learn Python programming, statistical concepts, and build your first predictive models using industry-standard libraries.',
        duration: '10 weeks',
        hours: 150,
        difficulty: 'Beginner',
        rating: 4.8,
        students: 18750,
        instructor: 'Dr. Anna Patel',
        price: 'Free',
        isPremium: false,
        modules: [
          'Python for Data Science - NumPy, Pandas, Matplotlib for data manipulation and visualization',
          'Statistics & Probability - Descriptive statistics, probability distributions, hypothesis testing',
          'Linear Algebra Fundamentals - Vectors, matrices, eigenvalues for ML applications',
          'Supervised Learning Algorithms - Linear regression, decision trees, random forests',
          'Unsupervised Learning - K-means clustering, hierarchical clustering, PCA',
          'Data Preprocessing & Feature Engineering - Data cleaning, scaling, feature selection',
          'Model Evaluation & Validation - Cross-validation, metrics, bias-variance tradeoff',
          'Prediction Model Project - End-to-end ML project from data to deployment'
        ],
        skills: ['Python', 'Statistics', 'Scikit-learn', 'Data Analysis', 'ML Algorithms', 'Data Visualization'],
        certificate: true,
        nextCourse: 'deep-learning-intro',
        detailedContent: {
          overview: 'Comprehensive introduction to machine learning covering fundamental algorithms, statistical concepts, and practical implementation.',
          prerequisites: ['Basic programming knowledge', 'High school mathematics', 'Curiosity about AI and data'],
          outcomes: ['Build ML models from scratch', 'Evaluate model performance', 'Handle real-world datasets', 'Deploy ML solutions']
        }
      }
    ],
    intermediate: [
      {
        id: 'deep-learning-intro',
        title: 'Deep Learning with TensorFlow',
        description: 'Explore the fascinating world of neural networks and deep learning. Build sophisticated AI models for computer vision, natural language processing, and more using TensorFlow.',
        duration: '8 weeks',
        hours: 120,
        difficulty: 'Intermediate',
        rating: 4.7,
        students: 9840,
        instructor: 'Prof. James Liu',
        price: '$129',
        isPremium: true,
        modules: [
          'Neural Network Fundamentals - Perceptrons, backpropagation, gradient descent',
          'TensorFlow & Keras Framework - Building and training neural networks',
          'Convolutional Neural Networks (CNNs) - Image classification and computer vision',
          'Recurrent Neural Networks (RNNs) - Sequential data and time series analysis',
          'Transfer Learning & Pre-trained Models - Leveraging existing models for new tasks',
          'Computer Vision Applications - Object detection, image segmentation, style transfer',
          'Natural Language Processing - Text classification, sentiment analysis, word embeddings',
          'Image Classifier Project - Build and deploy a production-ready image classification system'
        ],
        skills: ['TensorFlow', 'Neural Networks', 'CNN', 'RNN', 'Computer Vision', 'NLP'],
        certificate: true,
        nextCourse: 'ml-engineering',
        detailedContent: {
          overview: 'Deep dive into neural networks and deep learning with hands-on projects in computer vision and natural language processing.',
          prerequisites: ['Python proficiency', 'Basic ML knowledge', 'Linear algebra fundamentals'],
          outcomes: ['Build deep learning models', 'Implement CNNs and RNNs', 'Deploy AI applications', 'Work with image and text data']
        }
      }
    ],
    advanced: [
      {
        id: 'ml-engineering',
        title: 'ML Engineering & Production Systems',
        description: 'Master the art of deploying machine learning models at scale. Learn MLOps, model monitoring, A/B testing, and building production-ready AI systems.',
        duration: '10 weeks',
        hours: 180,
        difficulty: 'Advanced',
        rating: 4.9,
        students: 4320,
        instructor: 'Dr. Rachel Green',
        price: '$249',
        isPremium: true,
        modules: [
          'MLOps Fundamentals - ML lifecycle, versioning, and automation pipelines',
          'Model Versioning & Experiment Tracking - MLflow, DVC, and reproducible ML',
          'Containerization & Orchestration - Docker, Kubernetes for ML workloads',
          'A/B Testing for ML Models - Statistical testing and model comparison in production',
          'Model Monitoring & Observability - Drift detection, performance monitoring, alerting',
          'Scalable ML Pipelines - Apache Airflow, feature stores, and data pipelines',
          'Production ML System Project - Build end-to-end ML platform with monitoring',
          'Ethics & Bias in ML - Fairness, interpretability, and responsible AI practices'
        ],
        skills: ['MLOps', 'Docker', 'Kubernetes', 'ML Pipelines', 'Production ML', 'Model Monitoring'],
        certificate: true,
        nextCourse: null,
        detailedContent: {
          overview: 'Learn to deploy and maintain machine learning models in production environments with enterprise-grade practices.',
          prerequisites: ['Strong ML background', 'Python expertise', 'Basic DevOps knowledge'],
          outcomes: ['Deploy ML models at scale', 'Implement MLOps practices', 'Monitor model performance', 'Build ML platforms']
        }
      }
    ]
  },
  'backend-development': {
    beginner: [
      {
        id: 'backend-basics',
        title: 'Backend Development Fundamentals',
        description: 'Master server-side development with Node.js and Express. Learn to build robust APIs, handle databases, implement authentication, and create scalable backend systems.',
        duration: '10 weeks',
        hours: 140,
        difficulty: 'Beginner',
        rating: 4.8,
        students: 13250,
        instructor: 'Alex Thompson',
        price: 'Free',
        isPremium: false,
        modules: [
          'Node.js Fundamentals - Server-side JavaScript, modules, and asynchronous programming',
          'Express.js Framework - Routing, middleware, and RESTful API design',
          'Database Integration - MongoDB and PostgreSQL, CRUD operations',
          'Authentication & Authorization - JWT tokens, sessions, and security best practices',
          'API Design & Documentation - RESTful principles, OpenAPI, and API versioning',
          'Error Handling & Logging - Robust error management and application monitoring',
          'Testing Backend Applications - Unit testing, integration testing with Jest',
          'Blog API Project - Build a complete blog backend with user management'
        ],
        skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'JWT', 'API Design', 'Testing'],
        certificate: true,
        nextCourse: 'advanced-backend',
        detailedContent: {
          overview: 'Comprehensive backend development course covering server-side programming, databases, and API development.',
          prerequisites: ['JavaScript fundamentals', 'Basic understanding of web concepts', 'Command line basics'],
          outcomes: ['Build RESTful APIs', 'Implement authentication systems', 'Work with databases', 'Deploy backend applications']
        }
      }
    ],
    intermediate: [
      {
        id: 'advanced-backend',
        title: 'Advanced Backend Architecture',
        description: 'Design and build enterprise-grade backend systems. Learn microservices architecture, message queues, caching strategies, and advanced database optimization.',
        duration: '12 weeks',
        hours: 180,
        difficulty: 'Intermediate',
        rating: 4.9,
        students: 7890,
        instructor: 'Maria Santos',
        price: '$149',
        isPremium: true,
        modules: [
          'Microservices Architecture - Service decomposition, communication patterns, API gateways',
          'Message Queues & Event Streaming - Redis, RabbitMQ, Apache Kafka for async processing',
          'Caching Strategies - Redis, Memcached, CDN integration for performance',
          'Database Optimization - Query optimization, indexing, connection pooling',
          'API Security & Rate Limiting - OAuth2, API keys, DDoS protection',
          'Monitoring & Observability - Logging, metrics, distributed tracing',
          'Load Balancing & Scaling - Horizontal scaling, load balancers, auto-scaling',
          'E-commerce Backend Project - Build scalable backend for online marketplace'
        ],
        skills: ['Microservices', 'Message Queues', 'Caching', 'Database Optimization', 'API Security', 'Monitoring'],
        certificate: true,
        nextCourse: 'devops-backend',
        detailedContent: {
          overview: 'Advanced backend development focusing on scalable architecture patterns and enterprise-grade systems.',
          prerequisites: ['Solid backend fundamentals', 'Database experience', 'Understanding of system design'],
          outcomes: ['Design microservices architecture', 'Implement caching strategies', 'Optimize database performance', 'Build scalable systems']
        }
      }
    ],
    advanced: [
      {
        id: 'devops-backend',
        title: 'DevOps for Backend Systems',
        description: 'Master the deployment and operations of backend systems. Learn containerization, orchestration, CI/CD pipelines, and cloud infrastructure management.',
        duration: '8 weeks',
        hours: 120,
        difficulty: 'Advanced',
        rating: 4.8,
        students: 4560,
        instructor: 'Robert Chen',
        price: '$199',
        isPremium: true,
        modules: [
          'Containerization with Docker - Container creation, optimization, and best practices',
          'Kubernetes Orchestration - Pod management, services, deployments, and scaling',
          'CI/CD Pipelines - GitHub Actions, Jenkins, automated testing and deployment',
          'Infrastructure as Code - Terraform, CloudFormation for reproducible infrastructure',
          'Cloud Platforms - AWS, Azure, GCP services for backend applications',
          'Monitoring & Alerting - Prometheus, Grafana, ELK stack for system observability',
          'Security & Compliance - Container security, secrets management, compliance frameworks',
          'Production Deployment Project - Deploy and manage a production backend system'
        ],
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Cloud Platforms', 'Monitoring', 'Security'],
        certificate: true,
        nextCourse: null,
        detailedContent: {
          overview: 'Complete DevOps training for backend developers focusing on deployment, monitoring, and infrastructure management.',
          prerequisites: ['Backend development experience', 'Linux command line proficiency', 'Basic networking knowledge'],
          outcomes: ['Deploy applications with Docker/Kubernetes', 'Implement CI/CD pipelines', 'Manage cloud infrastructure', 'Monitor production systems']
        }
      }
    ]
  },
  'fullstack-development': {
    beginner: [
      {
        id: 'fullstack-basics',
        title: 'Full Stack Development Bootcamp',
        description: 'Comprehensive full-stack development program covering both frontend and backend technologies. Build complete web applications from database to user interface.',
        duration: '16 weeks',
        hours: 240,
        difficulty: 'Beginner',
        rating: 4.9,
        students: 11200,
        instructor: 'Jessica Williams',
        price: '$299',
        isPremium: true,
        modules: [
          'Frontend Fundamentals - HTML5, CSS3, JavaScript ES6+, responsive design',
          'React.js Development - Components, state management, hooks, routing',
          'Backend with Node.js - Express.js, RESTful APIs, middleware',
          'Database Management - MongoDB and PostgreSQL, data modeling',
          'Authentication Systems - User registration, login, JWT tokens, sessions',
          'Real-time Features - WebSockets, Socket.io for live updates',
          'Testing Full Stack Apps - Frontend and backend testing strategies',
          'Social Network Project - Build a complete social media platform'
        ],
        skills: ['HTML/CSS/JS', 'React.js', 'Node.js', 'Databases', 'Authentication', 'WebSockets', 'Testing'],
        certificate: true,
        nextCourse: 'fullstack-advanced',
        detailedContent: {
          overview: 'Complete full-stack development bootcamp covering modern web technologies from frontend to backend.',
          prerequisites: ['Basic computer skills', 'Problem-solving mindset', 'No prior programming experience required'],
          outcomes: ['Build full-stack web applications', 'Deploy applications to production', 'Implement user authentication', 'Work with databases']
        }
      }
    ],
    intermediate: [
      {
        id: 'fullstack-advanced',
        title: 'Advanced Full Stack with Modern Frameworks',
        description: 'Master advanced full-stack development with Next.js, TypeScript, GraphQL, and cloud technologies. Build enterprise-grade applications with modern best practices.',
        duration: '14 weeks',
        hours: 210,
        difficulty: 'Intermediate',
        rating: 4.8,
        students: 6750,
        instructor: 'Michael Rodriguez',
        price: '$399',
        isPremium: true,
        modules: [
          'TypeScript for Full Stack - Type safety across frontend and backend',
          'Next.js Framework - SSR, SSG, API routes, and performance optimization',
          'GraphQL & Apollo - Modern API design, queries, mutations, subscriptions',
          'Advanced State Management - Redux Toolkit, Zustand, server state',
          'Serverless Architecture - AWS Lambda, Vercel Functions, edge computing',
          'Advanced Database Patterns - ORMs, migrations, advanced queries',
          'Performance Optimization - Code splitting, lazy loading, caching strategies',
          'Marketplace Platform Project - Build a complete e-commerce marketplace'
        ],
        skills: ['TypeScript', 'Next.js', 'GraphQL', 'Serverless', 'Advanced Databases', 'Performance Optimization'],
        certificate: true,
        nextCourse: 'fullstack-enterprise',
        detailedContent: {
          overview: 'Advanced full-stack development with modern frameworks and enterprise-grade practices.',
          prerequisites: ['Full-stack fundamentals', 'JavaScript proficiency', 'Basic React and Node.js experience'],
          outcomes: ['Build with TypeScript and Next.js', 'Implement GraphQL APIs', 'Deploy serverless applications', 'Optimize application performance']
        }
      }
    ],
    advanced: [
      {
        id: 'fullstack-enterprise',
        title: 'Enterprise Full Stack Architecture',
        description: 'Design and build enterprise-scale full-stack applications. Learn system architecture, scalability patterns, security, and team collaboration practices.',
        duration: '12 weeks',
        hours: 180,
        difficulty: 'Advanced',
        rating: 4.9,
        students: 3420,
        instructor: 'Sarah Kim',
        price: '$499',
        isPremium: true,
        modules: [
          'System Architecture Design - Scalable patterns, microservices, distributed systems',
          'Advanced Security Practices - OWASP guidelines, penetration testing, security audits',
          'Team Collaboration & Code Quality - Git workflows, code reviews, documentation',
          'Performance at Scale - Load testing, profiling, optimization strategies',
          'Multi-tenant Applications - SaaS architecture, data isolation, tenant management',
          'Advanced DevOps Integration - Blue-green deployments, feature flags, monitoring',
          'Enterprise Integrations - Third-party APIs, webhooks, event-driven architecture',
          'Enterprise SaaS Project - Build a complete multi-tenant business application'
        ],
        skills: ['System Architecture', 'Enterprise Security', 'Team Leadership', 'Scalability', 'Multi-tenancy', 'DevOps'],
        certificate: true,
        nextCourse: null,
        detailedContent: {
          overview: 'Enterprise-level full-stack development covering architecture, security, and scalability for large-scale applications.',
          prerequisites: ['Advanced full-stack experience', 'System design knowledge', 'Leadership experience preferred'],
          outcomes: ['Architect enterprise applications', 'Implement advanced security', 'Lead development teams', 'Build scalable SaaS platforms']
        }
      }
    ]
  }
};

const CourseRecommendations = ({ selectedDomain, experienceLevel, onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const coursesRef = useRef([]);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const domainCourses = courseDatabase[selectedDomain?.id] || {};
      const levelCourses = domainCourses[experienceLevel?.id] || [];
      setCourses(levelCourses);
      setLoading(false);
    }, 1000);
  }, [selectedDomain, experienceLevel]);

  useEffect(() => {
    if (!loading && courses.length > 0) {
      // Reset refs array to match courses length
      coursesRef.current = coursesRef.current.slice(0, courses.length);
      
      // Filter out null/undefined refs and animate only valid elements
      const validRefs = coursesRef.current.filter(ref => ref !== null && ref !== undefined);
      
      if (validRefs.length > 0) {
        gsap.fromTo(validRefs, 
          { y: 50, opacity: 0, scale: 0.9 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)' }
        );
      }
    }
  }, [loading, courses]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6366f1';
    }
  };

  const handleEnrollClick = (course) => {
    onCourseSelect(course);
  };

  if (loading) {
    return (
      <div className="course-recommendations-loading">
        <div className="loading-spinner"></div>
        <h3>Finding the perfect courses for you...</h3>
        <p>Based on your selection: {selectedDomain?.title} - {experienceLevel?.title}</p>
      </div>
    );
  }

  return (
    <div className="course-recommendations">
      <div className="recommendations-header">
        <h2 className="recommendations-title">
          <span className="title-icon">🎓</span>
          Recommended Courses for You
        </h2>
        <div className="selection-summary">
          <span className="domain-tag">{selectedDomain?.title}</span>
          <span className="level-tag">{experienceLevel?.title}</span>
        </div>
        <p className="recommendations-subtitle">
          Carefully curated courses to help you master {selectedDomain?.title} at the {experienceLevel?.title} level
        </p>
      </div>

      <div className="courses-grid">
        {courses.map((course, index) => (
          <div
            key={course.id}
            ref={el => coursesRef.current[index] = el}
            className={`course-card ${course.isPremium ? 'premium' : 'free'}`}
          >
            {course.isPremium && <div className="premium-badge">Premium</div>}
            
            <div className="course-header">
              <div className="course-meta">
                <span 
                  className="difficulty-badge" 
                  style={{ backgroundColor: getDifficultyColor(course.difficulty) }}
                >
                  {course.difficulty}
                </span>
                <div className="course-rating">
                  <span className="rating-stars">⭐</span>
                  <span className="rating-value">{course.rating}</span>
                  <span className="rating-count">({course.students.toLocaleString()})</span>
                </div>
              </div>
              
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              
              <div className="course-stats">
                <div className="stat-item">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-text">{course.duration}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📚</span>
                  <span className="stat-text">{course.hours} hours</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">👨‍🏫</span>
                  <span className="stat-text">{course.instructor}</span>
                </div>
              </div>
            </div>

            <div className="course-content">
              <div className="course-modules">
                <h4>What You'll Learn:</h4>
                <ul className="modules-list">
                  {course.modules.slice(0, 4).map((module, idx) => (
                    <li key={idx}>{module}</li>
                  ))}
                  {course.modules.length > 4 && (
                    <li className="more-modules">+{course.modules.length - 4} more modules</li>
                  )}
                </ul>
              </div>

              <div className="course-skills">
                <h4>Skills You'll Gain:</h4>
                <div className="skills-tags">
                  {course.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="course-features">
                {course.certificate && (
                  <div className="feature-item">
                    <span className="feature-icon">🏆</span>
                    <span>Certificate included</span>
                  </div>
                )}
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Mobile friendly</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <span>Lifetime access</span>
                </div>
              </div>
            </div>

            <div className="course-footer">
              <div className="course-price">
                <span className={`price ${course.price === 'Free' ? 'free' : 'paid'}`}>
                  {course.price}
                </span>
                {course.nextCourse && (
                  <span className="next-course">
                    Next: {courseDatabase[selectedDomain?.id]?.[experienceLevel?.id]?.find(c => c.id === course.nextCourse)?.title || 'Advanced Course'}
                  </span>
                )}
              </div>
              
              <button 
                className={`enroll-btn ${course.isPremium ? 'premium-btn' : 'free-btn'}`}
                onClick={() => handleEnrollClick(course)}
              >
                {course.price === 'Free' ? 'Start Learning' : 'Enroll Now'}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="learning-path-info">
        <h3>Your Learning Path</h3>
        <p>
          Complete these courses in sequence to become proficient in {selectedDomain?.title}. 
          Each course builds upon the previous one, ensuring a structured learning experience.
        </p>
        <div className="path-progression">
          {courses.map((course, index) => (
            <div key={course.id} className="path-step">
              <div className="step-number">{index + 1}</div>
              <div className="step-info">
                <span className="step-title">{course.title}</span>
                <span className="step-duration">{course.duration}</span>
              </div>
              {index < courses.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseRecommendations;
