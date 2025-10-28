import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';

export default function LearningCourse() {
  const { courseSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseSlug) return;
    let cancelled = false;
    async function run() {
      setLoading(true); setError('');
      try {
        const { data } = await api.get(`/learning/courses/${courseSlug}`);
        if (!cancelled) {
          setCourse(data.course);
          setTopics(Array.isArray(data.topics) ? data.topics : []);
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || 'Failed to load course');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true };
  }, [courseSlug]);

  if (loading) return <div className="container" style={{ padding:'24px 0' }}>Loading…</div>;
  if (error) return <div className="container" style={{ padding:'24px 0', color:'#f88' }}>{error}</div>;
  if (!course) return <div className="container" style={{ padding:'24px 0' }}>Not found</div>;

  return (
    <div className="container" style={{ padding:'24px 0' }}>
      <h1>{course.title}</h1>
      <p className="muted" style={{ marginBottom: 16 }}>{course.description}</p>
      <div style={{ display:'flex', gap:8, marginBottom: 16, flexWrap:'wrap' }}>
        <span style={{ fontSize:12, padding:'4px 8px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6 }}>Domain: {course.domain}</span>
        {Array.isArray(course.tags) && course.tags.map(t => (
          <span key={t} style={{ fontSize:12, padding:'4px 8px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6 }}>{t}</span>
        ))}
      </div>

      <h2 className="section-title">Topics</h2>
      {topics.length === 0 && <div className="muted">No topics yet.</div>}
      <div style={{ display:'grid', gap:12 }}>
        {topics.map(t => (
          <Link key={t.id} to={`/learning/${course.slug}/${t.slug}`} className="card" style={{ textDecoration:'none', color:'inherit', padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h3 style={{ margin:0 }}>{t.order}. {t.title}</h3>
              <span className="btn btnGhost">Read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
