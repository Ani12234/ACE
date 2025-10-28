import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function LearningQuiz() {
  const { topicSlug } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!topicSlug) return;
    let cancelled = false;
    async function run() {
      setLoading(true); setError('');
      try {
        const { data } = await api.get(`/learning/topics/${topicSlug}/quiz`);
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.error || 'Failed to load quiz');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true };
  }, [topicSlug]);

  const score = items.reduce((acc, q) => (
    submitted && typeof answers[q.id] === 'number' && answers[q.id] === q.answerIndex ? acc + 1 : acc
  ), 0);

  if (loading) return <div className="container" style={{ padding:'24px 0' }}>Loading…</div>;
  if (error) return <div className="container" style={{ padding:'24px 0', color:'#f88' }}>{error}</div>;

  return (
    <div className="container" style={{ padding:'24px 0' }}>
      <h1>Quiz</h1>
      {submitted && (
        <div style={{ margin:'8px 0' }}>
          Score: {score} / {items.length}
        </div>
      )}
      <div style={{ display:'grid', gap:16 }}>
        {items.map((q, idx) => (
          <div key={q.id} className="card" style={{ padding:16 }}>
            <div style={{ fontWeight:600, marginBottom:8 }}>{idx+1}. {q.question}</div>
            <div style={{ display:'grid', gap:8 }}>
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                const correct = submitted && i === q.answerIndex;
                const wrong = submitted && selected && i !== q.answerIndex;
                return (
                  <button
                    key={i}
                    className="btn btnGhost"
                    style={{
                      textAlign:'left',
                      justifyContent:'flex-start',
                      border: correct ? '1px solid #16a34a' : wrong ? '1px solid #dc2626' : '1px solid rgba(255,255,255,0.12)',
                      background: selected ? 'rgba(255,255,255,0.08)' : 'transparent'
                    }}
                    disabled={submitted}
                    onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && q.explanation && (
              <div style={{ marginTop:8, fontSize:14, color:'#a6b0c3' }}>{q.explanation}</div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, marginTop:16 }}>
        {!submitted && (
          <button className="btn btnPrimary" onClick={() => setSubmitted(true)} disabled={items.length===0}>Submit</button>
        )}
        {submitted && (
          <button className="btn btnGhost" onClick={() => { setAnswers({}); setSubmitted(false); }}>Retry</button>
        )}
      </div>
    </div>
  );
}
