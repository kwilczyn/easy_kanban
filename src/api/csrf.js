import apiClient from './apiClient'

export default {
  getCsrfToken() {
    return apiClient.get('/api/csrf-token/')
  }
}
