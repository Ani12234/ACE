import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProctorCamera from '../components/ProctorCamera'
import { startInterview as apiStart } from '../api/interview'

export default function ReferenceSetup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [firstQ, setFirstQ] = useState(null)
  const [created, setCreated] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const selectionRaw = localStorage.getItem('userDomainSelection')
        const selection = selectionRaw ? JSON.parse(selectionRaw) : null
        const domainId = selection?.domain?.id || selection?.domain?.name
        if (!domainId) {
          setError('Please select a domain first.')
          navigate('/domain-selection')
          return
        }
        const userRaw = localStorage.getItem('user')
        const user = userRaw ? JSON.parse(userRaw) : null
        const candidateEmail = user?.email || 'candidate@example.com'
        const { sessionId: sid, firstQ: fq } = await apiStart({ candidateEmail, domain: domainId })
        const fqObj = typeof fq === 'string' ? { id: 'q1', text: fq } : fq
        setSessionId(sid)
        setFirstQ({ id: fqObj.id || 'q1', text: fqObj.text || '' })
        // Stash for InterviewPractice to pick up seamlessly
        localStorage.setItem('ace.sessionId', sid)
        localStorage.setItem('ace.firstQ', JSON.stringify({ id: fqObj.id || 'q1', text: fqObj.text || '' }))
      } catch (e) {
        setError('Failed to start session for reference capture.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [navigate])

  useEffect(() => {
    if (created) {
      try { localStorage.setItem('ace.referenceCreated', 'true') } catch {}
      navigate('/interview-practice')
    }
  }, [created, navigate])

  return (
    <div className="container" style={{ padding: 20 }}>
      <h2>Reference Setup</h2>
      {loading && <div>Preparing session…</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      {!loading && !error && (
        <div style={{ marginTop: 12 }}>
          <p>Align your face clearly in frame. We will capture a reference image before the interview starts.</p>
          <ProctorCamera sessionId={sessionId} intervalMs={4000} onStatus={() => {}} onReferenceCreated={() => setCreated(true)} />
          <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>After the reference is created, you will automatically proceed to the interview.</div>
        </div>
      )}
    </div>
  )
}
