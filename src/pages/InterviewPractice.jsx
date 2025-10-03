import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startInterview as apiStart, submitAnswer as apiSubmit } from '../api/interview';
import ProctorCamera from '../components/ProctorCamera';

gsap.registerPlugin(ScrollTrigger);

function InterviewPractice() {
  const heroRef = useRef(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  // Backend-driven state
  const [sessionId, setSessionId] = useState(null);
  const [currentQObj, setCurrentQObj] = useState(null); // { id, text }
  const [candidateText, setCandidateText] = useState('');
  const [progress, setProgress] = useState(null); // { index, total }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFeedback, setLastFeedback] = useState('');
  const [proctorStatus, setProctorStatus] = useState(null); // { ok, matchScore, multipleFaces, lookingAway, headPose, facesCount }
  // Voice: Speech-to-Text (browser Web Speech API) and Text-to-Speech
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sttSupported] = useState(() => {
    return typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );
  });
  // Local demo state kept for layout continuity
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewType, setInterviewType] = useState('technical');
  const [difficulty, setDifficulty] = useState('intermediate');

  const questions = {
    technical: [
      "Explain the difference between REST and GraphQL APIs.",
      "How would you optimize a slow database query?",
      "Describe the concept of microservices architecture.",
      "What are the benefits of using TypeScript over JavaScript?"
    ],
    behavioral: [
      "Tell me about a challenging project you worked on.",
      "How do you handle tight deadlines and pressure?",
      "Describe a time when you had to learn a new technology quickly.",
      "How do you approach debugging complex issues?"
    ]
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    // Hero animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(
      heroRef.current.querySelectorAll('[data-fade]'),
      { y: isMobile ? 20 : 30, opacity: 0 },
      { y: 0, opacity: 1, duration: isMobile ? 0.6 : 0.9, stagger: isMobile ? 0.08 : 0.12 }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Speak the current question aloud when it changes
  useEffect(() => {
    const text = currentQObj?.text;
    if (!text) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1.0;
        utter.pitch = 1.0;
        window.speechSynthesis.speak(utter);
      }
    } catch {}
  }, [currentQObj?.text]);

  const startListening = () => {
    if (!sttSupported || isRecording) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    let finalText = '';
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + ' ';
        else interim += t;
      }
      // Show combined interim + final in the textarea for live feedback
      setCandidateText((prev) => {
        // If empty or we are still dictating, prefer live stream content
        const base = finalText.trim();
        return base ? base + (interim ? (' ' + interim) : '') : (prev || interim);
      });
    };
    rec.onerror = () => {
      setIsRecording(false);
    };
    rec.onend = () => {
      setIsRecording(false);
    };
    rec.start();
    setIsRecording(true);
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec && isRecording) {
      try { rec.stop(); } catch {}
    }
    setIsRecording(false);
  };

  const startInterview = async () => {
    setError('');
    setLastFeedback('');
    setLoading(true);
    try {
      // Using interviewType as a stand-in for domain selection.
      const domain = interviewType;
      const candidateEmail = 'candidate@example.com'; // TODO: replace with logged-in user email if available
      const { sessionId: sid, firstQ } = await apiStart({ candidateEmail, domain });
      if (!sid || !firstQ) throw new Error('Invalid response from server');
      setSessionId(sid);
      setCurrentQObj(firstQ);
      setCandidateText('');
      setProgress({ index: 0, total: 10 });
      setIsInterviewActive(true);
      setCurrentQuestion(0); // keep local progress bar working
    } catch (e) {
      setError('Failed to start interview. Please check the interview server.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async () => {
    // If using backend, submit answer and fetch next question
    if (sessionId && currentQObj?.id) {
      setLoading(true);
      setError('');
      try {
        const { nextQuestion: nextQ, progress: p, feedback } = await apiSubmit({
          sessionId,
          questionId: currentQObj.id,
          candidateText,
        });
        // Update UI
        if (p) setProgress(p);
        setLastFeedback(feedback || '');
        setCandidateText('');
        if (nextQ && nextQ.id) {
          setCurrentQObj(nextQ);
          // keep legacy progress bar moving
          setCurrentQuestion((prev) => prev + 1);
        } else {
          // No next question: end interview
          setIsInterviewActive(false);
        }
      } catch (e) {
        setError('Failed to submit answer. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
      return;
    }
    // Fallback to local demo sequence if backend not initialized
    if (currentQuestion < questions[interviewType].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsInterviewActive(false);
    }
  };

  const endInterview = () => {
    setIsInterviewActive(false);
    setSessionId(null);
    setCurrentQObj(null);
    setCandidateText('');
    setProgress(null);
    setLoading(false);
    setError('');
  };

  return (
    <div className="interview-practice-page">
      {/* Hero Section */}
      <section ref={heroRef} className="interview-hero">
        <div className="container">
          <div className="interview-hero-content">
            <h1 className="interview-title" data-fade>
              AI-Powered Interview Practice
            </h1>
            <p className="interview-subtitle" data-fade>
              Experience realistic technical and behavioral interviews with our advanced AI proctor system
            </p>
            <div className="interview-stats" data-fade>
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">Practice Sessions</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Question Bank</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isInterviewActive ? (
        <>
          {/* Setup Section */}
          <section className="section setup-section">
            <div className="container">
              <div className="setup-content">
                <h2>Customize Your Interview</h2>
                <div className="setup-grid">
                  <div className="setup-card">
                    <h3>Interview Type</h3>
                    <div className="setup-options">
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="type" 
                          value="technical"
                          checked={interviewType === 'technical'}
                          onChange={(e) => setInterviewType(e.target.value)}
                        />
                        <span>Technical Interview</span>
                        <p>Focus on coding, system design, and technical concepts</p>
                      </label>
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="type" 
                          value="behavioral"
                          checked={interviewType === 'behavioral'}
                          onChange={(e) => setInterviewType(e.target.value)}
                        />
                        <span>Behavioral Interview</span>
                        <p>Assess soft skills, problem-solving, and cultural fit</p>
                      </label>
                    </div>
                  </div>

                  <div className="setup-card">
                    <h3>Difficulty Level</h3>
                    <div className="setup-options">
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="difficulty" 
                          value="beginner"
                          checked={difficulty === 'beginner'}
                          onChange={(e) => setDifficulty(e.target.value)}
                        />
                        <span>Beginner</span>
                        <p>Entry-level questions and concepts</p>
                      </label>
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="difficulty" 
                          value="intermediate"
                          checked={difficulty === 'intermediate'}
                          onChange={(e) => setDifficulty(e.target.value)}
                        />
                        <span>Intermediate</span>
                        <p>Mid-level professional questions</p>
                      </label>
                      <label className="setup-option">
                        <input 
                          type="radio" 
                          name="difficulty" 
                          value="advanced"
                          checked={difficulty === 'advanced'}
                          onChange={(e) => setDifficulty(e.target.value)}
                        />
                        <span>Advanced</span>
                        <p>Senior-level and complex scenarios</p>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="setup-actions">
                  {error && (
                    <div style={{ color: 'crimson', marginBottom: '0.5rem' }}>{error}</div>
                  )}
                  <button onClick={startInterview} className="btn btnPrimary btn-large" disabled={loading}>
                    Start AI Interview
                  </button>
                  <Link to="/features" className="btn btnGhost">
                    Learn More About AI Features
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="section features-section">
            <div className="container">
              <h2>What Makes Our AI Proctor Special</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🎥</div>
                  <h3>Video Analysis</h3>
                  <p>AI analyzes your body language, eye contact, and presentation skills</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🗣️</div>
                  <h3>Speech Recognition</h3>
                  <p>Advanced NLP processes your responses for technical accuracy</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📊</div>
                  <h3>Real-time Feedback</h3>
                  <p>Instant scoring and suggestions during your practice session</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📈</div>
                  <h3>Progress Tracking</h3>
                  <p>Detailed analytics showing improvement over multiple sessions</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Interview Interface */
        <section className="section interview-interface">
          <div className="container">
            <div className="interview-screen">
              <div className="interview-header">
                <div className="interview-progress">
                  <span>
                    Question {currentQuestion + 1} of {progress?.total || questions[interviewType].length}
                  </span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${((currentQuestion + 1) / (progress?.total || questions[interviewType].length)) * 100}%`}}
                    ></div>
                  </div>
                </div>
                <button onClick={endInterview} className="btn btnGhost btn-small">
                  End Interview
                </button>
              </div>

                <div className="interview-content">
                  <div className="ai-interviewer">
                    <div className="ai-avatar">🤖</div>
                    <div className="ai-name">AI Interviewer</div>
                  </div>

                  <div className="question-container">
                    <h3>Question {currentQuestion + 1}</h3>
                    <p className="question-text">
                      {currentQObj?.text || questions[interviewType][currentQuestion]}
                    </p>
                  </div>

                  <div className="response-area">
                    <ProctorCamera
                      sessionId={sessionId}
                      intervalMs={4000}
                      onStatus={setProctorStatus}
                    />

                    <div style={{ marginTop: '1rem' }}>
                      <label htmlFor="candidateAnswer" style={{ display: 'block', marginBottom: 4 }}>Your Answer</label>
                      <textarea
                        id="candidateAnswer"
                        value={candidateText}
                        onChange={(e) => setCandidateText(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={5}
                        style={{ width: '100%', padding: 8 }}
                      />
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                        <button type="button" className="btn btnGhost" onClick={() => {
                          if ('speechSynthesis' in window && currentQObj?.text) {
                            try {
                              window.speechSynthesis.cancel();
                              const u = new SpeechSynthesisUtterance(currentQObj.text);
                              window.speechSynthesis.speak(u);
                            } catch {}
                          }
                        }}>Speak question</button>
                        {sttSupported ? (
                          isRecording ? (
                            <button type="button" className="btn btnPrimary" onClick={stopListening}>Stop mic</button>
                          ) : (
                            <button type="button" className="btn btnPrimary" onClick={startListening}>Start mic</button>
                          )
                        ) : (
                          <span style={{ fontSize: 12, color: '#666' }}>Voice input not supported in this browser</span>
                        )}
                      </div>
                    </div>

                    {lastFeedback && (
                      <div style={{ marginTop: 12, padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>AI Feedback</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{lastFeedback}</div>
                      </div>
                    )}

                    {proctorStatus && (
                      <div style={{ marginTop: 12, padding: 10, border: '1px dashed #e5e7eb', borderRadius: 8, fontSize: 14 }}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>Proctoring Status</div>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {'matchScore' in proctorStatus && (
                            <span>Match: {proctorStatus.matchScore?.toFixed?.(2) ?? proctorStatus.matchScore}</span>
                          )}
                          {'multipleFaces' in proctorStatus && (
                            <span>Multiple Faces: {String(proctorStatus.multipleFaces)}</span>
                          )}
                          {'lookingAway' in proctorStatus && (
                            <span>Looking Away: {String(proctorStatus.lookingAway)}</span>
                          )}
                          {'facesCount' in proctorStatus && (
                            <span>Faces: {String(proctorStatus.facesCount)}</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="live-analysis">
                      <h4>Live Analysis</h4>
                      <div className="analysis-metrics">
                        <div className="metric">
                          <span>Confidence Level</span>
                          <div className="metric-bar">
                            <div className="metric-fill" style={{width: '78%'}}></div>
                          </div>
                          <span>78%</span>
                        </div>
                        <div className="metric">
                          <span>Speaking Pace</span>
                          <div className="metric-bar">
                            <div className="metric-fill" style={{width: '85%'}}></div>
                          </div>
                          <span>Good</span>
                        </div>
                        <div className="metric">
                          <span>Eye Contact</span>
                          <div className="metric-bar">
                            <div className="metric-fill" style={{width: '92%'}}></div>
                          </div>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="interview-controls">
                  <button className="btn btnGhost" disabled={loading}>Pause</button>
                  <button onClick={nextQuestion} className="btn btnPrimary" disabled={loading || (!candidateText && !!currentQObj)}>
                    {currentQuestion < questions[interviewType].length - 1 ? 'Next Question' : 'Finish Interview'}
                  </button>
                </div>
              </div>
            </div>
         
        </section>
      )}

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Ace Your Next Interview?</h2>
            <p>Join thousands of professionals who have improved their interview skills with our AI system</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btnPrimary">Create Free Account</Link>
              <Link to="/dashboard" className="btn btnGhost">View Dashboard</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InterviewPractice;
