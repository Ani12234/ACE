import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';

export default function LearningTopic() {
  const { courseSlug, topicSlug } = useParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!topicSlug) return;
    let cancelled = false;
    async function run() {
      setLoading(true); setError('');
      try {
        const { data } = await api.get(`/learning/topics/${topicSlug}`);
        if (!cancelled) setTopic(data);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || 'Failed to load topic');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true };
  }, [topicSlug]);

  if (loading) return <div className="container" style={{ padding:'24px 0' }}>Loading…</div>;
  if (error) return <div className="container" style={{ padding:'24px 0', color:'#f88' }}>{error}</div>;
  if (!topic) return <div className="container" style={{ padding:'24px 0' }}>Not found</div>;

  return (
    <div className="container" style={{ padding:'24px 0' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 style={{ margin:0 }}>{topic.title}</h1>
        <Link to={`/learning/${courseSlug}/${topic.slug}/quiz`} className="btn btnPrimary">Take Quiz</Link>
      </div>
      <div className="card" style={{ padding:16 }}>
        {/* Content can be HTML or plain text. Render safely if HTML trusted; otherwise pre-format. */}
        {String(topic.content || '').trim().startsWith('<') ? (
          <div dangerouslySetInnerHTML={{ __html: topic.content }} />
        ) : (
          <pre style={{ whiteSpace:'pre-wrap', margin:0 }}>{topic.content}</pre>
        )}
      </div>
    </div>
  );
}
