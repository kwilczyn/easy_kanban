import apiClient from './apiClient'

export default {
  registerUser(payload) {
    return apiClient.post('/api/register/', payload)
  },

  loginUser(credentials) {
    return apiClient.post('/api/token/', credentials)
  }
}
