import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiClient, { validateParams } from '@/api/apiClient.js'
import auth from '@/api/auth'

vi.mock('@/api/apiClient.js', () => {
  return {
    default: {
      post: vi.fn()
    }
  }
})

describe('register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call apiClient.get with appropriate parameters', () => {
    const payload = {
      username: 'testuser',
      password: 'testpassword',
      confirm_password: 'testpassword',
      email: 'example@email.test.pl'
    }
    auth.registerUser(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/api/register/', payload)
  })
})
