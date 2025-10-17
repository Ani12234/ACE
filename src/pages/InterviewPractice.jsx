import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { startInterview as apiStart, submitAnswer as apiSubmit } from '../api/interview';
import ProctorCamera from '../components/ProctorCamera';
import DomainSelection from '../components/DomainSelection';
import interviewClient from '../api/interviewClient';
import api from '../api/client';

gsap.registerPlugin(ScrollTrigger);

function InterviewPractice() {
  // Config: duration to listen per question before auto-submitting
  const ANSWER_WINDOW_MS = 25000; // 25 seconds per question
  const ANSWER_GRACE_MS = 1500;   // small grace before auto-restart or submit
  const heroRef = useRef(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  // Backend-driven state
  const [sessionId, setSessionId] = useState(null);
  const [currentQObj, setCurrentQObj] = useState(null); // { id, text }
  const [candidateText, setCandidateText] = useState('');
  const [progress, setProgress] = useState(null); // { current, total }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFeedback, setLastFeedback] = useState('');
  const [proctorStatus, setProctorStatus] = useState(null); // { ok, matchScore, multipleFaces, lookingAway, headPose, facesCount }
  const [events, setEvents] = useState([]); // malpractice events
  const qaRef = useRef([]); // accumulate { q, a }
  const [finalReport, setFinalReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [notice, setNotice] = useState('');
  const [noFaceNotified, setNoFaceNotified] = useState(false);
  const [lowMatchCount, setLowMatchCount] = useState(0);
  const [showDomainSelection, setShowDomainSelection] = useState(false);
  // Voice: Speech-to-Text (browser Web Speech API) and Text-to-Speech
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const isSubmittingRef = useRef(false);
  const candidateTextRef = useRef('');
  const answerTimerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const lastProctorRef = useRef({ facesCount: null, multipleFaces: null, lookingAway: null });
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

  // Speak the current question aloud when it changes, then auto-start listening
  useEffect(() => {
    candidateTextRef.current = candidateText;
  }, [candidateText]);

  useEffect(() => {
    const text = currentQObj?.text;
    if (!text) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1.0;
        utter.pitch = 1.0;
        utter.onend = () => {
          // Only start listening when not submitting to avoid overlap
          if (!isSubmittingRef.current) startListening();
        };
        window.speechSynthesis.speak(utter);
        setTimeout(() => {
          if (!isSubmittingRef.current && !answerTimerRef.current) startListening();
        }, 1000);
      }
      else {
        if (!isSubmittingRef.current) startListening();
      }
    } catch {}
  }, [currentQObj?.text]);

  // Watch proctor status and raise events for dashboard/deductions
  useEffect(() => {
    if (!proctorStatus) return;
    try {
      const prev = lastProctorRef.current || {};
      const now = proctorStatus;
      if (typeof now.facesCount === 'number') {
        if (now.facesCount === 0 && prev.facesCount !== 0) logEvent('no-face');
        if (now.facesCount > 1 && prev.facesCount !== now.facesCount) logEvent('multiple-faces', { count: now.facesCount });
      }
      if (typeof now.lookingAway === 'boolean' && now.lookingAway && !prev.lookingAway) logEvent('looking-away');
      lastProctorRef.current = { facesCount: now.facesCount, multipleFaces: now.multipleFaces, lookingAway: now.lookingAway };
    } catch {}
  }, [proctorStatus]);

  useEffect(() => {
    const p = proctorStatus || {};
    const score = typeof p.matchScore === 'number' ? p.matchScore : null;
    const low = score !== null && score < 0.85;
    const good = score !== null && score >= 0.85;
    if (low) {
      setLowMatchCount((c) => Math.min(3, c + 1));
    } else if (good) {
      setLowMatchCount(0);
      if (noFaceNotified && notice && notice.startsWith('⚠️ No face')) setNoFaceNotified(false), setNotice('');
    }
    const activelyListening = Boolean(answerTimerRef.current) || isRecording;
    if (!activelyListening && !noFaceNotified && (p.ok === false || (lowMatchCount + (low ? 1 : 0)) >= 2)) {
      setNotice('⚠️ No face detected. Please align your face in the frame with good lighting.');
      setNoFaceNotified(true);
    }
  }, [proctorStatus]);

  const startListening = async () => {
    if (!sttSupported || isRecording) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    recognitionRef.current = rec;
    rec.continuous = false; // fixed window per answer improves stability
    rec.interimResults = true;
    rec.lang = 'en-US';
    let finalText = '';
    const SILENCE_MS = 1200;
    // Clear any previous answer window timer
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
      answerTimerRef.current = null;
    }
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        try { micStream.getTracks().forEach(t => t.stop()); } catch {}
      }
    } catch (e) {
      setNotice('🎙️ Microphone permission is required. Please allow mic access and try again.');
      return;
    }
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + ' ';
        else interim += t;
      }
      const base = finalText.trim();
      const combined = base ? base + (interim ? (' ' + interim) : '') : (candidateTextRef.current || interim);
      candidateTextRef.current = combined;
      setCandidateText(combined);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => { try { rec.stop(); } catch {} }, SILENCE_MS);
    };
    rec.onerror = () => {
      // attempt a quick restart to keep hands-free
      if (!isSubmittingRef.current) setTimeout(() => startListening(), 300);
    };
    rec.onend = () => {
      // Clear timer if it hasn't fired
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current);
        answerTimerRef.current = null;
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      // Auto-advance when user stops speaking and we have content
      if (!isSubmittingRef.current) {
        const finalOnly = (typeof finalText === 'string' ? finalText : '').trim();
        const fallbackCombined = (candidateTextRef.current || '').trim();
        const toSubmit = finalOnly.length > 0 ? finalOnly : fallbackCombined;
        if (toSubmit.length > 0) {
          candidateTextRef.current = toSubmit;
          setCandidateText(toSubmit);
          nextQuestion();
        } else {
          setTimeout(() => startListening(), 300);
        }
      }
    };
    try { rec.start(); } catch (e) { setNotice('🎙️ Microphone permission is required. Please allow mic access and try again.'); return; }
    setIsRecording(true);
    // Schedule auto-stop and submit after the fixed answer window
    answerTimerRef.current = setTimeout(() => {
      if (!isSubmittingRef.current) {
        try { stopListening(); } catch {}
        const candidate = (candidateTextRef.current || '').trim();
        if (candidate.length > 0) {
          nextQuestion();
        } else {
          // Do not submit an empty answer. Prompt and restart listening.
          setNotice('🎤 No answer captured. Please speak or type your answer.');
          setTimeout(() => startListening(), 500);
        }
      }
    }, ANSWER_WINDOW_MS + ANSWER_GRACE_MS);
  };

  useEffect(() => {
    if (!isInterviewActive) return;
    if (!currentQObj?.id) return;
    if (isSubmittingRef.current) return;
    if (answerTimerRef.current) return;
    setTimeout(() => {
      if (!isSubmittingRef.current && !answerTimerRef.current) startListening();
    }, 600);
  }, [isInterviewActive, currentQObj?.id]);

  useEffect(() => {
    if (!isInterviewActive) return;
    const iv = setInterval(() => {
      if (!isSubmittingRef.current && !answerTimerRef.current && sttSupported && !isRecording && currentQObj?.id) {
        startListening();
      }
    }, 1500);
    return () => clearInterval(iv);
  }, [isInterviewActive, sttSupported, currentQObj?.id, isRecording]);

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec && isRecording) {
      try { rec.stop(); } catch {}
    }
    setIsRecording(false);
  };

  const beginInterviewWithDomain = async (domainId) => {
    // Using stored user email if available
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const candidateEmail = user?.email || 'candidate@example.com';
    const { sessionId: sid, firstQ } = await apiStart({ candidateEmail, domainId });
    if (!sid || !firstQ) throw new Error('Invalid response from server');
    const fq = typeof firstQ === 'string' ? { id: 'q1', text: firstQ } : firstQ;
    setSessionId(sid);
    setCurrentQObj({ id: fq.id || 'q1', text: fq.text || '' });
    setCandidateText('');
    setProgress({ current: 0, total: 6 });
    setIsInterviewActive(true);
    setCurrentQuestion(0); // keep local progress bar working
    qaRef.current = [];
    setEvents([]);
    // Attach malpractice listeners
    const onBlur = () => logEvent('tab-switch');
    const onVis = () => { if (document.visibilityState !== 'visible') logEvent('tab-hidden'); };
    const onFs = () => { if (!document.fullscreenElement) logEvent('exit-fullscreen'); };
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('fullscreenchange', onFs);
    // Save detach for endInterview
    detachListenersRef.current = () => {
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('fullscreenchange', onFs);
    };
  };

  const startInterview = async () => {
    setError('');
    setLastFeedback('');
    setLoading(true);
    try {
      // Enter full screen
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
      } catch {}
      // Always open domain selection to pick domain for this session
      setShowDomainSelection(true);
      setLoading(false);
      return;
    } catch (e) {
      setError('Failed to start interview. Please check the interview server.');
      console.error(e);
    } finally {
      // loading is already turned off when modal opens
    }
  };

  const nextQuestion = async () => {
    // If using backend, submit answer and fetch next question
    if (sessionId && currentQObj?.id) {
      isSubmittingRef.current = true;
      // ensure mic is off during submit to avoid overlap
      try { stopListening(); } catch {}
      // Clear any pending timer for previous question
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current);
        answerTimerRef.current = null;
      }
      setLoading(true);
      setError('');
      try {
        const trimmedAnswer = (candidateText ?? '').trim();
        const payloadAnswer = trimmedAnswer.length ? trimmedAnswer : '(no answer)';
        const serverRes = await apiSubmit({
          sessionId,
          questionId: currentQObj.id,
          candidateText: payloadAnswer,
        });
        const nextQ = serverRes?.nextQuestion ?? serverRes?.question ?? serverRes?.questionText;
        const p = serverRes?.progress;
        const feedback = serverRes?.feedback;
        // accumulate Q/A
        qaRef.current.push({ q: currentQObj.text, a: payloadAnswer });
        // Update UI
        if (p) setProgress(p);
        let fbText = '';
        if (typeof feedback === 'string') fbText = feedback;
        else if (feedback && typeof feedback === 'object') fbText = feedback.summary || JSON.stringify(feedback);
        setLastFeedback(fbText);
        setCandidateText('');
        if (nextQ) {
          const qObj = typeof nextQ === 'string' ? { id: `q${(p?.current ?? currentQuestion)+1}`, text: nextQ } : nextQ;
          setCurrentQObj({ id: qObj.id || `q${(p?.current ?? currentQuestion)+1}`, text: qObj.text || '' });
          // keep legacy progress bar moving
          setCurrentQuestion((prev) => prev + 1);
          // restart listening for the next answer after UI updates
          setTimeout(() => { if (!isRecording) startListening(); }, 250);
        } else {
          // No next question: end interview
          endInterview();
        }
      } catch (e) {
        setError('Failed to submit answer. Please try again.');
        console.error(e);
      } finally {
        isSubmittingRef.current = false;
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

  const detachListenersRef = useRef(() => {});
  const endInterview = async () => {
    try {
      // stop mic and mark submitting
      try { stopListening(); } catch {}
      isSubmittingRef.current = true;
      setFinalizing(true);
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current);
        answerTimerRef.current = null;
      }

      // Final scoring (canonical)
      let finalReportLocal = null;
      if (sessionId) {
        try {
          await api.post('/scoring/final/start', {
            sessionId,
            qa: qaRef.current.map(x => ({ question: x.q, answer: x.a })),
            proctor: {
              integrity: proctorStatus?.matchScore ?? null,
              stats: proctorStatus,
              events,
            },
          }, { timeout: 10000 });

          const startedAt = Date.now();
          const TIMEOUT_MS = 30000;
          const SLEEP = (ms) => new Promise(r => setTimeout(r, ms));
          while (Date.now() - startedAt < TIMEOUT_MS) {
            try {
              const { data } = await api.get(`/scoring/report/${encodeURIComponent(sessionId)}?ts=${Date.now()}`, { timeout: 8000 });
              if (data?.ready && data?.report) {
                setFinalReport(data.report);
                finalReportLocal = data.report;
                setShowReport(true);
                break;
              }
            } catch {}
            await SLEEP(1000);
          }
          if (!finalReportLocal) {
            console.warn('scoring/report not ready within timeout');
          }
        } catch (e) {
          console.warn('scoring/final/start failed', e?.message || e);
        }
      }
      // Save report locally
      // gather domain selection metadata if available
      let domainMeta = null;
      try {
        const selectionRaw = localStorage.getItem('userDomainSelection');
        domainMeta = selectionRaw ? JSON.parse(selectionRaw) : null;
      } catch {}

      const report = {
        id: `${Date.now()}`,
        sessionId: sessionId || null,
        startedAt: Date.now(),
        finishedAt: Date.now(),
        qa: qaRef.current.slice(),
        events,
        proctorLast: proctorStatus,
        interviewType,
        difficulty,
        domain: domainMeta?.domain || null,
        overallScore100: finalReportLocal?.overall_score_100 ?? (typeof finalReportLocal?.overall_score_10 === 'number' ? Math.round(finalReportLocal.overall_score_10 * 10) : undefined),
        strengths: finalReportLocal?.strengths || null,
        weaknesses: finalReportLocal?.weaknesses || null,
        improvements: finalReportLocal?.improvements || null,
      };
      try {
        const key = 'interviewReports';
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.push(report);
        localStorage.setItem(key, JSON.stringify(arr));
      } catch {}
    } finally {
      isSubmittingRef.current = false;
      setFinalizing(false);
      // cleanup state
      setIsInterviewActive(false);
      setSessionId(null);
      setCurrentQObj(null);
      setCandidateText('');
      setProgress(null);
      setLoading(false);
      setError('');
      // detach listeners
      try { detachListenersRef.current(); } catch {}
      // exit fullscreen
      try { if (document.exitFullscreen) await document.exitFullscreen(); } catch {}
    }
  };

  // Log malpractice events and send to server (best effort)
  const logEvent = async (type, payload = {}) => {
    // Severity mapping for deductions and styling
    const severity = (
      type === 'tab-switch' || type === 'exit-fullscreen' || type === 'no-face' || type === 'multiple-faces'
    ) ? 'high' : (type === 'looking-away' ? 'medium' : 'low');

    const ev = { type, severity, payload, at: Date.now() };
    setEvents((prev) => [...prev, ev]);

    // Notification messages with emojis for better UX
    const msgMap = {
      'tab-switch': '⚠️ Tab switch detected. Please return to the interview tab.',
      'tab-hidden': '⚠️ Tab hidden. Please keep this tab active.',
      'exit-fullscreen': '⚠️ Fullscreen exited. Please return to fullscreen mode.',
      'no-face': '👤 No face detected. Please position yourself in frame.',
      'multiple-faces': '👥 Multiple faces detected. Ensure only you are visible.',
      'looking-away': '👀 Please maintain eye contact with the camera.',
    };

    const noticeText = msgMap[type] || 'Proctoring event detected.';
    setNotice(noticeText);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      if (notice === noticeText) {
        setNotice('');
      }
    }, 3000);

    // Log event to server (best effort)
    if (sessionId) {
      try {
        await interviewClient.post('/event', { sessionId, type, payload, severity });
      } catch (e) {
        console.error('Failed to log event:', e);
      }
    }
  };

  return (
    <div className="interview-practice-page">
      {/* Notice Toast */}
      {notice && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#1a1a1a',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          borderLeft: '4px solid ' + (
            notice.includes('⚠️') ? '#ff4d4f' :
            notice.includes('👤') || notice.includes('👥') ? '#faad14' : '#52c41a'
          ),
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '320px'
        }}>
          <span style={{ fontSize: '18px' }}>{
            notice.startsWith('⚠️') ? '⚠️' :
            notice.startsWith('👤') ? '👤' :
            notice.startsWith('👥') ? '👥' : '👀'
          }</span>
          <span>{notice.replace(/^[^\w\s]+/, '')}</span>
        </div>
      )}
      {/* Finalizing Overlay */}
      {finalizing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 55 }}>
          <div style={{ background: '#fff', color: '#111', padding: 16, borderRadius: 10, minWidth: 220, textAlign: 'center', boxShadow: '0 10px 24px rgba(0,0,0,0.25)' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Finalizing Interview</div>
            <div style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>Processing your scores and generating report…</div>
            <div style={{ fontSize: 12, color: '#888' }}>This should take no more than 10 seconds.</div>
          </div>
        </div>
      )}
      {showReport && finalReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', color: '#111', padding: 20, borderRadius: 10, maxWidth: 700, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Final Report</h3>
            <div style={{ marginBottom: 10 }}>
              <strong>Overall Score:</strong> {finalReport.overall_score_100 ?? Math.round((finalReport.overall_score_10 || 0) * 10)} / 100
            </div>
            <div style={{ marginBottom: 12, fontSize: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><strong>Interview Type:</strong> {interviewType}</div>
              <div><strong>Difficulty:</strong> {difficulty}</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Domain:</strong> {(() => { try { const s = JSON.parse(localStorage.getItem('userDomainSelection')||'null'); return s?.domain?.name || s?.domain?.id || 'N/A'; } catch { return 'N/A'; } })()}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <h4>Strengths</h4>
                <ul>
                  {(finalReport.strengths || []).map((s, i) => (<li key={`str-${i}`}>{s}</li>))}
                </ul>
              </div>
              <div>
                <h4>Weaknesses</h4>
                <ul>
                  {(finalReport.weaknesses || []).map((w, i) => (<li key={`weak-${i}`}>{w}</li>))}
                </ul>
              </div>
            </div>
            <div>
              <h4>Improvements</h4>
              <ul>
                {(finalReport.improvements || []).map((imp, i) => (<li key={`imp-${i}`}>{imp}</li>))}
              </ul>
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btnPrimary" onClick={() => setShowReport(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Inline Domain Selection Modal */}
      <DomainSelection
        isOpen={showDomainSelection}
        onClose={() => setShowDomainSelection(false)}
        onDomainSelect={(payload) => {
          try {
            localStorage.setItem('userDomainSelection', JSON.stringify(payload));
          } catch {}
          setShowDomainSelection(false);
          if (payload?.domain?.id) {
            beginInterviewWithDomain(payload.domain.id);
          }
        }}
      />
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
                      paused={Boolean(answerTimerRef.current) || isRecording || isSubmittingRef.current}
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
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        {sttSupported ? (
                          <span style={{ fontSize: 12, color: '#666' }}>{answerTimerRef.current ? 'Listening…' : 'Mic idle'}</span>
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
                  <button onClick={endInterview} className="btn btnPrimary" disabled={loading || finalizing}>
                    {finalizing ? 'Processing…' : 'Finish Interview'}
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
