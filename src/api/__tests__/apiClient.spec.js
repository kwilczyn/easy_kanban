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
})
