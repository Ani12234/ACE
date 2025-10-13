// RAG storage helpers backed by localStorage
const keyFor = (domainId) => `rag:${domainId}`

export function saveDomainText(domainId, text) {
  const existing = loadDomainChunks(domainId)
  const item = { id: Date.now().toString(), text }
  const next = [...existing, item]
  localStorage.setItem(keyFor(domainId), JSON.stringify(next))
  return next
}

export function overwriteDomain(domainId, chunks) {
  localStorage.setItem(keyFor(domainId), JSON.stringify(chunks || []))
}

export function loadDomainChunks(domainId) {
  try {
    const raw = localStorage.getItem(keyFor(domainId))
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
