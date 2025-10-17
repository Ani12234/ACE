import React, { useState, useMemo } from 'react'
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
  const [activeTab, setActiveTab] = useState('upload')
  const [domainId, setDomainId] = useState(DOMAINS[0].id)
  const [rawText, setRawText] = useState('')
  const [status, setStatus] = useState('')

  // PDF Upload state
  const [files, setFiles] = useState([])
  const [adminToken, setAdminToken] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // RAG Query state
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [isQuerying, setIsQuerying] = useState(false)

  const existing = useMemo(() => loadDomainChunks(domainId), [domainId])

  const handleIngest = () => {
    setStatus('')
    const chunks = chunkText(rawText, { chunkSize: 900, overlap: 150 }).map((t, i) => ({ id: `${Date.now()}-${i}`, text: t }))
    overwriteDomain(domainId, chunks)
    setStatus(`Ingested ${chunks.length} chunks for ${domainId}.`)
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async (useAdminEndpoint = false) => {
    if (files.length === 0) {
      setUploadStatus('Please select PDF files to upload.')
      return
    }

    if (useAdminEndpoint && !adminToken.trim()) {
      setUploadStatus('Admin token is required for admin uploads.')
      return
    }

    setIsUploading(true)
    setUploadStatus(`Uploading ${files.length} file(s)...`)

    try {
      const formData = new FormData()
      formData.append('domain', domainId)
      files.forEach(file => formData.append('files', file))

      const endpoint = useAdminEndpoint ? '/api/admin/rag/ingest' : '/api/rag/ingest'
      const headers = {
        'Content-Type': 'multipart/form-data'
      }

      if (useAdminEndpoint) {
        headers['x-admin-token'] = adminToken.trim()
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      setUploadStatus(`Successfully uploaded ${files.length} file(s)`)
      setFiles([])
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const queryRag = async () => {
    if (!question.trim()) return

    setIsQuerying(true)
    setAnswer('')
    setSources([])

    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain: domainId,
          question: question.trim()
        })
      })

      if (!response.ok) {
        throw new Error(`Query failed: ${response.statusText}`)
      }

      const result = await response.json()
      setAnswer(result.answer || 'No answer received')
      setSources(result.sources || [])
    } catch (error) {
      setAnswer(`Query failed: ${error.message}`)
    } finally {
      setIsQuerying(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="container" style={{ padding: 16 }}>
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Admin Panel - PDF & Content Management</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Upload PDFs, manage RAG content, and test queries</p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        backgroundColor: '#34495e',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden'
      }}>
        {[
          { key: 'upload', label: '📁 PDF Upload', icon: '📁' },
          { key: 'admin-upload', label: '🔐 Admin Upload', icon: '🔐' },
          { key: 'text-ingest', label: '📝 Text Ingest', icon: '📝' },
          { key: 'rag-query', label: '🔍 RAG Query', icon: '🔍' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '15px',
              backgroundColor: activeTab === tab.key ? '#3498db' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.key ? 'bold' : 'normal',
              transition: 'background-color 0.3s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '0 0 8px 8px',
        padding: '30px'
      }}>
        {/* PDF Upload Tab */}
        {activeTab === 'upload' && (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>📁 Standard PDF Upload</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Domain:
              </label>
              <select
                value={domainId}
                onChange={(e) => setDomainId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              >
                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                PDF Files:
              </label>
              <div
                style={{
                  border: '2px dashed #ddd',
                  borderRadius: '4px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <div style={{ marginBottom: '10px' }}>
                  📄 Click to select PDF files or drag and drop
                </div>
                <input
                  type="file"
                  id="file-upload"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {files.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <h4>Selected Files ({files.length}):</h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px',
                          backgroundColor: '#f8f9fa',
                          marginBottom: '5px',
                          borderRadius: '4px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => uploadFiles(false)}
              disabled={isUploading || files.length === 0}
              style={{
                backgroundColor: isUploading ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {isUploading ? '⏳ Uploading...' : `📤 Upload ${files.length} File(s)`}
            </button>

            {uploadStatus && (
              <div
                style={{
                  marginTop: '15px',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: uploadStatus.includes('failed') || uploadStatus.includes('Failed') ? '#f8d7da' : '#d4edda',
                  color: uploadStatus.includes('failed') || uploadStatus.includes('Failed') ? '#721c24' : '#155724',
                  border: `1px solid ${uploadStatus.includes('failed') || uploadStatus.includes('Failed') ? '#f5c6cb' : '#c3e6cb'}`
                }}
              >
                {uploadStatus}
              </div>
            )}
          </div>
        )}

        {/* Admin Upload Tab */}
        {activeTab === 'admin-upload' && (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🔐 Admin PDF Upload</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Admin Token:
              </label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Enter admin token"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Domain:
              </label>
              <select
                value={domainId}
                onChange={(e) => setDomainId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              >
                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                PDF Files:
              </label>
              <div
                style={{
                  border: '2px dashed #ddd',
                  borderRadius: '4px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('admin-file-upload')?.click()}
              >
                <div style={{ marginBottom: '10px' }}>
                  📄 Click to select PDF files or drag and drop
                </div>
                <input
                  type="file"
                  id="admin-file-upload"
                  accept="application/pdf"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {files.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <h4>Selected Files ({files.length}):</h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px',
                          backgroundColor: '#f8f9fa',
                          marginBottom: '5px',
                          borderRadius: '4px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{file.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          style={{
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => uploadFiles(true)}
              disabled={isUploading || files.length === 0 || !adminToken.trim()}
              style={{
                backgroundColor: isUploading || !adminToken.trim() ? '#95a5a6' : '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: isUploading || !adminToken.trim() ? 'not-allowed' : 'pointer',
                width: '100%'
              }}
            >
              {isUploading ? '⏳ Uploading...' : `🔐 Admin Upload ${files.length} File(s)`}
            </button>

            {uploadStatus && (
              <div
                style={{
                  marginTop: '15px',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: uploadStatus.includes('failed') || uploadStatus.includes('Failed') ? '#f8d7da' : '#d4edda',
                  color: uploadStatus.includes('failed') || uploadStatus.includes('Failed') ? '#721c24' : '#155724',
                  border: `1px solid ${uploadStatus.includes('failed') || uploadStatus.includes('Failed') ? '#f5c6cb' : '#c3e6cb'}`
                }}
              >
                {uploadStatus}
              </div>
            )}
          </div>
        )}

        {/* Text Ingest Tab */}
        {activeTab === 'text-ingest' && (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>📝 Text Content Ingest</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Domain:
              </label>
              <select
                value={domainId}
                onChange={(e) => setDomainId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              >
                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Text Content:
              </label>
              <textarea
                placeholder="Paste text content here (from PDF, notes, etc.)..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={12}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              onClick={handleIngest}
              disabled={!rawText.trim()}
              style={{
                backgroundColor: rawText.trim() ? '#3498db' : '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: rawText.trim() ? 'pointer' : 'not-allowed',
                width: '100%'
              }}
            >
              📝 Ingest Text Content
            </button>

            {status && (
              <div
                style={{
                  marginTop: '15px',
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  border: '1px solid #c3e6cb'
                }}
              >
                {status}
              </div>
            )}

            <div style={{ marginTop: '20px' }}>
              <h3>Existing Chunks ({existing.length})</h3>
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'grid',
                gap: '8px'
              }}>
                {existing.slice(0, 8).map(chunk => (
                  <div
                    key={chunk.id}
                    style={{
                      border: '1px solid #eee',
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#f8f9fa',
                      whiteSpace: 'pre-wrap',
                      fontSize: '14px'
                    }}
                  >
                    {chunk.text.slice(0, 300)}{chunk.text.length > 300 ? '…' : ''}
                  </div>
                ))}
                {existing.length > 8 && (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                    …and {existing.length - 8} more chunks
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RAG Query Tab */}
        {activeTab === 'rag-query' && (
          <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🔍 RAG Query Interface</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Domain:
              </label>
              <select
                value={domainId}
                onChange={(e) => setDomainId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              >
                {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Question:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the uploaded content..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              onClick={queryRag}
              disabled={isQuerying || !question.trim()}
              style={{
                backgroundColor: isQuerying || !question.trim() ? '#95a5a6' : '#9b59b6',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: isQuerying || !question.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {isQuerying ? '⏳ Querying...' : '🔍 Query RAG'}
            </button>

            {answer && (
              <div style={{ marginTop: '20px' }}>
                <h3>Answer:</h3>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: '4px solid #9b59b6',
                  whiteSpace: 'pre-wrap',
                  fontSize: '16px'
                }}>
                  {answer}
                </div>
              </div>
            )}

            {sources.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3>Sources:</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {sources.map((source, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: '15px',
                        padding: '10px',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <strong>Source {index + 1}</strong>
                        <span style={{ color: '#666' }}>
                          Score: {typeof source.score === 'number' ? source.score.toFixed(3) : 'N/A'}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#555' }}>
                        {source.text.length > 400
                          ? `${source.text.substring(0, 400)}...`
                          : source.text
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
