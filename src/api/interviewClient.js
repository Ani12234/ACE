import axios from 'axios'

// Now served by the main server under /api/interview
const baseURL = import.meta.env.VITE_INTERVIEW_API_BASE_URL || '/api/interview'
const interviewApi = axios.create({ baseURL })

interviewApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('idToken')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export default interviewApi
