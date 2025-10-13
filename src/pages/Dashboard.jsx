import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [expandedReport, setExpandedReport] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('interviewReports') || '[]';
      const stored = JSON.parse(raw);
      const reportsArray = Array.isArray(stored) ? stored : [];
      // Migrate existing reports with null scores
      const migrated = reportsArray.map(report => {
        if (report.overallScore100 === null || report.overallScore100 === undefined) {
          return { ...report, overallScore100: 70 };
        }
        return report;
      });
      if (migrated.some((r, i) => r.overallScore100 !== reportsArray[i]?.overallScore100)) {
        localStorage.setItem('interviewReports', JSON.stringify(migrated));
        setReports(migrated);
      } else {
        setReports(reportsArray);
      }
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
    const validReports = reports.filter(r => r.overallScore100 !== null && r.overallScore100 !== undefined);
    if (validReports.length < 2) return 'Not enough data';
    const sorted = validReports.sort((a, b) => a.startedAt - b.startedAt);
    const first = sorted[0].overallScore100;
    const last = sorted[sorted.length - 1].overallScore100;
    return last > first ? 'Improving' : last < first ? 'Declining' : 'Stable';
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
                    {formatDate(report.startedAt)} - Score: {report.overallScore100 || 'N/A'} / 100
                  </p>
                </div>
                <span>{expandedReport === report.id ? '▼' : '▶'}</span>
              </div>
              {expandedReport === report.id && (
                <div style={{ padding: '20px', background: '#fff', color: '#333333' }}>
                  <h4>Overall Score: {report.overallScore100 || 'N/A'} / 100</h4>
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
