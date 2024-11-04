import apiClient from './apiClient'

export default {
  registerUser(payload) {
    return apiClient.post('/api/register/', payload)
  }
}
