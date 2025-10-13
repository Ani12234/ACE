import interviewClient from './interviewClient'

export async function startInterview({ candidateEmail, domainId }) {
  const res = await interviewClient.post('/start', { candidateEmail, domainId })
  // { sessionId, firstQ }
  return res.data
}

export async function submitAnswer({ sessionId, questionId, candidateText }) {
  const res = await interviewClient.post('/answer', { sessionId, questionId, candidateText })
  // { feedback, nextQuestion, progress }
  return res.data
}
