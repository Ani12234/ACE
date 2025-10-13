// Simple text chunker with overlap
export function chunkText(text, { chunkSize = 900, overlap = 150 } = {}) {
  const clean = (text || '').replace(/\r\n?/g, '\n').trim()
  if (!clean) return []
  const chunks = []
  let i = 0
  while (i < clean.length) {
    const end = Math.min(clean.length, i + chunkSize)
    const slice = clean.slice(i, end)
    chunks.push(slice)
    if (end >= clean.length) break
    i = end - overlap
    if (i < 0) i = 0
  }
  return chunks
}
