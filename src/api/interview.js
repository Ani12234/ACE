import interviewClient from './interviewClient'

export async function startInterview({ candidateEmail, domain }) {
  const res = await interviewClient.post('/start', { candidateEmail, domain })
  // { sessionId, firstQ }
  return res.data
}

export async function submitAnswer({ sessionId, questionId, candidateText }) {
  const res = await interviewClient.post('/answer', { sessionId, questionId, candidateText })
  // { feedback, nextQuestion, progress }
  return res.data
}
