import React, { useEffect, useRef, useState } from 'react'

export default function MicRecorder({ autoStart = false, onTranscript, onAudioBlob, showControls = true }) {
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const stopRequestedRef = useRef(false)

  useEffect(() => {
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition
    if (SR) {
      const rec = new SR()
      rec.lang = 'en-US'
      rec.continuous = true
      rec.interimResults = true
      rec.onresult = (e) => {
        let final = ''
        let interim = ''
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript
          else interim += e.results[i][0].transcript
        }
        const combined = (final + ' ' + interim).trim()
        if (combined && onTranscript) onTranscript(combined)
      }
      rec.onend = () => {
        if (!stopRequestedRef.current) {
          try { rec.start() } catch {}
          setListening(true)
        }
      }
      rec.onerror = () => {
        if (!stopRequestedRef.current) {
          try { rec.start() } catch {}
          setListening(true)
        }
      }
      recognitionRef.current = rec
    }
    return () => {
      try { recognitionRef.current?.stop?.() } catch {}
    }
  }, [onTranscript])

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream)
    chunksRef.current = []
    mr.ondataavailable = (e) => { if (e.data?.size) chunksRef.current.push(e.data) }
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      onAudioBlob && onAudioBlob(blob)
    }
    mr.start()
    mediaRecorderRef.current = mr
    setListening(true)
    stopRequestedRef.current = false
    try { recognitionRef.current?.start?.() } catch {}
  }

  function stop() {
    stopRequestedRef.current = true
    try { mediaRecorderRef.current?.stop() } catch {}
    try { mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop()) } catch {}
    try { recognitionRef.current?.stop?.() } catch {}
    setListening(false)
  }

  useEffect(() => {
    if (autoStart) start()
    return () => { try { stop() } catch {} }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart])

  if (!showControls) return null
  return (
    <div className="mic-recorder">
      <button onClick={() => (listening ? stop() : start())}>
        {listening ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  )
}
