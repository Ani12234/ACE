import React, { useMemo, useState } from 'react'
import { chunkText } from '../rag/chunker'
import { loadDomainChunks, overwriteDomain } from '../rag/store'

const DOMAINS = [
  { id: 'web-development', title: 'Web Development' },
  { id: 'machine-learning', title: 'Machine Learning' },
  { id: 'backend-development', title: 'Backend Development' },
  { id: 'fullstack-development', title: 'Full Stack Development' },
  { id: 'data-science', title: 'Data Science' },
  { id: 'cybersecurity', title: 'Cybersecurity' },
]

export default function AdminRag() {
  const [domainId, setDomainId] = useState(DOMAINS[0].id)
  const [rawText, setRawText] = useState('')
  const [status, setStatus] = useState('')
  const existing = useMemo(() => loadDomainChunks(domainId), [domainId])

  const handleIngest = () => {
    setStatus('')
    const chunks = chunkText(rawText, { chunkSize: 900, overlap: 150 }).map((t, i) => ({ id: `${Date.now()}-${i}`, text: t }))
    overwriteDomain(domainId, chunks)
    setStatus(`Ingested ${chunks.length} chunks for ${domainId}.`)
  }

  return (
    <div className="container" style={{ padding: 16 }}>
      <h1>Admin: Upload RAG Content</h1>
      <div style={{ margin: '12px 0' }}>
        <label>Domain:&nbsp;</label>
        <select value={domainId} onChange={(e) => setDomainId(e.target.value)}>
          {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
        </select>
      </div>

      <p>Paste text (from PDF or notes). We'll chunk and store in localStorage for the selected domain.</p>
      <textarea
        placeholder="Paste domain text here..."
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        rows={12}
        style={{ width: '100%', padding: 8 }}
      />
      <div style={{ marginTop: 8 }}>
        <button className="btn btnPrimary" onClick={handleIngest} disabled={!rawText.trim()}>Ingest</button>
      </div>

      {status && <div style={{ marginTop: 8, color: '#0a7' }}>{status}</div>}

      <div style={{ marginTop: 16 }}>
        <h3>Existing Chunks ({existing.length})</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {existing.slice(0, 8).map(c => (
            <div key={c.id} style={{ border: '1px solid #eee', padding: 8, borderRadius: 6, whiteSpace: 'pre-wrap' }}>
              {c.text.slice(0, 300)}{c.text.length > 300 ? '…' : ''}
            </div>
          ))}
          {existing.length > 8 && <div style={{ color: '#666' }}>…and {existing.length - 8} more</div>}
        </div>
      </div>
    </div>
  )
}
