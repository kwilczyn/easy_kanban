import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient, { validateParams } from '@/api/apiClient'
import store from '@/store/store.js'

vi.mock('@/store/store.js', () => {
  return {
    default: {
      commit: vi.fn(),
      dispatch: vi.fn()
    }
  }
})

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  describe('validateParams', () => {
    it('should not throw an error when all parameters are provided and truthy', () => {
      const params = { param1: 'value1', param2: 'value2' }
      expect(() => validateParams(params)).not.toThrow()
    })

    it('should throw an error when a parameter is null', () => {
      const params = { param1: 'value1', param2: null }
      expect(() => validateParams(params)).toThrow('Parametr "param2" is required.')
    })

    it('should throw an error when a parameter is undefined', () => {
      const params = { param1: 'value1', param2: undefined }
      expect(() => validateParams(params)).toThrow('Parametr "param2" is required.')
    })

    it('should throw an error when a parameter is an empty string', () => {
      const params = { param1: 'value1', param2: '' }
      expect(() => validateParams(params)).toThrow('Parametr "param2" is required.')
    })

    it('should throw an error when a parameter is false', () => {
      const params = { param1: 'value1', param2: false }
      expect(() => validateParams(params)).toThrow('Parametr "param2" is required.')
    })

    it('should throw an error when a parameter is 0', () => {
      const params = { param1: 'value1', param2: 0 }
      expect(() => validateParams(params)).toThrow('Parametr "param2" is required.')
    })
  })

  describe('apiClient configuration', () => {
    it('should have the correct baseURL and headers', () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
    })
  })

  describe('apiClient interceptors', () => {
    it('should have a response interceptor', () => {
      expect(apiClient.interceptors.response.handlers.length).toBe(1)
    })

    it('should retry the request with a refreshed token on 401 error', async () => {
      const originalRequest = { url: '/api/test/', method: 'get', headers: {} }
      const error = {
        config: originalRequest,
        response: { status: 401 }
      }
      localStorage.setItem('refreshToken', 'testRefreshToken')
      const refreshTokenPost = vi
        .spyOn(apiClient, 'post')
        .mockResolvedValue({ data: { access: 'refreshedAccessToken' } })
      const retriedRequest = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: 'testData' })

      await apiClient.interceptors.response.handlers[0].rejected(error)
      expect(refreshTokenPost).toHaveBeenCalledWith('/api/token/refresh/', {
        refresh: 'testRefreshToken'
      })
      expect(retriedRequest).toHaveBeenCalledWith({
        ...originalRequest,
        headers: { Authorization: 'Bearer refreshedAccessToken' }
      })
    })

    it('should log out the user on 401 error if the refresh token is not available', async () => {
      const originalRequest = { url: '/api/test/', method: 'get', headers: {} }
      const error = {
        config: originalRequest,
        response: { status: 401 }
      }
      localStorage.removeItem('refreshToken')
      const logoutUser = vi.spyOn(store, 'dispatch')
      await apiClient.interceptors.response.handlers[0].rejected(error)
      expect(logoutUser).toHaveBeenCalledWith('logoutUser')
    })

    it('should log out the user on 401 error if the refresh token is expired', async () => {
      const originalRequest = { url: '/api/test/', method: 'get', headers: {} }
      const error = {
        config: originalRequest,
        response: { status: 401 }
      }
      localStorage.setItem('refreshToken', 'testRefreshToken')
      const refreshTokenPost = vi
        .spyOn(apiClient, 'post')
        .mockRejectedValue({ response: { data: 'testError' } })
      const logoutUser = vi.spyOn(store, 'dispatch')
      await apiClient.interceptors.response.handlers[0].rejected(error)
      expect(refreshTokenPost).toHaveBeenCalledWith('/api/token/refresh/', {
        refresh: 'testRefreshToken'
      })
      expect(logoutUser).toHaveBeenCalledWith('logoutUser')
    })

    it('should not retry refresh token request on 401 error', async () => {
      const originalRequest = { url: '/api/token/refresh/', method: 'post', headers: {} }
      const error = {
        config: originalRequest,
        response: { status: 401 }
      }
      const refreshTokenPost = vi
        .spyOn(apiClient, 'post')
        .mockResolvedValue({ data: { access: 'refreshedAccessToken' } })
      const retriedRequest = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: 'testData' })

      await apiClient.interceptors.response.handlers[0].rejected(error)
      expect(refreshTokenPost).not.toHaveBeenCalled()
      expect(retriedRequest).not.toHaveBeenCalled()
    })
  })
})
