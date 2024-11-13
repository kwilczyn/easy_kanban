import axios from 'axios'
import store from '@/store/store'

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (originalRequest.url == '/api/token/') {
      return Promise.reject(error)
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Try refreshing token
        if (
          !localStorage.getItem('refreshToken') ||
          originalRequest.url.includes('/api/token/refresh/')
        ) {
          logoutAndSetError()
          return
        }
        const response = await apiClient.post('/api/token/refresh/', {
          refresh: localStorage.getItem('refreshToken')
        })
        store.commit('setToken', {
          access: response.data.access,
          refresh: localStorage.getItem('refreshToken')
        })

        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access

        return apiClient.request(originalRequest)
      } catch (err) {
        if (err.response) {
          logoutAndSetError()
          return
        }
        return Promise.reject(error)
      }
    } else {
      store.commit('setCommunicationError', error)
      return Promise.reject(error)
    }
  }
)

function logoutAndSetError() {
  console.warn('User session has expired. Logging out...')
  store.commit('setLoginError', 'Sorry but user session has expired. Please log in again.')
  store.dispatch('logoutUser')
}

export default apiClient

export function validateParams(params) {
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      throw new Error(`Parametr "${key}" is required.`)
    }
  }
}
