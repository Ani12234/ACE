// Extremely simple keyword-based retriever over chunks
export function scoreChunk(query, chunk) {
  const q = (query || '').toLowerCase()
  const c = (chunk || '').toLowerCase()
  if (!q || !c) return 0
  const terms = q.split(/[^a-z0-9]+/).filter(Boolean)
  let score = 0
  for (const t of terms) {
    const count = c.split(t).length - 1
    score += count
  }
  return score
}

export function topKChunks(query, chunks, k = 3) {
  return (chunks || [])
    .map((text, idx) => ({ id: idx, text, score: scoreChunk(query, text) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}
