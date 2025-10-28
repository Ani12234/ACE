import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [expandedReport, setExpandedReport] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('interviewReports') || '[]';
      const stored = JSON.parse(raw);
      const reportsArray = Array.isArray(stored) ? stored : [];
      setReports(reportsArray);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setReports([]);
    }
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const syncWithServer = async (id, sessionId) => {
    if (!sessionId) return;
    try {
      const { data } = await api.get(`/scoring/report/${encodeURIComponent(sessionId)}?ts=${Date.now()}`);
      if (data?.ready && data?.report) {
        const updated = reports.map(r => {
          if (r.id !== id) return r;
          return {
            ...r,
            overallScore100: data.report.overall_score_100 ?? (typeof data.report.overall_score_10 === 'number' ? Math.round(data.report.overall_score_10 * 10) : r.overallScore100),
            strengths: data.report.strengths || r.strengths,
            weaknesses: data.report.weaknesses || r.weaknesses,
            improvements: data.report.improvements || r.improvements,
          };
        });
        setReports(updated);
        try { localStorage.setItem('interviewReports', JSON.stringify(updated)); } catch {}
        alert('Report synced from server.');
      } else {
        alert('Report not ready on server yet. Try again in a few seconds.');
      }
    } catch (e) {
      alert('Failed to sync report: ' + (e?.response?.data?.error || e?.message || 'unknown error'));
    }
  };

  const toggleExpand = (id) => {
    setExpandedReport(expandedReport === id ? null : id);
  };

  const getAverageScore = () => {
    const validScores = reports.filter(r => r.overallScore100 !== null && r.overallScore100 !== undefined).map(r => r.overallScore100);
    if (validScores.length === 0) return 0;
    const total = validScores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / validScores.length);
  };

  const getScoreTrend = () => {
    const validReports = reports
      .filter(r => r.overallScore100 !== null && r.overallScore100 !== undefined)
      .sort((a, b) => {
        const timeA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
        const timeB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
        return timeA - timeB;
      });
    
    if (validReports.length < 2) return 'N/A';
    
    // Compare last 3 to first 3 for trend calculation
    const recent = validReports.slice(-3).map(r => r.overallScore100);
    const older = validReports.slice(0, 3).map(r => r.overallScore100);
    
    const recentAvg = recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg = older.reduce((sum, score) => sum + score, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    
    if (Math.abs(diff) < 2) return '→ Stable';
    if (diff > 0) return `↑ +${Math.round(diff)}`;
    return `↓ ${Math.round(diff)}`;
  };

  const deleteReport = (id) => {
    if (window.confirm('Are you sure you want to delete this interview report? This action cannot be undone.')) {
      const updatedReports = reports.filter(report => report.id !== id);
      localStorage.setItem('interviewReports', JSON.stringify(updatedReports));
      setReports(updatedReports);
      if (expandedReport === id) setExpandedReport(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', color: '#ffffff' }}>
      <h1>Interview Dashboard</h1>
      <p>Review your past interview sessions, track progress, and analyze performance.</p>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#333333' }}>
          <h3>Total Sessions</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{reports.length}</p>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#333333' }}>
          <h3>Average Score</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{getAverageScore()} / 100</p>
        </div>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', color: '#333333' }}>
          <h3>Progress Trend</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{getScoreTrend()}</p>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <p>No interview reports found. Complete an interview to see your data here!</p>
      ) : (
        <div>
          <h2>Past Interviews</h2>
          {reports.map((report) => (
            <div key={report.id} style={{ border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', overflow: 'hidden', backgroundColor: '#ffffff', color: '#333333' }}>
              <div
                style={{
                  padding: '15px',
                  background: '#f9f9f9',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => toggleExpand(report.id)}
              >
                <div>
                  <h3 style={{ margin: 0 }}>
                    {report.interviewType} Interview - {report.difficulty}
                    {report.domain && ` (${report.domain?.name || report.domain?.id || 'N/A'})`}
                  </h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    {formatDate(report.startedAt)} - Score: {report.overallScore100 !== null && report.overallScore100 !== undefined ? report.overallScore100 : 'N/A'} / 100
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {report.sessionId && (
                    <button
                      onClick={(e) => { e.stopPropagation(); syncWithServer(report.id, report.sessionId); }}
                      style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Sync
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReport(report.id);
                    }}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                  <span>{expandedReport === report.id ? '▼' : '▶'}</span>
                </div>
              </div>
              {expandedReport === report.id && (
                <div style={{ padding: '20px', background: '#fff', color: '#333333' }}>
                  <h4>Overall Score: {report.overallScore100 !== null && report.overallScore100 !== undefined ? report.overallScore100 : 'N/A'} / 100</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <h5>Strengths</h5>
                      <ul>
                        {(report.strengths || []).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5>Weaknesses</h5>
                      <ul>
                        {(report.weaknesses || []).map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <h5>Improvements</h5>
                    <ul>
                      {(report.improvements || []).map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5>Q&A Summary</h5>
                    {(report.qa || []).map((qa, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <p><strong>Q{i + 1}:</strong> {qa.q}</p>
                        <p><strong>A{i + 1}:</strong> {qa.a}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <h5>Proctor Events</h5>
                    <ul>
                      {(report.events || []).map((event, i) => (
                        <li key={i}>{event.type} ({event.severity}) - {formatDate(event.at)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link to="/features" style={{ color: '#ffffff', textDecoration: 'none' }}>
          ← Back to Features
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
