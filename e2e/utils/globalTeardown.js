import apiClient from '@/api/apiClient.js'

export default async function globalTeardown() {
  apiClient.defaults.baseURL = 'http://localhost:8000/'
  apiClient.get('api/remove_test_users/')
}
