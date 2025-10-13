import React, { useEffect, useRef, useState } from 'react'
import { createReference, verifyFrame } from '../api/vision'

// Simple webcam proctoring component
// - Requests camera access
// - Captures an initial reference frame and stores embedding for the session
// - Periodically verifies live frames against the stored reference via YOLO/vision service
export default function ProctorCamera({ sessionId, intervalMs = 4000, onStatus }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const timerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [creatingRef, setCreatingRef] = useState(false)
  const [createdRef, setCreatedRef] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [error, setError] = useState('')

  // Start webcam
  useEffect(() => {
    let stream
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setReady(true)
        }
      } catch (e) {
        setError('Camera access denied or unavailable')
      }
    }
    start()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (stream) {
        stream.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const retryCamera = async () => {
    setError('')
    setReady(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setReady(true)
      }
    } catch (e) {
      setError('Camera access denied or unavailable')
    }
  }

  // Convert current video frame to base64 PNG
  const snapshotBase64 = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null
    const w = video.videoWidth || 640
    const h = video.videoHeight || 480
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, w, h)
    const dataUrl = canvas.toDataURL('image/png')
    return dataUrl.replace(/^data:image\/png;base64,/, '')
  }

  // Create reference once ready and sessionId available
  useEffect(() => {
    if (!ready || !sessionId || createdRef || creatingRef) return
    let cancelled = false
    async function createRef() {
      try {
        setCreatingRef(true)
        const imageBase64 = snapshotBase64()
        if (!imageBase64) throw new Error('No frame')
        const resp = await createReference({ sessionId, imageBase64 })
        if (!cancelled) {
          if (resp && (resp.ok === true || resp.refId || resp.embedding)) {
            setCreatedRef(true)
            setError('')
          } else {
            setError('Failed to create reference image')
          }
        }
      } catch (e) {
        if (!cancelled) {
          const code = e?.response?.status
          if (code === 503) setError('Vision service unavailable')
          else setError('Failed to create reference image')
        }
      } finally {
        if (!cancelled) setCreatingRef(false)
      }
    }
    createRef()
    return () => { cancelled = true }
  }, [ready, sessionId, createdRef, creatingRef])

  // Periodic verification
  useEffect(() => {
    if (!ready || !sessionId || !createdRef) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(async () => {
      try {
        const imageBase64 = snapshotBase64()
        if (!imageBase64) return
        const res = await verifyFrame({ sessionId, imageBase64 })
        setLastResult(res)
        onStatus && onStatus(res)
      } catch (e) {
        // transient errors are expected if service is warming up
      }
    }, intervalMs)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [ready, sessionId, createdRef, intervalMs, onStatus])

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <video ref={videoRef} playsInline muted style={{ width: 260, height: 195, background: '#000', borderRadius: 6 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Proctoring</div>
          {error && (
            <div style={{ color: 'crimson', marginBottom: 8 }}>
              {error}
              <div>
                <button onClick={retryCamera} className="btn btnGhost" style={{ marginTop: 6 }}>Retry camera</button>
              </div>
            </div>
          )}
          <div style={{ fontSize: 14, color: '#555' }}>
            <div>Status: {ready ? (createdRef ? 'Reference created • Verifying' : (creatingRef ? 'Creating reference...' : 'Ready')) : 'Initializing camera...'}</div>
            {lastResult && (
              <ul style={{ marginTop: 8 }}>
                {'ok' in lastResult && <li>OK: {String(lastResult.ok)}</li>}
                {'matchScore' in lastResult && <li>Match Score: {lastResult.matchScore?.toFixed?.(2) ?? lastResult.matchScore}</li>}
                {'multipleFaces' in lastResult && <li>Multiple Faces: {String(lastResult.multipleFaces)}</li>}
                {'lookingAway' in lastResult && <li>Looking Away: {String(lastResult.lookingAway)}</li>}
                {'headPose' in lastResult && <li>Head Pose: {JSON.stringify(lastResult.headPose)}</li>}
                {'facesCount' in lastResult && <li>Faces Count: {String(lastResult.facesCount)}</li>}
              </ul>
            )}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
